const {ipcRenderer} = require('electron')
const {spawn} = require('child_process')
const fs = require('fs')

let apps = {}

// Load apps from file on startup
if (fs.existsSync('apps.json')) {
  apps = JSON.parse(fs.readFileSync('apps.json'))
  updateAppList()
}

document.getElementById('openButton').addEventListener('click', async () => {
  const result = await ipcRenderer.invoke('open-file-dialog')
  if (!result.canceled) {
    openApp(result[0])
  }
})

function updateAppList() {
  const appListDiv = document.getElementById('app-list')
  appListDiv.innerHTML = '<h2>Opened Applications:</h2>'

  for (let app in apps) {
    const appElement = document.createElement('p')
    const appLink = document.createElement('a')
    appLink.textContent =
        `${app} - Total runtime: ${millisecondsToHumanReadable(apps[app])}`
    appLink.href = '#'
    appLink.addEventListener('click', (event) => {
      event.preventDefault()
      openApp(app)
    })
      appElement.appendChild(appLink)
      appListDiv.appendChild(appElement)
  }
}

function openApp(appPath) {
  // Save the app path if it's not already in the object
  if (!apps.hasOwnProperty(appPath)) {
    apps[appPath] = 0
  }
  fs.writeFileSync('apps.json', JSON.stringify(apps))

  let start = Date.now()
  let child = spawn(appPath)

  child.on('exit', () => {
    let end = Date.now()
  let runtime = end - start
  console.log(`Runtime: ${millisecondsToHumanReadable(runtime)}`)

  // Add the runtime to the total
  apps[appPath] += runtime
  fs.writeFileSync('apps.json', JSON.stringify(apps))
    updateAppList()
  })
}

function millisecondsToHumanReadable(ms) {
  let seconds = Math.floor(ms / 1000)
  let minutes = Math.floor(seconds / 60)
  seconds %= 60
  let hours = Math.floor(minutes / 60)
  minutes %= 60

  let formatted = `${seconds} sec`
  if (minutes > 0) formatted = `${minutes} min ${formatted}`
  if (hours > 0) formatted = `${hours} hr ${formatted}`

  return formatted
}
