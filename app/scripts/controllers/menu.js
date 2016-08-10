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
    $scope.bots = BotManager.getBots();

    $scope.followBot = function(bot){
      $rootScope.$emit('follow_bot_on_map', bot)
    };


    $scope.findBot = function(bot){
      $rootScope.$emit('find_bot_on_map', bot)
    };

  }]);
