'use strict';

/**
 * @ngdoc directive
 * @name pokemonGoWebViewApp.directive:fallbackSrc
 * @description
 * # fallbackSrc
 */
angular.module('pokemonGoWebViewApp')
  .directive('fallbackSrc', function () {
    var fallbackSrc = {
      link: function postLink(scope, iElement, iAttrs) {
        iElement.bind('error', function() {
          angular.element(this).attr("src", iAttrs.fallbackSrc);
        });
      }
    };
    return fallbackSrc;
  });
