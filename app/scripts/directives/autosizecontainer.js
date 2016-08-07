'use strict';

/**
 * @ngdoc directive
 * @name pokemonGoWebViewApp.directive:autoSizeContainer
 * @description
 * # autoSizeContainer
 */
angular.module('pokemonGoWebViewApp')
  .directive('autoSizeContainer',['$window', function ($window) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var resize = function(){
          var navbarHeight = $('.navbar-collapse').height();
          element.height(($window.innerHeight - navbarHeight))
        };
        resize();

        angular.element($window).bind('resize', function(){
          resize();
          scope.$digest();
        });

      }
    };
  }]);
