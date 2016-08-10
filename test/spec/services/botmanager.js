'use strict';

describe('Service: BotManager', function () {

  // load the service's module
  beforeEach(module('pokemonGoWebViewApp'));

  // instantiate service
  var BotManager;
  beforeEach(inject(function (_BotManager_) {
    BotManager = _BotManager_;
  }));

  it('should do something', function () {
    expect(!!BotManager).toBe(true);
  });

});
