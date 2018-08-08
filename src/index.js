import electron from 'electron';
import keytar from 'keytar';
import querystring from 'querystring';
import url from 'url';
import fetch from 'node-fetch';
import PouchDB from 'pouchdb';
import { debounce } from 'lodash';

PouchDB.plugin(require('pouchdb-adapter-node-websql'));

const config = require('./config.json');

const DEV = 'development';
const PROD = 'production';

// Default to production
const ENV = process.env.NODE_ENV || PROD;

const isDevMode = ENV === DEV;

console.log('Loading application in ' + ENV);

if (isDevMode) {
    // Enable live reloading whenn we are in development mode
    const { enableLiveReload } = require('electron-compile');
    enableLiveReload({ strategy: 'react-hmr' });
}

const KEYTAR_SERVICE = 'Salesforce Explorer';
const KEYTAR_ACCOUNT = 'Oauth';

const userData = electron.app.getPath('userData');

console.log('user data is stored at ' + userData);

const db = new PouchDB(userData + '/SalesforceExplorer.db', {
    adapter: 'websql',
});

function getWindow() {
    return db
        .get('window')
        .then(result => {
            return {
                height: result.height,
                width: result.width,
                x: result.x,
                y: result.y,
            };
        })
        .catch(err => {
            console.log(
                'An error has occurred getting window information',
                err
            );
        });
}

function setWindow(width, height, x, y) {
    return db
        .get('window')
        .then(doc => {
            doc.height = height;
            doc.width = width;
            doc.x = x;
            doc.y = y;

            return db.put(doc);
        })
        .catch(err => {
            if (err.status === 404) {
                console.log(
                    'Did not find window document, creating a new one.'
                );
                db.post({
                    _id: 'window',
                    height,
                    width,
                    x,
                    y,
                }).catch(err => {
                    console.log(
                        'An error occurred while trying to post the window document.',
                        err
                    );
                });
            }

            console.log('An error has occurred', err);
        });
}

function loadApplication(app, options, accessToken, instanceUrl, refreshToken) {
    console.log('loading application');

    getWindow().then(window => {
        console.log('setting window size and position', window);

        const { width, height, x, y } = window;

        if (window) {
            app.setSize(width, height);
            app.setPosition(x, y);
        } else {
            app.setSize(800, 600);
            app.center();
        }
    });

    const url = `file://${__dirname}/index.html`;

    console.log('loading url ' + url);

    app.loadURL(url);

    app.show();
    app.focus();
}

async function runApplication(options) {
    const app = new electron.BrowserWindow({
        titleBarStyle: 'hidden-inset',
    });

    if (isDevMode) {
        // Add the react developer tools extension when we are in development mode
        const devTools = require('electron-devtools-installer');
        const installExtension = devTools.default;

        await installExtension(devTools.REACT_DEVELOPER_TOOLS);

        app.webContents.openDevTools({
            mode: 'undocked',
        });
    }

    // These events fire frequently when active resizing/moving is occurring and we want to debounce them as they come in
    const updateWindow = debounce(e => {
        if (app.isOnAuth) {
            return;
        }

        const position = app.getPosition();
        const size = app.getSize();

        console.log('setting window size and position', size, position);

        setWindow(size[0], size[1], position[0], position[1]);
    }, 200);

    app.on('moved', updateWindow);
    app.on('resize', updateWindow);

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
                    if (response.status !== 200) {
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

            const { id, access_token, instance_url } = password;

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
                        null
                    );
                })
                .catch(e => {
                    authApplication(app, options);
                });
        });
}

function authApplication(app, options) {
    app.isOnAuth = true;

    app.setSize(500, 700);
    app.center();

    // Construct the URL for OAuth
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

    // Load the OAuth login screen
    app.loadURL(oauthUrl);
    app.show();
    app.focus();

    app.webContents.on('will-navigate', async (event, browserUrl) => {
        console.log('Navigating to ' + browserUrl);

        // Not the URL we are looking for...
        if (
            browserUrl.substring(0, options.redirect_uri.length) !==
            options.redirect_uri
        ) {
            console.log('Not the URL we are looking for...');
            return;
        }

        event.preventDefault();

        const urlPieces = url.parse(browserUrl);
        const urlQueryPieces = querystring.parse(urlPieces.hash.substring(1));

        keytar.setPassword(
            KEYTAR_SERVICE,
            KEYTAR_ACCOUNT,
            JSON.stringify(urlQueryPieces)
        );

        app.isOnAuth = false;

        await loadApplication(
            app,
            options,
            urlQueryPieces.access_token,
            urlQueryPieces.instance_url,
            null
        );
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
