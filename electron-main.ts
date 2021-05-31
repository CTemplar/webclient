import { app, BrowserWindow, screen, session, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as url from 'url';
import * as windowStateKeeper from 'electron-window-state';
import * as notifier from 'node-notifier';

const contextMenu = require('electron-context-menu');

// Initialize remote module
require('@electron/remote/main').initialize();

contextMenu({
  prepend: (defaultActions, parameters, browserWindow) => [],
  showLookUpSelection: false,
  showSearchWithGoogle: false,
  showCopyImage: false,
  showCopyImageAddress: true,
  showSaveImage: false,
  showSaveImageAs: false,
  showSaveLinkAs: false,
  showServices: false,
  shouldShowMenu: (event, parameters) => {
    if (parameters.linkURL && parameters.linkURL.length > 0) {
      const regex =
        /(https?:\/\/(?:www\.|(?!www))[\da-z][\da-z-]+[\da-z]\.\S{2,}|www\.[\da-z][\da-z-]+[\da-z]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[\da-z]+\.\S{2,}|[\da-z][\da-z-]+[\da-z]\.com|www\.[\da-z]+\.\S{2,})/gi;
      return regex.test(parameters.linkURL);
    } else {
      return true;
    }
  },
});

let mainWindow: BrowserWindow;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: size.width,
    defaultHeight: size.height,
  });

  // Create the window using the state information
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {
    mainWindow.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    mainWindow.loadURL('http://localhost:4200');
  } else {
    // Let us register listeners on the window, so we can update the state
    // automatically (the listeners will be removed when the window is closed)
    // and restore the maximized or full screen state
    mainWindowState.manage(mainWindow);

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `dist/index.html`),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
    // REDIRECT TO FIRST WEBPAGE AGAIN
  });

  const handleRedirect = (e: Event, url: string) => {
    if (url != mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };

  // open external links with web browser
  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);
}

try {
  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947

  app.on('ready', () => {
    const filter = {
      urls: ['wss://api.ctemplar.com/*'],
    };
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      details.requestHeaders['Origin'] = 'https://mail.ctemplar.com';
      callback({ requestHeaders: details.requestHeaders });
    });
    setTimeout(createWindow, 400);
    autoUpdater.checkForUpdatesAndNotify();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

/**
 * Communicating with Render Process
 */
try {
  // Print EMAIL
  ipcMain.on('print-email', (event, printHtml) => {
    printRawHtml(printHtml);
  });

  const printRawHtml = (printHtml: string) => {
    const win = new BrowserWindow({ show: false });
    win.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(printHtml)}`);

    win.webContents.on('did-finish-load', () => {
      win.show();
      win.webContents.print({}, (success, failureReason) => {});
    });
  };

  // Notification
  ipcMain.on('native-notification', (event, data: any) => {
    makeNotification(data);
  });

  const makeNotification = (data: any) => {
    notifier.notify(
      {
        title: 'CTemplar',
        message: data.message,
        icon: 'https://mail.ctemplar.com/assets/images/media-kit/mediakit-logo4.png', // Absolute path (doesn't work on balloons)
        open: data.responseUrl,
        sound: true, // Only Notification Center or Windows Toasters
        wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
      },
      (error: any, response: any, metadata: any) => {
        if (metadata?.activationType === 'clicked') {
          shell.openExternal(data.responseUrl);
        }
      },
    );
  };
} catch (e) {
  // Catch Error
  // throw e;
}
