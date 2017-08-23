import React from 'react';
import request from '../AuthInterceptor';
import style from './style.css';

class OpenedTasksPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: []
    };
  }

  componentDidMount() {
    request.get('https://secure.runrun.it/api/v1.0/tasks', {
      params: {
        user_id: localStorage.getItem("userid"),
        is_closed: false
      }
    })
      .then(response => {
        this.setState({tasks: response.data});
      });
  }

  render() {
    const tasks = this.state.tasks.map((task, index) => (
      <li key={index} className="list-group-item">
        {task.id} - {task.title}
        <div>
          {(task.is_working_on) ?
            (<button type="button" className="btn btn-sm btn-primary">
              <i className="fa fa-clock-o" aria-hidden="true"></i> PAUSE
            </button>) :
            (<button type="button" className="btn btn-sm btn-primary">
              <i className="fa fa-pause-circle-o" aria-hidden="true"></i> WORK
            </button>)
          } <button type="button" className="btn btn-sm btn-light">COMPLETE</button>
        </div>
      </li>
    ));

    return (
      <div>
        <h1>Tasks</h1>
        <ul className={`list-group ${style.OpenedTasksPage}`}>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default OpenedTasksPage;