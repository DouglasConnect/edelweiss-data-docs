# Edelweiss Query Language

EdelweissData™ has a rich Query language that allows you to filter and sort both queries to find datasets as well as queries for the actual data of an individual dataset.

To make it easy to get familiar with the Query Language this walkthrough is divided into two sections: an overview of the Query language and then an enumeration of the different types of expressions with examples.

A useful way to get familiar with the Query Language is also to view a dataset in the [EdelweissData™ DataExplorer](https://edelweissdata.com/dataset), filter the data by filling search fields and ordering it by clicking the icons and then clicking the "API" button in the top right corner to copy/paste the code including the Query expression to filter & order data rows just like you see it.

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

The JSON serialisation we chose is very flexible, easily adaptable with future extensions and easy to correctly parse and construct in various languages - but it looks a bit odd the first time you see it. The JSON serialisation is an [S-Expression](https://en.wikipedia.org/wiki/S-expression) encoded as JSON, something that you might be familiar with if you ever had contact with the Lisp programming language or a descendant - but it doesn't matter if you don't.

The JSON serialisation always follows the same, rigid layout: everything is either encoded as a **direct value** (e.g. `"Germany"` above or numeric literals), or as an **operation** that is a JSON object with the operation name as the key and an array of sub-expressions as the entries of the array.

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

The Query Language can be used with EdelweissData™ API Endpoints that queries for datasets ([/datasets](https://api.edelweissdata.com/docs/index.html#operations-Published-getPublishedDatasetsViaPost)) as well as those that query for data of an individual dataset ([/datasets/{datasetId}/versions/{version}/data](https://api.edelweissdata.com/docs/index.html#operations-Published-postPublishedDatasetData)). In both cases it can be used to specify the sorting of the data and to filter rows. In the sorting case then Expression has to evaluate to a numeric or textual value (i.e. not a boolean), for the filtering the expression has to evaluate to a boolean value (i.e. whether or not to include a row).

# Elements of the Query Language

## Values

Values are the simplest elements of a Query and are used verbatim (i.e. there is no special escaping etc necessary, they are simply JSON values). You can either use string values (in quotes, e.g. `"Germany"`), numbers (e.g. `4` or `3.2` or `2.384e12`), arrays (JSON style arrays, i.e. `[2.0, 3.0, 4.0]`) or JSON objects (e.g. `{"some-key": "some-value"}`). Of these, strings and numbers are by far used the most. Arrays can be useful for contains queries (where you want to know if a column contains the values of the given array). Objects are only used occasionally when doing queries for datasets that include parts of the metadata that can of course contain nested objects.

## Columns

Column expression reference a given column by name. Columns are expressions and thus encoded in the usual form as an object with key `column` and an array that contains the string literal value of the column name:

```JSON
{ "exactSearch": [{ "column": ["location"] }, "Germany"] }
```

Queries that query for datasets can use JSONpaths to map fragments of the metadata into new columns with names supplied with the JSONpath. To distinguish between always existing columns like the dataset name (`name`) or the creation timestamp (`created`) and user defined column names, there exist the

## Text searches

Three text search functions exist in EdelweissData™: `searchAnywhere` which searches in any text-like column;`exactSearch` which searches in a given column for an exact string value; and `fuzzySearch` which does a more lenient search within a given column for a string (matchings substrings). Text searches result in a boolean value.

```JSON
{ "searchAnywhere": [ "Germany" ] }
```

```JSON
{ "exactSearch": [{ "column": ["location"] }, "Germany"] }
```

```JSON
{ "fuzzySearch": [{ "column": ["location"] }, "Ger"] }
```

## Relations

Relations express the usual comparisions: equality (`eq`), greaterThan (`gt`), greaterThanOrEqual(`gte`), lessThan (`lt`), lessThanOrEqual(`lte`). All of these take two subexpressions that are then compared with the result being a boolean value.

```JSON
{ "eq": [ 0, 100 ] }
```

```JSON
{ "gt": [ 0, 100 ] }
```

```JSON
{ "gte": [ 12.0, 100 ] }
```

```JSON
{ "lt": [ {"column": ["new_cases"] }, 100 ] }
```

```JSON
{ "lte": [  {"column": ["new_cases"] },  {"column": ["new_deaths"] } ] }
```

In addition to the usual subjects above there exist two special relations, `contains` and `containedIn` that check if the first subexpression is contained within the second (`contains`) or vice versa (`containedIn`).

```JSON
{ "contains": [ [1, 2], [1, 2, 3, 4, 5] ] }
```

```JSON
{ "containedIn": [ [1, 2, 3, 5, 6], [1, 2] ] }
```

## Logical operators

The usual logical operators are supported: `not` (unary), `and` and `or` (both binary). All require boolean subexpressions and evaluate in turn to a boolean value.

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
    { "gt": [{ "column": ["new_cases"] }, 100] }
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

There are a few additional capabilities that fall outside the range of the usualy query vocabulary. These revolve around specific domain types, notably the SMILES column type for the chemical structure notation of the same name.

`tanimotoSimilarity` allows you to calculate the [Tanimoto Similarity](https://en.wikipedia.org/wiki/Jaccard_index#Tanimoto_similarity_and_distance) between the molecular fingerprints of the two subexpressions (fingerprinting is currently not customizable and defaults to rdkit fingerprints with default settings). Both subexpressions should evaluate to a SMILES chemical structure (either string values that will be converted implicitly or a column with datatype SMILES). The expression evaluates to a score between 0 and 1 with 0 being dissimar and 1 being entirely identically fingerprints. `tanimotoSimilarity` can thus be used either directly in `orderBy` clauses or as a filter when used in a relation (e.g. > 0.7). When an orderBy clause with a tanimotoSimilarity is active, the values returned for each row in the first referenced column will be augmented with the calculated similarity score.

```JSON
// E.g. to be used as an order by expression:
{ "tanimotoSimilarity": [{ "column": ["compound"] }, "c1ccccc1"] }
```

`substructureSearch` let's you find chemical substructures where the first subexpression is searched for in the second. Both subexpressions should evaluate to a SMILES chemical structure (either string values that will be converted implicitly or a column with datatype SMILES). `substructureSearch` evaluates to a boolean value.

```JSON
{ "substructureSearch": ["c1ccccc1", { "column": ["compound"] }]}
```

## Casts

The final element of the EdelweissData™ Query Language are casts. Because the query language uses a simple type system, EdelweissData is usually able to infer all necessary casts and it is rarely necessary for a user to explicity specify these. There are some edge cases where it can be necessary though which is why they are available as query expressions. Two types of cast exist - strict casts which make the query fail if a cast is specified between incompatible types, and lenient casts which result in a `null` value if a cast is impossible.

`cast` or `strictCast` attempts to cast from one datatype to another, failing if the cast is impossible. The possible datatypes are [listed here](create-publish.md#upload-the-schema). The first subexpression is the expression to cast, the second string argument is the datatype identifier of the type to cast to.

```JSON
{ "cast": [["test"], "xsd:string"]}
```

`lenientCast` attempts to cast from one datatype to another, returning null if the cast is not possible. The possible datatypes are [listed here](create-publish.md#upload-the-schema). The first subexpression is the expression to cast, the second string argument is the datatype identifier of the type to cast to.

```JSON
{ "lenientCast": [["test"], "xsd:string"]}
```