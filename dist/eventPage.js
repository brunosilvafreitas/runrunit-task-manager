JSON.isAJSONString = (object) => {
  try {
    JSON.parse(object);
  } catch (e) {
    return false;
  }
  return true;
};

class RunrunTasks {
  constructor() {
    this._tasks = [];
    this._is_working_on = (localStorage.getItem("is_working_on") && JSON.isAJSONString(localStorage.getItem("is_working_on"))) ? JSON.parse(localStorage.getItem("is_working_on")) : false;
    this._reminder = (localStorage.getItem("reminder")) ? moment(localStorage.getItem("reminder")) : moment();
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
        responsible_id: localStorage.getItem("userid"),
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
            "message": `You have stopped working on "${this._is_working_on.title}".`
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
            "message": `You are now working on "${workingTask.title}".`
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
        this._reminder = moment();
        if(this._is_working_on) {
          chrome.notifications.create(
            'runrunit_task_notification', {
              "type": 'basic', 
              "iconUrl": 'images/icon_128_reminder.png', 
              "title": "Reminder!!!", 
              "message": `You are still working on "${this._is_working_on.title}".`
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
              "message": `You have no tasks currently in progress.`
            },
            () => {}
          );
        }
      }

      localStorage.setItem("is_working_on", (this._is_working_on !== false) ? JSON.stringify(this._is_working_on) : false);
      localStorage.setItem("reminder", this._reminder.format());

      chrome.runtime.sendMessage({
        subject: "taskUpdated",
        body: response.data
      });
    });
  }
}
const UserRunrunTasks = new RunrunTasks();
