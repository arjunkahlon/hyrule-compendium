getCreatures();
getMonsters();
getMaterials();
getEquipment();
getTreasure();

var $entryRow = document.querySelector('#entry-row');

var $navigationIcons = document.querySelectorAll('.nav-icon');
addEventList($navigationIcons, 'click', navigationClick);

// General Event Functionality
function addEventList(list, event, fnct) {
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener(event, fnct);
  }
}

// Event Handler Functionality
function navigationClick(event) {
  if (event.target.className !== 'nav-icon') {
    return;
  }
  renderSwap(event.target.id);
}

// API Functionality

function getCreatures() {
  var creatureRequest = new XMLHttpRequest();
  creatureRequest.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/creatures');
  creatureRequest.responseType = 'json';
  creatureRequest.addEventListener('load', function () {
    for (let i = 0; i < creatureRequest.response.data.food.length; i++) {
      data.creatures.push(creatureRequest.response.data.food[i]);
      data.compendium.push(creatureRequest.response.data.food[i]);
    }
    for (let i = 0; i < creatureRequest.response.data.non_food.length; i++) {
      data.creatures.push(creatureRequest.response.data.non_food[i]);
      data.creaturesAlph.push(creatureRequest.response.data.non_food[i]);
      data.compendium.push(creatureRequest.response.data.non_food[i]);

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
      return a.name.localeCompare(b.name);
    });

    // Render creatures entries on page load by defualt
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
    }
    data.monsters.sort(function (a, b) {
      return a.id - b.id;
    });

    data.monstersAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
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
    }
    data.materials.sort(function (a, b) {
      return a.id - b.id;
    });

    data.materialsAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
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
    }
    data.equipment.sort(function (a, b) {
      return a.id - b.id;
    });

    data.equipmentAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
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
    }
    data.treasure.sort(function (a, b) {
      return a.id - b.id;
    });

    data.treasureAlph.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    data.compendium.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  });

  treasureRequest.send();
}

// Dom Functionality

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
    createElement('div', { class: 'col-full col-sm-half col-md-third col-lg-fourth', id: 'entry-container' }, [
      createElement('div', { class: 'entry-wrapper' }, [
        createElement('div', { class: 'row' }, [
          createElement('div', { class: 'col-img' }, [
            createElement('div', { class: 'col-img-wrapper' }, [
              createElement('img', { src: obj.image }, [])
            ])
          ]),
          createElement('div', { class: 'col-name' }, [
            createElement('div', { class: 'col-name-wrapper' }, [
              createElement('h3', { class: 'text-gold' }, [obj.name]),
              createElement('p', { class: 'text-blue' }, [obj.id])
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

// General Dom Functionality

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Navigation Functionality

function renderSwap(category) {
  data.pageView = category;
  renderEntries(data[category]);
}
