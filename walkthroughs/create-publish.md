# Create and Publish a Dataset

In order to create a Dataset, you first need to Create an In Progress Dataset. In this stage you can make as many changes to the dataset as you want.

Once you are okay with the Data in the Dataset and want to make the Dataset Available to others, you can simply Publish the Dataset.

A published dataset is versioned and as such cannot be modified. In order to modify a published Dataset you will need to publish a new version by creating another In Progress Dataset, apply the new changes you'd like to make and then publish a new version.

Keep in mind that the old version is still available

**Dataset Lifecycle Flow**

![Dataset LifeCycle](images/dataset-lifecycle.png)

For detailed information about Edelweiss API you can visit the [Swagger Docs](https://api.edelweissdata.com/docs/index.html)

## Getting Started
To Create a Dataset you will need to first [Create a Authentication Token](authentication.md)

The steps to publish a new Dataset are as follows

1. Create a Dataset
2. Upload the Data
3. Upload the Schema
4. Upload Metadata and Description
5. Publish the Dataset
6. Query the Dataset
7. Delete a Dataset

For the rest of this walkthrough we will need to declare a few global contants

```js
let baseUrl = "https://api.edelweissdata.com"  // Points to the specific Edelweiss API url
let token = "XXXXXXXXXXXXXXXX"                          // Your API Token
let datasetid = null // variable to hold the datasetId once we create the dataset
```

So with that out of the way..

### Create a Dataset

We start by creating a dataset. By default when a dataset is created it is in the InProgress State. In this state you can make modifications and updates but at the moment, the Dataset is empty

**Code**:
```js
const data = { name: 'my-dataset' };

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
    .then(data => console.log('Success:', data); datasetid = data.id;)
    .catch((error) => {
        console.error('Error:', error);
    });
```

**Response:**

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

Now that we have a dataset created, we need to populate it with data. We need to read the csv and upload it as `multipart/form-data`. The API expects the file to be passed as the `data` parameter

**Code:**

```js
let formData = new FormData();
formData.append("data", file)

let fetchOptions = {
    method: 'POST',
    headers: {
        'Authorization': `bearer ${token}`
    },
    body: formData,
}

fetch(`${baseUrl}/datasets/${datasetid}/in-progress/data/upload`, fetchOptions)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```
**Response:**
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

### Upload the Schema

At this point we have our data stored as CSV in Edelweiss Data. However, It is currently stored as a bunch of string values in the Edelweiss Data.

In order to make the data interesting and allow Edelweiss Data make sense of it, we need to supply a schema.

The schema defines the datatype of the columns in the data. The data types could be simple Data Types like `string`, `integer` or they could be more advanced datatypes like `DateTime` or [Smiles](https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system)

Here are the list of Datatypes currently supported

| Data Type        | Representation                      |
| --               | --                                  |
| String           | xsd:string                          |
| Url              | xsd:anyURI                          |
| Boolean          | xsd:boolean                         |
| Integer          | xsd:integer                         |
| Float            | xsd:double                          |
| DateTime         | xsd:dateTime                        |
| Date             | xsd:date                            |
| DatasetId        | edelweiss:datasetid                 |
| SMILES           | cheminf:CHEMINF_000018              |
| Image            | https://schema.org/image            |
| Json             | http://edamontology.org/format_3464 |

There are currently two ways to define the Schema

1. Inference - We can tell Edelweiss to Infer the schema
2. Upload Schema - We supply the correct schema as json

#### Schema Inference

Edelweiss Data can infer the schema based on some heuristics.

To do this, we simply call the `Infer Schema` endpoint as follows

**Code:**

```js
let fetchOptions = {
    method: 'POST',
    headers: {
        'Authorization': `bearer ${token}`
    }
}

fetch(`${baseUrl}/datasets/${datasetid}/in-progress/schema/infer`, fetchOptions)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```
**Response:**
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

Schema inference can only infer basic information like the data type. If you use schema inference, consider augmenting the returned schema (e.g. with richer descriptions for each column if you have them) and uploading it again (see the Schema Upload section below for details)

#### Schema Upload

The schema inference works very well for basic data types, however there are situations where you want fine grained control over the schema. To accomplish this we simply need to call the `UpdateDataset` endpoint

**Code:**
```js
let data = {
    schema: {
        columns:
        [
            {
                "name": "FirstName",
                "dataType": "xsd:string"
                "description": "First Name"
            },
            {
                "name": "LastName",
                "dataType": "xsd:string"
                "description": "Last Name"
            }
        ]
    }
}

let fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(data),
}

fetch(`${baseUrl}/datasets/${datasetId}/in-progress`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```

**Response:**
```json
{
   "id":"8e26dca9-477f-4d2f-b979-0a4b5763f359",
   "name":"my-dataset",
   "schema":{
      "columns":[
         {
            "name":"FirstName",
            "description":"First Name",
            "dataType":"xsd:string",
            "visible":true
         },
         {
            "name":"LastName",
            "description":"Last Name",
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

### Upload Metadata and Description

We have successfully inferred the schema; at this point we can move on to publish the dataset. To make our dataset more useful though, it is a good idea to to add a few additional pieces of information. They are:

1. Description - Markdown textual description to help users understand what the data is about
2. Metadata - A Json object that contains pieces of structured metadata that is useful to allow other people to find the dataset. To learn more about how metadata can be used effectively, have a look at the [metadata documentation](metadata.md)

**Code:**
```js

let description = `
    # My Dataset
    **by Jane Doe**

    Description of the Dataset in Markdown. This can contain [links](https://en.wikipedia.org/wiki/Hyperlink) and **formatting**.
`

let metadata = {
    author: "Jane Doe",
    location: "Basel, Switzerland"
}

let datasetInfo = {
  "name": "My dataset",
  "description": description,
  "metadata": metadata
}

let fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(datasetInfo),
}

fetch(`${baseUrl}/datasets/${datasetId}/in-progress`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```

**Response:**
```json
{
   "id":"8e26dca9-477f-4d2f-b979-0a4b5763f359",
   "name":"My dataset",
   "schema":{
      "columns":[
         {
            "name":"FirstName",
            "description":"First Name",
            "dataType":"xsd:string",
            "visible":true
         },
         {
            "name":"LastName",
            "description":"Last Name",
            "dataType":"xsd:string",
            "visible": true
         }
      ]
   },
   "created":"2020-07-20T01:48:58.9086970+00:00",
   "description":"# My Dataset...",
   "metadata":{
        "author": "Jane Doe",
        "location": "Basel, Switzerland",
    },
   "dataSource":null
}
```

### Publish the Dataset

Now that we have a schema for the dataset and added metadata and a description we can publish our dataset. In the publishing step Edelweiss Data will validate the schema and also pre-compute some information about our data.

Publishing a Dataset creates a new version of that Dataset. Once published, a version cannot be changed. If you want to update the dataset you can create a new version. The old version will still be available though. In the URL scheme of EdelweissData™ all endpoints that reference published datasets specify either a specific version by number (starting at 1), or the special version string `latest` to indicate that we want to retrieve whatever is the newest version of this dataset.

To document the reason behind publishing new version we need to provide a helpful changelog message when we publish a new version:

**Code:**
```js
const data = { changelog: 'Initial Version' };

let fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(data),
}

fetch(`${baseUrl}/datasets/${datasetId}/in-progress/publish`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```
**Response:**
```json
{
   "id": {
      "id": "8e26dca9-477f-4d2f-b979-0a4b5763f359",
      "version": 1
   },
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
   "description":"# My Dataset...",
   "metadata":{
        "name": "my-dataset",
        "author": "Jane Doe",
        "location": "Basel, Switzerland",
    },
   "dataSource":null,
   "isPublic": true
}
```


### Query the Dataset

When we want to query the Dataset, we use need to supply the datasetId and version number. In the event that you don't want to specify the version you can use the `latest` moniker

When querying the data you can also leverage a powerful query language that allows you to filter and order the data.

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


**Code:**
```js
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

fetch(`${baseUrl}/datasets/${datasetId}/versions/${version}/data?query=${queryString}`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```

**Response:**
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
To delete a dataset simply send a delete request. Keep in mind that this deletes the dataset and all versions of the dataset

```js
let fetchOptions = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    }
}

fetch(`${baseUrl}/datasets/${datasetId}`, fetchOptions)
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
```

Delete dataset just produces a 204 status code with no content
