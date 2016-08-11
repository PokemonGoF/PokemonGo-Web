'use strict';

/**
 * @ngdoc service
 * @name pokemonGoWebViewApp.BotManager
 * @description
 * # BotManager
 * Service in the pokemonGoWebViewApp.
 */
angular.module('pokemonGoWebViewApp')
  .service('BotManager', ['EventService', 'ToolService', '$interval', function (EventService, ToolService, $interval) {

    function genColor(str) { // java String#hashCode
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var c = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

      return '#' + '00000'.substring(0, 6 - c.length) + c;
    }

    var pokemonData = ToolService.pokemonData();

    var get_player_info_callback = function (data) {
      var bot = data.account;
      var player = data.result.player.player_data;
      var inventory = data.result.inventory.inventory_delta.inventory_items;
      _bots[bot].candies = [];
      _bots[bot].pokedex = [];
      _bots[bot].inventory = [];
      initialize_pokedex(bot);
      _bots[bot].eggs = [];
      _bots[bot].pokemons = [];

      angular.forEach(inventory, function(inventory_item){
        inventory_item = inventory_item.inventory_item_data;
        if (inventory_item.hasOwnProperty('pokemon_data')) {
          var pokemon = inventory_item.pokemon_data;
          if (pokemon.hasOwnProperty('is_egg')) {
            _bots[bot].eggs.push(pokemon);
          } else {
            pokemon.pid = ToolService.toThreeDigits(pokemon.pokemon_id);
            pokemon.name = pokemonData[pokemon.pokemon_id];
            pokemon.iv = parseFloat((pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina) / 45).toFixed(2);
            _bots[bot].pokemons.push(pokemon);
          }
        } else if (inventory_item.hasOwnProperty('candy')) {
          _bots[bot].candies.push(inventory_item.candy);
        } else if (inventory_item.hasOwnProperty('pokedex_entry')) {
          _bots[bot].pokedex[inventory_item.pokedex_entry.pokemon_id].caught = true;
          //$scope.pokedex.push( inventory[i].inventory_item_data );
        } else if (inventory_item.hasOwnProperty('item')) {
          inventory_item.item.name = ToolService.getItemById(inventory_item.item.item_id);
          _bots[bot].inventory.push(inventory_item.item);
        } else if(inventory_item.hasOwnProperty('player_stats')){
          _bots[bot].player_stats = inventory_item.player_stats
        } else if(inventory_item.hasOwnProperty('egg_incubators')){
          _bots[bot].egg_incubators = inventory_item.egg_incubators
        }
      });

      delete player.username;
      _bots[bot] = angular.merge(_bots[bot], player);
      //console.log(_bots)
    };

    var initialize_pokedex = function (botName) {
      angular.forEach(pokemonData, function (pokemon, pId) {
        _bots[botName].pokedex[pId] = {
          caught: false
        }
      });
    };

    var bot_template = {
      name: '',
      position: null,
      location_history: [],
      shown_on_map: true,
      inventory: [],
      egg_incubators: [],
      pokedex: [],
      eggs: [],
      candies: [],
      pokemons: [],
      player_stats: {},
      follow_on_map: false

    };
    var get_player_info = function(bot_name){
      EventService.emit('remote:send_request', {'name': 'get_player_info', 'account': bot_name});
    };

    var _bots = {};
    return {
      load: function (bots) {
        angular.forEach(bots, function (bot_name) {
          var bot_color = genColor(bot_name);
          var bot = angular.copy(bot_template);
          bot.name = bot_name;
          bot.color = bot_color;
          _bots[bot_name] = bot;
          initialize_pokedex(bot_name);
          EventService.on('get_player_info:' + bot_name, get_player_info_callback);
          get_player_info(bot_name);
          $interval(function(){
            get_player_info(bot_name)
          }, 5000)
        });
        return _bots
      },
      getBots: function () {
        return _bots;
      }
    }
  }]);
