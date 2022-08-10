// API Calls.
getCreatures();
getMonsters();
getMaterials();
getEquipment();
getTreasure();

// Document Selectors
var $appBody = document.body;

// Entry Selectors
var $compediumEntries = document.querySelector('#compendium-entries');
var $entryRow = document.querySelector('#entry-row');
$entryRow.addEventListener('click', clickEntry);

// Navigation Selectors
var $appHeader = document.querySelector('#app-header');
var $navigationIcons = document.querySelectorAll('.nav-icon');
var $navIconContainer = document.querySelector('#navigation-icons');
$appHeader.addEventListener('click', initializeCompendium);
addEventList($navigationIcons, 'click', navigationClick);

// Entry Details Selectors
var $detailRow = document.querySelector('#detail-row');
var $detailOverlay = document.querySelector('.detail-overlay');
$detailOverlay.addEventListener('click', clickDetailOverlay);

// Sort Selectors
var $navSort = document.querySelector('#nav-sort');
var $sortToggle = document.querySelector('#sort-toggle');
var $sortToggleBox = document.querySelector('#sort-toggle-box');
var $sortRow = document.querySelector('#sort-row');
var $ascendArrow = document.querySelector('#ascend-arrow');
var $descendArrow = document.querySelector('#descend-arrow');
var $sortBtn = document.querySelector('.sort-btn');
var $dropDownSortChoice = document.querySelector('#dropdown-sort-choice');
var $sortOverlay = document.querySelector('.sort-overlay');
var $sortClose = document.querySelector('#sort-close');
$navSort.addEventListener('click', clickSort);
$sortToggleBox.addEventListener('click', clickSortToggle);
$dropDownSortChoice.addEventListener('click', clickDownDownSort);
$sortOverlay.addEventListener('click', clickSortOverlay);
$sortClose.addEventListener('click', toggleSortView);

// Search Selectors
var $navSearch = document.querySelector('#nav-search');
var $searchView = document.querySelector('#search-view');
var $searchClose = document.querySelector('#search-close');
var $searchEntriesInput = document.querySelector('#search-entries-input');
$navSearch.addEventListener('click', toggleSearch);
$searchClose.addEventListener('click', toggleSearch);

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
    $detailRow.appendChild(renderDetail(data.entryView));
    renderDetailLocations(data.entryView);
    renderDetailAttributes(data.entryView, ['drops', 'cooking_effect', 'attack', 'defense']);
    var $closeDetail = document.querySelector('.modal-close');
    $closeDetail.addEventListener('click', toggleDetailView);
  } else {
    if (data.searchView) {
      toggleSearchView();
    }
    data.entryView = null;
    $detailOverlay.classList.add('hidden');
    $appBody.classList.remove('stop-background-scroll');
    if ($detailRow.childElementCount !== 0) {
      removeAllChildren($detailRow);
    }
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
    renderEntries(data.compendiumAlph);
    data.searchView = true;
    $searchEntriesInput.addEventListener('input', processSearchInput);
  } else {
    toggleSearchView();
    $searchEntriesInput.value = '';
    data.searchView = false;
    renderControl();
  }
}

function processSearchInput(event) {
  data.searchStr = $searchEntriesInput.value;
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
  var $element = document.createElement(tagName);
  for (var name in attributes) {
    $element.setAttribute(name, attributes[name]);
  }
  for (var i = 0; i < children.length; i++) {
    if (children[i] instanceof HTMLElement) {
      $element.appendChild(children[i]);
    } else {
      $element.appendChild(document.createTextNode(children[i]));
    }
  }
  return $element;
}

function renderEntry(obj) {
  var $compendiumEntry =
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
  var $entryDetail =
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
          createElement('i', { class: 'fas fa-heart mobile-heart' }, [])
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
          createElement('i', { class: 'fas fa-heart desktop-heart' }, [])
        ])
      ])
    ]);
  return $entryDetail;
}

function renderDetailLocations(obj) {
  var $locationWrapper = document.querySelector('.location-wrapper');
  if (obj.common_locations !== null) {
    for (let i = 0; i < obj.common_locations.length; i++) {
      $locationWrapper.appendChild(createElement('p', { class: 'text-gold segoe-font' }, [obj.common_locations[i]]));
    }
  } else {
    $locationWrapper.appendChild(createElement('p', { class: 'text-gold segoe-font' }, ['No Common Locations']));
  }
}

function renderDetailAttributes(obj, attributes) {
  var $attributeWrapper = document.querySelector('.detail-attribute-wrapper');

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
  var creatureRequest = new XMLHttpRequest();
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
  var monsterRequest = new XMLHttpRequest();
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
  var materialRequest = new XMLHttpRequest();
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
  var equipmentRequest = new XMLHttpRequest();
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
  var treasureRequest = new XMLHttpRequest();
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
