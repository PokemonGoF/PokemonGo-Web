'use strict';

/**
 * @ngdoc directive
 * @name pokemonGoWebViewApp.directive:consoleOutput
 * @description
 * # consoleOutput
 */
angular.module('pokemonGoWebViewApp')
  .directive('consoleOutput',[function () {
    return {
      templateUrl: 'views/directives/consoleoutput.html',
      restrict: 'A',
      link: function(scope, element){
          $(element).draggable().resizable();
      },
      controller: function ($scope, BotManager, EventService) {
          $scope.buffer = {};
          $scope.bots = BotManager.getBots();
          EventService.on("*",function(event,data) {
              // console.log('Socket IO Event: ', event);
              // console.log('Socket IO data: ', data);
              if(data.hasOwnProperty('data') && data.data.hasOwnProperty('msg')) {
                  if (!$scope.buffer[data.account]) {
                      $scope.buffer[data.account] = [];
                  }
                  event = event.split(':')[0];
                  $scope.buffer[data.account].push({
                      msg: data.data.msg,
                      time: new Date(),
                      event: event
                  });
                  $scope.buffer[data.account] = $scope.buffer[data.account].slice(Math.max($scope.buffer.length - 100, 1));
              }
          });
      }
    };
  }]);
