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
  for (let app in apps.libraries[apps.current]) {
    if (app !== appPath && lib[app].parent === '') {
      if (parentSelect.innerHTML === '') {
        const option = document.createElement('option');
        option.value = '';
        option.text = '';
        parentSelect.appendChild(option);
      }
      parentOptionsAvailable = true;
      const option = document.createElement('option');
      option.value = app;
      option.text = lib[app].name;
      parentSelect.appendChild(option)
    }
  }
  if (lib[appPath].parent === '') {
    parentSelect.value = '';
  } else {
    parentSelect.value = lib[appPath].parent;
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
  for (let app in apps.libraries[apps.current]) {
    if (app !== appPath) {
      childrenOptionsAvailable = true
      const option = document.createElement('option')
      option.value = app;
      option.text = lib[app].name;
      childrenSelect.appendChild(option);
      if (lib[app].parent === appPath) {
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
  document.getElementById('displayName').value = lib[appPath].name
  document.getElementById('appPath').value = appPath;
  document.getElementById('appPath').addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    event.target.blur();
    ipcRenderer.send(
        'open-file-dialog',
        {control: 'save', appPath: document.getElementById('appPath').value});
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
  const old = lib[editedAppPath];
  const displayName = document.getElementById('displayName').value;
  const appPath = document.getElementById('appPath').value;
  const parent = document.getElementById('parent').value;
  const children =
      Array.from(document.getElementById('children').selectedOptions)
          .map(option => option.value);

  old.name = displayName;
  if (appPath !== editedAppPath) {
    lib[appPath] = old;
    // delete lib[editedAppPath];
    delete apps.libraries[apps.current][editedAppPath];
    editedAppPath = appPath;
  }

  // Move app to new parent and update children accordingly...
  if (parent !== '' && parent !== old.parent) {
    apps.libraries[apps.current][editedAppPath]
    Object.keys(old.children).forEach(child => {
      lib[child].parent = parent;
      lib[parent].children = {...lib[parent].children, [child]: 1};
    });
    old.parent = parent;
    old.children = {};
  } else if (!compareObjects(children, old.children)) {
    old.children = Object.fromEntries(children.map(child => [child, 1]));
    Object.keys(old.children).forEach(child => {
      lib[child].parent = editedAppPath;
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
compareObjects = (c, d) => {
  return JSON.stringify(c) === JSON.stringify(d);
};
module.exports = {openEditModal}
