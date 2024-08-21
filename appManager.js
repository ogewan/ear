const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require('electron');
// import {unpack} from require('node-unar');
// const {updateAppList} = require('./appListUpdater');
// const {unpack} = require('../node-unar/index.js');
// console.log(unpack)

let version = 5;
let appDir = `cfg/apps.json`;
let apps = {};
let processes = {};
let state = {
  lastFinished: '',
  running: new Set(),
  failed: new Set(),
};
const updateAppVersion = {
  1: (app) => {
    return {
      parentDir: '',
      version,
      current: 'Default',
      libraries: {'Default': {...app}}
    };
  },
  2: (app) => {
    return {...app, parentDir: '', version};
  },
  3: (app) => {
    const newApp = {...app, version};
    // for every library, iterate through every app, and if that app has a
    // parent, move all of its children to the parent. Additionally, convert the
    // children array of every app to an object of children keys with empty
    // values.
    for (let library in newApp.libraries) {
      for (let appKey in newApp.libraries[library]) {
        let app = newApp.libraries[library][appKey];
        // convert children array to object
        app.children =
            Object.fromEntries(app.children.map(child => [child, 1]));
        const parent = app.parent;
        if (parent) {
          parent.children = {...parent.children, ...app.children};
          app.children = {};
        }
      }
    }
    return newApp;
  },
  4: (app) => {
    const newApp = {...app, version};
    for (let library in newApp.libraries) {
      for (let appKey in newApp.libraries[library]) {
        let lib = newApp.libraries[library];
        let app = lib[appKey];
        // convert children array to object
        delete app.children;
        if (app.parent !== '') {
          let ancestor = app.parent;
          if (lib[ancestor]) {
            while (lib[ancestor].parent !== '') {
              ancestor = lib[ancestor].parent;
            }
          } else
            ancestor = '';
          app.parent = ancestor;
        }
      }
    }
    return newApp;
  }
};

if (fs.existsSync(appDir)) {
  apps = updateAppFile(JSON.parse(fs.readFileSync(appDir)));
}

const proxy_lib = new Proxy(apps, {
  get: function(target, prop, receiver) {
    return target.libraries[target.current][prop];
  },
  /*apply: function(target, thisArg, argumentsList) {
    return target.libraries[argumentsList[0] || target.current][prop];
  },*/
  set: function(target, prop, value, receiver) {
    target.libraries[target.current][prop] = value;
  },
  ownKeys: function(target) {
    return target.libraries[target.current];
  },
  getOwnPropertyDescriptor: function(target, key) {
    return {enumerable: true, configurable: true, value: this[key]};
  }
});

function updateAppFile(app) {
  // if version of app is less than current version or doesn't exist, update it
  if (version > app.version) {
    let newApp = updateAppVersion[app.version](app) ?? app;
    writeApp(newApp);
    return newApp;
  }
  return app;
}

function openApp(filePath) {
  if (processes[filePath] || !filePath) {
    return;
  }
  const extension = path.extname(filePath).toLowerCase();

  if (!['exe', 'app'].includes(extension)) {
    // handleArchive(filePath, apps.stagingDir);
    // return;
  }

  const start = Date.now();
  if (!lib[filePath]) {
    lib[filePath] = {name: filePath, parent: '', children: [], runtime: 0};
  }
  // updateAppList();

  const newPath = moveDirectory(filePath, apps.parentDir);
  if (newPath !== filePath) {
    lib[newPath] = lib[filePath];
    // lib[newPath].name = newPath;
    // delete lib[path];
    delete apps.libraries[apps.current][filePath];
    filePath = newPath;
  }

  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    const process = spawn(filePath);
    processes[filePath] = process;

    process.stdout.on('data', (data) => {console.log(`stdout: ${data}`)});

    process.stderr.on('data', (data) => {console.error(`stderr: ${data}`)});

    process.on('close', (code) => {
      const elapsed = Date.now() - start;
      lib[filePath].runtime += elapsed;
      writeApp();
      delete processes[filePath];
      // Last app closed (ran)
      state.lastFinished = filePath;
      state.running.delete(filePath);
      // updateAppList();
    });
    // App opened and timing (started)
    state.running.add(filePath);
    state.failed.delete(filePath);
  } catch (err) {
    console.error(err);
    // App failed to open (failed)
    state.failed.add(filePath);
    return;
  }
}

function writeApp(data = apps) {
  fs.writeFileSync(appDir, JSON.stringify(data, (key, value) => {
    if (key === 'children') {
      return undefined
    }
    return value;
  }, 4));
}

/**
 * Move the directory containing the given filepath to a new folder.
 *
 * @param {string} filePath - The path to the file inside the directory.
 * @param {string} newFolderPath - The path to the new folder.
 * @returns {string} - The path to the moved directory.
 */
function moveDirectory(filePath, newFolderPath) {
  if (newFolderPath === '') {
    return filePath;
  }
  // Extract the directory of the file
  const fileDir = path.dirname(filePath);
  const dirName = path.basename(fileDir);

  // Construct the new directory path
  const newDirPath = path.join(newFolderPath, dirName);
  // Construct the new file path
  const newFilePath = path.join(newDirPath, path.basename(filePath));

  if (newFilePath === filePath) {
    return filePath;
  }
  // Check if the directory already exists in the new path
  try {
    // Move the directory (pythonic way)
    fs.renameSync(fileDir, newDirPath);
  } catch (err) {
    console.error(err.message);
    return filePath;
  }

  return newFilePath;
}

module.exports = {
  apps,
  processes,
  state,
  openApp,
  proxy_lib,
  writeApp,
  moveDirectory
};
