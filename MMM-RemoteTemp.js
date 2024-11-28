Module.register("MMM-RemoteTemp", {
    defaults: {
        sensorId: null,
        icon: "home",
        showMore: true,
        showTemperature: true,
        showHumidity: true
    },

    start: function() {
        this.temperature = null;
        this.humidity = null;
        this.loaded = false;
        this.sendSocketNotification("GET_REMOTE_TEMPERATURE_DATA", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "REMOTE_TEMPERATURE_DATA") {
            this.temperature = payload.temp;
            this.humidity = payload.humidity;
            this.loaded = true;
            this.updateDom();
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "MMM-RemoteTemp";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            return wrapper;
        }

        if (this.config.icon) {
            const icon = document.createElement("span");
            icon.className = "fa fa-" + this.config.icon + " symbol";
            wrapper.appendChild(icon);
        }

        if (this.temperature !== null && this.config.showTemperature) {
            const temp = document.createElement("span");
            temp.className = "temp";
            temp.innerHTML = `${this.temperature}°`;
            wrapper.appendChild(temp);
        }

        if (this.humidity !== null && this.config.showHumidity) {
            const humidity = document.createElement("span");
            humidity.className = "humidity";
            humidity.innerHTML = `${this.humidity}%`;
            wrapper.appendChild(humidity);
        }

        return wrapper;
    }
});