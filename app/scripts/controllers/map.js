'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the pokemonGoWebViewApp@dou
 */
angular.module('pokemonGoWebViewApp')
  .controller('MapCtrl', ['$scope', 'NgMap', '$rootScope', 'EventService', 'BotManager', 'ToolService', function ($scope, NgMap, $rootScope, EventService, BotManager, ToolService) {

    $scope.map_center = null;
    var update_location = function (data) {
      $scope.bots[data.account].location_history.push(data.data.current_position);
      $scope.bots[data.account].position= data.data.current_position;
      if(!$scope.map_center){
        $scope.map_center = data.data.current_position
      }
    };


    var removePokemonFromMap = function (data) {
      angular.forEach($scope.map_pokemons, function (map_pokemon) {
        if (map_pokemon.encounter_id == data.data.encounter_id) {
          var idx = $scope.map_pokemons.indexOf(map_pokemon);
          $scope.map_pokemons = $scope.map_pokemons.splice(idx, 0)
        }
      })
    };

    angular.forEach(BotManager.getBots(), function (bot) {
      EventService.on('pokemon_appeared:' + bot.name, function (data) {
        var pokemon = data.data;
        pokemon.id = ToolService.toThreeDigits(pokemon.pokemon_id);
        pokemon.position = data.data.latitude + ", " + data.data.longitude;
        $scope.map_pokemons.push(pokemon);
      });



      EventService.on('pokemon_caught:' + bot.name, removePokemonFromMap);
      EventService.on('pokemon_vanished:' + bot.name, removePokemonFromMap);


      EventService.on('moving_to_fort:' + bot.name, update_location);
      EventService.on('moving_to_lured_fort:' + bot.name, update_location);
      EventService.on('position_update:' + bot.name, update_location);
    })

  }]);
