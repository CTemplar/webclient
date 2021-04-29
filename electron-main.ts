import { app, BrowserWindow, screen, session, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as url from 'url';
import * as windowStateKeeper from 'electron-window-state';

let mainWindow: BrowserWindow;

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
      allowRunningInsecureContent: true,
    },
  });

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

  // open external links with web browser
  mainWindow.webContents.on('will-navigate', (e, reqUrl) => {
    const getHost = host => require('url').parse(host).host;
    const reqHost = getHost(reqUrl);
    const isExternal = reqHost && reqHost !== getHost(mainWindow.webContents.getURL());
    if (isExternal) {
      e.preventDefault();
      shell.openExternal(this.href);
    }
  });
}

try {
  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947


  app.on('ready', () => {
    const filter = {
      urls: ['wss://api.ctemplar.com/*']
    };
    session.defaultSession.webRequest.onBeforeSendHeaders(
      filter,
      (details, callback) => {
        details.requestHeaders['Origin'] = 'https://mail.ctemplar.com';
        callback({ requestHeaders: details.requestHeaders });
      }
    );

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
