// Importing required modules
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')

let apps = []

    // Load apps from file on startup
    if (fs.existsSync('apps.json')) {
  apps = JSON.parse(fs.readFileSync('apps.json'))
}

app.whenReady().then(() => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

// Load the app's index.html file
  mainWindow.loadFile('index.html')
})

ipcMain.handle('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  })
  return result.filePaths
})
