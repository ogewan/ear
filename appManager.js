const {spawn} = require('child_process')
const fs = require('fs')

let apps = {};
let processes = {}

if (fs.existsSync('apps.json')) {
  apps = JSON.parse(fs.readFileSync('apps.json'))
}

function openApp(path) {
  const start = Date.now()
  if (!apps[path]) {
    apps[path] = { name: path, parent: '', children: [], runtime: 0 }
  }

  const process = spawn(path)
  processes[path] = process

  process.stdout.on('data', (data) => {console.log(`stdout: ${data}`)})

  process.stderr.on('data', (data) => {console.error(`stderr: ${data}`)})

  process.on('close', (code) => {
    const elapsed = Date.now() - start
  apps[path].runtime += elapsed
    fs.writeFileSync('apps.json', JSON.stringify(apps))
    delete processes[path]
  })
}

module.exports = {
  apps,
  processes,
  openApp
}
