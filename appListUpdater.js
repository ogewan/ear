const {apps, openApp, processes, proxy_lib} = require('./appManager')
const {openEditModal} = require('./modalManager')
const {msToTime} = require('./util')

function updateAppList() {
  const appList = document.getElementById('appList');
  const oldAppList = appList.cloneNode(true);
  document.body.appendChild(oldAppList);
  oldAppList.style.display = 'none';
  oldAppList.id = 'oldAppList';

  appList.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Runtime</th>
            <th>Edit</th>
            <th>Close</th>
            <th>Total</th>
        </tr>`;

  for (let appPath in apps.libraries[apps.current]) {
    const app = lib[appPath];
    if (!app.parent) {
      const existColor =
          document.getElementById(appPath)?.style.getPropertyValue(
              'background-color');
      const isLastRan =
          document.getElementById(appPath)?.classList.contains('lastRan');
      const row = document.createElement('tr');
      row.id = appPath;
      if (existColor) {
        row.style.setProperty('background-color', existColor);
      }
      if (isLastRan) {
        row.classList.add('lastRan');
      }

      const nameCell = document.createElement('td');
      const nameLink = document.createElement('a');
      nameLink.innerText = app.name;
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
      closeCell.appendChild(closeLink);

      const totalCell = document.createElement('td');
      totalCell.innerText = msToTime(
          app.runtime +
          app.children.reduce((acc, child) => acc + lib[child].runtime, 0));


      row.appendChild(nameCell);
      row.appendChild(runtimeCell);
      row.appendChild(editCell);
      row.appendChild(closeCell);
      row.appendChild(totalCell);

      appList.appendChild(row)
    }
  }
  // should garbage collect once out of scope
  document.body.removeChild(oldAppList);
  // delete oldAppList;
}

module.exports = {updateAppList}
