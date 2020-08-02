# API Authentication

The Edelweiss Data API uses bearer tokens in HTTP requests in order to authenticate the requester and to allow access to protected datasets.

For example, sending a bearer token with fetch request to list datasets:

```js
fetch(`${baseUrl}/datasets`, {
    headers: {
        'Authorization': `bearer ${token}`
    },
})
```

In this document we cover:

1. Generating an access token using the Edelweiss Data CLI.
2. (Advanced) Generating an access token directly from http requests.
