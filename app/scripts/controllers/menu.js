'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('MenuCtrl', ['$scope', 'NgMap', '$rootScope', 'EventService', 'BotManager', '$uibModal', 'ToolService', function ($scope, NgMap, $rootScope, EventService, BotManager, $uibModal, ToolService) {
    $scope.bots = BotManager.getBots();

    $scope.popup = function (bot, type) {
      var ctrl = type+'Ctrl'
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/modals/' + type +'.html',
        controller: ctrl,
        size: 'lg',
        resolve: {
          selectedBot: function () {
            return bot
          }
        }
      });
    };

    $scope.getLevelPercent = function(level, exp){
      if(!level || ! exp){
        return 0
      }
      return ToolService.getLevelPercent(level, exp);
    };

    $scope.followBot = function(bot){
      $rootScope.$emit('follow_bot_on_map', bot)
    };


    $scope.findBot = function(bot){
      $rootScope.$emit('find_bot_on_map', bot)
    };

  }]);
