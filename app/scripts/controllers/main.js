'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('MainCtrl', ['$scope', 'NgMap', '$rootScope', function ($scope, NgMap, $rootScope) {
    $scope.sidebar_shown = true;
    $scope.maps = [];

    $scope.active_bot = null;
    $scope.events = [];
    $scope.bots = [];

    $scope.$on('mapInitialized', function(event, map) {
      $scope.maps.push(map)
    })

  }]);
