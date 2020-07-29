# Documentation Tests

This Project is designed to act as a sanity check for the snippets in the Documentation.

## Authentication

For now, you will need to first generate an access token using the python client and then replace it in the [tests.js](./src/tests.js#L3) file

To generate the token, simply navigate to the python folder and run the following

```bash
# we create the python environment
virtualenv env

# activate the python environment
./env/Scripts/activate # Windows
./env/bin/activate     # Mac or Linux

# install the requirements
pip install -r requirements.txt

# Execute the script to generate the token
python authenticate.py > '../test/src/token.jwt'
```

This will generate a `token.jwt` file with your access token

## Execute Tests
To run simply navigate to the test directory and then from there execute the following commands

```bash
## Install Dependencies
yarn install

## Run Test Page
yarn start
```

It will launch a webpage with the test on it. Simply click on the "Run Tests"