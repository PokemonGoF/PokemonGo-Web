'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('MenuCtrl', ['$scope', 'NgMap', '$rootScope', 'EventService', 'BotManager', function ($scope, NgMap, $rootScope, EventService, BotManager) {
    $scope.bots = BotManager.getBots()
  }]);
