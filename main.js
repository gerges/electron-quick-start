const electron = require('electron')
// Module to control application life.
const app = electron.app
const session = electron.session;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  let window = createWindow();
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'openExternal') {
      window.webContents.send("log", `openExternal requested with WebContents url ${webContents.getURL()}`);
      callback(false);
    }
  });

  window.webContents.on('will-navigate', (e, url) => {
    window.webContents.send("log", `browserWindow will-navigate called with ${url}`);
  });

  window.webContents.on('did-navigate-in-page', (e, url, isMainFrame) => {
    window.webContents.send("log", `browserWindow did-navigate-in-page called with ${url}`);
  });

  window.webContents.on('did-fail-provisional-load', (e, code, desc, url) => {
    window.webContents.send("log", `browserWindow did-fail-provisional-load called with ${url}`);
  });

  app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'webview') {
      contents.on('will-navigate', (e, url) => {
        window.webContents.send("log", `webview will-navigate called with ${url}`);
      });

      contents.on('did-navigate-in-page', (e, url, isMainFrame) => {
        window.webContents.send("log", `webview did-navigate-in-page called with ${url}`);
      });

      contents.on('did-fail-provisional-load', (e, code, desc, url) => {
        window.webContents.send("log", `webview did-fail-provisional-load called with ${url}`);
      });
    }
  });
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
