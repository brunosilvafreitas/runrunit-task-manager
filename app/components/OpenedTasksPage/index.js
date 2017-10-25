import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import 'moment-duration-format';
import { FormattedMessage } from 'react-intl';

import style from './style.css';
import request from '../AuthInterceptor';
import LoadingIcon from '../LoadingIcon';
import PopupHeader from '../PopupHeader';
import PopupNav from '../PopupNav';
import TaskDetail from '../TaskDetail';

class OpenedTasksPage extends React.Component {
  constructor(props) {
    super(props);
    parent = this;
    
    this.state = {
      tasks: undefined,
      trackedTask: localStorage.getItem("trackedTask"),
      autoPauseResume: (localStorage.getItem("autoPauseResume") && localStorage.getItem("autoPauseResume") === "true") ? true : false,
      taskExpanded: undefined
    };
    
    this.handleTaskDetailToggle = this.handleTaskDetailToggle.bind(this);
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

  handleTaskDetailToggle(id) {
    return () => {
      this.setState({
        taskExpanded: (this.state.taskExpanded === id) ? undefined : id
      });
    };
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
    
    const tasks = (() => {
      if(!localStorage.getItem("appkey"))
        return (
          <FormattedMessage id="app.welcome">
            {(txt) => (<li className="text-center">{txt}</li>)}
          </FormattedMessage>
        );
      else if(this.state.tasks === undefined)
        return (
          <li className="text-center"><LoadingIcon visible={true} /></li>
        );
      else if(this.state.tasks instanceof Array && this.state.tasks.length === 0)
        return (
          <FormattedMessage id="openedTasks.empty">
            {(txt) => (<li className="text-center">{txt}</li>)}
          </FormattedMessage>
        );
      else
        return this.state.tasks.map((task, index) => (
          <li key={index} className="list-group-item">
            <a href={`https://secure.runrun.it/tasks/${task.id}`} target="_blank">{task.id} - {task.title}</a>
            <div className="text-size-sm pb-1">
              {task.client_name} > {task.project_name} - {task.type_name} <button  type="button" className="btn btn-secondary btn-xs" onClick={this.handleTaskDetailToggle(task.id)}> {
                (this.state.taskExpanded === task.id) ? (
                    <span data-glyph="minus" className="oi"></span>
                ) : (
                  <span data-glyph="plus" className="oi"></span>
                )
              } </button>
              {(this.state.taskExpanded === task.id) ? (
                <TaskDetail task={task} />
              ) : ""}
            </div>
            <div>
              <button type="button" className={`btn btn-${(task.current_estimate_seconds != 0 && task.time_worked > task.current_estimate_seconds)?'danger':'info'} btn-sm nohover`}>
                <span data-glyph="timer" className="oi"></span> {
                  timer(task.time_worked)
                } {
                  (task.current_estimate_seconds) ? 
                  '/ ' + timer(task.current_estimate_seconds) : ""
                }
              </button> {
                (task.is_working_on) ?
                (<FormattedMessage id="tasks.controls.pause">
                  {(txt) => (<button type="button" className="btn btn-sm btn-primary" onClick={this.handlePause(task.id)}>
                    <span className="oi" data-glyph="media-pause"></span> {txt}
                  </button>)}
                </FormattedMessage>) :
                (<FormattedMessage id="tasks.controls.work">
                  {(txt) => (<button type="button" className="btn btn-sm btn-primary" onClick={this.handlePlay(task.id)}>
                    <span className="oi" data-glyph="media-play"></span> {txt}
                  </button>)}
                </FormattedMessage>)
              } <FormattedMessage id="tasks.controls.close">
                {(txt) => (<button type="button" className="btn btn-sm btn-light" onClick={this.handleClose(task.id)}>{txt}</button>)}
              </FormattedMessage>
    
              {(this.state.autoPauseResume && task.is_working_on)?(
                <FormattedMessage id="openedTasks.monitor">
                  {(txt) => (<button title={txt} type="button" className={`btn btn-sm btn-${(this.state.trackedTask == task.id)?'warning':'light'} float-right`} onClick={this.handleTaskTracking(task.id)}>
                    <span className="oi" data-glyph="monitor"></span>
                  </button>)}
                </FormattedMessage>
              ):""}
    
            </div>
          </li>
        ));
    })();

    return (
      <div>
        <div>
          <PopupHeader title="openedTasks.title" />
          <PopupNav />
        </div>
        <ul className={`list-group ${style.OpenedTasksPage}`}>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default OpenedTasksPage;