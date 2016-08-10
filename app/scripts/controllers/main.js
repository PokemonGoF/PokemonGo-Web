'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('MainCtrl', ['$scope', 'NgMap', '$rootScope', 'EventService', 'BotManager', function ($scope, NgMap, $rootScope, EventService, BotManager) {
    $scope.sidebar_shown = true;
    $scope.bots = BotManager.load(userInfo.users);
    console.log('Accounts loaded: ', $scope.bots);
    $scope.maps = [];
    $scope.$on('mapInitialized', function (event, map) {
      $scope.maps.push(map)
    });







    $scope.map_pokemons = [];
    // $scope.items = [];
    // $scope.pokedex = [];
    //
    // for (var i = 1; i <= 151; i++) {
    //   var entry = {};
    //   entry.pid = toThreeDigits(i);
    //   entry.caught = false;
    //   $scope.pokedex[i] = entry;
    // }
    // $scope.pokemons = [];
    // $scope.eggs = [];
    // $scope.candies = [];
    //
    //
    // $scope.zoom = userInfo.zoom;
    //
    // function toThreeDigits(n) {
    //   var z = z || '0';
    //   var n = n + '';
    //   return n.length >= 3 ? n : new Array(3 - n.length + 1).join(z) + n;
    // }


    $scope.events = [];
    //
    //

    //
    // EventService.emit('remote:send_request', {'name': 'get_player_info', 'account': userInfo.users[0]});
    // EventService.on('get_player_info:' + $scope.active_bot.name, function (data) {
    //   if (!data.result.inventory.inventory_delta) {
    //
    //   }
    //   var inventory = data.result.inventory.inventory_delta.inventory_items;
    //   for (var i = 0; i < inventory.length; i++) {
    //     if (inventory[i].inventory_item_data.hasOwnProperty('pokemon_data')) {
    //       var pokemon = inventory[i].inventory_item_data.pokemon_data;
    //       if (pokemon.hasOwnProperty('is_egg')) {
    //         $scope.eggs.push(pokemon);
    //       } else {
    //         pokemon.pid = toThreeDigits(pokemon.pokemon_id);
    //         pokemon.name = pokemonData[pokemon.pokemon_id];
    //         pokemon.iv = parseFloat((pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina) / 45).toFixed(2);
    //         $scope.pokemons.push(pokemon);
    //       }
    //     } else if (inventory[i].inventory_item_data.hasOwnProperty('candy')) {
    //       $scope.candies.push(inventory[i].inventory_item_data);
    //     } else if (inventory[i].inventory_item_data.hasOwnProperty('pokedex_entry')) {
    //       $scope.pokedex[inventory[i].inventory_item_data.pokedex_entry.pokemon_id].caught = true;
    //       //$scope.pokedex.push( inventory[i].inventory_item_data );
    //     } else if (inventory[i].inventory_item_data.hasOwnProperty('item')) {
    //       $scope.items.push(inventory[i].inventory_item_data);
    //     }
    //   }
    //
    //
    // })

  }]);
