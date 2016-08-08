'use strict';

/**
 * @ngdoc overview
 * @name pokemonGoWebViewApp
 * @description
 * # pokemonGoWebViewApp
 *
 * Main module of the application.
 */
angular
  .module('pokemonGoWebViewApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMap',
    'btford.socket-io'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('mySocket', function (socketFactory) {
    var myIoSocket = io.connect('localhost:4001');

    return socketFactory({
      ioSocket: myIoSocket
    });
  })
  ;
