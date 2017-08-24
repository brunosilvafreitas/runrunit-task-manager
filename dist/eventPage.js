class RunrunTasks {
  constructor() {
    this._tasks = [];
    this._is_working_on = false;
    this._reminder = moment();
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

      if(this._is_working_on !== false && workingTask === undefined) {
        this._reminder = moment();
        chrome.notifications.create(
            'runrunit_task_notification', {
            "type": 'basic', 
            "iconUrl": 'images/icon_128.png', 
            "title": "Pause!!!", 
            "message": `Task "${this._is_working_on.title}" has been paused.`
            },
            () => {}
        );
      }
      else if(workingTask !== undefined && (this._is_working_on === false || this._is_working_on.id !== workingTask.id)) {
        this._reminder = moment();
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
        this._is_working_on = workingTask;
        chrome.browserAction.setIcon({path:"images/icon_128_active.png"});
      }
      else {
        this._is_working_on = false;
        chrome.browserAction.setIcon({path:"images/icon_128.png"});
      }

      const hasReminder = localStorage.getItem("rememberTimeInMinutes") || 0;
      if(hasReminder && this._reminder.isSameOrBefore(moment().subtract(hasReminder, 'm'))) {
        if(this._is_working_on) {
          this._reminder = moment();
          chrome.notifications.create(
            'runrunit_task_notification', {
              "type": 'basic', 
              "iconUrl": 'images/icon_128_reminder.png', 
              "title": "Reminder!!!", 
              "message": `You are still working on task "${this._is_working_on.title}".`
            },
            () => {}
          );
        }
        else {
          chrome.notifications.create(
            'runrunit_task_notification', {
              "type": 'basic', 
              "iconUrl": 'images/icon_128_reminder.png', 
              "title": "Reminder!!!", 
              "message": `There are no tasks currently in progress.`
            },
            () => {}
          );
        }
      }

      chrome.runtime.sendMessage({
        subject: "taskUpdated",
        body: response.data
      });
    });
  }
}
const UserRunrunTasks = new RunrunTasks();
