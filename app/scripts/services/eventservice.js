'use strict';

/**
 * @ngdoc service
 * @name pokemonGoWebViewApp.EventService
 * @description
 * # EventService
 * Service in the pokemonGoWebViewApp.
 */
angular.module('pokemonGoWebViewApp')
  .service('EventService',['$rootScope', function ($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var socket = io.connect(userInfo.websocketUrl || 'http://' + document.domain + ':4000');

    var onevent = socket.onevent;
    socket.onevent = function (packet) {
      var args = packet.data || [];
      onevent.call (this, packet);    // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);      // additional call to catch-all
    };
/*
    socket.on("*",function(event,data) {
      console.log('Socket IO Event: ', event);
      console.log('Socket IO data: ', data);
    });*/

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }]);
