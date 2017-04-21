# Salesforce Explorer

This is an electron app using the jsforce library to explore a Salesforce instance.  Think of it like Workbench, but for your desktop.

## Getting Started

1. Install the dependencies using npm:

```
npm instal
```

2. Rebuild the native libraries against electron's version of node, you can doing this using:

```
npm run rebuild
```

3. Create a connected app in a Salesforce org. You can create a new developer org [here](https://developer.salesforce.com/signup), and there are instructions for setting up a connected app [here](https://help.salesforce.com/articleView?id=connected_app_create.htm&type=0).  You will want to add the grants for refresh token and api access.  For a callback url you can use: `https://salesforce-explorer-redirect-uri.localhost.com/`.

4. Create a config file `config.json` in your root. It should look like this:

```json
{
    "authorize_url": "https://login.salesforce.com/services/oauth2/authorize",
    "access_token_url": "https://login.salesforce.com/services/oauth2/token",
    "client_id": "...",
    "client_secret": "...",
    "redirect_uri": "https://salesforce-explorer-redirect-uri.localhost.com/",
    "scopes": ["refresh_token", "api"],
    "extra": {
        "response_type": "code"
    }
}
```

*Note that `client_id` and `client_secret` will be filled in with those provided by your connected app, which you created in the previous step.*

5. Run the app:
```
npm start
```

## Packaging

In order to package you first need to run:

```
npm run build
```

This will use babel to compile es6 language features and React's jsx.

Next run the packaging command:

```
npm run package
```

This will prepare a binary on your local machine that you can run.
