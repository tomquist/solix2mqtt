# solix2mqtt

CLI tool to poll data for an Anker SOLIX Solarbank E1600 Balcony Power Storage and publish it to an MQTT broker.

## Description
This is a thin bridge between the API used by the Anker App and MQTT. Although the project is currently read-only, adding support for updates should be relatively straightforward. Feel free to open a PR.

## Prerequisites

Before you begin, ensure you have met the following requirements:

### Software
- **[Node.js](https://nodejs.org/)**: You will need Node.js to run this project. Download and install it from [nodejs.org](https://nodejs.org/).
- **[npm](https://www.npmjs.com/)**: This project uses npm for dependency management. It is included with the Node.js installation.

### Setup
1. **Clone the repository**: Clone this repository to your local machine using `git clone https://github.com/tomquist/solix2mqtt.git`.
2. **Navigate to the project directory**: `cd solix2mqtt`.
3. **Install dependencies**: Run `npm install` to install all the project dependencies.

With these steps, you will have set up the necessary environment to run and use `solix2mqtt`.

## Usage
### Locally
```bash
npm install && npm run build
  S2M_USER=*** \
  S2M_PASSWORD=*** \
  S2M_COUNTRY=DE \
  S2M_MQTT_URI=mqtt://localhost:1883 \
  npm run start
```

### Docker
```bash
docker run -d \
  -e S2M_USER=*** \
  -e S2M_PASSWORD=*** \
  -e S2M_COUNTRY=DE \
  -e S2M_MQTT_URI=mqtt://localhost:1883 \
  tomquist/solix2mqtt:latest
```

## Configuration
The app can be configured using the following environment variables:

- `S2M_USER` (required): A Solix API client id
- `S2M_PASSWORD` (required): The client secret
- `S2M_COUNTRY` (required): A two-letter country code (e.g. `DE`)
- `S2M_LOGIN_STORE` (optional): Path to a file where the auth tokens will be cached. (default `auth.data`)
- `S2M_POLL_INTERVAL` (optional): The polling interval in seconds (default `60`) 
- `S2M_MQTT_URI` (required): The MQTT broker URL, e.g. `mqtt://host:1883`
- `S2M_MQTT_USERNAME` (optional): Optional username for MQTT authentication
- `S2M_MQTT_PASSWORD` (optional): Optional password for MQTT authentication
- `S2M_MQTT_CLIENT_ID` (optional): MQTT client identifier (default: `solix2mqtt``)
- `S2M_MQTT_TOPIC` (required): Topic prefix where data should be published (default: `solix``)
- `S2M_VERBOSE` (optional): Set to true for more logs (default: `false``)

## Auth

The App utilizes an advanced version of the auth mechanism known from Eufy. The Anker App employs a two-step authentication scheme: first, keys are exchanged, and second, the full login payload is encrypted. However, it turns out the original Eufy mechanism still works, so we're using that in this project (credits to [eufy-security-client](https://github.com/bropat/eufy-security-client) for inspiration). This might break at some point!

**Note**: Anker currently permits only one simultaneous login at a time. When you log in from another device, all previously generated auth tokens become invalidated. Thus, if you're utilizing this project, you will be unable to use the app concurrently.

## Disclaimer
This project is the result of some work I did to integrate my Solix into my home automation. I no longer own an Anker Solix Solarbank due to disappointment with the product, so this project will not receive any updates. However, I'm happy to accept pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements
- [eufy-security-client](https://github.com/bropat/eufy-security-client)
