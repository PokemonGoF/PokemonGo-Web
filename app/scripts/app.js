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
    'ngMap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/map.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
