/* exported data */
const data = {
  pageView: 'creatures',
  searchView: false,
  currentNavIcon: null,
  numSort: true,
  ascendSort: true,
  entryView: null,
  favorites: [],
  compendium: [],
  creatures: [],
  monsters: [],
  materials: [],
  equipment: [],
  treasure: [],
  compendiumAlph: [],
  creaturesAlph: [],
  monstersAlph: [],
  materialsAlph: [],
  equipmentAlph: [],
  treasureAlph: [],
  searchResults: [],
  searchStr: ''
};

const previousFavorites = localStorage.getItem('hyrule-local-storage');
if (previousFavorites != null) {
  data.favorites = JSON.parse(previousFavorites);
}

window.addEventListener('beforeunload', storeFavorites);

function storeFavorites() {
  const saveFavorites = JSON.stringify(data.favorites);
  localStorage.setItem('hyrule-local-storage', saveFavorites);
}
