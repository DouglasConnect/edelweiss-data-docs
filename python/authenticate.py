from edelweiss_data import API
from os import path

# Set this to the url of the Edelweiss Data server you want to interact with
edelweiss_api_url = 'https://api.edelweissdata.com'

api = API(edelweiss_api_url)

api.authenticate()

token = api.auth.generate_jwt()

print(token)