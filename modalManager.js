const {app} = require('electron');
const {apps, openApp} = require('./appManager')
const {msToTime} = require('./util')
const fs = require('fs')

const editModal = document.getElementById('editModal')
const span = document.getElementsByClassName('close')[0];
let editedAppPath;

function createParentDropdown(appPath) {
  const parentSelect = document.getElementById('parent')
  parentSelect.innerHTML = ''

  let parentOptionsAvailable = false;
  for (let app in apps) {
    if (app !== appPath && apps[app].parent === '') {
      if (parentSelect.innerHTML === '') {
        const option = document.createElement('option');
        option.value = '';
        option.text = '';
        parentSelect.appendChild(option);
      }
      parentOptionsAvailable = true;
      const option = document.createElement('option');
      option.value = app;
      option.text = apps[app].name;
      parentSelect.appendChild(option)
    }
  }
  if (apps[appPath].parent === '') {
    parentSelect.value = '';
  } else {
    parentSelect.value = apps[appPath].parent;
  }

  if (parentOptionsAvailable) {
    parentSelect.style.display = 'block'
  } else {
    parentSelect.style.display = 'none'
  }
}

function createChildrenDropdown(appPath) {
  const childrenSelect = document.getElementById('children')
  childrenSelect.innerHTML = ''

  let childrenOptionsAvailable = false
  for (let app in apps) {
    if (app !== appPath) {
      childrenOptionsAvailable = true
      const option = document.createElement('option')
      option.value = app;
      option.text = apps[app].name;
      childrenSelect.appendChild(option);
      if (apps[app].parent === appPath) {
        option.selected = true;
      }
    }
  }

  if (childrenOptionsAvailable) {
    childrenSelect.style.display = 'block'
  } else {
    childrenSelect.style.display = 'none'
  }
}

function openEditModal(appPath) {
  editedAppPath = appPath
  document.getElementById('displayName').value = apps[appPath].name
  document.getElementById('appPath').value = appPath;
  document.getElementById('appPath').addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    event.target.blur();
    ipcRenderer.send('open-file-dialog');
  });



  createParentDropdown(appPath)
  createChildrenDropdown(appPath)

  editModal.style.display = 'block'
}

span.onclick = function() {
  editModal.style.display = 'none'
};

window.onclick = function(event) {
  if (event.target == editModal) {
    editModal.style.display = 'none'
  }
};

document.getElementById('editForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const old = apps[editedAppPath];
  const displayName = document.getElementById('displayName').value;
  const appPath = document.getElementById('appPath').value;
  const parent = document.getElementById('parent').value;
  const children =
      Array.from(document.getElementById('children').selectedOptions)
          .map(option => option.value);

  old.name = displayName;
  if (appPath !== editedAppPath) {
    apps[appPath] = old;
    delete apps[editedAppPath];
    editedAppPath = appPath;
  }

  // Move app to new parent and update children accordingly...
  if (parent !== '' && parent !== old.parent) {
    old.children.forEach(child => {
      apps[child].parent = parent;
      apps[parent].children.push(child);
    });
    old.parent = parent;
    old.children = [];
  } else if (!compareArraysAsSets(children, old.children)) {
    children.forEach(child => {
      const oldApp = apps[apps[child].parent];  // could be undefined
      oldApp?.children.splice(1, oldApp?.children.indexOf(child));
      apps[child].parent = editedAppPath;
      old.children.push(child);
    });
  }

  fs.writeFileSync('apps.json', JSON.stringify(apps))
  editModal.style.display = 'none'
});

compareArraysAsSets = (c, d) => {
  const a = new Set(c);
  const b = new Set(d);
  // https://stackoverflow.com/a/44827922
  return a.size === b.size && [...a].every(value => b.has(value));
};
module.exports = {openEditModal}
