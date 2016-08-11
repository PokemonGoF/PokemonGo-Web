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
      link: function postLink(scope, element, attrs) {
          window.setInterval(function() {
              for(var i = 0; i < $('.console .output').length; i++){
                  $('.console .output')[i].scrollTop = $('.console .output')[i].scrollHeight;
              }
          }, 1000);
      }
    };
  });
