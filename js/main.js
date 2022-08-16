// API Calls.
getCreatures();
getMonsters();
getMaterials();
getEquipment();
getTreasure();

// Document Variables
const $appBody = document.body;
let windowXCoord = 0;
let windowYCoord = 0;

// Entry Variables/Events
const $compediumEntries = document.querySelector('#compendium-entries');
const $entryRow = document.querySelector('#entry-row');
const $entryPlaceholder = document.querySelector('#no-entry-placeholder');
$entryRow.addEventListener('click', clickEntry);

// Navigation Variables/Events
const $appHeader = document.querySelector('#app-header');
const $navigationIcons = document.querySelectorAll('.nav-icon');
const $navIconContainer = document.querySelector('#navigation-icons');
$appHeader.addEventListener('click', initializeCompendium);
addEventList($navigationIcons, 'click', navigationClick);

// Entry Details Variables/Events
const $detailRow = document.querySelector('#detail-row');
const $detailOverlay = document.querySelector('.detail-overlay');
$detailOverlay.addEventListener('click', clickDetailOverlay);

// Sort Variables/Events
const $navSort = document.querySelector('#nav-sort');
const $sortToggle = document.querySelector('#sort-toggle');
const $sortToggleBox = document.querySelector('#sort-toggle-box');
const $sortRow = document.querySelector('#sort-row');
const $ascendArrow = document.querySelector('#ascend-arrow');
const $descendArrow = document.querySelector('#descend-arrow');
const $sortBtn = document.querySelector('.sort-btn');
const $dropDownSortChoice = document.querySelector('#dropdown-sort-choice');
const $sortOverlay = document.querySelector('.sort-overlay');
const $sortClose = document.querySelector('#sort-close');
$navSort.addEventListener('click', clickSort);
$sortToggleBox.addEventListener('click', clickSortToggle);
$dropDownSortChoice.addEventListener('click', clickDownDownSort);
$sortOverlay.addEventListener('click', clickSortOverlay);
$sortClose.addEventListener('click', toggleSortView);

// Search Variables/Events
const $navSearch = document.querySelector('#nav-search');
const $searchView = document.querySelector('#search-view');
const $searchClose = document.querySelector('#search-close');
const $searchEntriesInput = document.querySelector('#search-entries-input');
$navSearch.addEventListener('click', toggleSearch);
$searchClose.addEventListener('click', toggleSearch);

// Favorites Variables/Events
const $navHeart = document.querySelector('#nav-heart');
const $favoritesView = document.querySelector('#favorites-view');
const $favoritesEntryRow = document.querySelector('#favorites-row');
const $favoritesContainerRow = document.querySelector('#favorites-container-row');
const $favoritesOverlay = document.querySelector('.favorites-overlay');
const $favoritesClose = document.querySelector('#favorites-close');
$navHeart.addEventListener('click', toggleFavorites);
$favoritesOverlay.addEventListener('click', clickFavoritesOverlay);
$favoritesClose.addEventListener('click', toggleFavoritesView);

// Navigation Functionality
function navigationClick(event) {
  if (event.target.className !== 'nav-icon') {
    return;
  }
  data.currentNavIcon.classList.remove('nav-icon-selected');
  data.currentNavIcon = event.target;
  data.currentNavIcon.classList.add('nav-icon-selected');
  data.pageView = event.target.id;
  renderControl();
}

function toggleNavigationIconsView() {
  if ($navIconContainer.classList.contains('hidden')) {
    $navIconContainer.classList.remove('hidden');
  } else {
    $navIconContainer.classList.add('hidden');
  }

}

// Entry Detail Functionality
function clickEntry(event) {
  event.stopPropagation();
  data.entryView = data.compendium[event.target.closest('.entry-container').getAttribute('dataid') - 1];
  toggleDetailView();
}

function clickDetailOverlay(event) {
  if (event.target.className !== 'detail-overlay') {
    return;
  }
  event.stopPropagation();
  toggleDetailView();
}

function toggleDetailView() {
  if ($detailOverlay.classList.contains('hidden')) {
    if (data.searchView) {
      toggleSearchView();
    }
    $detailOverlay.classList.remove('hidden');
    $appBody.classList.add('stop-background-scroll');
    $entryRow.classList.add('entry-toggle');
    $detailRow.appendChild(renderDetail(data.entryView));
    manageDetailFavorites();
    renderDetailLocations(data.entryView);
    renderDetailAttributes(data.entryView, ['drops', 'cooking_effect', 'attack', 'defense']);
    const $closeDetail = document.querySelector('.modal-close');
    $closeDetail.addEventListener('click', toggleDetailView);
  } else {
    if (data.searchView) {
      toggleSearchView();
    }
    data.entryView = null;
    $detailOverlay.classList.add('hidden');
    $appBody.classList.remove('stop-background-scroll');
    $entryRow.classList.remove('entry-toggle');
    if ($detailRow.childElementCount !== 0) {
      removeAllChildren($detailRow);
    }
  }
}

function manageDetailFavorites() {
  const $desktopHeart = document.querySelector('.desktop-heart');
  const $mobileHeart = document.querySelector('.mobile-heart');
  $mobileHeart.addEventListener('click', clickDetailFavorite);
  $desktopHeart.addEventListener('click', clickDetailFavorite);
  if (entryInFavorites()) {
    $mobileHeart.classList.replace('text-grey', 'text-red');
    $desktopHeart.classList.replace('text-grey', 'text-red');
  }

}

function clickDetailFavorite(event) {
  if (event.target.tagName !== 'I') {
    return;
  }
  if (event.target.classList.contains('text-grey')) {
    event.target.classList.replace('text-grey', 'text-red');
    data.favorites.push(data.entryView);
  } else if (event.target.classList.contains('text-red')) {
    event.target.classList.replace('text-red', 'text-grey');
    deleteFavorite(data.entryView.id);
  }
}

// Sort Functionality
function clickSort(event) {
  if (event.target.getAttribute('id') !== 'nav-sort') {
    return;
  }
  toggleSortView();
}

function clickSortToggle(event) {
  event.stopPropagation();
  toggleOrder();
}

function clickSortOverlay(event) {
  if (event.target.className !== 'sort-overlay') {
    return;
  }
  event.stopPropagation();
  toggleSortView();
}

function clickSortRow(event) {
  if (event.target.getAttribute('id') !== 'sort-row') {
    return;
  }
  toggleSortView();
}

function clickDownDownSort(event) {
  if (event.target.tagName !== 'SPAN') {
    return;
  }
  if ($dropDownSortChoice.textContent === 'Name') {
    data.numSort = false;
    $sortBtn.innerText = 'Name';
    $dropDownSortChoice.textContent = 'Number';
  } else {
    data.numSort = true;
    $sortBtn.innerText = 'Number';
    $dropDownSortChoice.textContent = 'Name';
  }
  renderControl();
}

function toggleOrder() {
  if (data.ascendSort) {
    $sortToggle.style.left = '2.8rem';
    highlightArrowDown();
    data.ascendSort = false;
  } else {
    $sortToggle.style.left = '0';
    highlightArrowUp();
    data.ascendSort = true;
  }
  renderControl();
}

function highlightArrowUp() {
  $descendArrow.classList.replace('text-gold', 'text-grey');
  $ascendArrow.classList.replace('text-grey', 'text-gold');
}

function highlightArrowDown() {
  $descendArrow.classList.replace('text-grey', 'text-gold');
  $ascendArrow.classList.replace('text-gold', 'text-grey');
}

function toggleSortView() {
  if ($sortOverlay.classList.contains('hidden')) {
    $sortOverlay.classList.remove('hidden');
    $navSort.classList.replace('text-light-grey', 'text-gold');
    $appBody.classList.add('stop-background-scroll');
  } else {
    $sortOverlay.classList.add('hidden');
    $navSort.classList.replace('text-gold', 'text-light-grey');
    $appBody.classList.remove('stop-background-scroll');

  }
  $sortRow.addEventListener('click', clickSortRow);
}

// Search Functionality
function toggleSearch() {
  if (!data.searchView) {
    toggleSearchView();
    windowXCoord = window.pageXOffset;
    windowYCoord = window.pageYOffset;
    window.scrollTo(0, 0);
    renderEntries(data.compendiumAlph);
    data.searchView = true;
    $searchEntriesInput.addEventListener('input', processSearchInput);
  } else {
    toggleSearchView();
    window.scrollTo(windowXCoord, windowYCoord);
    $searchEntriesInput.value = '';
    data.searchView = false;
    renderControl();
  }
}

function processSearchInput(event) {
  data.searchStr = $searchEntriesInput.value.toLowerCase();
  searchEntries();
}

function toggleSearchView() {
  if ($searchView.classList.contains('hidden')) {
    $searchView.classList.remove('hidden');
    $compediumEntries.style['margin-top'] = '100px';
    toggleNavigationIconsView();
    $searchEntriesInput.focus();
  } else {
    $searchView.classList.add('hidden');
    $compediumEntries.style['margin-top'] = '145px';
    toggleNavigationIconsView();
  }
}

function searchEntries() {
  data.searchResults = [];
  for (let i = 0; i < data.compendiumAlph.length; i++) {
    if (data.compendiumAlph[i].name.includes(data.searchStr)) {
      data.searchResults.push(data.compendiumAlph[i]);
    }
  }
  renderControl();
}

// App Initialization/Reset
function initializeCompendium() {
  if (data.currentNavIcon !== null) {
    data.currentNavIcon.classList.remove('nav-icon-selected');
  }
  data.currentNavIcon = $navigationIcons[0];
  data.currentNavIcon.classList.add('nav-icon-selected');

  data.pageView = 'creatures';
  if (!data.ascendSort) {
    data.ascendSort = true;
    $sortToggle.style.left = '0';
    highlightArrowUp();
  }
  if (!data.numSort) {
    data.numSort = true;
    $sortBtn.innerText = 'Number';
    $dropDownSortChoice.textContent = 'Name';
  }
  data.entryView = null;
  renderControl();
}

// Dom Render Functionality
function createElement(tagName, attributes, children) {
  const $element = document.createElement(tagName);
  for (const name in attributes) {
    $element.setAttribute(name, attributes[name]);
  }
  for (let i = 0; i < children.length; i++) {
    if (children[i] instanceof HTMLElement) {
      $element.appendChild(children[i]);
    } else {
      $element.appendChild(document.createTextNode(children[i]));
    }
  }
  return $element;
}

function renderEntry(obj) {
  const $compendiumEntry =
    createElement('div', { class: 'col-full col-sm-half col-md-third col-lg-fourth entry-container', dataID: obj.id }, [
      createElement('div', { class: 'entry-wrapper' }, [
        createElement('div', { class: 'row' }, [
          createElement('div', { class: 'col-img' }, [
            createElement('div', { class: 'col-img-wrapper' }, [
              createElement('img', { src: obj.image, class: 'block' }, [])
            ])
          ]),
          createElement('div', { class: 'col-name' }, [
            createElement('div', { class: 'col-name-wrapper' }, [
              createElement('h3', { class: 'text-gold hylia-font' }, [obj.name]),
              createElement('p', { class: 'text-blue hylia-font' }, [obj.id])
            ])
          ])
        ])
      ])
    ]);
  return $compendiumEntry;
}

function renderEntries(entryArr) {
  if ($entryRow.childElementCount !== 0) {
    removeAllChildren($entryRow);
  }

  if (entryArr.length === 0) {
    $entryPlaceholder.classList.remove('hidden');
    return;
  }
  $entryPlaceholder.classList.add('hidden');
  for (let i = 0; i < entryArr.length; i++) {
    $entryRow.appendChild(renderEntry(entryArr[i]));
  }
}

function renderEntriesReverse(entryArr) {
  if ($entryRow.childElementCount !== 0) {
    removeAllChildren($entryRow);
  }
  for (let i = entryArr.length - 1; i >= 0; i--) {
    $entryRow.appendChild(renderEntry(entryArr[i]));
  }
}

function renderDetail(obj) {
  const $entryDetail =
    createElement('div', { class: 'col-modal' }, [
      createElement('div', { class: 'detail-header' }, [
        createElement('div', { class: 'row center space-between' }, [
          createElement('div', { class: 'col-fluid detail-title' }, [
            createElement('h2', { class: 'text-gold hylia-font' }, [
              obj.name
            ])
          ]),
          createElement('div', { class: 'col-fluid' }, [
            createElement('div', { class: 'detail-close-wrapper' }, [
              createElement('i', { class: 'fa-solid fa-xmark text-grey modal-close' }, [])
            ])
          ])
        ])
      ]),
      createElement('div', { class: 'detail-body background-dark' }, [
        createElement('div', { class: 'mobile-heart-wrapper align-right' }, [
          createElement('i', { class: 'fas fa-heart mobile-heart text-grey' }, [])
        ]),
        createElement('div', { class: 'row wrap' }, [
          createElement('div', { class: 'col-detail' }, [
            createElement('div', { class: 'detail-image-wrapper align-center' }, [
              createElement('img', { src: obj.image }, [])
            ])
          ]),
          createElement('div', { class: 'col-detail' }, [
            createElement('div', { class: 'detail-summary-wrapper' }, [
              createElement('p', { class: 'text-gold segoe-font' }, [
                obj.description
              ])
            ])
          ])
        ])
      ]),
      createElement('div', { class: 'detail-footer' }, [
        createElement('div', { class: 'row wrap' }, [
          createElement('div', { class: 'col-detail' }, [
            createElement('div', { class: 'location-wrapper align-center' }, [
              createElement('h2', { class: 'text-gold hylia-font' }, ['Common Locations'])
            ])
          ]),
          createElement('div', { class: 'col-detail align-center' }, [
            createElement('div', { class: 'detail-attribute-wrapper' }, [])
          ])
        ]),
        createElement('div', { class: 'desktop-heart-wrapper align-right' }, [
          createElement('i', { class: 'fas fa-heart desktop-heart text-grey' }, [])
        ])
      ])
    ]);
  return $entryDetail;
}

function renderDetailLocations(obj) {
  const $locationWrapper = document.querySelector('.location-wrapper');
  if (obj.common_locations !== null) {
    for (let i = 0; i < obj.common_locations.length; i++) {
      $locationWrapper.appendChild(createElement('p', { class: 'text-gold segoe-font' }, [obj.common_locations[i]]));
    }
  } else {
    $locationWrapper.appendChild(createElement('p', { class: 'text-gold segoe-font' }, ['No Common Locations']));
  }
}

function renderDetailAttributes(obj, attributes) {
  const $attributeWrapper = document.querySelector('.detail-attribute-wrapper');

  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i] in obj && obj[attributes[i]] !== 0) {
      $attributeWrapper.appendChild(createElement('h2', { class: 'text-gold hylia-font' }, [titleAttribute(attributes[i])]));
      if (obj[attributes[i]] !== null) {
        if (obj[attributes[i]].length !== 0) {
          if (Array.isArray(obj[attributes[i]])) {
            for (let j = 0; j < obj[attributes[i]].length; j++) {
              $attributeWrapper.appendChild(createElement('p', { class: 'capitalize text-gold segoe-font' }, [obj[attributes[i]][j]]));
            }
          } else {
            $attributeWrapper.appendChild(createElement('p', { class: 'capitalize text-gold segoe-font' }, [obj[attributes[i]]]));
          }
        } else {
          $attributeWrapper.appendChild(createElement('p', { class: 'capitalize text-gold segoe-font' }, ['None']));
        }
      } else {
        $attributeWrapper.appendChild(createElement('p', { class: 'capitalize text-gold segoe-font' }, ['Rare Unknown']));
      }
    }
  }
}

function renderFavoriteEntry(obj) {
  const $compendiumFavorite =
    createElement('div', { class: 'col-full', dataID: obj.id }, [
      createElement('div', { class: 'entry-wrapper' }, [
        createElement('div', { class: 'row' }, [
          createElement('div', { class: 'col-img' }, [
            createElement('div', { class: 'col-img-wrapper' }, [
              createElement('img', { src: obj.image, class: 'block' }, [])
            ])
          ]),
          createElement('div', { class: 'col-name' }, [
            createElement('div', { class: 'col-name-wrapper' }, [
              createElement('h3', { class: 'text-gold hylia-font' }, [obj.name]),
              createElement('span', { class: 'text-blue hylia-font' }, [obj.id])
            ])
          ]),
          createElement('i', { class: 'in-line fas fa-heart text-red align-right favorites-view-heart', heartid: obj.id }, [])
        ])
      ])
    ]);
  return $compendiumFavorite;
}

function renderFavoriteEntries() {
  removeAllChildren($favoritesEntryRow);

  for (let i = 0; i < data.favorites.length; i++) {
    $favoritesEntryRow.appendChild(renderFavoriteEntry(data.favorites[i]));
  }
}

function renderControl() {

  if (data.searchView) {
    renderEntries(data.searchResults);
    return;
  }
  if (data.numSort) {
    if (data.ascendSort) {
      renderEntries(data[data.pageView]);
    } else {
      renderEntriesReverse(data[data.pageView]);
    }
  } else {
    if (data.ascendSort) {
      renderEntries(data[data.pageView + 'Alph']);
    } else {
      renderEntriesReverse(data[data.pageView + 'Alph']);
    }
  }
}

// Favorites Functionality

function toggleFavorites(event) {
  if (event.target.getAttribute('id') !== 'nav-heart') {
    return;
  }
  renderFavoriteEntries();
  toggleFavoritesView();
}

function toggleFavoritesView() {
  if ($favoritesView.classList.contains('hidden')) {
    $favoritesView.classList.remove('hidden');
    if (data.favorites.length > 0) {
      const $favoriteHeartList = document.querySelectorAll('.favorites-view-heart');
      addEventList($favoriteHeartList, 'click', clickFavoritesViewHeart);
    }
  } else {
    $favoritesView.classList.add('hidden');
  }
  $favoritesContainerRow.addEventListener('click', clickFavoritesRow);
}

function clickFavoritesViewHeart(event) {
  if (event.target.tagName !== 'I') {
    return;
  }
  if (event.target.classList.contains('text-red')) {
    event.target.classList.replace('text-red', 'text-grey');
    const $domDelete = event.target.closest('.col-full');
    deleteFavorite(parseInt($domDelete.getAttribute('dataid')));
    $domDelete.remove();
  }
}

function clickFavoritesOverlay(event) {
  if (event.target.className !== 'favorites-overlay') {
    return;
  }
  event.stopPropagation();
  toggleFavoritesView();
}

function clickFavoritesRow(event) {
  if (event.target.getAttribute('id') !== 'favorites-container-row') {
    return;
  }
  toggleFavoritesView();
}

function entryInFavorites() {
  if (data.favorites.includes(data.entryView)) {
    return true;
  }
  return false;
}

function deleteFavorite(id) {
  for (let i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].id === id) {
      data.favorites.splice(i, 1);
    }
  }
}

// General Dom Functionality
function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function addEventList(list, event, fnct) {
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener(event, fnct);
  }
}

// API Functionality
function getCreatures() {
  const creatureRequest = new XMLHttpRequest();
  creatureRequest.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/creatures');
  creatureRequest.responseType = 'json';
  creatureRequest.addEventListener('load', function () {
    for (let i = 0; i < creatureRequest.response.data.food.length; i++) {
      data.creatures.push(creatureRequest.response.data.food[i]);
      data.creaturesAlph.push(creatureRequest.response.data.food[i]);
      data.compendium.push(creatureRequest.response.data.food[i]);
      data.compendiumAlph.push(creatureRequest.response.data.food[i]);
    }
    for (let i = 0; i < creatureRequest.response.data.non_food.length; i++) {
      data.creatures.push(creatureRequest.response.data.non_food[i]);
      data.creaturesAlph.push(creatureRequest.response.data.non_food[i]);
      data.compendium.push(creatureRequest.response.data.non_food[i]);
      data.compendiumAlph.push(creatureRequest.response.data.non_food[i]);
    }
    // Sort creatures array by id
    data.creatures.sort(function (a, b) {
      return a.id - b.id;
    });

    // Sort creatures and compendium arrays by name
    data.creaturesAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
      return a.id - b.id;
    });

    data.compendiumAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    // Render creatures entries on page load by defualt
    initializeCompendium();
  });
  creatureRequest.send();
}

function getMonsters() {
  const monsterRequest = new XMLHttpRequest();
  monsterRequest.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/monsters');
  monsterRequest.responseType = 'json';
  monsterRequest.addEventListener('load', function () {
    for (let i = 0; i < monsterRequest.response.data.length; i++) {
      data.monsters.push(monsterRequest.response.data[i]);
      data.monstersAlph.push(monsterRequest.response.data[i]);
      data.compendium.push(monsterRequest.response.data[i]);
      data.compendiumAlph.push(monsterRequest.response.data[i]);
    }
    data.monsters.sort(function (a, b) {
      return a.id - b.id;
    });

    data.monstersAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
      return a.id - b.id;
    });

    data.compendiumAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  });
  monsterRequest.send();
}

function getMaterials() {
  const materialRequest = new XMLHttpRequest();
  materialRequest.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/materials');
  materialRequest.responseType = 'json';
  materialRequest.addEventListener('load', function () {
    for (let i = 0; i < materialRequest.response.data.length; i++) {
      data.materials.push(materialRequest.response.data[i]);
      data.materialsAlph.push(materialRequest.response.data[i]);
      data.compendium.push(materialRequest.response.data[i]);
      data.compendiumAlph.push(materialRequest.response.data[i]);
    }
    data.materials.sort(function (a, b) {
      return a.id - b.id;
    });

    data.materialsAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
      return a.id - b.id;
    });

    data.compendiumAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  });
  materialRequest.send();
}

function getEquipment() {
  const equipmentRequest = new XMLHttpRequest();
  equipmentRequest.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/equipment');
  equipmentRequest.responseType = 'json';
  equipmentRequest.addEventListener('load', function () {
    for (let i = 0; i < equipmentRequest.response.data.length; i++) {
      data.equipment.push(equipmentRequest.response.data[i]);
      data.equipmentAlph.push(equipmentRequest.response.data[i]);
      data.compendium.push(equipmentRequest.response.data[i]);
      data.compendiumAlph.push(equipmentRequest.response.data[i]);
    }
    data.equipment.sort(function (a, b) {
      return a.id - b.id;
    });

    data.equipmentAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
      return a.id - b.id;
    });

    data.compendiumAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  });
  equipmentRequest.send();
}

function getTreasure() {
  const treasureRequest = new XMLHttpRequest();
  treasureRequest.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/treasure');
  treasureRequest.responseType = 'json';
  treasureRequest.addEventListener('load', function () {
    for (let i = 0; i < treasureRequest.response.data.length; i++) {
      data.treasure.push(treasureRequest.response.data[i]);
      data.treasureAlph.push(treasureRequest.response.data[i]);
      data.compendium.push(treasureRequest.response.data[i]);
      data.compendiumAlph.push(treasureRequest.response.data[i]);
    }
    data.treasure.sort(function (a, b) {
      return a.id - b.id;
    });

    data.treasureAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
      return a.id - b.id;
    });

    data.compendiumAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  });

  treasureRequest.send();
}

// Case Specific Functionality
function titleAttribute(str) {
  switch (str) {
    case 'drops':
      return 'Droppable Items';
    case 'cooking_effect':
      return 'Cooking Effect';
    case 'attack':
      return 'Attack Power';
    case 'defense':
      return 'Defense Power';
    default:
      return str;
  }
}
