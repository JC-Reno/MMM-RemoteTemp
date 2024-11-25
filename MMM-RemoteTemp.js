/* global Module, moment */

/* Magic Mirror Module: MMM-RemoteTemp (https://github.com/JC-Reno/MMM-RemoteTemp)
 * A fork from MMM-RemoteTemperature (https://gitub.com/balassy/MMM-RemoteTemperature)
 * by György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */

Module.register('MMM-RemoteTemp', {
  defaults: {
    sensorId: null,
    icon: 'home',
    showMore: true
  },

  requiresVersion: '2.29.0', // Ensure MagicMirror version is 2.29.0 or higher

  getScripts() {
    return [
      'moment.js' // Ensure moment.js is included and up to date
    ];
  },

  getStyles() {
    return [
      'MMM-RemoteTemp.css', // Ensure this file is available and up to date
      'font-awesome.css', // Ensure this file is available and up to date
      'font-awesome5.css' // Ensure this file is available and up to date
    ];
  },

  getTranslations() {
    return {
      en: 'translations/en.json', // Ensure this file is available and correctly formatted
      hu: 'translations/hu.json' // Ensure this file is available and correctly formatted
    };
  },

  start() {
    this.viewModel = null;
    this._initCommunication();
    this._setupPostEndpoint();
    console.log("MMM-RemoteTemp started");
  },

  getDom() {
    const wrapper = document.createElement('div');

    if (this.viewModel) {
      const firstLineEl = document.createElement('div');

      if (this.config.icon) {
        const iconEl = document.createElement('span');
        iconEl.classList = `symbol fa fa-${this.config.icon}`;
        firstLineEl.appendChild(iconEl);
      }

      if (this.viewModel.temp) {
        const tempEl = document.createElement('span');
        tempEl.classList = 'temp';
        tempEl.innerHTML = `${this.viewModel.temp}&deg;`;
        firstLineEl.appendChild(tempEl);
      }

      if (this.viewModel.humidity) {
        const humidityEl = document.createElement('span');
        humidityEl.classList = 'humidity';
        humidityEl.innerHTML = `${this.viewModel.humidity}%`;
        firstLineEl.appendChild(humidityEl);
      }

      wrapper.appendChild(firstLineEl);

      if (this.config.showMore) {
        const secondLineEl = document.createElement('div');
        secondLineEl.classList = 'more dimmed small';
        secondLineEl.innerHTML = `<span class="fa fa-refresh"></span> ${this._formatTimestamp(this.viewModel.timestamp)}`;

        if (this.viewModel.battery) {
          secondLineEl.innerHTML += `<span class="fa fa-battery-half"></span> ${this.viewModel.battery}%`;
        }

        wrapper.appendChild(secondLineEl);
      }
    } else {
      const loadingEl = document.createElement('span');
      loadingEl.innerHTML = this.translate('LOADING');
      loadingEl.classList = 'dimmed small';
      wrapper.appendChild(loadingEl);
    }

    return wrapper;
  },

  socketNotificationReceived(notificationName, payload) {
    console.log("Notification received:", notificationName, payload);
    if (notificationName === 'MMM-RemoteTemp.VALUE_RECEIVED' && payload) {
      if (!this.config.sensorId || (this.config.sensorId && this.config.sensorId === payload.sensorId)) {
        this.viewModel = {
          temp: payload.temp,
          humidity: payload.humidity,
          battery: payload.battery,
          timestamp: Date.now()
        };

        console.log("ViewModel updated:", this.viewModel);
        this.updateDom();
      }
    }
  },

  _initCommunication() {
    console.log("Initializing communication with sensorId:", this.config.sensorId);
    this.sendSocketNotification('MMM-RemoteTemp.INIT', {
      sensorId: this.config.sensorId
    });
  },

  _setupPostEndpoint() {
    const expressApp = this.config.expressApp;
    if (expressApp) {
      expressApp.post('/api/module/MMM-RemoteTemp', (req, res) => {
        console.log("POST request received:", req.body);
        const payload = req.body;
        if (payload && (!this.config.sensorId || this.config.sensorId === payload.sensorId)) {
          this.viewModel = {
            temp: payload.temp,
            humidity: payload.humidity,
            battery: payload.battery,
            timestamp: Date.now()
          };
          console.log("ViewModel updated via POST:", this.viewModel);
          this.updateDom();
          res.status(200).send('Data received');
        } else {
          console.log("Invalid sensorId:", payload.sensorId);
          res.status(400).send('Invalid sensorId');
        }
      });
    } else {
      console.error("Express app not available");
    }
  },

  _formatTimestamp(timestamp) {
    return moment(timestamp).format('HH:mm');
  }
});