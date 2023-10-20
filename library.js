const {createTable} = require('./tableManager');
const {updateAppList} = require('./appListUpdater');
const {apps, writeApp} = require('./appManager');

function updateTabs() {
  const tabContainer = document.getElementById('tabContainer');
  let addTab = document.getElementById('addTab');
  tabContainer.innerHTML = '';
  if (addTab) {
    tabContainer.appendChild(addTab);
  }
  for (let library in apps.libraries) {
    let tab = document.createElement('div');
    tab.classList.add('tab');
    if (library === apps.current) tab.classList.add('active');
    tab.addEventListener('click', () => {
      switchToTab(library);
    });

    // Add a span for the name of the tab
    let tabName = document.createElement('span');
    tabName.innerText = library + ' ';
    tabName.className = 'tab-label';
    tab.appendChild(tabName);

    // Add an input field for renaming the tab
    let renameInput = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = library;
    renameInput.className = 'tab-input';
    tab.appendChild(renameInput);

    // Add a rename button for each tab
    let renameButton = document.createElement('button');
    renameButton.innerText = '✎';
    renameButton.addEventListener('click', (event) => {
      event.stopPropagation();
      let newName = renameInput.value;
      if (renameInput.style.display === 'none' || !renameInput.style.display) {
        // Switch to edit mode
        renameInput.style.display = 'block';
        renameInput.focus();
        renameButton.innerText = '✔';  // Or some 'save' icon
      } else if (newName && !apps.libraries[newName]) {
        // Save the changes and switch to label mode
        renameInput.innerText = newName;
        renameInput.style.display = 'none';
        renameButton.innerText = '✎';  // Or some 'edit' icon
        if (apps.current === library) {
          apps.current = newName;
        }
        apps.libraries[newName] = apps.libraries[library];
        delete apps.libraries[library];
        updateTabs();
        writeApp();
      }
    });
    tab.appendChild(renameButton);

    tabContainer.appendChild(tab);
  }
}

function switchToTab(library) {
  apps.current = library;
  // createTable();
  updateAppList();
}

module.exports = {
  updateTabs,
  switchToTab
};
