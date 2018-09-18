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
 * @name frontendApp.controller:SpaceCtrl
 * @description
 * # SpaceCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SpaceCtrl', function (space, $timeout) {

    angular.extend(this, space);

    this.map = {
        center: {
            lat: space.latitude,
            lng: space.longitude,
            zoom: 9
        },
        tiles: {
            url: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
            options: {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        markers: {
            "space": {
                id: space.id,
                lat: space.latitude,
                lng: space.longitude,
                icon: {
                    iconUrl: space.marker,
                    iconSize: [64,64],
                    iconAnchor: [32, 32]
                }
            }
        }
    };
    // fix marker bug if coming from map
    var ctrl = this;
    $timeout(function(){
        ctrl.showMap = true;
    }, 100)
  });
