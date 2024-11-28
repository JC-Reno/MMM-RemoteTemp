const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_REMOTE_TEMPERATURE_DATA") {
            this.config = payload;
            this.fetchData();
            // Set up regular polling
            setInterval(() => {
                this.fetchData();
            }, 60000); // Every minute
        }
    },

    fetchData: function() {
        if (!this.config.sensorId) {
            console.error("No sensorId configured");
            return;
        }

        axios.post("http://localhost:8080/remote-temperature", {
            sensorId: this.config.sensorId
        })
        .then(response => {
            this.sendSocketNotification("REMOTE_TEMPERATURE_DATA", response.data);
        })
        .catch(error => {
            console.error("Error fetching remote temperature data:", error);
        });
    }
});