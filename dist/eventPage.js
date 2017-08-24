class RunrunTasks {
  constructor() {
    this._tasks = [];
    this.is_working_on = false;
    this._channel;
    parent = this;

    this.updateTasks = this.updateTasks.bind(this);

    chrome.alarms.onAlarm.addListener((alarm) => {
      if(alarm.name === 'updateTasks') {
        const hasAppKey = !!localStorage.getItem("appkey");
        if(hasAppKey)
          parent.updateTasks();
      }
    });
    
    chrome.alarms.create('updateTasks', {
      periodInMinutes: 0.08
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if(msg.subject === "taskUpdateRequest") {
        parent.updateTasks();
      }
    });
  }

  updateTasks() {
    const request = axios.create();
    request.interceptors.request.use((config) => {
      config.headers['App-Key'] = localStorage.getItem("appkey");
      config.headers['User-Token'] = localStorage.getItem("usertoken");
      
      return config;
    });
  
    request.get('https://secure.runrun.it/api/v1.0/tasks', {
      params: {
        user_id: localStorage.getItem("userid"),
        is_closed: false
      }
    })
    .then(response => {
      this._tasks = response.data;

      const workingTask = this._tasks.find((task) => {
        return task.is_working_on;
      });

      if(this.is_working_on !== false && workingTask === undefined) {
        chrome.notifications.create(
            'runrunit_task_notification', {
            "type": 'basic', 
            "iconUrl": 'images/icon_128.png', 
            "title": "Pause!!!", 
            "message": `Task "${this.is_working_on.title}" has been paused.`
            },
            () => {}
        );
      }
      else if(workingTask !== undefined && (this.is_working_on === false || this.is_working_on.id !== workingTask.id)) {
        chrome.notifications.create(
            'runrunit_task_notification', {
            "type": 'basic', 
            "iconUrl": 'images/icon_128_active.png', 
            "title": "Work!!!", 
            "message": `Task "${workingTask.title}" has been started.`
            },
            () => {}
        );
      }

      if(workingTask) {
        this.is_working_on = workingTask;
        chrome.browserAction.setIcon({path:"images/icon_128_active.png"});
      }
      else {
        this.is_working_on = false;
        chrome.browserAction.setIcon({path:"images/icon_128.png"});
      }

      chrome.runtime.sendMessage({
        subject: "taskUpdated",
        body: response.data
      });
    });
  }
}
const UserRunrunTasks = new RunrunTasks();
