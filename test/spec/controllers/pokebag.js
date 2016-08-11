'use strict';

describe('Controller: PokemonCtrl', function () {

  // load the controller's module
  beforeEach(module('pokemonGoWebViewApp'));

  var PokemonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PokemonCtrl = $controller('PokebagCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PokemonCtrl.awesomeThings.length).toBe(3);
  });
});
