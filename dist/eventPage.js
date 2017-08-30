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
    this._tasks;

    if(!localStorage.getItem("reminderEnabled"))
      localStorage.setItem("reminderEnabled", true);

    if(!localStorage.getItem("reminderTimeInMinutes"))
      localStorage.setItem("reminderTimeInMinutes", 30);

    if(!localStorage.getItem("lastMachineStatus"))
      localStorage.setItem("lastMachineStatus", "active");

    if(!localStorage.getItem("trackedTask"))
      localStorage.setItem("trackedTask", "");

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

    chrome.idle.onStateChanged.addListener((state) => {
      state = (state === "idle") ? "active" : state;
      if(localStorage.getItem("lastMachineStatus") !== state && localStorage.getItem("trackedTask") !== "") {
        if(state === "locked")
          parent.pauseTask(localStorage.getItem("trackedTask"));
        else if(state === "active")
          parent.resumeTask(localStorage.getItem("trackedTask"));
      }
      localStorage.setItem("lastMachineStatus", state);
    });
  }

  getHttpClient() {
    const client = axios.create();
    client.interceptors.request.use((config) => {
      config.headers['App-Key'] = localStorage.getItem("appkey");
      config.headers['User-Token'] = localStorage.getItem("usertoken");
      
      return config;
    });
    return client;
  }

  updateTasks() {
    const request = this.getHttpClient();
  
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

      const trackedTask = localStorage.getItem("trackedTask");
      if(trackedTask) {
        const trackedTaskOnTaskList = this._tasks.find((task) => {
          return task.id == trackedTask;
        });
        if(trackedTaskOnTaskList === undefined || (workingTask !== undefined && workingTask.id !== trackedTaskOnTaskList.id))
          localStorage.setItem("trackedTask", "");
      }

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

      const reminderEnabled = (localStorage.getItem("reminderEnabled") && localStorage.getItem("reminderEnabled") == "true") ? true : false;
      const reminderTime = (localStorage.getItem("reminderTimeInMinutes")) ? parseInt(localStorage.getItem("reminderTimeInMinutes")) : 30;
      if(reminderEnabled && this._reminder.isSameOrBefore(moment().subtract(reminderTime, 'm'))) {
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

  pauseTask(id) {
    const request = this.getHttpClient();
    request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/pause`)
    .then(response => {
      this.updateTasks();
    });
  }

  resumeTask(id) {
    const request = this.getHttpClient();
    request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/play`)
      .then(response => {
        this.updateTasks();
      });
  }
}
const UserRunrunTasks = new RunrunTasks();