'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:PokemonCtrl
 * @description
 * # PokemonCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('PokebagCtrl',['$scope', '$uibModalInstance', 'selectedBot', function ($scope, $uibModalInstance, selectedBot) {
    console.log(selectedBot);
    $scope.selected_bot = selectedBot;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }]);