import React from 'react';
import request from '../AuthInterceptor';

class OptionsPage extends React.Component {
  constructor(props) {
    super(props);

    const browserLanguage = (navigator.language || navigator.userLanguage || 'en').split('-')[0];

    this.state = {
      language: localStorage.getItem("language") || browserLanguage,
      appkey: localStorage.getItem("appkey") || "",
      usertoken: localStorage.getItem("usertoken") || "",
      reminderEnabled: (localStorage.getItem("reminderEnabled") && localStorage.getItem("reminderEnabled") === "true") ? true : false,
      reminderTimeInMinutes: localStorage.getItem("reminderTimeInMinutes") || 30,
      view: "options",
      msg: "",
      autoPauseResume: (localStorage.getItem("autoPauseResume") && localStorage.getItem("autoPauseResume") === "true") ? true : false
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

    localStorage.setItem("language", this.state.language);
    localStorage.setItem("appkey", this.state.appkey);
    localStorage.setItem("usertoken", this.state.usertoken);
    localStorage.setItem("reminderEnabled", this.state.reminderEnabled);
    localStorage.setItem("reminderTimeInMinutes", this.state.reminderTimeInMinutes);
    localStorage.setItem("autoPauseResume", this.state.autoPauseResume);

    if(!this.state.autoPauseResume) {
      localStorage.setItem("lastMachineStatus", "active");
      localStorage.setItem("trackedTask", "");
    }

    request.get(`https://secure.runrun.it/api/v1.0/users/me`)
      .then(response => {
        localStorage.setItem("user", JSON.stringify(response.data));
        this.setState({
          msg: {
            type: 'success',
            text: "Success!"
          }
        });
      });
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
          <label htmlFor="language">Language</label>
          <select className="form-control" name="language" value={this.state.language} onChange={this.handleInputChange}>
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="appkey">App Key</label>
          <input type="text" className="form-control" name="appkey" value={this.state.appkey} required onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="usertoken">User Token</label>
          <input type="text" className="form-control" name="usertoken" value={this.state.usertoken} required onChange={this.handleInputChange} />
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

        <div className="form-check">
          <label className="form-check-label" htmlFor="autoPauseResume">
            <input type="checkbox" className="form-check-input" name="autoPauseResume" checked={this.state.autoPauseResume} onChange={this.handleInputChange} /> Auto Pause/Resume
          </label>
          <small className="form-text text-muted">
            * By enabling this option, an icon will be displayed to the right of the task you're currently working on, allowing it be automatically paused/resumed when you lock/unlock your computer. However, we've noticed that this feature doesn't work as expected on some computers. If you really wish to use this feature, we strongly suggest you to test it by locking your computer for a few minutes and then checking on your task details to see if the recorded time is correct.
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