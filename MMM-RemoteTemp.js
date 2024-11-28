Module.register("MMM-RemoteTemp", {
  defaults: {
    showTemperature: true,
    showHumidity: true
  },

  const NodeHelper = require("node_helper");
  const axios = require("axios");

  module.exports = NodeHelper.create({
    start() {
      this.temperature = null;
      this.humidity = null;
      this.sendSocketNotification("GET_REMOTE_TEMPERATURE_DATA");
      console.log("Remote Temperature Helper started.");
      this.fetchData();
      setInterval(() => {
        this.fetchData();
      }, 60000); // Fetch data every 60 seconds
    },

    fetchData() {
      const sensorId = this.config.sensorId; // Get sensor ID from config
      axios.post("http://rpi44-mm:8080/remote-temperature", {
        sensorId: sensorId,
      })
        .then(response => {
          this.sendSocketNotification("REMOTE_TEMPERATURE_DATA", response.data);
        })
        .catch(error => {
          console.error("Error fetching remote temperature data:", error);
        });
    },

    socketNotificationReceived(notification, payload) {
      if (notification === "REMOTE_TEMPERATURE_DATA") {
        this.temperature = payload.temperature;
        this.humidity = payload.humidity;
        this.updateDom();
      }
    },

    getDom() {
      const wrapper = document.createElement("div");
      if (this.temperature !== null && this.config.showTemperature) {
        const tempDiv = document.createElement("div");
        tempDiv.className = "data";
        tempDiv.innerHTML = `Temperature: ${this.temperature}°C`;
        wrapper.appendChild(tempDiv);
      }
      if (this.humidity !== null && this.config.showHumidity) {
        const humidityDiv = document.createElement("div");
        humidityDiv.className = "data";
        humidityDiv.innerHTML = `Humidity: ${this.humidity}%`;
        wrapper.appendChild(humidityDiv);
      }
      return wrapper;
    }
  });
});