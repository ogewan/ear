const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
let Unar;
let unpack;
(async () => {
  const {list, unpack} = await import('node-unar');
  Unar = {list, unpack};
})();

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

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('open-file-dialog', openFileDialog)

function openFileDialog(event, args) {
  if (!args) return;
  const {control, appPath, staging} = args;
  let type = control === 'pardir' ?
      {properties: ['openDirectory'], defaultPath: appPath} :
      {
        properties: ['openFile'],
        filters: [{
          name: 'Applications',
          extensions: ['exe', 'app', 'zip', 'zipx', 'rar', '7z', 'tar', 'gzip']
        }],
        defaultPath: appPath
      };

  dialog.showOpenDialog(type)
      .then(result => {
        if (!result.canceled) {
          const filePath = result.filePaths[0];
          const extension = path.extname(filePath).toLowerCase();

          if (control !== 'pardir' && !['.exe', '.app'].includes(extension)) {
            handleArchive(filePath, staging, event, control);
            return;
          }
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
}

function handleArchive(
    filePath, newFolderPath = path.dirname(filePath), event, control) {
  // Construct the new file path
  const newFilePath = path.join(newFolderPath, path.basename(filePath));

  if (newFolderPath !== path.dirname(filePath)) {
    // Check if the directory already exists in the new path
    try {
      try {
        fs.accessSync(newFolderPath);
      } catch {
        fs.mkdirSync(newFolderPath);
      }
      // Move the directory (pythonic way)
      fs.renameSync(filePath, newFilePath);
    } catch (err) {
      console.error(err.message);
      return filePath;
    }
  }
  Unar.unpack(
          newFilePath,
          {forceDirectory: true, noRecursion: true, targetDir: newFolderPath})
      .progress((files) => {
        console.log('files', files);
      })
      .then((results) => {
        console.log('Archive type: ', results.type);
        console.log('Archive files', results.files);
        console.log('Archive output directory', results.directory);

        openFileDialog(event, {
          control,
          appPath: path.join(newFolderPath, path.parse(filePath).name)
        });
      })
      .catch((err) => {
        console.error(err);
      });
}
