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
          var side_nav = (scope.sidebar_shown) ? $('.side-nav').width() : 0;
          element.height(($window.innerHeight - navbarHeight));
          element.width(($window.innerWidth - side_nav));
          if(scope.maps.length > 0){
            angular.forEach(scope.maps, function(map){
              google.maps.event.trigger(map,'resize');
            });
          }

        };
        resize();


        angular.element($window).bind('resize', function(){
          resize();
          scope.$digest();
        });

        scope.$watch('sidebar_shown', function(){
          resize();
        });
      }
    };
  }]);
