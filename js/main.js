// API Calls.
getCreatures();
getMonsters();
getMaterials();
getEquipment();
getTreasure();

// Global Dom Selectors
var $entryRow = document.querySelector('#entry-row');
$entryRow.addEventListener('click', clickEntry);

var $detailRow = document.querySelector('#detail-row');

var $navigationIcons = document.querySelectorAll('.nav-icon');
addEventList($navigationIcons, 'click', navigationClick);

var $detailOverlay = document.querySelector('.detail-overlay');
$detailOverlay.addEventListener('click', clickDetailOverlay);

var $navSort = document.querySelector('#nav-sort');
var $sortToggle = document.querySelector('#sort-toggle');
var $sortToggleBox = document.querySelector('#sort-toggle-box');
var $sortRow = document.querySelector('#sort-row');
var $ascendArrow = document.querySelector('#ascend-arrow');
var $descendArrow = document.querySelector('#descend-arrow');
var $sortBtn = document.querySelector('.sort-btn');
var $dropDownNum = document.querySelector('#dropdown-number');
var $dropDownName = document.querySelector('#dropdown-name');
var $sortOverlay = document.querySelector('.sort-overlay');
var $sortClose = document.querySelector('#sort-close');
$navSort.addEventListener('click', clickSort);
$sortToggleBox.addEventListener('click', clickSortToggle);
$dropDownNum.addEventListener('click', clickDropDownNum);
$dropDownName.addEventListener('click', clickDropDownName);
$sortOverlay.addEventListener('click', clickSortOverlay);
$sortClose.addEventListener('click', closeSort);

// Entry Functionality

function clickEntry(event) {
  event.stopPropagation();
  data.entryView = data.compendium[event.target.closest('.entry-container').getAttribute('dataid') - 1];
  openDetail();
}

function clickDetailOverlay(event) {
  if (event.target.className !== 'detail-overlay') {
    return;
  }
  event.stopPropagation();
  closeDetail();
}

function openDetail() {
  $detailOverlay.classList.remove('hidden');
  $detailRow.appendChild(renderDetail(data.entryView));
  renderDetailLocations(data.entryView);
  renderDetailAttributes(data.entryView, ['drops', 'cooking_effect', 'attack', 'defense']);
  var $closeDetail = document.querySelector('.modal-close');
  $closeDetail.addEventListener('click', closeDetail);
}

function closeDetail() {
  data.entryView = null;
  $detailOverlay.classList.add('hidden');
  if ($detailRow.childElementCount !== 0) {
    removeAllChildren($detailRow);
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
  closeSort();
}

function clickSortRow(event) {
  if (event.target.getAttribute('id') !== 'sort-row') {
    return;
  }
  closeSort();
}

function clickDropDownNum(event) {
  if (event.target.tagName !== 'SPAN') {
    return;
  }

  data.numSort = true;
  $sortBtn.innerText = 'Number';
  renderControl();
}

function clickDropDownName(event) {
  if (event.target.tagName !== 'SPAN') {
    return;
  }
  data.numSort = false;
  $sortBtn.innerText = 'Name';
  renderControl();
}

function toggleOrder() {
  if (data.ascendSort) {
    $sortToggle.style.left = '2.8rem';
    highlightArrowUp();
    data.ascendSort = false;
  } else {
    $sortToggle.style.left = '0';
    highlightArrowDown();
    data.ascendSort = true;
  }
  renderControl();
}

function highlightArrowUp() {
  $descendArrow.classList.add('text-gold');
  $descendArrow.classList.remove('text-grey');
  $ascendArrow.classList.remove('text-gold');
  $ascendArrow.classList.add('text-grey');
}

function highlightArrowDown() {
  $ascendArrow.classList.add('text-gold');
  $ascendArrow.classList.remove('text-grey');
  $descendArrow.classList.remove('text-gold');
  $descendArrow.classList.add('text-grey');
}

function toggleSortView() {
  if ($sortOverlay.classList.contains('hidden')) {
    $sortOverlay.classList.remove('hidden');
  } else {
    $sortOverlay.classList.add('hidden');
  }
  $sortRow.addEventListener('click', clickSortRow);
}

function closeSort() {
  $sortOverlay.classList.add('hidden');
}

// Navigation Functionality
function navigationClick(event) {
  if (event.target.className !== 'nav-icon') {
    return;
  }
  data.currentNavIcon.classList.remove('nav-icon-selected');
  data.currentNavIcon = event.target;
  data.currentNavIcon.classList.add('nav-icon-selected');
  renderCategory(event.target.id);
}

function renderCategory(category) {
  data.pageView = category;
  renderControl();
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
    data.currentNavIcon = $navigationIcons[0];
    renderEntries(data.creatures);
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

function renderControl() {
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
              createElement('i', { class: 'fa-solid fa-xmark text-gold modal-close' }, [])
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

// Case Specific Functionality

function titleAttribute(str) {
  switch (str) {
    case 'drops':
      return 'Droppable Items';
    case 'cooking_effect':
      return 'Cooking Effect';
    case 'attack':
      return 'Attack Stat';
    case 'defense':
      return 'Defense Stat';
    default:
      return str;
  }
}
