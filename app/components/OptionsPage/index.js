import React from 'react';

class OptionsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appkey: localStorage.getItem("appkey") || "",
      usertoken: localStorage.getItem("usertoken") || "",
      userid: localStorage.getItem("userid") || "",
      reminderEnabled: (localStorage.getItem("reminderEnabled") && localStorage.getItem("reminderEnabled") === "true") ? true : false,
      reminderTimeInMinutes: localStorage.getItem("reminderTimeInMinutes") || 30,
      view: "options",
      msg: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMsgHide = this.handleMsgHide.bind(this);
    this.handleViewToggle = this.handleViewToggle.bind(this);
  }

  handleMsgHide() {
    this.setState({
      msg: ""
    });
  }

  handleInputChange(e) {
    const {name, value, type, checked} = e.target;

    const getValueByType = () => {
      switch(type) {
        case 'number':
          return Number(value);
        case 'checkbox':
          return checked;
        default:
          return value;
      }
    };

    this.setState({
      [name]: getValueByType()
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    localStorage.setItem("appkey", this.state.appkey);
    localStorage.setItem("usertoken", this.state.usertoken);
    localStorage.setItem("userid", this.state.userid);
    localStorage.setItem("reminderEnabled", this.state.reminderEnabled);
    localStorage.setItem("reminderTimeInMinutes", this.state.reminderTimeInMinutes);

    this.setState({
      msg: {
        type: 'success',
        text: "Success!"
      }
    })
  }

  handleViewToggle() {
    this.setState({
      view: (this.state.view === "options") ? "tutorial" : "options"
    });
  }

  render() {
    const msg = (this.state.msg) ? (
      <div className={`alert alert-${this.state.msg.type} alert-dismissible fade show`} role="alert">
        <button type="button" className="close" onClick={this.handleMsgHide}>
          <span aria-hidden="true">&times;</span>
        </button>
        {this.state.msg.text}
      </div>
    ) : "";

    const form = (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="appkey">App Key</label>
          <input type="text" className="form-control" name="appkey" value={this.state.appkey} required onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="usertoken">User Token</label>
          <input type="text" className="form-control" name="usertoken" value={this.state.usertoken} required onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="userid">User Id</label>
          <input type="text" className="form-control" name="userid" value={this.state.userid} required onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="reminderTimeInMinutes">Reminder's interval ({
              (this.state.reminderEnabled) ? "Enabled" : "Disabled"
            })</label>
          <div className="input-group">
            <span className="input-group-addon">
              <input type="checkbox" name="reminderEnabled" checked={this.state.reminderEnabled} onChange={this.handleInputChange} />
            </span>
            <input type="number" min="1" className="form-control" name="reminderTimeInMinutes" value={this.state.reminderTimeInMinutes} disabled={!this.state.reminderEnabled} required onChange={this.handleInputChange} />
          </div>
          <small className="form-text text-muted">
            * You will be reminded every X minutes whether you are either working on the same task or haven't started one. In case you either pause or start a task, the timer will reset.
          </small>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-info float-right" onClick={this.handleViewToggle}>Tutorial</button>
      </form>
    );

    const tutorial = (
      <div>
        <div>
          <strong>1. Go to your profile on Runrun.it</strong><br />
          <img src="/images/tutorial1.png" /><br /><br />
          <strong>2. Then, if there is no "App key", click on "Generate".</strong><br />
          <img src="/images/tutorial2.png" /><br />
          <span>* Permission needed. If it does not appear, contact anyone with "Administrator" role.</span><br /><br />
          <strong>3. Your "App Key" and "User Token" will be displayed (or only the "User Token" if you aren't an "Administrator").</strong><br />
          <img src="/images/tutorial3.png" /><br /><br />
          <strong>4. You can get your "User ID" on this page's url.</strong><br />
          <img src="/images/tutorial4.png" /><br /><br />
        </div>
        <button type="button" className="btn btn-info" onClick={this.handleViewToggle}>&lt;</button>
      </div>
    );

    return (
      <div className="container">
        <div className="content">
          <div className="row justify-content-md-center">
            <div className="col col-md-6"><br /><br />
              <div className="card">
                <div className="card-body">
                  {msg}
                  <div className="text-center">
                    <img src="/images/icon_128.png" />
                  </div>
                  <h1 className="text-center">Runrun.it Settings</h1>
                  {(this.state.view === "options") ? form : tutorial}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OptionsPage;