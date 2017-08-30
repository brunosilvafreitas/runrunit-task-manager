import React from 'react';
import request from '../AuthInterceptor';
import style from './style.css';
import moment from 'moment';
import 'moment-duration-format';

class OpenedTasksPage extends React.Component {
  constructor(props) {
    super(props);
    parent = this;
    
    this.state = {
      tasks: [],
      trackedTask: localStorage.getItem("trackedTask")
    };
    
    this.handleSetList = this.handleSetList.bind(this);
    this.handleGetList = this.handleGetList.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleTaskTracking = this.handleTaskTracking.bind(this);

    chrome.runtime.onMessage.addListener((msg) => {
      if(msg.subject === "taskUpdated")
        parent.handleSetList(msg.body);
    });
  }

  componentDidMount() {
    this.handleGetList();
  }

  handlePlay(id) {
    return () => {
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/play`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handlePause(id) {
    return () => {
      localStorage.setItem("trackedTask", "");
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/pause`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handleClose(id) {
    return () => {
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/close`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handleSetList(tasks) {
    this.setState({
      tasks,
      trackedTask: localStorage.getItem("trackedTask")
    });
  }

  handleGetList() {
    chrome.runtime.sendMessage({
      subject: "taskUpdateRequest"
    });
  }

  handleTaskTracking(id) {
    return () => {
      if(localStorage.getItem("trackedTask") && localStorage.getItem("trackedTask") == id)
        localStorage.setItem("trackedTask", "");
      else
        localStorage.setItem("trackedTask", id);
      this.setState({
        trackedTask: localStorage.getItem("trackedTask")
      });
    };
  }

  render() {
    const timer = (seconds) => moment.duration(seconds, 'seconds').format('HH:mm', {trim:false});
    
    const tasks = (localStorage.getItem("appkey")) ? this.state.tasks.map((task, index) => (
      <li key={index} className="list-group-item">
        <a href={`https://secure.runrun.it/tasks/${task.id}`} target="_blank">{task.id} - {task.title}</a>
        <div>
          <button type="button" className="btn btn-info btn-sm nohover">
            <span data-glyph="timer" className="oi"></span> {timer(task.time_worked)}
          </button> {
            (task.is_working_on) ?
            (<button type="button" className="btn btn-sm btn-primary" onClick={this.handlePause(task.id)}>
            <span className="oi" data-glyph="media-pause"></span> PAUSE
            </button>) :
            (<button type="button" className="btn btn-sm btn-primary" onClick={this.handlePlay(task.id)}>
            <span className="oi" data-glyph="media-play"></span> WORK
            </button>)
          } <button type="button" className="btn btn-sm btn-light" onClick={this.handleClose(task.id)}>COMPLETE</button>

          {(task.is_working_on)?(
            <button title="When this option is active the extension will manage the task for you, pausing/resuming if you lock/unlock the machine." type="button" className={`btn btn-sm btn-${(this.state.trackedTask == task.id)?'warning':'light'} float-right`} onClick={this.handleTaskTracking(task.id)}>
              <span className="oi" data-glyph="monitor"></span>
            </button>
          ):""}

        </div>
      </li>
    )) : (
      <li className="text-center">
        Welcome to Runrun.it Task Manager!<br />
        Click <a href="options.html" target="_blank">here</a> to set up your Runrun.it account.
      </li>
    );

    return (
      <div>
        <div>
          <a href="https://secure.runrun.it/en-US/tasks" target="_blank"><img src="images/runrun.png" className={style.RunrunIcon} /></a>
          <a href="options.html" target="_blank"><img src="/open-iconic/svg/cog.svg" className={style.Settings} /></a>
          <h1 className="text-center">Tasks</h1> 
        </div>        
        <ul className={`list-group ${style.OpenedTasksPage}`}>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default OpenedTasksPage;