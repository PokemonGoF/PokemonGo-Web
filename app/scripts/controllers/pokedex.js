'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:PokedexCtrl
 * @description
 * # PokedexCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('PokedexCtrl',['$scope', '$uibModalInstance', 'selectedBot', 'ToolService', function ($scope, $uibModalInstance, selectedBot, ToolService) {
    $scope.selected_bot = selectedBot;


    $scope.num_caught = 0;
    angular.forEach(selectedBot.pokedex, function(pokemon){
      if(pokemon.caught){
        $scope.num_caught++;
      }
    });

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.toThreeDigits = function(int){
      return ToolService.toThreeDigits(int);
    };

    $scope.pokemonById = function(int){
      return ToolService.pokemonById(int);
    }
  }]);
