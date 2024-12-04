const NodeHelper = require("node_helper");
const express = require("express");

module.exports = NodeHelper.create({
    start() {
        console.log(`Starting node helper for: ${this.name}`);
        this.expressApp.use(express.json());
        this.createRoutes();
    },

    createRoutes() {
        this.expressApp.post("/remote-temperature", (req, res) => {
            const data = req.body;
            
            if (!data.sensorId) {
                res.status(400).json({ error: "sensorId is required" });
                return;
            }

            // Send data with sensorId to allow filtering
            this.sendSocketNotification("REMOTE_TEMPERATURE_DATA", {
                sensorId: data.sensorId,
                temp: data.temp,
                humidity: data.humidity,
                battery: data.battery
            });
            res.status(200).json({ status: "success" });
        });
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "GET_REMOTE_TEMPERATURE_DATA") {
            this.config = payload;
        }
    },
});