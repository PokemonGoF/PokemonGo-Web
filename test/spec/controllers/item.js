'use strict';

describe('Controller: ItemCtrl', function () {

  // load the controller's module
  beforeEach(module('pokemonGoWebViewApp'));

  var ItemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemCtrl = $controller('ItemCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ItemCtrl.awesomeThings.length).toBe(3);
  });
});
