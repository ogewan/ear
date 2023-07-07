const {apps, openApp, processes} = require('./appManager')
const {openEditModal} = require('./modalManager')
const {msToTime} = require('./util')

function updateAppList() {
  const appList = document.getElementById('appList')
  appList.innerHTML = ''

  for (let appPath in apps) {
    const app = apps[appPath]

        if (!app.parent) {
      const row = document.createElement('tr')

      const nameCell = document.createElement('td')
      const nameLink = document.createElement('a')
      nameLink.innerText = app.name
      nameLink.href = '#'
      nameLink.addEventListener('click', () => openApp(appPath))
      nameCell.appendChild(nameLink)

      const runtimeCell = document.createElement('td')
      runtimeCell.innerText = msToTime(app.runtime)

      const editCell = document.createElement('td')
      const editLink = document.createElement('a')
      editLink.innerText = '🔧'
      editLink.href = '#'
      editLink.addEventListener('click', () => openEditModal(appPath))
      editCell.appendChild(editLink)

      const closeCell = document.createElement('td')
      const closeLink = document.createElement('a')
      closeLink.innerText = '❌'
      closeLink.href = '#'
      closeLink.addEventListener('click', () => {
        if (processes[appPath]) {
          processes[appPath].kill()
        }
      })
      closeCell.appendChild(closeLink)

      row.appendChild(nameCell)
      row.appendChild(runtimeCell)
      row.appendChild(editCell)
      row.appendChild(closeCell)

      appList.appendChild(row)
    }
  }
}

module.exports = {updateAppList}
