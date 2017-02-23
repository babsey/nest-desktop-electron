"use strict"

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.

const Config = require('electron-config');
var config = new Config({
    defaults: require('jsonfile').readFileSync(__dirname + '/src/config/electronDefaults.json')
});

// var autoUpdater = require('auto-updater');
// autoUpdater.setFeedURL('http://mycompany.com/myapp/latest?version=' + app.getVersion());
//
// // Report crashes to our server.
// require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function createWindow() {

    let {
        width,
        height,
    } = config.get('windowBounds');

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        frame: config.store.window.frame,
        title: 'A NEST desktop application',
        icon: './src/assets/img/icon.png',
        // "node-integration": true,
    });

    mainWindow.setFullScreen(config.store.window.fullscreen);

    mainWindow.on('resize', () => {
        // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
        // the height, width, and x and y coordinates.
        let {
            width,
            height
        } = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        config.set('windowBounds', {
            width,
            height
        });
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/src/index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

const fs = require('fs');
const path = require('path');

var main = {};
main.capturePage = function(filepath) {
    var filepath = __dirname + path.sep + filepath;

    let {
        width,
        height,
    } = config.get('windowBounds');

    var clipRect = {
        x: 0,
        y: 0,
        width: width - 330,
        height: width
    };

    var clipRect = {
        x: 0,
        y: 0,
        width: width - 330,
        height: height
    };
    mainWindow.capturePage(clipRect, function(imageBuffer) {
        fs.writeFile(filepath, imageBuffer.resize({
            'height': 480
        }).toPng(), function(err) {
            if (err) {
                console.log("ERROR Failed to save file", err);
            } else {
                console.log('Screen captured in ' + filepath)
            }
        });
    });
}

module.exports = main;
