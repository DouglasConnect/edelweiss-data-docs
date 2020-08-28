# Retrieving data

This walkthrough shows how to retrieve a dataset and its data from EdelweissData. One of EdelweissData's principles is that for most interactions there should be a nice graphical user interface as well as a well designed REST like API. For this notebook, we will look at the API requests equivalent to browsing a single dataset in the EdelweissData DataExplorer. We'll retrieve information about the "[COVID-19 timeseries data for Germany by state (RKI data)](https://edelweissdata.com/dataset/8dde2785-8a2a-4847-80b8-982a691954d6:106)" dataset - if you follow the link you can explore it interactively in the DataExplorer to get an idea about the data.

In this walkthrough we'll concentrate on public datasets that can be accessed without authorization. If you want to access private datasets, refer to the [authentication notebook](/docs-authentication) for details.

## Datasets in EdelweissData

You can think of datasets in EdelweissData as having 4 components:
* The **data table** itself
* A **dataset description** that explains the data in human readable form - much like a README.md on a github repository
* **Metadata** formatted as a JSON document. This can be used to store information about the author, equipment used to collect the data or whatever else you think may be useful.
* The **schema** of the data that stores information about the data columns. This includes the data type, an optional description and statistics for numeric values or aggregations for categorical values.

Each of these 4 components gets it's own tab in the DataExplorer:
![Data Explorer image](https://edelweissdata.com/images/data-explorer-tabs.png)

When it comes to the API requests, these 4 components are grouped into 2 request endpoints - one for retrieving the data ([/datasets/{datasetId}/versions/{version}/data](https://api.edelweissdata.com/docs/index.html#operations-Published-postPublishedDatasetData)) and one for retrieving information about the dataset, like the name, description, metadata and schema ([/datasets/{datasetId}/versions/{version}](https://api.edelweissdata.com/docs/index.html#operations-Published-getPublishedDataset)).

The **datasetId** is a UUID identifier. The **version** is either the integer number that identifies the version of the dataset you want to retrieve (starting at 1 and incremented every time a new version is published), or the special **latest** identifier which will get whatever is the most recent published version of a dataset. Versions are immutable, meaning they are guaranteed by the system not to change once they are published, so you can have exact reproducibility of analysis by referencing a concrete version or using whatever the most up-to-date version of a dataset is if you prefer that.

## Retrieving the dataset

To retrieve a dataset (containing the description, schema and metadata among other pieces of information) you perform a GET request to the [/datasets/{datasetId}/versions/{version}](https://api.edelweissdata.com/docs/index.html#operations-Published-getPublishedDataset) endpoint.

```javascript
fetch(`${edelweissdataUrl}/datasets/${datasetId}/versions/${version}`)
     .then(response => response.json())
```

## Retrieving the data

For the tabular data component of the dataset there are a few more options since this can result in a lot of data potentially being transmitted.

The basic mechanism to retrieve data is to perform a GET request to the [/datasets/{datasetId}/versions/{version}/data](https://api.edelweissdata.com/docs/index.html#operations-Published-postPublishedDatasetData) endpoint.

Our queries support powerful filtering - the query can either be encoded as a query parameter or as a json request body. Since not all clients support request bodies for GET requests, the endpoint works identically for a POST request.

The response is a JSON object containing a few keys with general information (e.g. how many rows the current query results in in total), as well as the **results** key that contains an array of json objects where every object is one result row. Every row object has two keys: **id**, containing the original row number in the CSV file, and **data** containing a JSON object where the column names are keys and the values are the values for the columns of this row.

The resulting data is paged so if the top level **total** entry indicates more rows than were returned you have to use the **limit** and **offset** parameters of the query to accumulate the full data over multiple requests.

```javascript
fetch(`${edelweissdataUrl}/datasets/${datasetId}/versions/${version}/data`)
    .then(response => response.json())
```

The data retrieval endpoint accepts a [DataQuery JSON object](https://api.edelweissdata.com/docs/index.html#model-DataQuery) that allows you to order the data differently, filter the rows or return only selected columns (for details about the Query Language refer to the [Query Language walkthrough](/@danyx/edelweissdata-docs-query-language)).

Here is an example that filters to only the rows where the State column is "Berlin", orders by the number of new cases descending and returns only the first 10 rows:

```javascript
const dataQuery = ({
    limit: 10,
    orderBy: [{ expression: { column: ["Cases"] }, ordering: "descending" }],
    condition: { exactSearch: [{ column: ["State"] }, "Berlin"] },
    columns: ["Date", "Cases", "State"]
  })
const options = {
    method: 'POST',
    body: JSON.stringify(dataQuery)
  }
fetch(`${edelweissdataUrl}/datasets/${datasetId}/versions/${version}/data`,options)
    .then(response => response.json());
```

### Data retrieval as CSV

The data retrieval endpoint can return the data not just as JSON as shown above but also as CSV, which can be easier to work with in some workflow tools etc. To retrieve the data as CSV you can either use content-negotiation (i.e. set the `Content-Type` header to `text/csv`) or include a query parameter "`mimetype=text/csv`. The former is preferred but the latter is sometimes convenient when a workflow tool does not let you set request headers. Note that in the CSV case you only get the data back, not the additional information you get with JSON on the top level.

Here is the request for performing the above filtered query but requesting the data as CSV.

```javascript
const options = {
    method: 'POST',
    body: JSON.stringify(dataQuery)
  };
fetch(`${edelweissdataUrl}/datasets/${datasetId}/versions/${version}/data?mimetype=text/csv`,options)
    .then(response => response.text());
```