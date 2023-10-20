const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
// const {updateAppList} = require('./appListUpdater');

let version = 3;
let apps = {};
let processes = {};
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
  }
};

if (fs.existsSync('apps.json')) {
  apps = updateAppFile(JSON.parse(fs.readFileSync('apps.json')));
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

function openApp(path) {
  if (processes[path] || !path) {
    return;
  }
  const start = Date.now();
  if (!lib[path]) {
    lib[path] = {name: path, parent: '', children: [], runtime: 0};
  }
  // updateAppList();

  const newPath = moveDirectory(path, apps.parentDir);
  if (newPath !== path) {
    lib[newPath] = lib[path];
    // lib[newPath].name = newPath;
    // delete lib[path];
    delete apps.libraries[apps.current][path];
    path = newPath;
  }

  try {
    fs.accessSync(path, fs.constants.F_OK);
    const process = spawn(path);
    processes[path] = process;

    process.stdout.on('data', (data) => {console.log(`stdout: ${data}`)});

    process.stderr.on('data', (data) => {console.error(`stderr: ${data}`)});

    process.on('close', (code) => {
      const elapsed = Date.now() - start;
      lib[path].runtime += elapsed;
      writeApp();
      delete processes[path];
      // Last app closed (ran)
      document.getElementById(path)?.style.setProperty(
          'background-color', 'green');
      document.getElementById(path)?.classList.add('lastRan');
      // updateAppList();
    });
    // App opened and timing (started)
    document.getElementById(path)?.style.setProperty(
        'background-color', 'yellow');
    const existGreen = document.body.querySelectorAll(`.lastRan`);
    for (let node of existGreen) {
      node.style.setProperty('background-color', 'white');
      node.classList.remove('lastRan');
    }
  } catch (err) {
    console.error(err);
    // App failed to open (failed)
    document.getElementById(path)?.style.setProperty('background-color', 'red');
    return;
  }
}

function writeApp(data = apps) {
  fs.writeFileSync('apps.json', JSON.stringify(data));
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
  openApp,
  proxy_lib,
  writeApp,
  moveDirectory
};
