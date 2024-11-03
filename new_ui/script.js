// script.js

document.addEventListener('DOMContentLoaded', () => new Vapor());

class Vapor {
  constructor() {
    this.model = new VaporModel();
    this.view = new VaporView();
  }
}

class VaporView {
  app;
  container
  _topBar;
  get topBar() {
    return (!this._topBar) ? this.createTopBar() : this._topBar;
  }
  set topBar(options) {
    this.topBar.menu.innerHtml = '';
    options.forEach(option => {
      const li = document.createElement('li');
      li.textContent = option.name;
      li.onclick = option.onClick;
      this.topBar.menu.appendChild(li);
    });
  }
  _sideBar;
  get sideBar() {
    return (!this._sideBar) ? this.createLeftBar() : this._sideBar;
  }
  set sideBar(entries) {
    this.sideBar.games.innerHtml = '';
    if (Array.isArray(entries)) {
      entries.forEach(entry => this.addEntry(entry));
    } else
      this.addEntry(entries);
  }
  addEntry(game) {
    const gameItem = document.createElement('li');
    gameItem.textContent = game.name;
    gameItem.addEventListener('click', (e) => {
      // alert(`Clicked ${game.name}`);
      this.addTile({title: game.name, description: game.tags.join(', ')});
    });
    this.sideBar.games.appendChild(gameItem);
  }
  _tileSet;
  get tileSet() {
    return (!this._tileSet) ? this.createMainContent() : this._tileSet;
  }
  set tileSet(tiles) {
    this.tileSet.innerHtml = '';
    tiles.forEach(tile => {
      this.addTile(tile);
    });
  }
  addTile(tile) {
    const tileDiv = document.createElement('div');
    tileDiv.className = 'tile';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.textContent = tile.title;

    const descDiv = document.createElement('div');
    descDiv.textContent = tile.description;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.onclick = tile.close;

    const editButton = document.createElement('button');
    editButton.textContent = '⚙';
    editButton.onclick = tile.edit;

    actionsDiv.appendChild(closeButton);
    actionsDiv.appendChild(editButton);

    tileDiv.appendChild(titleDiv);
    tileDiv.appendChild(descDiv);
    tileDiv.appendChild(actionsDiv);

    this.tileSet.appendChild(tileDiv);
  }

  constructor() {
    this.app = document.getElementById('app');
    this.topBar = [];
    [{name: 'Store', onClick: () => alert('Store clicked')},
     {name: 'Library', onClick: () => alert('Library clicked')},
     {name: 'Community', onClick: () => alert('Community clicked')},
     {name: 'Profile', onClick: () => alert('Profile clicked')},
     {name: 'News', onClick: () => alert('News clicked')},
     {name: 'Settings', onClick: () => alert('Settings clicked')}];

    // create a container for the left bar and main content
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.app.appendChild(this.container);

    this.sideBar = [
      {name: 'Game 1', tags: ['Action'], parent: null},
      {name: 'Game 2', tags: ['RPG'], parent: null},
      {name: 'Game 3', tags: ['Adventure'], parent: null}
    ];
    this.tileSet = [];
    [{
      title: 'Tile 1',
      description: 'Description 1',
      close: () => alert('Close 1'),
      edit: () => alert('Edit 1')
    },
     {
       title: 'Tile 2',
       description: 'Description 2',
       close: () => alert('Close 2'),
       edit: () => alert('Edit 2')
     },
     {
       title: 'Tile 3',
       description: 'Description 3',
       close: () => alert('Close 3'),
       edit: () => alert('Edit 3')
     }];

    createModal()
  }

  createLogoElement() {
    // Create a container div for the logo
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';

    // Create the text span for the logo
    const logoText = document.createElement('span');
    logoText.textContent = 'Vapor';
    logoText.style.fontFamily = 'Arial, sans-serif';
    logoText.style.fontSize = '24px';
    logoText.style.fontWeight = 'bold';
    logoText.style.color = '#ffffff';
    logoText.style.cursor = 'pointer';

    // Optional: Add any logo-specific styling
    logoDiv.style.display = 'flex';
    logoDiv.style.alignItems = 'center';

    // Append the text to the logo div
    logoDiv.appendChild(logoText);

    // Return the logo element to be appended elsewhere
    return logoDiv;
  }
  createTopBar() {
    this._topBar = document.createElement('div');
    this._topBar.className = 'top-bar';
    this._topBar.menu = document.createElement('ul');
    this._topBar.menu.className = 'menu-options';
    this._topBar.logo = this.createLogoElement();

    this._topBar.appendChild(this._topBar.logo);
    this._topBar.appendChild(this._topBar.menu);
    this.app.appendChild(this._topBar);
    return this._topBar;
  }
  /*const games = {
  game1: {name: 'Game 1', tags: ['Action'], parent: null},
  game2: {name: 'Game 2', tags: ['RPG'], parent: null},
  game3: {name: 'Game 3', tags: ['Adventure'], parent: null}
};*/

  createLeftBar() {
    this._sideBar = document.createElement('div');
    this._sideBar.className = 'left-bar';

    this._sideBar.search = document.createElement('input');
    this._sideBar.search.type = 'text';
    this._sideBar.search.placeholder = 'Search...';
    this._sideBar.appendChild(this._sideBar.search);

    this._sideBar.filterButton = document.createElement('button');
    this._sideBar.filterButton.className = 'filter-button';
    this._sideBar.filterButton.textContent = 'Filter';
    this._sideBar.filterButton.onclick = () => toggleModal(true);
    this._sideBar.appendChild(this._sideBar.filterButton);

    this._sideBar.games = document.createElement('ul');
    this._sideBar.games.className = 'game-list';

    // Implementing the search functionality
    this._sideBar.search.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      Array.from(this._sideBar.games.children).forEach(item => {
        const isVisible = item.textContent.toLowerCase().includes(searchTerm);
        item.style.display = isVisible ? 'block' : 'none';
      });
    });

    this._sideBar.appendChild(this._sideBar.games);
    this.container.appendChild(this._sideBar);
    return this._sideBar;
  }
  createMainContent() {
    // Main content
    this._tileSet = document.createElement('div');
    this._tileSet.className = 'main-content';

    this.container.appendChild(this._tileSet);
    return this._tileSet;
  }
}

class VaporModel {
  update5to6(data) {
    if (data.version !== 5) return data;
    const apps = {...data};
    apps.version = 6;
    const nameToKey = {};

    for (let library in apps.libraries) {
      for (let key in apps.libraries[library]) {
        const app = apps.libraries[library][key];
        const uuid = crypto.randomUUID();
        nameToKey[key] = uuid;
        apps.libraries[library][uuid] = {...app};
        delete apps.libraries[library][key];
      }
      for (let key in apps.libraries[library]) {
        const app = apps.libraries[library][key];
        app.parent = app.parent ? nameToKey[app.parent] : '';
      }
    }
    return apps;
  }
  // getters
  get libraries() {
    return this._libraries;
  }
  get version() {
    return this._version;
  }
  get active() {
    return this._active;
  }
  get activeLibrary() {
    return this._activeLibrary;
  }
  entry() {}
  tile() {}
}

function generateDummyData() {
  // Generate dummy game list data
  const games = {
    game1: {name: 'The Witcher 3', tags: ['RPG', 'Adventure'], parent: null},
    game2: {name: 'Cyberpunk 2077', tags: ['RPG', 'Sci-Fi'], parent: null},
    game3: {name: 'Dota 2', tags: ['MOBA', 'Strategy'], parent: null},
    game4: {name: 'Counter-Strike: GO', tags: ['FPS', 'Action'], parent: null},
    game5:
        {name: 'Stardew Valley', tags: ['Simulation', 'Farming'], parent: null},
    game6: {name: 'Minecraft', tags: ['Sandbox', 'Adventure'], parent: null}
  };

  // Generate dummy tiles for the main content
  const tiles = [
    {
      title: 'The Witcher 3',
      description: 'An open world RPG set in a fantasy universe.',
      close: () => alert('Close Witcher 3'),
      edit: () => alert('Edit Witcher 3')
    },
    {
      title: 'Cyberpunk 2077',
      description: 'An open-world, action-adventure story set in Night City.',
      close: () => alert('Close Cyberpunk 2077'),
      edit: () => alert('Edit Cyberpunk 2077')
    },
    {
      title: 'Dota 2',
      description: 'A multiplayer online battle arena video game.',
      close: () => alert('Close Dota 2'),
      edit: () => alert('Edit Dota 2')
    },
    {
      title: 'Counter-Strike: GO',
      description: 'A multiplayer first-person shooter.',
      close: () => alert('Close CS: GO'),
      edit: () => alert('Edit CS: GO')
    },
    {
      title: 'Stardew Valley',
      description: 'A farming simulation role-playing video game.',
      close: () => alert('Close Stardew Valley'),
      edit: () => alert('Edit Stardew Valley')
    },
    {
      title: 'Minecraft',
      description:
          'A sandbox game about placing blocks and going on adventures.',
      close: () => alert('Close Minecraft'),
      edit: () => alert('Edit Minecraft')
    }
  ];

  // Inject the data into the app

  // Top bar
  const topBar = document.querySelector('.top-bar .menu-options');
  menuOptions.forEach(option => {
    const li = document.createElement('li');
    li.textContent = option.name;
    li.onclick = option.onClick;
    topBar.appendChild(li);
  });

  // Left bar
  const gameList = document.querySelector('.left-bar .game-list');
  Object.keys(games).forEach(key => {
    const gameItem = document.createElement('li');
    gameItem.textContent = games[key].name;
    gameList.appendChild(gameItem);
  });

  // Main content
  const mainContent = document.querySelector('.main-content');
  tiles.forEach(tile => {
    const tileDiv = document.createElement('div');
    tileDiv.className = 'tile';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.textContent = tile.title;

    const descDiv = document.createElement('div');
    descDiv.textContent = tile.description;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.onclick = tile.close;

    const editButton = document.createElement('button');
    editButton.textContent = '⚙';
    editButton.onclick = tile.edit;

    actionsDiv.appendChild(closeButton);
    actionsDiv.appendChild(editButton);

    tileDiv.appendChild(titleDiv);
    tileDiv.appendChild(descDiv);
    tileDiv.appendChild(actionsDiv);

    mainContent.appendChild(tileDiv);
  });
}



// Main function to create the modal
function createModal(type, options, callback) {
  const overlay = createOverlay();
  const modal = document.createElement('div');
  modal.className = 'modal';

  // Generate modal content based on the type
  if (type === 'tag') {
    generateTagModal(modal, options, callback);
  } else if (type === 'config') {
    generateConfigModal(modal, options, callback);
  } else if (type === 'edit') {
    generateEditModal(modal, options, callback);
  }

  // Append modal to overlay and display it
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  toggleModal(true);
}

// Helper function to create overlay
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = () => toggleModal(false);
  return overlay;
}

// Toggle the modal visibility
function toggleModal(show) {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    if (show) {
      overlay.classList.add('show');
    } else {
      overlay.classList.remove('show');
      document.body.removeChild(
          overlay);  // Remove overlay from DOM when hiding
    }
  }
}

// Generate tag modal
function generateTagModal(modal, tags, callback) {
  const table = document.createElement('table');

  tags.forEach(tag => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = tag;
    row.appendChild(nameCell);

    ['Include', 'Exclude', 'Require'].forEach((option, index) => {
      const cell = document.createElement('td');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `filter-${tag}`;
      radio.value = option.toLowerCase();
      if (index === 0) radio.checked = true;  // Default to 'Include'
      radio.onclick = () => callback(getSelectedTags(tags));
      cell.appendChild(radio);
      row.appendChild(cell);
    });

    table.appendChild(row);
  });

  modal.appendChild(table);
}

// Helper function to get selected tags from the tag modal
function getSelectedTags(tags) {
  const selectedTags = [];
  tags.forEach(tag => {
    const selectedOption =
        document.querySelector(`input[name="filter-${tag}"]:checked`).value;
    selectedTags.push({tag, action: selectedOption});
  });
  return selectedTags;
}

// Generate config modal
function generateConfigModal(modal, options, callback) {
  const table = document.createElement('table');

  for (let key in options) {
    const row = document.createElement('tr');

    const labelCell = document.createElement('td');
    labelCell.textContent = key;
    row.appendChild(labelCell);

    const inputCell = document.createElement('td');

    if (typeof options[key] === 'number') {
      inputCell.textContent = options[key];  // Display the integer
    } else if (typeof options[key] === 'string') {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = options[key];

      if (key.toLowerCase().includes('path')) {
        input.onclick = () =>
            openFileDialog();  // Attach the file dialog function
      }

      inputCell.appendChild(input);
    }

    row.appendChild(inputCell);
    table.appendChild(row);
  }

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.onclick = () => callback(collectConfigValues(options));

  modal.appendChild(table);
  modal.appendChild(submitButton);
}

// Helper function to collect values from config modal
function collectConfigValues(options) {
  const newValues = {};
  for (let key in options) {
    if (typeof options[key] === 'number') {
      newValues[key] = options[key];  // Keep the integer value as is
    } else if (typeof options[key] === 'string') {
      const input = document.querySelector(`td input[value="${options[key]}"]`);
      newValues[key] = input ? input.value : options[key];
    }
  }
  return newValues;
}

// Stub function to open a file dialog
function openFileDialog() {
  alert('File dialog opened!');
  // Actual implementation would involve platform-specific file dialogs
}

// Generate edit modal
function generateEditModal(modal, options, callback) {
  const table = document.createElement('table');

  // Edit display name
  const nameRow = document.createElement('tr');
  const nameLabel = document.createElement('td');
  nameLabel.textContent = 'Display Name';
  const nameInputCell = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = options.displayName || '';
  nameInputCell.appendChild(nameInput);
  nameRow.appendChild(nameLabel);
  nameRow.appendChild(nameInputCell);
  table.appendChild(nameRow);

  // Edit path
  const pathRow = document.createElement('tr');
  const pathLabel = document.createElement('td');
  pathLabel.textContent = 'Path';
  const pathInputCell = document.createElement('td');
  const pathInput = document.createElement('input');
  pathInput.type = 'text';
  pathInput.value = options.path || '';
  pathInput.onclick = () => openFileDialog();
  pathInputCell.appendChild(pathInput);
  pathRow.appendChild(pathLabel);
  pathRow.appendChild(pathInputCell);
  table.appendChild(pathRow);

  // Set parent
  const parentRow = document.createElement('tr');
  const parentLabel = document.createElement('td');
  parentLabel.textContent = 'Parent';
  const parentSelectCell = document.createElement('td');
  const parentSelect = document.createElement('select');
  const availableParents =
      getAvailableParents(options);  // Function to get available parent apps
  availableParents.forEach(parent => {
    const option = document.createElement('option');
    option.value = parent.key;
    option.textContent = parent.name;
    parentSelect.appendChild(option);
  });
  parentSelectCell.appendChild(parentSelect);
  parentRow.appendChild(parentLabel);
  parentRow.appendChild(parentSelectCell);
  table.appendChild(parentRow);

  // Set children
  const childrenRow = document.createElement('tr');
  const childrenLabel = document.createElement('td');
  childrenLabel.textContent = 'Children';
  const childrenSelectCell = document.createElement('td');
  const childrenSelect = document.createElement('select');
  childrenSelect.multiple = true;
  const availableChildren =
      getAvailableChildren(options);  // Function to get available child apps
  availableChildren.forEach(child => {
    const option = document.createElement('option');
    option.value = child.key;
    option.textContent = child.name;
    childrenSelect.appendChild(option);
  });
  childrenSelectCell.appendChild(childrenSelect);
  childrenRow.appendChild(childrenLabel);
  childrenRow.appendChild(childrenSelectCell);
  table.appendChild(childrenRow);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.onclick = () => {
    const changes = {
      displayName: nameInput.value,
      path: pathInput.value,
      parent: parentSelect.value,
      children: Array.from(childrenSelect.selectedOptions)
                    .map(option => option.value),
    };
    callback(changes);
  };

  modal.appendChild(table);
  modal.appendChild(submitButton);
}

// Helper functions to get available parents and children (stub implementation)
function getAvailableParents(currentApp) {
  ``
  // Return a list of apps that don't have parents and are not the current app
  return [{key: 'app1', name: 'App 1'}, {key: 'app2', name: 'App 2'}];
}

function getAvailableChildren(currentApp) {
  // Return a list of apps that are not the current app and don't have children
  return [{key: 'app3', name: 'App 3'}, {key: 'app4', name: 'App 4'}];
}
