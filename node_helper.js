const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start() {
    console.log("Remote Temperature Helper started.");
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "REMOTE_TEMPERATURE_DATA") {
      this.sendSocketNotification("REMOTE_TEMPERATURE_DATA", payload);
    }
  }
});