import React from 'react';
import { Link } from 'react-router';
import request from '../AuthInterceptor';
import LoadingIcon from '../LoadingIcon';
import style from './style.css';
import moment from 'moment';
import 'moment-duration-format';

class ClosedTasksPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tasks: undefined,
      taskExpanded: undefined
    };
    
    this.handleTaskDetailToggle = this.handleTaskDetailToggle.bind(this);
    this.handleGetList = this.handleGetList.bind(this);
    this.handleReopen = this.handleReopen.bind(this);
  }

  componentDidMount() {
    this.handleGetList();
  }

  handleGetList() {
    request.get('https://secure.runrun.it/api/v1.0/tasks', {
      params: {
        responsible_id: localStorage.getItem("userid"),
        is_closed: true,
        limit: 10
      }
    })
    .then(response => {
      this.setState({
        tasks: response.data
      });
    });
  }

  handleReopen(id) {
    return () => {
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/reopen`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handleTaskDetailToggle(id) {
    return () => {
      this.setState({
        taskExpanded: (this.state.taskExpanded === id) ? undefined : id
      });
    };
  }

  render() {
    const timer = (seconds) => moment.duration(seconds, 'seconds').format('HH:mm', {trim:false});

    const tasks = (() => {
      if(!localStorage.getItem("appkey"))
        return (
          <li className="text-center">
            Welcome to Runrun.it Task Manager!<br />
            Click <a href="options.html" target="_blank">here</a> to set up your Runrun.it account.
          </li>
        );
      else if(this.state.tasks === undefined)
        return (
          <li className="text-center"><LoadingIcon visible={true} /></li>
        );
      else if(this.state.tasks instanceof Array && this.state.tasks.length === 0)
        return (
          <li className="text-center">
            You don't have closed tasks at the moment.
          </li>
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
                <ul className="list-group mt-1 mb-1">
                  <li className="list-group-item list-group-item-light">
                    <strong>Responsible:</strong> {task.responsible_name}
                  </li>
                  <li className="list-group-item list-group-item-light">
                    <strong>Type:</strong> {task.type_name}
                  </li>
                  <li className="list-group-item list-group-item-light">
                    <strong>Client > Project:</strong> {task.client_name} > {task.project_name}
                  </li>
                  <li className="list-group-item list-group-item-light">
                    <strong>Tags:</strong> {task.task_tags.map((tag, index) => (
                      <span key={index} className="badge badge-secondary mr-1">{tag}</span>
                    ))}
                  </li>
                  <li className="list-group-item list-group-item-light">
                    <div className="col">
                      <strong>Started:</strong> {moment(task.start_date).format("MMM DD, hh:mm A")}
                    </div>
                    <div className="col">
                      <strong>Completed:</strong> {moment(task.close_date).format("MMM DD, hh:mm A")}
                    </div>
                  </li>
                </ul>
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
              </button> <button type="button" className="btn btn-sm btn-primary" onClick={this.handleReopen(task.id)}>REOPEN</button>
            </div>
          </li>
        ));
    })();

    return (
      <div>
        <div>
          <a href="https://secure.runrun.it/en-US/tasks" target="_blank"><img src="images/runrun.png" className={style.RunrunIcon} /></a>
          <a href="options.html" target="_blank"><img src="/open-iconic/svg/cog.svg" className={style.Settings} /></a>
          <h1 className="text-center">Tasks</h1> 
          <ul className="nav justify-content-center mb-3">
            <li className="nav-item">
              <Link to="/opened-tasks" className="rounded p-2" activeClassName={style.navActive}>Opened</Link>
            </li>
            <li className="nav-item">
              <Link to="/closed-tasks" className="rounded p-2" activeClassName={style.navActive}>Completed</Link>
            </li>
          </ul>
        </div>
        <ul className={`list-group ${style.ClosedTasksPage}`}>
          {tasks}
        </ul>
      </div>
    );

  }
}

export default ClosedTasksPage;