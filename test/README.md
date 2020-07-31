# Documentation Tests

This Project is designed to act as a sanity check for the snippets in the Documentation.

## Authentication

#### Step1: Generate a refresh token

```bash
# we create the python environment
virtualenv env

# activate the python environment
./env/Scripts/activate # Windows
./env/bin/activate     # Mac or Linux

# install the requirements
pip install -r requirements.txt

# Execute the script to print the token
python authenticate.py
```

#### Step2: Provide refresh token to the nodejs server.

Either export an environment variable

```bash
export REFRESH_TOKEN={{ your refresh token }}
```

or create a `config.user.js` file with this content:

```javascript
module.exports = {
  refreshToken: '{{ your refresh token }}',
}
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
