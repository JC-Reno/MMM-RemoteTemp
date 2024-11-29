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
        this.battery = null;
        this.lastUpdate = null;
        this.loaded = false;
        this.sendSocketNotification("GET_REMOTE_TEMPERATURE_DATA", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "REMOTE_TEMPERATURE_DATA") {
            this.temperature = payload.temp;
            this.humidity = payload.humidity;
            this.battery = payload.battery;
            this.lastUpdate = new Date();
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

        const dataDiv = document.createElement("div");
        dataDiv.className = "data";

        if (this.config.icon) {
            const icon = document.createElement("span");
            icon.className = "fa fa-" + this.config.icon + " symbol";
            dataDiv.appendChild(icon);
        }

        if (this.temperature !== null) {
            const temp = document.createElement("span");
            temp.className = "temp";
            temp.innerHTML = `${this.temperature}°`;
            dataDiv.appendChild(temp);
        }

        if (this.humidity !== null) {
            const humidity = document.createElement("span");
            humidity.className = "humidity";
            humidity.innerHTML = `${this.humidity}%`;
            dataDiv.appendChild(humidity);
        }

        wrapper.appendChild(dataDiv);

        if (this.config.showMore) {
            const moreDiv = document.createElement("div");
            moreDiv.className = "more";

            if (this.lastUpdate) {
                const time = document.createElement("span");
                time.className = "time";
                time.innerHTML = this.lastUpdate.toLocaleTimeString();
                moreDiv.appendChild(time);
            }

            if (this.battery !== null) {
                const battery = document.createElement("span");
                battery.className = "battery fa fa-battery-full";
                battery.innerHTML = ` ${this.battery}%`;
                moreDiv.appendChild(battery);
            }

            wrapper.appendChild(moreDiv);
        }

        return wrapper;
    }
});