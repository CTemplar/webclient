"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_updater_1 = require("electron-updater");
var path = require("path");
var url = require("url");
var mainWindow;
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    mainWindow = new electron_1.BrowserWindow({
        width: size.width, height: size.height,
        webPreferences: {
            allowRunningInsecureContent: true,
        },
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: 'file:',
        slashes: true,
    }));
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
// Open dev tool for testing
// mainWindow.webContents.openDevTools();
try {
    electron_1.app.allowRendererProcessReuse = true;
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () {
        setTimeout(createWindow, 400);
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=electron-main.js.map