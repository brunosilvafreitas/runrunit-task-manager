import React from 'react';

class OptionsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appkey: localStorage.getItem("appkey") || "",
      usertoken: localStorage.getItem("usertoken") || "",
      userid: localStorage.getItem("userid") || "",
      rememberTimeInMinutes: localStorage.getItem("rememberTimeInMinutes") || 30,
      msg: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMsgHide = this.handleMsgHide.bind(this);
  }

  handleMsgHide() {
    this.setState({
      msg: ""
    });
  }

  handleInputChange(e) {
    const {name, value, type} = e.target;

    const getValueByType = () => {
      switch(type) {
        case 'number':
          return Number(value);
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
    localStorage.setItem("rememberTimeInMinutes", this.state.rememberTimeInMinutes);

    this.setState({
      msg: {
        type: 'success',
        text: "Success!"
      }
    })
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
                      <label htmlFor="rememberTimeInMinutes">Remember me every * minutes</label>
                      <input type="number" className="form-control" name="rememberTimeInMinutes" value={this.state.rememberTimeInMinutes} required onChange={this.handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                  </form>
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