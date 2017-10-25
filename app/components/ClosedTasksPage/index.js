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
    this.setState({
      tasks: undefined
    }, () => {
      const user = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {};
      request.get('https://secure.runrun.it/api/v1.0/tasks', {
        params: {
          responsible_id: user.id,
          is_closed: true,
          limit: 10
        }
      })
      .then(response => {
        this.setState({
          tasks: response.data
        });
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
          <FormattedMessage id="closedTasks.empty">
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
              </button> <FormattedMessage id="tasks.controls.reopen">
                {(txt) => (<button type="button" className="btn btn-sm btn-primary" onClick={this.handleReopen(task.id)}>{txt}</button>)}
              </FormattedMessage>
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
        <FormattedMessage id="closedTasks.description">
          {(txt) => (<div className="text-center text-secondary text-size-sm">{txt}</div>)}
        </FormattedMessage>
        <ul className={`list-group ${style.ClosedTasksPage}`}>
          {tasks}
        </ul>
      </div>
    );

  }
}

export default ClosedTasksPage;