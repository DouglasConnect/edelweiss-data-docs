# API Authentication

There are two types of Tokens for authenticating with EdelweissData API. They are

1. Access Token
2. Refresh Token

## Access Tokens
This is the primary way of authenticating with the EdelweissData API. These Tokens are short lived and will expire after a few minutes. This is great if you simply want to execute a script against your datasets.

Because they are short lived, It's relatively safe to share scripts that contain these tokens.

You simply add it to the request as follows
```js
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...ZGqRC0ZVBJBRJK-1sYuy2cON40sLRCusRkoTjcy92YY"

let fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    }
}
...
```

### Get Your Access Token
To get your access token simply login you simply take the following steps

- Navigate to [My Datasets](https://edelweissdata.com/datasets/manage) Page.
- Click the "Get API Key" button
- Click the "Copy Key" button


## Refresh Tokens

As convinient as Access Tokens are, this approach will not work for applications that have to run on behalf of the user. In this case we need a way to generate access tokens without exposing the username and password.

That's where referesh tokens come in. They represent a username/password pair for the user so applications can use them to generate access tokens automatically

However, unlike Access Tokens, they are very sensitive and long lived so you need to be careful where you store them and who has access to them as anyone with the referesh token can impersonate the User