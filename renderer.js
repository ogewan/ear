// renderer.js
const {ipcRenderer} = require('electron')
const {spawn} = require('child_process')
const fs = require('fs')

let apps = {};
let processes = {}

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

const editModal = document.getElementById('editModal')
const span = document.getElementsByClassName('close')[0];
let editedAppPath;

function openEditModal(appPath) {
  editedAppPath = appPath
  document.getElementById('displayName').value = apps[appPath].name
  document.getElementById('appPath').value = appPath

  const parentDropdown = document.getElementById('parent')
  parentDropdown.innerHTML = `<option value="">None</option>`
  for (let app in apps) {
    if (apps[app].parent === '' && app !== appPath) {
      const option = document.createElement('option')
      option.text = apps[app].name
      option.value = app
      if (apps[appPath].parent === app) option.selected = true
      parentDropdown.add(option)
    }
  }

  const childrenDropdown = document.getElementById('children')
  childrenDropdown.innerHTML = ''
  for (let app in apps) {
    if (app !== appPath) {
      const option = document.createElement('option')
      option.text = apps[app].name
      option.value = app
      if (apps[appPath].children.includes(app)) option.selected = true
      childrenDropdown.add(option)
    }
  }

  editModal.style.display = 'block'
}

span.onclick =
    function() {
  editModal.style.display = 'none'
}

    window.onclick =
        function(event) {
  if (event.target == editModal) {
    editModal.style.display = 'none'
  }
}

        document.getElementById('editForm')
            .addEventListener('submit', (event) => {
              event.preventDefault()

              const displayName = document.getElementById('displayName').value
              const appPath = document.getElementById('appPath').value
              const parent = document.getElementById('parent').value
              const children =
                  Array
                      .from(document.getElementById('children').selectedOptions)
                      .map(option => option.value)

              apps[editedAppPath].name = displayName
              if (appPath !== editedAppPath) {
                apps[appPath] = apps[editedAppPath];
                delete apps[editedAppPath]
                editedAppPath = appPath
              }

              // Remove app as child from old parent
              if (apps[editedAppPath].parent !== '') {
                const index = apps[apps[editedAppPath].parent].children.indexOf(
                    editedAppPath)
                if (index > -1) apps[apps[editedAppPath].parent]
                    .children.splice(index, 1)
              }

              apps[editedAppPath].parent = parent

              // Add app as child to new parent
              if (parent !== '') {
                apps[parent].children.push(editedAppPath)
                // Move children to the new parent
    apps[editedAppPath].children.forEach(child => {
      apps[child].parent = parent
      apps[parent].children.push(child)
    })
      apps[editedAppPath].children = []
              }

              // Remove app as parent from old children
              apps[editedAppPath].children.forEach(
                  child => {apps[child].parent = ''})

              // Add app as parent to new children
              children.forEach(child => {apps[child].parent = editedAppPath})

              apps[editedAppPath].children = children

              fs.writeFileSync('apps.json', JSON.stringify(apps))
              updateAppList()
              editModal.style.display = 'none'
            })

function openApp(path) {
  const start = Date.now()
  if (!apps[path]) {
    apps[path] = { name: path, parent: '', children: [], runtime: 0 }
  }

  const process = spawn(path)
  processes[path] = process

  process.on('close', (code) => {
    const elapsed = Date.now() - start
    apps[path].runtime += elapsed
    fs.writeFileSync('apps.json', JSON.stringify(apps));
    delete processes[path]
    updateAppList()
  })

  updateAppList()
}

/*function updateAppList() {
  const appList = document.getElementById('app-list')
  appList.innerHTML = ''

  for (let app in apps) {
    if (apps[app].parent === '') {
      const row = document.createElement('tr')

      const name = document.createElement('td')
      name.innerHTML =
          `<a href="#" onclick="openApp('${app}')">${apps[app].name}</a>`
      row.appendChild(name)

      const runtime = document.createElement('td')
      runtime.innerText = msToTime(apps[app].runtime)
      row.appendChild(runtime)

      const editButton = document.createElement('td')
      editButton.innerHTML = '<button>Edit</button>'
      editButton.addEventListener('click', () => openEditModal(app))
      row.appendChild(editButton)

      const closeButton = document.createElement('td')
      closeButton.innerHTML = '<button>X</button>'
      closeButton.addEventListener('click', () => {
        if (processes[app]) processes[app].kill()
      })
      row.appendChild(closeButton)

      appList.appendChild(row)
    }
  }
}*/

function updateAppList() {
  const appList = document.getElementById('app-list')
  appList.innerHTML = ''

  for (let app in apps) {
    if (apps[app].parent === '') {
      const row = document.createElement('tr')

      const name = document.createElement('td')
      const link = document.createElement('a')
      link.href = '#'
      link.addEventListener('click', (event) => {
        event.preventDefault()
        openApp(app)
      })
        link.textContent = apps[app].name
        name.appendChild(link)
        row.appendChild(name)

        const runtime = document.createElement('td')
        runtime.innerText = msToTime(apps[app].runtime)
        row.appendChild(runtime)

        const editButton = document.createElement('td')
        const buttonEdit = document.createElement('button')
        buttonEdit.innerText = 'Edit'
        buttonEdit.addEventListener('click', () => openEditModal(app))
        editButton.appendChild(buttonEdit)
        row.appendChild(editButton)

        const closeButton = document.createElement('td')
        const buttonClose = document.createElement('button')
        buttonClose.innerText = 'X'
        buttonClose.addEventListener('click', () => {
          if (processes[app]) processes[app].kill()
        })
        closeButton.appendChild(buttonClose)
        row.appendChild(closeButton)

        appList.appendChild(row)
    }
  }
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  let formatted = `${seconds} sec`
  if (minutes > 0) formatted = `${minutes} min ${formatted}`
  if (hours > 0) formatted = `${hours} hr ${formatted}`

  return formatted
}
