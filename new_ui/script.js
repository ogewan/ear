// script.js

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.appendChild(createTopBar());

  // create a container for the left bar and main content
  const container = document.createElement('div');
  container.className = 'container';
  app.appendChild(container);

  container.appendChild(createLeftBar());
  container.appendChild(createMainContent());

  createModal()
  generateDummyData();
});

function generateDummyData() {
  // Generate dummy menu options
  const menuOptions = [
    {name: 'Store', onClick: () => alert('Store clicked')},
    {name: 'Library', onClick: () => alert('Library clicked')},
    {name: 'Community', onClick: () => alert('Community clicked')},
    {name: 'Profile', onClick: () => alert('Profile clicked')},
    {name: 'News', onClick: () => alert('News clicked')},
    {name: 'Settings', onClick: () => alert('Settings clicked')}
  ];

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

function createLogoElement() {
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

function createTopBar() {
  const menuOptions = [
    {name: 'Store', onClick: () => alert('Store clicked')},
    {name: 'Library', onClick: () => alert('Library clicked')},
    {name: 'Community', onClick: () => alert('Community clicked')},
    {name: 'Profile', onClick: () => alert('Profile clicked')}
  ];

  const topBar = document.createElement('div');
  topBar.className = 'top-bar';

  const menuList = document.createElement('ul');
  menuList.className = 'menu-options';

  menuOptions.forEach(option => {
    const li = document.createElement('li');
    li.textContent = option.name;
    li.onclick = option.onClick;
    menuList.appendChild(li);
  });

  topBar.appendChild(createLogoElement());
  topBar.appendChild(menuList);
  return topBar;
}

function createLeftBar() {
  const leftBar = document.createElement('div');
  leftBar.className = 'left-bar';

  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.placeholder = 'Search...';
  leftBar.appendChild(searchBar);

  const filterButton = document.createElement('button');
  filterButton.className = 'filter-button';
  filterButton.textContent = 'Filter';
  filterButton.onclick = () => toggleModal(true);
  leftBar.appendChild(filterButton);

  const gameList = document.createElement('ul');
  gameList.className = 'game-list';

  const games = {
    game1: {name: 'Game 1', tags: ['Action'], parent: null},
    game2: {name: 'Game 2', tags: ['RPG'], parent: null},
    game3: {name: 'Game 3', tags: ['Adventure'], parent: null}
  };

  Object.keys(games).forEach(key => {
    const gameItem = document.createElement('li');
    gameItem.textContent = games[key].name;
    gameList.appendChild(gameItem);
  });

  // Implementing the search functionality
  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    Array.from(gameList.children).forEach(item => {
      const isVisible = item.textContent.toLowerCase().includes(searchTerm);
      item.style.display = isVisible ? 'block' : 'none';
    });
  });

  leftBar.appendChild(gameList);
  return leftBar;
}

function createMainContent() {
  // Main content
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';

  const tiles = [
    {
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
    }
  ];

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
  return mainContent;
}

function createModal() {
  // Modal for filtering
  const modal = document.createElement('div');
  modal.className = 'modal';

  const closeModalButton = document.createElement('span');
  closeModalButton.className = 'close';
  ``
  closeModalButton.textContent = 'X';
  closeModalButton.onclick = () => toggleModal(false);
  modal.appendChild(closeModalButton);

  const tags = ['Action', 'RPG', 'Adventure'];
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
      if (index === 0) radio.checked = true;  // Default to 'Include'
      cell.appendChild(radio);
      row.appendChild(cell);
    });

    table.appendChild(row);
  });

  modal.appendChild(table);
  document.body.appendChild(modal);
}
// Function to toggle modal (used for the filter button in the left bar)
function toggleModal(show) {
  const modal = document.querySelector('.modal');
  if (show) {
    modal.classList.add('show');
  } else {
    modal.classList.remove('show');
  }
}
// Call the function to generate and include the dummy data
// generateDummyData();
