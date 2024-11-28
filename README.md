# mmm-RemoteTemp
Use this template for creating new MagicMirror² modules.

See the [wiki page](https://github.com/Dennis-Rosenbaum/mmm-RemoteTemp/wiki) for an in depth overview of how to get started.

# mmm-RemoteTemp

![Example of mmm-RemoteTemp](./example_1.png)

Display temperature, humidity, and/or battery level from a Smart Home Temperature Sensor.

## Installation

### Install

In your terminal, go to your [MagicMirror²][mm] Module folder and clone mmm-RemoteTemp:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/JC-Reno/MMM-RemoteTemp.git
```

### Update

```bash
cd ~/MagicMirror/modules/mmm-RemoteTemp
git pull
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
    {
        module: 'mmm-RemoteTemp',
        position: 'lower_third'
    },
```

Or you could use all the options:

```js
    {
        module: 'mmm-RemoteTemp',
        position: 'lower_third',
        config: {
            exampleContent: 'Welcome world',
            showTemperature: true,
            showHumidity: true
        }
    },
```

## Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`exampleContent`|`string`|not available|The content to show on the page
`showTemperature`|`boolean`|true|Show the temperature
`showHumidity`|`boolean`|true|Show the humidity

## Sending notifications to the module

Notification|Description
------|-----------
`TEMPLATE_RANDOM_TEXT`|Payload must contain the text that needs to be shown on this module

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
