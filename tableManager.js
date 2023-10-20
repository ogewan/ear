const {apps, openApp, openEditModal} = require('./appManager')
const {msToTime} = require('./util')

function createTable() {
  const appTable = document.getElementById('appTable')
  appTable.innerHTML = ''
  for (let app in apps) {
    if (apps[app].parent === '') {
      const row = appTable.insertRow(-1)
      const appName = row.insertCell(0)
      const runtime = row.insertCell(1)
      const edit = row.insertCell(2)
      const close = row.insertCell(3)
      const children = row.insertCell(4)

      appName.innerHTML = apps[app].name
      runtime.innerHTML = msToTime(apps[app].runtime)
      edit.innerHTML = `<button class='edit'>Edit</button>`
      close.innerHTML = `<button class='close'>X</button>`

      // Create a child table if the app has children
      if (apps[app].children.length > 0) {
        children.innerHTML = '<button class=\'expand\'>+</button>'
        const childTable = document.createElement('table')
        childTable.id = app + '-childTable'
        childTable.style.display = 'none'
        appTable.appendChild(childTable)

        children.querySelector('.expand').addEventListener('click', (event) => {
          if (event.target.innerHTML === '+') {
            event.target.innerHTML = '-'
            childTable.style.display = 'table'
            createChildTable(apps[app].children, childTable)
          } else {
            event.target.innerHTML = '+'
            childTable.style.display = 'none'
          }
        })
      }

      appName.addEventListener('click', () => openApp(app))
      edit.querySelector('.edit').addEventListener(
          'click', () => openEditModal(app))
      close.querySelector('.close').addEventListener(
          'click', () => closeApp(app))
    }
  }
}

function createChildTable(children, table) {
  table.innerHTML = ''
  for (let child of children) {
    const row = table.insertRow(-1)
    const appName = row.insertCell(0)
    const runtime = row.insertCell(1)
    const edit = row.insertCell(2)

    appName.innerHTML = apps[child].name
    runtime.innerHTML = msToTime(apps[child].runtime)
    edit.innerHTML = `<button class='edit'>Edit</button>`

    appName.addEventListener('click', () => openApp(child))
    edit.querySelector('.edit').addEventListener(
        'click', () => openEditModal(child))
  }
}

module.exports = {createTable}
