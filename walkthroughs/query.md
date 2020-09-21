# Edelweiss Query Language

<div class="message">
  <div class="message-body">
        An interactive version of this walkthrough is available as an <a target="_blank" href="https://observablehq.com/@danyx/edelweissdata-docs-query-language?collection=@danyx/edelweissdata-interactive-documentation">Observable notebook</a> that allows you to interact with the code and EdelweissData™ directly. A version of this walkthrough that uses the official
        EdelweissData python client library is available <a target="_blank" href=" https://github.com/DouglasConnect/edelweiss-data-docs/tree/master/example-notebooks">in the public EdelweissData Documentation repository</a>
  </div>
</div>

EdelweissData™ has a rich Query language that allows you to filter and sort both queries to find datasets as well as queries for the actual data of an individual dataset.

To make it easy to get familiar with the Query Language this walkthrough is divided into two sections: an overview of the Query language and then an enumeration of the different types of expressions with examples.

A useful way to get familiar with the Query Language is also to view a dataset in the [EdelweissData™ DataExplorer](https://edelweissdata.com/dataset/8dde2785-8a2a-4847-80b8-982a691954d6:128?q=%7B%7D), filter the data by filling search fields in the UI and ordering it by clicking the icons and then clicking the "API" button in the top right corner to copy/paste the code including the Query expression to filter & order data rows just like you see it in the DataExplorer.

## Overview

The Query Language can be viewed in two different ways: on a higher level that makes it easy to think about the logical structure of a query, and on the lower level of the concrete JSON serialisation. When sending queries to the EdelweissData™ server API, **you always have to use the JSON serialisation**, but when writing queries it can be more familiar to think about it on a higher level in the more familiar infix notation. To illustrate what these levels look like, consider the following JSON serialisation and then the high level conceptual representation. The logical query we want to construct here is to do an exact search on the column `location` for the value `Germany`.

JSON serialisation:
```JSON
{ "exactSearch": [{ "column": ["location"] }, "Germany"] }
```

High level equivalent:
```
exactSearch(column("location"), "Germany")
```

The JSON serialisation we chose is very flexible, easily adaptable with future extensions and easy to correctly parse and construct in various languages - but it looks a bit odd the first time you see it. The JSON serialisation is an [S-Expression](https://en.wikipedia.org/wiki/S-expression) encoded as JSON, something that you might be familiar with if you ever had contact with the Lisp programming language or a descendant - but it doesn't matter if you aren't.

The JSON serialisation always follows the same, rigid layout: everything is either encoded as a **direct value** (e.g. `"Germany"` above or numeric literals), or as an **operation** that is a JSON object with the operation name as its single key and an array of arguments as the corresponding entries.

Here is a more complex example that extends the above by also filtering to rows where `new_cases` is above 100:

```JSON
{
  "and": [
    { "exactSearch": [{ "column": ["location"] }, "Germany"] },
    { "gt": [{ "column": ["new_cases"] }, 100] }
  ]
}
```

```
exactSearch(column("location"), "Germany") AND column("new_cases") > 100
```

## Applications

The Query Language can be used with EdelweissData™ API Endpoints that queries for datasets ([/datasets](https://api.edelweissdata.com/docs/index.html#operations-Published-getPublishedDatasetsViaPost)) as well as those that query for data of an individual dataset ([/datasets/{datasetId}/versions/{version}/data](https://api.edelweissdata.com/docs/index.html#operations-Published-postPublishedDatasetData)). In both cases it can be used to specify the sorting of the data and to filter rows. In the sorting case the Expression has to evaluate to a numeric or textual value (i.e. not a boolean), for the filtering the expression has to evaluate to a boolean value (i.e. whether or not to include a row).

# Elements of the Query Language

## Values

Values are the simplest elements of a Query and are used verbatim (i.e. there is no special escaping etc necessary, they are simply JSON values). You can either use string values (in quotes, e.g. `"Germany"`), numbers (e.g. `4` or `3.2` or `2.384e12`), arrays (JSON style arrays, i.e. `[2.0, 3.0, 4.0]`) or JSON objects (e.g. `{"some-key": "some-value"}`). Of these, strings and numbers are by far used the most. Arrays can be useful for contains queries (where you want to know if a column of an array data type contains the values of the given array). Objects are only used occasionally when doing queries for datasets that include parts of the metadata that can of course contain nested objects. Note that any object with a single key and an array as its value will be parsed as an operation.

## Columns

Column expression reference a given column by name and return the value in the column of the given name. Columns are expressions and thus encoded in the usual form as an object with key `column` and an array that contains the string literal value of the column name:

```JSON
{ "exactSearch": [{ "column": ["location"] }, "Germany"] }
```

Queries that query for datasets can use JSONpaths to map fragments of the metadata into new columns with names supplied with the JSONpath. To distinguish between always existing columns like the dataset name (`name`) or the creation timestamp (`created`) and user defined column names, there exist the special `systemColumn` expression that is used for system specified columns, e.g. to search for a dataset with the name "RNA Sequencing dataset 23" the following expression would be used to indicate that we want to search in the system defined name column, not a column with the same name that was constructed with a JSONpath query:

```JSON
{ "exactSearch": [{ "systemColumn": ["name"] }, "RNA Sequencing dataset 23"] }
```

## Text searches

Three text search functions exist in EdelweissData™: `searchAnywhere` which searches in any text-like column;`exactSearch` which searches in a given column for an exact string value; and `fuzzySearch` which does a more lenient search within a given column for a string (matchings substrings). Text searches result in a boolean value.

```JSON
{ "searchAnywhere": [ "Germany" ] }
```

```JSON
{ "exactSearch": [{ "column": ["location"] }, "Germany"] }
```

```JSON
{ "fuzzySearch": [{ "column": ["location"] }, "erman"] }
```

## Relations

Relations express the usual comparisons: equality (`eq`), greaterThan (`gt`), greaterThanOrEqual(`ge`), lessThan (`lt`), lessThanOrEqual(`le`). All of these take two arguments that are then compared with the result being a boolean value.

```JSON
{ "eq": [ 0, 100 ] }
```

```JSON
{ "gt": [ 0, 100 ] }
```

```JSON
{ "ge": [ 12.0, 100 ] }
```

```JSON
{ "lt": [ {"column": ["new_cases"] }, 100 ] }
```

```JSON
{ "le": [  {"column": ["new_cases"] },  {"column": ["new_deaths"] } ] }
```

In addition to the usual suspects above there exist two special relations, `contains` and `containedIn` that check if the first argument is contains the second (`contains`) or vice versa (`containedIn`).

```JSON
{ "contains": [ [1, 2, 3, 4, 5, 6], [1, 2] ] }
```

```JSON
{ "containedIn": [ [1, 2], [1, 2, 3, 4, 5, 6] ] }
```

## Logical operators

The usual logical operators are supported: `not` (unary), `and` and `or` (both n-ary). All require boolean arguments and evaluate in turn to a boolean value. Since both `and` and `or` are n-ary, you can combine an arbitrary number of arguments with either of these operators in one expression.

```JSON
{
  "not": [
    { "exactSearch": [{ "column": ["location"] }, "Germany"] }
  ]
}
```

```JSON
{
  "and": [
    { "exactSearch": [{ "column": ["location"] }, "Germany"] },
    { "gt": [{ "column": ["new_cases"] }, 100] },
    { "lt": [{ "column": ["new_deaths"] }, 10] }
  ]
}
```

```JSON
{
  "or": [
    { "exactSearch": [{ "column": ["location"] }, "Germany"] },
    { "gt": [{ "column": ["new_cases"] }, 100] }
  ]
}
```


## Special functions

There are a few additional capabilities that fall outside the range of the usual query vocabulary. These revolve around specific domain types, notably the SMILES column type for the chemical structure notation of the same name.

`tanimotoSimilarity` allows you to calculate the [Tanimoto Similarity](https://en.wikipedia.org/wiki/Jaccard_index#Tanimoto_similarity_and_distance) between the molecular fingerprints of the two arguments (fingerprinting is currently not customizable and defaults to rdkit fingerprints with default settings). Both arguments should evaluate to a SMILES chemical structure (either string values that will be converted implicitly or a column with datatype SMILES). The expression evaluates to a score between 0 and 1 with 0 being dissimilar and 1 being entirely identically fingerprints. `tanimotoSimilarity` can thus be used either directly in `orderBy` clauses or as a filter when used in a relation (e.g. > 0.7). When an orderBy clause with a tanimotoSimilarity is active, the values returned for each row in the first referenced column will be augmented with the calculated similarity score (i.e. the json object that is returned for SMILES columns that is always an object with one key for the original value and one for the canonicalized SMILES string will be augmented with an additional `similarity` key that contains the numerical similarity value)

```JSON
// E.g. to be used as an order by expression:
{ "tanimotoSimilarity": ["c1ccccc1", { "column": ["compound"] }] }
```

`substructureSearch` let's you find chemical substructures where the first argument is searched for in the second. Both argument should evaluate to a SMILES chemical structure (either string values that will be converted implicitly or a column with datatype SMILES). `substructureSearch` evaluates to a boolean value.

```JSON
{ "substructureSearch": ["c1ccccc1", { "column": ["compound"] }]}
```

## Casts

The final element of the EdelweissData™ Query Language are casts, which convert data from one datatype to another. Because the query language uses a simple type system, EdelweissData™ is able to infer if a cast is possible. If the cast is safe and cannot fail (for example converting an integer to a string), it will be inserted automatically. If the cast is possible, but not necessarily safe (for example converting a string to an integer may fail, or converting a float to an integer will lose data), the user has to insert it explicitly using the `cast` function. Its first argument is the expression to cast and the second one is the datatype identifier of the type to cast to.

```JSON
{ "cast": [{ "column": ["molecular_weight"] }, "xsd:integer"]}
```

The possible datatypes are [listed here](create-publish.md#upload-the-schema).
