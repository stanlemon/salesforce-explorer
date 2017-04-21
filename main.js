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
        const postData = querystring.stringify({
            grant_type: 'refresh_token',
            client_id: options.client_id,
            client_secret: options.client_secret,
            refresh_token: refreshToken,
        });

        const accessTokenUrl = url.parse(options.access_token_url);

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

        try {
            const request = https.request(post, (response) => {
                let result = '';
                response.on('data', (data) => {
                    result += data;
                });
                response.on('end', () => {
                    const data = JSON.parse(result);

                    keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT).then((result) => {
                        return JSON.parse(result);
                    }).then((oldPassword) => {
                        const newPassword = Object.assign({}, oldPassword, data);

                        keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT).then(() => {
                            keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, JSON.stringify(newPassword));
                        });
                    })
                });
                response.on('error', (err) => {
                    console.error('OAUTH REQUEST ERROR: ' + err.message);
                });
            });
            request.write(postData);
            request.end();
        } catch (e) {
            console.error(e);
        }
    }, 10000); // Refresh every 10 seconds
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

    const menu = electron.Menu.buildFromTemplate(menuTemplate);
    electron.Menu.setApplicationMenu(menu);

    const password = keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);

    let passwordData;
    
    try {
        passwordData = JSON.parse(password);
    } catch (e) {
        // Treat it like we don't have the password...
    }

    if (password == null || passwordData == null) {
        authApplication(app, options);
        return;
    }

    const { access_token, instance_url, refresh_token } = passwordData;

    const conn = new jsforce.Connection({
        oauth2: {
            clientId: config.client_id,
            clientSecret: config.client_secret,
            redirectUri: config.redirect_uri,
        },
        instanceUrl: instance_url,
        accessToken: access_token,
        refreshToken: refresh_token,
    });

    conn.identity((error, response) => {
        if (error) {
            authApplication(app, options);
        } else {
            loadApplication(app, options, access_token, instance_url, refresh_token);
        }
    });

    electron.ipcMain.on('logout', () => {
        conn.logout(() => {
            keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);

            app.webContents.session.clearStorageData();

            authApplication(app, options);
        });
    });
}

function authApplication(app, options) {
    app.setSize(500, 700);

    // Check for valid URL
    const oauthUrl = options.authorize_url + '?' + querystring.stringify(
        Object.assign(
            {}, 
            options.extra,
            {
                client_id: options.client_id,
                scope: options.scopes.join(" "),
                redirect_uri: options.redirect_uri,
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
            alert('A problem occurred! There was no code paramter in the OAuth redirect.');
            return;
        }

        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            redirect_uri: options.redirect_uri,
            client_id: options.client_id,
            client_secret: options.client_secret,
            code: urlQueryPieces.code,
        });

        const accessTokenUrl = url.parse(options.access_token_url);

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

                keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT).then(() => {
                    keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, result);
                });

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

const menuTemplate = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        // TODO: Update
        click () { electron.shell.openExternal('https://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: electron.app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  menuTemplate[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  menuTemplate[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}
