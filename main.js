'use strict';

const electron = require('electron');
const keytar = require('keytar');
const querystring = require('querystring');
const https = require('https');
const url = require('url');
const jsforce = require('jsforce');
const config = require('./config.json');

const KEYTAR_SERVICE = 'Salesforce Explorer';
const KEYTAR_ACCOUNT = 'Oauth';

function refreshOauth(options, refreshToken) {
    setInterval(() => {
        console.log('Refreshing access token...');

        const postData = querystring.stringify({
            grant_type: 'refresh_token',
            client_id: options.client_id,
            client_secret: options.client_secret,
            refresh_token: refreshToken
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

        const request = https.request(post, (response) => {
            let result = '';
            response.on('data', (data) => {
                result += data;
            });
            response.on('end', () => {
                const data = JSON.parse(result);

                keytar.replacePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, result);
            });
            response.on('error', (err) => {
                console.error('OAUTH REQUEST ERROR: ' + err.message);
            });
        });
        request.write(postData);
        request.end();
    }, 60000); // Refresh every 10 seconds
}

function loadApplication(app, options, accessToken, instanceUrl, refreshToken) {
    app.setSize(800, 600);

    if (process.env.NODE_ENV === 'development') {
        app.loadURL('file://' + __dirname + '/src/index.html');
        app.webContents.openDevTools();
    } else {
        app.loadURL('file://' + __dirname + '/dist/index.html');
    }

    refreshOauth(options, refreshToken);

    app.show();
    app.focus();
}

function runApplication(options) {
    const app = new electron.BrowserWindow({
        titleBarStyle: 'hidden-inset',
    });

    electron.ipcMain.on('logout', (event) => {
        console.log('Logging out...');
        keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
        authApplication(app, options);
    });

    const password = keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);

    if (password === null) {
        authApplication(app, options);
        return;
    }

    const { access_token, instance_url, refresh_token } = JSON.parse(password);

    const conn = new jsforce.Connection({
        instanceUrl: instance_url,
        accessToken: access_token,
    });

    conn.identity((error, response) => {
        if (error) {
            authApplication(app, options);
        } else {
            loadApplication(app, options, access_token, instance_url, refresh_token);
        }
    });
}

function authApplication(app, options) {
    app.setSize(500, 700);

    const oauthUrl = options.authorizeUrl + '?' + querystring.stringify(
        Object.assign(
            {}, 
            options.extra,
            {
                client_id: options.client_id,
                scope: options.scopes.join(" "),
                redirect_uri: options.redirect_uri
            }
        )
    );

    app.loadURL(oauthUrl);
    app.show();
    app.focus();

    app.webContents.on('will-navigate', (event, browserUrl) => {
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

        const request = https.request(post, (response) => {
            let result = '';
            response.on('data', (data) => {
                result += data;
            });
            response.on('end', () => {
                const data = JSON.parse(result);

                keytar.replacePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, result);

                loadApplication(app, options, data.access_token, data.instance_url, data.refresh_token);
            });
            response.on('error', (err) => {
                console.error('OAUTH REQUEST ERROR: ' + err.message);
            });
        });
        request.write(postData);
        request.end();
    });
}

electron.app.setName('Salesforce Explorer');

electron.app.setAboutPanelOptions({
    applicationName: 'Salesforce Explorer',
    applicationVersion: '0.1.0',
});

electron.app.on('ready', runApplication.bind(null, config));

electron.app.on('window-all-closed', () => {
    electron.app.quit();
});
