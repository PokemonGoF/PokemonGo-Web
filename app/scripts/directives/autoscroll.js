'use strict';

/**
 * @ngdoc directive
 * @name pokemonGoWebViewApp.directive:autoScroll
 * @description
 * # autoScroll
 * @TODO Make this pretty plox =D
 *
 */
angular.module('pokemonGoWebViewApp')
  .directive('autoScroll', function () {
    return {
      restrict: 'A',
      scope: {
        autoScroll: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('autoScroll', function () {
          for (var i = 0; i < $('.console .output').length; i++) {
            $('.console .output')[i].scrollTop = $('.console .output')[i].scrollHeight;
          }
        });
      }
    };
  });
