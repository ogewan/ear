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

  ipcMain.on('open-file-dialog', (event, control) => {
    let type = control === 'pardir' ? {properties: ['openDirectory']} : {
      properties: ['openFile'],
      filters: [{name: 'Applications', extensions: ['exe', 'app']}]
    };
    dialog.showOpenDialog(type)
        .then(result => {
          if (!result.canceled) {
            switch (control) {
              case 'open':
                event.sender.send('open-app', result.filePaths[0]);
                break;
              case 'save':
                event.sender.send('save-path', result.filePaths[0]);
                break;
              case 'pardir':
                event.sender.send('set-directory', result.filePaths[0]);
                break;
            }
          }
        })
        .catch(err => {console.log(err)})
  })
