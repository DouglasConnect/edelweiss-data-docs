# Retrieving data

An interactive version of this walkthrough exists as an [Observable notebook](https://observablehq.com/@danyx/edelweissdata-docs-retrieving-data?collection=@danyx/edelweissdata-interactive-documentation) that allows you to change parameters and see results instantaneously.

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

Response (truncated in parts for brevity):
```json
{
  "id": {
    "id": "8dde2785-8a2a-4847-80b8-982a691954d6",
    "version": 106
  },
  "name": "COVID-19 timeseries data for Germany by state (RKI data)",
  "schema": {
    "columns": [
      {
        "name": "State",
        "description": "",
        "dataType": "xsd:string",
        "arrayValueSeparator": null,
        "missingValueIdentifiers": [],
        "indices": [
          "terms-aggregation"
        ],
        "visible": true,
        "rdfPredicate": null,
        "statistics": {
          "mean": null,
          "standardDeviation": null,
          "min": null,
          "max": null,
          "terms": [
            {
              "docCount": 132,
              "termName": "Mecklenburg-Vorpommern"
            }
            //, ...
          ]
        }
      },
      {
        "name": "Date",
        "description": "",
        "dataType": "xsd:string",
        "arrayValueSeparator": null,
        "missingValueIdentifiers": [],
        "indices": [],
        "visible": true,
        "rdfPredicate": null,
        "statistics": {
          "mean": null,
          "standardDeviation": null,
          "min": null,
          "max": null,
          "terms": null
        }
      },
      {
        "name": "Cases",
        "description": "",
        "dataType": "xsd:integer",
        "arrayValueSeparator": null,
        "missingValueIdentifiers": [],
        "indices": [],
        "visible": true,
        "rdfPredicate": null,
        "statistics": {
          "mean": 87.17551622418878,
          "standardDeviation": 193.172798954723,
          "min": 1,
          "max": 1986,
          "terms": null
        }
      },
      {
        "name": "Deaths",
        "description": "",
        "dataType": "xsd:integer",
        "arrayValueSeparator": null,
        "missingValueIdentifiers": [],
        "indices": [],
        "visible": true,
        "rdfPredicate": null,
        "statistics": {
          "mean": 3.420722713864307,
          "standardDeviation": 11.006584168256104,
          "min": 0,
          "max": 131,
          "terms": null
        }
      },
      {
        "name": "TotalCases",
        "description": "",
        "dataType": "xsd:integer",
        "arrayValueSeparator": null,
        "missingValueIdentifiers": [],
        "indices": [],
        "visible": true,
        "rdfPredicate": null,
        "statistics": {
          "mean": 10028.100294985252,
          "standardDeviation": 14101.49014397,
          "min": 1,
          "max": 57560,
          "terms": null
        }
      },
      {
        "name": "TotalDeaths",
        "description": "",
        "dataType": "xsd:integer",
        "arrayValueSeparator": null,
        "missingValueIdentifiers": [],
        "indices": [],
        "visible": true,
        "rdfPredicate": null,
        "statistics": {
          "mean": 463.3517699115044,
          "standardDeviation": 693.937711433364,
          "min": 0,
          "max": 2635,
          "terms": null
        }
      }
    ]
  },
  "rowcount": 13,
  "created": "2020-08-26T09:35:55.9000930+00:00",
  "description": "# COVID-19 data for Germany ...",
  "metadata": {
    "category": "covid-19",
    "columnNames": {
      "daily-cases": "Cases",
      "daily-deaths": "Deaths",
      "date": "Date",
      "region": "State",
      "total-cases": "TotalCases",
      "total-deaths": "TotalDeaths"
    },
    "dataBackgroundInformation": "https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0",
    "datetimeRetrieved": "2020-08-26 09:35:47.668202+00:00",
    "estimatedReportingCutoff": "2020-08-25 22:00:00+00:00",
    "keywords": [
      "covid-19",
      "cases",
      "deaths",
      "Germany"
    ],
    "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "originalDataCollectionAgency": "https://www.rki.de",
    "regions": [
      "Baden-Württemberg",
      "Bayern",
      "Berlin",
      "Brandenburg",
      "Bremen",
      "Hamburg",
      "Hessen",
      "Mecklenburg-Vorpommern",
      "Niedersachsen",
      "Nordrhein-Westfalen",
      "Rheinland-Pfalz",
      "Saarland",
      "Sachsen",
      "Sachsen-Anhalt",
      "Schleswig-Holstein",
      "Thüringen"
    ],
    "upstreamSource": "https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.csv"
  },
  "isPublic": true
}
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

Example Response (only 2 example rows):
```json
{
  "total": 174,
  "offset": 0,
  "limit": 10,
  "results": [
    {
      "id": 398,
      "data": {
        "Date": "2020/03/26 00:00:00",
        "Cases": 286,
        "State": "Berlin",
        "Deaths": 4,
        "TotalCases": 2032,
        "TotalDeaths": 23
      }
    },
    {
      "id": 397,
      "data": {
        "Date": "2020/03/25 00:00:00",
        "Cases": 245,
        "State": "Berlin",
        "Deaths": 2,
        "TotalCases": 1746,
        "TotalDeaths": 19
      }
    },
    // ...
  ]
}
```

The data retrieval endpoint accepts a [DataQuery JSON object](https://api.edelweissdata.com/docs/index.html#model-DataQuery) that allows you to order the data differently, filter the rows or return only selected columns (for details about the Query Language refer to the [Query Language walkthrough](query)).

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

The data retrieval endpoint can return the data not just as JSON as shown above but also as CSV, which can be easier to work with in some workflow tools etc. To retrieve the data as CSV you can either use content-negotiation (i.e. set the `Accept` header to `text/csv`) or include a query parameter "`mimetype=text/csv`. The former is preferred but the latter is sometimes convenient when a workflow tool does not let you set request headers. Note that in the CSV case you only get the data back, not the additional information you get with JSON on the top level.

Here is the request for performing the above filtered query but requesting the data as CSV.

```javascript
const options = {
    headers: { Accept: "text/csv" }
    method: 'POST',
    body: JSON.stringify(dataQuery)
  };
fetch(`${edelweissdataUrl}/datasets/${datasetId}/versions/${version}/data`,options)
    .then(response => response.text());
```

Response
```text
State,Date,Cases,Deaths,TotalCases,TotalDeaths
Berlin,2020/03/26 00:00:00,286,4,2032,23
Berlin,2020/03/25 00:00:00,245,2,1746,19
Berlin,2020/04/03 00:00:00,239,17,3564,74
Berlin,2020/04/02 00:00:00,237,7,3325,57
Berlin,2020/03/31 00:00:00,213,3,2901,42
Berlin,2020/03/27 00:00:00,205,5,2237,28
Berlin,2020/04/07 00:00:00,202,15,4096,105
Berlin,2020/03/24 00:00:00,199,5,1501,17
Berlin,2020/03/28 00:00:00,197,3,2434,31
Berlin,2020/04/01 00:00:00,187,8,3088,50
```