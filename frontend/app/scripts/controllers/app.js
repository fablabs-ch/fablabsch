'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AppCtrl', function ($mdSidenav, $location) {
    this.toggleSidenav = function(){
        $mdSidenav('left').toggle();
    };
    this.isPath = function(path){
        return $location.path().indexOf(path) > -1;
    };

  });
