'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('ItemCtrl', ['$scope', '$uibModalInstance', 'selectedBot', function ($scope, $uibModalInstance, selectedBot) {
    $scope.selected_bot = selectedBot;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }]);
