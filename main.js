const {app, BrowserWindow, dialog, ipcMain} = require('electron')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // Enable Node.js integration in renderer process
      contextIsolation:
          false,  // For IPC, you also need to disable contextIsolation
    },
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
  })

  ipcMain.on(
      'open-file-dialog',
      (event, openApp) => {
          dialog
              .showOpenDialog({
                properties: ['openFile'],
                filters: [{name: 'Applications', extensions: ['exe', 'app']}]
              })
              .then(result => {
                if (!result.canceled) {
                  if (openApp)
                    event.sender.send('open-app', result.filePaths[0]);
                  else
                    event.sender.send('save-path', result.filePaths[0]);
                }
              })
              .catch(err => {console.log(err)})})
