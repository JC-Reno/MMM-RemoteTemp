const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start() {
    console.log("Remote Temperature Helper started.");
  },

  fetchTemperatureData() {
    fetch("http://example.com/api/temperature")
      .then(response => response.json())
      .then(data => {
        this.sendSocketNotification("REMOTE_TEMPERATURE_DATA", data);
      })
      .catch(error => console.error("Error fetching temperature data:", error));
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_REMOTE_TEMPERATURE_DATA") {
      this.fetchTemperatureData();
    }
    if (notification === "REMOTE_TEMPERATURE_DATA") {
      this.sendSocketNotification("REMOTE_TEMPERATURE_DATA", payload);
    }
  }
});