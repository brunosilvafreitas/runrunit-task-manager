import React from 'react';
import request from '../AuthInterceptor';
import { FormattedMessage } from 'react-intl';

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
          <FormattedMessage id="settings.label.language">
            {(txt) => (<label htmlFor="language">{txt}</label>)}
          </FormattedMessage>
          <select className="form-control" name="language" value={this.state.language} onChange={this.handleInputChange}>
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>
        <div className="form-group">
          <FormattedMessage id="settings.label.appkey">
            {(txt) => (<label htmlFor="appkey">{txt}</label>)}
          </FormattedMessage>
          <input type="text" className="form-control" name="appkey" value={this.state.appkey} required onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <FormattedMessage id="settings.label.usertoken">
            {(txt) => (<label htmlFor="usertoken">{txt}</label>)}
          </FormattedMessage>
          <input type="text" className="form-control" name="usertoken" value={this.state.usertoken} required onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          {(this.state.reminderEnabled) ?
          (<FormattedMessage id="settings.label.reminderTimeInMinutesEnabled">
            {(txt) => (<label htmlFor="reminderTimeInMinutes">{txt}</label>)}
          </FormattedMessage>) :
          (<FormattedMessage id="settings.label.reminderTimeInMinutesDisable">
            {(txt) => (<label htmlFor="reminderTimeInMinutes">{txt}</label>)}
          </FormattedMessage>)}
          <div className="input-group">
            <span className="input-group-addon">
              <input type="checkbox" name="reminderEnabled" checked={this.state.reminderEnabled} onChange={this.handleInputChange} />
            </span>
            <input type="number" min="1" className="form-control" name="reminderTimeInMinutes" value={this.state.reminderTimeInMinutes} disabled={!this.state.reminderEnabled} required onChange={this.handleInputChange} />
          </div>
          <FormattedMessage id="settings.reminder.description">
            {(txt) => (<small className="form-text text-muted">{txt}</small>)}
          </FormattedMessage>
        </div>

        <div className="form-check">
          <FormattedMessage id="settings.label.autoPauseResume">
            {(txt) => (<label className="form-check-label" htmlFor="autoPauseResume">
              <input type="checkbox" className="form-check-input" name="autoPauseResume" checked={this.state.autoPauseResume} onChange={this.handleInputChange} /> {txt}
            </label>)}
          </FormattedMessage>

          <FormattedMessage id="settings.autoPauseResume.description">
            {(txt) => (<small className="form-text text-muted">{txt}</small>)}
          </FormattedMessage>
        </div>

        <FormattedMessage id="settings.btn.submit">
          {(txt) => (<button type="submit" className="btn btn-primary">{txt}</button>)}
        </FormattedMessage>
        <FormattedMessage id="settings.btn.tutorial">
          {(txt) => (<button type="button" className="btn btn-info float-right" onClick={this.handleViewToggle}>{txt}</button>)}
        </FormattedMessage>
      </form>
    );

    const tutorial = (
      <div>
        <div>
          <FormattedMessage id="settings.tutorial.step1">
            {(txt) => (<strong>{txt}</strong>)}
          </FormattedMessage><br />
          <img src="/images/tutorial1.png" /><br /><br />
          <FormattedMessage id="settings.tutorial.step2">
            {(txt) => (<strong>{txt}</strong>)}
          </FormattedMessage><br /><br />
          <img src="/images/tutorial2.png" /><br />
          <FormattedMessage id="settings.tutorial.step2.help">
            {(txt) => (<span>{txt}</span>)}
          </FormattedMessage><br /><br />
          <FormattedMessage id="settings.tutorial.step3">
            {(txt) => (<strong>{txt}</strong>)}
          </FormattedMessage><br /><br />
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
                  <FormattedMessage id="settings.tutorial.title">
                    {(txt) => (<h1 className="text-center">{txt}</h1>)}
                  </FormattedMessage>
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