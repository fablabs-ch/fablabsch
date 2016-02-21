'use strict';

describe('Controller: SpaceCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var SpaceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpaceCtrl = $controller('SpaceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SpaceCtrl.awesomeThings.length).toBe(3);
  });
});
