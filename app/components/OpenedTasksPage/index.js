import React from 'react';
import request from '../AuthInterceptor';
import style from './style.css';
import moment from 'moment';

class OpenedTasksPage extends React.Component {
  constructor(props) {
    super(props);
    parent = this;
    
    this.state = {
      tasks: []
    };
    
    this.handleSetList = this.handleSetList.bind(this);
    this.handleGetList = this.handleGetList.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);

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
    this.setState({tasks});
  }

  handleGetList() {
    chrome.runtime.sendMessage({
      subject: "taskUpdateRequest"
    });
  }

  render() {
    const tasks = this.state.tasks.map((task, index) => (
      <li key={index} className="list-group-item">
        <a href={`https://secure.runrun.it/tasks/${task.id}`} target="_blank">{task.id} - {task.title}</a>
        <div>
          {(task.is_working_on) ?
            (<button type="button" className="btn btn-sm btn-primary" onClick={this.handlePause(task.id)}>
            <span className="oi" data-glyph="media-pause"></span> PAUSE
            </button>) :
            (<button type="button" className="btn btn-sm btn-primary" onClick={this.handlePlay(task.id)}>
            <span className="oi" data-glyph="media-play"></span> WORK
            </button>)
          } <button type="button" className="btn btn-sm btn-light" onClick={this.handleClose(task.id)}>COMPLETE</button>
        </div>
      </li>
    ));

    return (
      <div>
        <div>
          <a href="chrome-extension://jiicagknbmclheeiimekecibhcknibge/options.html#/options" target="_blank"><img src="/open-iconic/svg/cog.svg" className={style.Settings} /></a>
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