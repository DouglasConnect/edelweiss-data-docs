# Documentation Tests

This Project is designed to act as a sanity check for the snippets in the Documentation.

## Authentication

For now, you will need to first generate an access token using the python client and then replace it in the [tests.js](./src/tests.js#L3) file

To generate the token you will need to use the following snippet

```python
from edelweiss_data import API

# Set this to the url of the Edelweiss Data server you want to interact with
edelweiss_api_url = 'https://api.edelweissdata.com'

api = API(edelweiss_api_url)

api.authenticate()

token = api.auth.generate_jwt()

print(token)
```

## Execute Tests
To run simply navigate to the test directory and then from there execute the following commands

```bash
## Install Dependencies
yarn install

## Run Test Page
yarn start
```

It will launch a webpage with the test on it. Simply click on the "Run Tests"