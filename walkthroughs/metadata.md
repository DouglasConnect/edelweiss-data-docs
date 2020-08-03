# Metadata

Maybe the most interesting feature of EdelweissData™ is the metadata support. You may know the [FAIR Data](https://en.wikipedia.org/wiki/FAIR_data) initiative that is an effort to make scientific data Findable, Accessible, Interoperable and Reusable. EdelweissData™ itself takes care of the Accessible and Interoperable parts by defining APIs and using open standards for communication. But only good metadata provided by you as the author to EdelweissData™ can enable the Findable and Reusable parts of FAIR data.

Metadata in EdelweissData™ is stored for each dataset and comes in four forms:

1. the metadata field that stores arbitrary JSON formatted metadata and is optimized for use in scripts etc.
2. the description field that can contain markdown formatted text that describes details of the dataset in verbose form for other humans
3. the description field for each column in the schema
4. some automatically collected system metadata like the timestamp the version of the dataset was published at

Of these, the first is maybe the most unusual so this walkthrough will focus on how the metadata field can be used, but first, let's take a quick look at the description fields.

## The datset description field

The dataset description field can be used like a README.md text on Github - i.e. it is text that can be formatted using the simple markdown formatting language. The purpose of this description is to explain to another scientist what this dataset is about, what should be know when using it, how it can be re-used etc.. Some questions to consider answering in the description are:

* What does this dataset contain?
* When was the data collected/computed?
* Who collected/computed the data?
* What are limitations of the data that should be known when interpreting it?
* Is there an authorative source where the original CSV data can be found? If so, link to it in the text.
* Is there a specific license under which the data can be used?

Additionally, a description can be given for every column in the dataset schema. This can be used to store a similar textual description of this particular column which is useful to elaborate further on details specific to one column or to state things like the unit for all values in this column.

## The metadata field

The metadata field that EdelweissData™ stores for every dataset can contain arbitrary JSON - i.e. at the simplest, it can just be an empty JSON object (`{}`).

To understand what makes the JSON metadata so powerful in EdelweissData™ it is important to understand the various ways the metadata can be used. The most straight forward use is to treat it mainly to attach some additional data to a dataset, e.g. to track the start and end date of data collection etc in a way that can easily be processed in a script or workflow.

Metadata becomes most useful though if you are dealing not just with a single dataset but with a large number. If the datasets in question adehere to a common (sub-)structure of metadata then powerful workflows can be enabled. As an example, consider a scenario where each dataset contains the measurements made in a particular experiment with one chemical - the rows and columns could be different timepoints and concentrations and the respective measurements. In such a case you might have hundreds of different datasets, each containing data for a different chemical. It would be very useful if you could easily train a machine learning model to predict these values from some kind of descriptors derived form the chemical structure. You can use metadata for such cases to store, for each dataset, the name of the compound, the SMILES encoded chemical structure and maybe even some descriptors that might be relevant (like solubility in water, molecular weight, ...) in the json metadata. A script that trains an ML model could then simply retrieve the dataset for all these compounds and their metadata (the json encoded details like the name, SMILES string and descriptors) and their tabular data and train a predictive model with it.

To illustrate, here is an example of what the metadata could look like for a dataset representing measurements made with a specific chemical. The data could be nested into multiple levels but here everything is shown on the top level for simplicity:

```json
{
    "chemicalName": "valporic acid",
    "smiles": "O=C(O)C(CCC)CCC",
    "molecularWeight": 144.211,
    "logP": 2.8
}
```

Because in such scenarios it is very common to filter datasets based on certain criteria (e.g. include only datasets that contain the required descriptors while excluding those with a molecular weight above a certain threshold), EdelweissData™ allows you to specify column mappings to extract certain values from each datasets' metadata into a new column in a /datasets query. I.e. where you would normaly retrieve just the name, creation date and version of a dataset you can specify arbitrary mappings into the metadata to appear as values in a new column. To illustrate, consider that you want to retrieve only datasets with a molecularWeigth above 0 but below 900. You could create a query with the following Dataset Query payload to retrieve data filtered in such a way:

```json
{
  "columns": [
    {
      "name": "molecularWeight",
      "jsonPath": "$.molecularWeight",
      "dataType": "xsd:integer"
    }
  ],
  "condition": {
      "and": [
          { "gt": [{"column": ["molecularWeight"]}, 0.0] },
          { "lt": [{"column": ["molecularWeight"]}, 900.0] }
      ]
  }
}
```

The result would be a json response that would look something like this when viewed in the UI of EdelweissData™:

| Name | Created | Version | molecularWeight |
| ...  | ...     | ...     | 144.211         |

The "columns" section above creates a mapping using a [JSONPath query](https://goessner.net/articles/JsonPath/) that tries to map the value at the "molecularWeight" key at the root level into a new column (converting it to an integer), while the "condition" section filters to only those datasets where the value at this part of the metadata is above 0 and below 900.
