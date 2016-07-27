class Player {
  constructor(name) {
    this.name = name;
    this.bagCandy = {};
    this.bagItems = {};
    this.bagPokemon = {};
    this.pokedex = {};
    this.stats = {};
    this.trainerPath = undefined;
  }
 
  updateInventory(data) {
    function filterInventory(arr, search) {
      var filtered = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].inventory_item_data[search] != undefined) {
          filtered.push(arr[i]);
        }
      }
      return filtered;
    }

    this.bagCandy = filterInventory(data, 'pokemon_family');
    this.bagItems = filterInventory(data, 'item');
    this.bagPokemon = filterInventory(data, 'pokemon_data');
    this.pokedex = filterInventory(data, 'pokedex_entry');
    this.stats = filterInventory(data, 'player_stats');
  } 
}
