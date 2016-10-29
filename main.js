'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const querystring = require('querystring');
const https = require('https');
const url = require('url');
const config = require('./config.json');

function appWindow (options) {
    const oauthUrl = options.authorizeUrl + '?' + querystring.stringify({
        ...options.extra,
        client_id: options.client_id,
        scope: options.scopes,
        redirect_uri: options.redirect_uri,
    });

    const appWindow = new BrowserWindow({
        width: 500,
        height: 700,
        titleBarStyle: 'hidden-inset',
    });
    appWindow.loadURL(oauthUrl);
    appWindow.show();
    appWindow.focus();

    appWindow.webContents.on('will-navigate', (event, browserUrl) => {
        // Not the URL we are looking for...
        if (browserUrl.substring(0, options.redirect_uri.length) !== options.redirect_uri) {
            return;
        }

        const urlPieces = url.parse(browserUrl);
        const urlQueryPieces = querystring.parse(urlPieces.query);

        if (!urlQueryPieces.code) {
            alert('A problem occurred! There was no code in the OAuth response.');
            return;
        }

        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            redirect_uri: options.redirect_uri,
            client_id: options.client_id,
            client_secret: options.client_secret,
            code: urlQueryPieces.code,
        });

        const accessTokenUrl = url.parse(options.accessTokenUrl);

        const post = {
            hostname: accessTokenUrl.hostname,
            path: accessTokenUrl.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
                'Accept': 'application/json',
            },
        };

        const req = https.request(post, (response) => {
            let result = '';
            response.on('data', (data) => {
                result += data;
            });
            response.on('end', () => {
                const data = JSON.parse(result.toString());

                appWindow.setSize(800, 600);

                if (process.env.NODE_ENV === 'development') {
                    appWindow.loadURL('file://' + __dirname + '/src/index.html?accessToken=' + data.access_token + '&instanceUrl=' + data.instance_url);
                    appWindow.webContents.openDevTools();
                } else {
                    appWindow.loadURL('file://' + __dirname + '/dist/index.html?accessToken=' + data.access_token + '&instanceUrl=' + data.instance_url);
                }

                appWindow.show();
                appWindow.focus();
            });
            response.on('error', (err) => {
                console.error('OAUTH REQUEST ERROR: ' + err.message);
            });
        });

        req.write(postData);
        req.end();
    });
}

app.setName('Salesforce Explorer');

app.setAboutPanelOptions({
    applicationName: 'Salesforce Explorer',
    applicationVersion: '0.1.0',
});

app.on('ready', appWindow.bind(null, config));

app.on('window-all-closed', () => {
    app.quit();
});
