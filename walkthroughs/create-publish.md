# Create and Publish a Dataset

In order to create a Dataset, you first need to Create an In Progress Dataset. In this stage you can make as many changes to the dataset as you want.

Once you are okay with the Data in the Dataset and want to make the Dataset Available to others, you can simply Publish the Dataset.

A published dataset is versioned and as such cannot be modified. In order to modify a published Dataset you will need to publish a new version by creating another In Progress Dataset, apply the new changes you'd like to make and then publish a new version.

Keep in mind that the old version is still available

<p>&nbsp;</p>

![Dataset LifeCycle](images/dataset-lifecycle.png)

## Getting Started
To Create a Dataset you will need to first [Create a Authentication Token](authentication.md)

The steps to publish a new Dataset are as follows

1. Create a Dataset
2. Upload the Data
3. Infer the Schema
4. Publish the Dataset
5. Query the Dataset
6. Delete a Dataset

### Create a Dataset

You start by creating a dataset. By default when a dataset is created it is in the InProgress State. In this state you can make modifications and updates

Code:
```js
let token = "XXXXXXXXXXXXXXXX" //Replace with your API Token
const data = { name: 'my-dataset' };
let baseUrl = "https://api.edelweissdata.com/datasets"

let fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(data),
}

fetch(`${baseUrl}/datasets/create`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```

Response:

```json
{
   "id":"8e26dca9-477f-4d2f-b979-0a4b5763f359",
   "name":"my-dataset",
   "schema":null,
   "created":"2020-07-18T23:14:03.9818053+00:00",
   "description":"",
   "metadata":{

   },
   "dataSource":null
}
```

### Upload data to a Dataset

Now that we have a dataset created, we need to populate it with data. We need to read the csv and upload it as `multipart/form-data`. The api expects the file to be passed as the `data` parameter

Code:

```js
let baseUrl = "https://api.edelweissdata.com/datasets"
let datasetId = "8e26dca9-477f-4d2f-b979-0a4b5763f359"

let baseUrl = "https://api.edelweissdata.com/datasets";

let formData = new FormData();
formData.append("data", file, "")

let fetchOptions = {
    method: 'POST',
    headers: {
        'Authorization': `bearer ${token}`
    },
    body: formData,
}

fetch(`${baseUrl}/${datasetid}/in-progress/data/upload`, fetchOptions)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```
Response:
```json
{
   "id":"8e26dca9-477f-4d2f-b979-0a4b5763f359",
   "name":"my-dataset",
   "schema":null,
   "created":"2020-07-19T10:04:59.9681770+00:00",
   "description":"",
   "metadata":{

   },
   "dataSource":null
}
```

### Infer Schema

At this point we have our data stored as CSV in Edelweiss Data however, It is currently stored as a bunch of string values in the Edelweiss Data.

In order to make the data interesting and allow Edelwiess Data make sense of it, we need to supply a schema.

The schema defines the datatype of the columns in the data. The data types could be simple Data Types like `string`, `integer` or they could be more advanced datatypes like `DateTime` or `Smiles`

You can manually define a schema and upload it but Edelweiss Data has a convinent feature where it can infer the schema based on some heuristics.

Code:

```js
let baseUrl = "https://api.edelweissdata.com/datasets"
let datasetId = "8e26dca9-477f-4d2f-b979-0a4b5763f359"

let fetchOptions = {
    method: 'POST',
    headers: {
        'Authorization': `bearer ${token}`
    }
}

fetch(`${baseUrl}/${datasetid}/in-progress/schema/infer`, fetchOptions)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```
Response:
```json
{
   "id":"8e26dca9-477f-4d2f-b979-0a4b5763f359",
   "name":"my-dataset",
   "schema":{
      "columns":[
         {
            "name":"FirstName",
            "description":"",
            "dataType":"xsd:string",
            "visible":true
         },
         {
            "name":"LastName",
            "description":"",
            "dataType":"xsd:string",
            "visible": true
         }
      ]
   },
   "created":"2020-07-20T01:48:58.9086970+00:00",
   "description":"",
   "metadata":{

   },
   "dataSource":null
}
```

### Publish the Dataset

Now that we have inferred a schema for the database, We could publish our Dataset. Publishing a Dataset creates a new version of that Dataset.

Each version after being published cannot be changed rather you can create new versions to replace earlier versions.

As a result, we need to provide a helpful changelog message that will helps us understand what this version is about

Code:
```js
const data = { changelog: 'Initial Version' };
let baseUrl = "https://api.edelweissdata.com/datasets"
let datasetId = "8e26dca9-477f-4d2f-b979-0a4b5763f359"

let fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(data),
}

fetch(`${baseUrl}/${datasetId}/in-progress/publish`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```
Response:
```json
{
   "id":"8e26dca9-477f-4d2f-b979-0a4b5763f359",
   "name":"my-dataset",
   "schema":{
      "columns":[
         {
            "name":"FirstName",
            "description":"",
            "dataType":"xsd:string",
            "visible":true
         },
         {
            "name":"LastName",
            "description":"",
            "dataType":"xsd:string",
            "visible": true
         }
      ]
   },
   "created":"2020-07-20T01:48:58.9086970+00:00",
   "description":"",
   "metadata":{

   },
   "dataSource":null
}
```


### Query the Dataset

When we want to query the Dataset, we use need to supply the datasetId and version number. In the event that you don't want to specify the version you can use the `latest` moniker

It also leverages a powerful query languge that allows you to slice and filter the data the endpoint returns.

For example the query in the snippet, filters the data where the column `State` contains the word `baden`

```js
let query = {
   "columns":[

   ],
   "condition":{
      "and":[
         {
            "fuzzySearch":[
               {
                  "column":[
                     "State"
                  ]
               },
               "baden"
            ]
         }
      ]
   },
   "offset":0,
   "limit":100,
   "orderBy":[

   ]
}
```
See [Query Language](query.md) for more details about the query language.


Code:
```js
let baseUrl = "https://api.edelweissdata.com/datasets"
let datasetId = "8e26dca9-477f-4d2f-b979-0a4b5763f359"
let version = "1"

let queryString = JSON.stringify(query)

let fetchOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(data),
}

fetch(`${baseUrl}/${datasetId}/versions/${version}/data?query=${query}`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```

Response:
```json
{
    "total": 0,
    "offset": 0,
    "limit": 0,
    "results": [
        {
            "id": 0,
            "data": {
                "Column1": "data",
                "Column2": "data"
            }
        }
    ],
    "aggregations": {}
}
```


### Delete a Dataset
To delete a dataset we simply need send a delete request. Keep in mind that this deletes the dataset and all versions of the dataset

```js
let baseUrl = "https://api.edelweissdata.com/datasets"
let datasetId = "8e26dca9-477f-4d2f-b979-0a4b5763f359"

let fetchOptions = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    }
}

fetch(`${baseUrl}/${datasetId}`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```

Delete dataset just produces a 204 status code with no content