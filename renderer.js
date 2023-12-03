const {ipcRenderer} = require('electron')
const {apps, processes, openApp, proxy_lib, writeApp} = require('./appManager')
// const {openEditModal} = require('./modalManager')
const {updateAppList} = require('./appListUpdater')
const {updateTabs, switchToTab} = require('./library')

ipcRenderer.on('open-app', (event, path) => {openApp(path)});
ipcRenderer.on('save-path', (event, path) => {
  document.getElementById('appPath').value = path;
});
ipcRenderer.on('set-directory', (event, path) => {
  apps.parentDir = path || '';
  writeApp();
});

document.getElementById('openFile').addEventListener('click', () => {
  console.log('openFile button clicked');
  ipcRenderer.send('open-file-dialog', { control: 'open' });
});

document.getElementById('setDirectory').addEventListener('click', () => {
  console.log('setDirectory button clicked');
  ipcRenderer.send(
      'open-file-dialog', {control: 'pardir', appPath: apps.parentDir});
});

document.getElementById('addTab').addEventListener('click', () => {
  const tabName = prompt('Enter new tab name:');
  if (tabName && !apps[tabName]) {
    apps[tabName] = {};
    switchToTab(tabName);
    updateTabs();
  }
});

Object.defineProperty(window, 'lib', {
  get: () => proxy_lib,
  set: function(val) {
    apps.current = val;
  }
});

updateTabs();
updateAppList();
setInterval(() => {updateAppList()}, 1000)
