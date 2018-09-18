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
 * @name frontendApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MapCtrl', function ($scope, $location, api) {
    var map = this;

    // TODO: try to use https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet for nicer layout?
    map.map = {
        center: {
            lat: 46.94257184670688,
            lng: 7.9578,
            zoom: 9
        },
        tiles: {
            url: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
            options: {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        events: {
            map: {
                enable: ['popupopen'],
                logic: 'emit'
            }
        }
    };

    api.ready.then(function(){
        map.spaces = api.spaces;
        map.markers = api.spaces.map(function(space){
            return {
                id: space.id,
                lat: space.latitude,
                lng: space.longitude,
                icon: {
                    iconUrl: space.marker,
                    iconSize: [64,64],
                    iconAnchor: [32, 32]
                },
                message: space.slug,

            };
        });
    });

    $scope.$on('leafletDirectiveMap.popupopen', function(event, payload){
        //payload.leafletObject.closePopup();
        $location.path('/space/' + payload.leafletEvent.popup.getContent());
    });

  });
