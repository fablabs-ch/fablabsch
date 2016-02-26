'use strict';

/**
 * @ngdoc filter
 * @name frontendApp.filter:formatKey
 * @function
 * @description
 * # formatKey
 * Filter in the frontendApp.
 */
angular.module('frontendApp')
  .filter('formatKey', function () {
    return function (input) {
      return input.charAt(0).toUpperCase() + input.slice(1).replace('_', ' ');
    };
  });
