const {ipcRenderer} = require('electron')
const {apps, processes, openApp} = require('./appManager')
const {openEditModal} = require('./modalManager')
const {updateAppList} = require('./appListUpdater')

ipcRenderer.on('open-app', (event, path) => {openApp(path)})
ipcRenderer.on('save-path', (event, path) => {
  document.getElementById('appPath').value = path;
})

document.getElementById('openFile').addEventListener('click', () => {
  console.log('openFile button clicked');
  ipcRenderer.send('open-file-dialog', true);
});

setInterval(() => {updateAppList()}, 1000)
