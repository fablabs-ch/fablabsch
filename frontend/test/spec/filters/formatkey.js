'use strict';

describe('Filter: formatKey', function () {

  // load the filter's module
  beforeEach(module('frontendApp'));

  // initialize a new instance of the filter before each test
  var formatKey;
  beforeEach(inject(function ($filter) {
    formatKey = $filter('formatKey');
  }));

  it('should return the input prefixed with "formatKey filter:"', function () {
    var text = 'angularjs';
    expect(formatKey(text)).toBe('formatKey filter: ' + text);
  });

});
