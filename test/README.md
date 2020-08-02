# Documentation Tests

This Project is designed to act as a sanity check for the snippets in the Documentation.

## Setup

```bash
## Install Dependencies
yarn install
```

## Authentication

#### Step1: Generate a refresh token

```bash
yarn run authenticate
```

#### Step2: Provide refresh token to the nodejs server.

Either export an environment variable

```bash
export REFRESH_TOKEN={{ your refresh token }}
```

or create a file `server/config.user.js` file with this content:

```javascript
module.exports = {
  refreshToken: '{{ your refresh token }}',
}
```

## Directory contents

* [public](./public) contains the front-end html and javascript for running tests against the edelweiss api.
* [server](./server) is a http webserver that handles authentication and serves the static html/javascript files.
* [cli](./cli) is a command line program for interacting with the edelweiss server. Currently it just implements authentication, but its functionality could be extended.

## Execute Tests
To run simply navigate to the test directory and then from there execute the following commands

```bash
## Run Test Page
yarn start
```

It will launch a webpage with the test on it. Simply click on the "Run Tests"
