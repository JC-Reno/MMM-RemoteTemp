const NodeHelper = require("node_helper");
const express = require("express");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
        this.expressApp.use(express.json());
        this.createRoutes();
    },

    createRoutes: function() {
        this.expressApp.post("/remote-temperature", (req, res) => {
            const data = req.body;
            
            if (!data.sensorId) {
                res.status(400).json({ error: "sensorId is required" });
                return;
            }

            // Forward the data to the module
            this.sendSocketNotification("REMOTE_TEMPERATURE_DATA", data);
            res.status(200).json({ status: "success" });
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_REMOTE_TEMPERATURE_DATA") {
            this.config = payload;
        }
    }
});