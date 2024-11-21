Module.register("MMM-RemoteTemp", {

  const NodeHelper = require("node_helper");
  const axios = require("axios");

  module.exports = NodeHelper.create({
    start() {
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
    }
  });