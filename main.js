'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600});

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('file://' + __dirname + '/src/index.html');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
    }

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
