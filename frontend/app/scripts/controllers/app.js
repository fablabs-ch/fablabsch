/*
    FabLabs-CH a community web site for swiss fablabs
    Copyright (C) 2016  Boris Fritscher

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
