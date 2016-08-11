'use strict';

describe('Controller: PokedexCtrl', function () {

  // load the controller's module
  beforeEach(module('pokemonGoWebViewApp'));

  var PokedexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PokedexCtrl = $controller('PokedexCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PokedexCtrl.awesomeThings.length).toBe(3);
  });
});
