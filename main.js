import electron from 'electron';
import keytar from 'keytar';
import querystring from 'querystring';
import url from 'url';
import fetch from 'node-fetch';

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

        fetch(options.access_token_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
                Accept: 'application/json',
            },
            body: postData,
        })
            .then(response => response.json())
            .then(result => {
                keytar
                    .getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
                    .then(password => JSON.parse(password))
                    .then(oldPassword => {
                        const newPassword = Object.assign(
                            {},
                            oldPassword,
                            result
                        );

                        keytar
                            .deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
                            .then(() => {
                                keytar.setPassword(
                                    KEYTAR_SERVICE,
                                    KEYTAR_ACCOUNT,
                                    JSON.stringify(newPassword)
                                );
                            });
                    });
            });
    }, 60000); // Refresh every 60 seconds
}

function loadApplication(app, options, accessToken, instanceUrl, refreshToken) {
    app.setSize(800, 600);
    app.loadURL(`file://${__dirname}/src/index.html`);

    if (process.env.NODE_ENV === 'development') {
        app.webContents.openDevTools();
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

    electron.ipcMain.on('salesforce-logout', (event, arg) => {
        console.log('Logging out...');

        keytar
            .getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
            .then(result => JSON.parse(result))
            .then(password => {
                const { access_token } = password;

                const accessTokenUrl = url.parse(options.access_token_url);
                const revokeTokenUrl = url.format({
                    protocol: accessTokenUrl.protocol,
                    hostname: accessTokenUrl.hostname,
                    pathname: '/services/oauth2/revoke',
                    query: {
                        token: access_token,
                        format: 'json',
                    },
                });

                fetch(revokeTokenUrl).then(response => {
                    if (response.status != 200) {
                        return;
                    }

                    keytar
                        .deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
                        .then(() => {
                            app.webContents.session.clearStorageData();

                            authApplication(app, options);
                        });
                });
            });
    });

    keytar
        .getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
        .then(result => JSON.parse(result))
        .then(password => {
            if (password == null) {
                authApplication(app, options);
                return;
            }

            const { id, access_token, instance_url, refresh_token } = password;

            const url =
                id +
                '?' +
                querystring.stringify({
                    access_token: access_token,
                    format: 'json',
                });

            fetch(url)
                .then(response => response.json())
                .then(user => {
                    loadApplication(
                        app,
                        options,
                        access_token,
                        instance_url,
                        refresh_token
                    );
                })
                .catch(e => {
                    authApplication(app, options);
                });
        });
}

function authApplication(app, options) {
    app.setSize(500, 700);

    // Check for valid URL
    const oauthUrl =
        options.authorize_url +
        '?' +
        querystring.stringify(
            Object.assign({}, options.extra, {
                client_id: options.client_id,
                scope: options.scopes.join(' '),
                redirect_uri: options.redirect_uri,
            })
        );

    app.loadURL(oauthUrl);
    app.show();
    app.focus();

    app.webContents.on('will-navigate', (event, browserUrl) => {
        // Not the URL we are looking for...
        if (
            browserUrl.substring(0, options.redirect_uri.length) !==
            options.redirect_uri
        ) {
            return;
        }

        const urlPieces = url.parse(browserUrl);
        const urlQueryPieces = querystring.parse(urlPieces.query);

        if (!urlQueryPieces.code) {
            alert(
                'A problem occurred! There was no code paramter in the OAuth redirect.'
            );
            return;
        }

        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            redirect_uri: options.redirect_uri,
            client_id: options.client_id,
            client_secret: options.client_secret,
            code: urlQueryPieces.code,
        });

        fetch(options.access_token_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
                Accept: 'application/json',
            },
            body: postData,
        })
            .then(response => response.json())
            .then(result => {
                keytar
                    .deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)
                    .then(() => {
                        keytar.setPassword(
                            KEYTAR_SERVICE,
                            KEYTAR_ACCOUNT,
                            JSON.stringify(result)
                        );
                    });

                loadApplication(
                    app,
                    options,
                    result.access_token,
                    result.instance_url,
                    result.refresh_token
                );
            });
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
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' },
        ],
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ],
    },
    {
        role: 'window',
        submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                // TODO: Update
                click() {
                    electron.shell.openExternal('https://electron.atom.io');
                },
            },
        ],
    },
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({
        label: electron.app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    });

    // Edit menu
    menuTemplate[1].submenu.push(
        { type: 'separator' },
        {
            label: 'Speech',
            submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
        }
    );

    // Window menu
    menuTemplate[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
    ];
}
