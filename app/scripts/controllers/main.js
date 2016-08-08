'use strict';

/**
 * @ngdoc function
 * @name pokemonGoWebViewApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pokemonGoWebViewApp
 */
angular.module('pokemonGoWebViewApp')
  .controller('MainCtrl', ['$scope', 'NgMap', '$rootScope', 'socketFactory', 'mySocket', function ($scope, NgMap, $rootScope, socketFactory, mySocket) {
    $scope.sidebar_shown = true;
    $scope.maps = [];
    $scope.$on('mapInitialized', function(event, map) {
      $scope.maps.push(map)
    });

    $scope.pokestops = [];

    mySocket.on('spun_pokestop:anon@gmail.com', function (data) {
      $scope.pokestops.push(data.pokestop);
    });

    $scope.pokemons = [];

    mySocket.on('pokemon_caught:anon@gmail.com', function (data) {
      var pokemon = {name: data.pokemon, desc: data.iv_display};
      $scope.pokemons.push(pokemon);
    });
  }]);
