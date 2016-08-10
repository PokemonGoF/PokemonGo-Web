'use strict';

describe('Controller: MapCtrl', function () {

  // load the controller's module
  beforeEach(module('pokemonGoWebViewApp'));

  var MapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapCtrl = $controller('MapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MapCtrl.awesomeThings.length).toBe(3);
  });
});
