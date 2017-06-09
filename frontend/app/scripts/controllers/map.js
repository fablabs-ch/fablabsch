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
  .controller('MapCtrl', function ($http, $location, $timeout, api) {
    var map = this;

    map.acceptClicks = false;
    function expand() {
        $timeout(function(){
            if(!map.control || !map.control.getManager) {
                return;
            }
            map.acceptClicks = false;
            var oms = map.control.getManager().markerSpiderfier;
            oms.unspiderfy();
            var markers = oms.markersNearAnyOtherMarker();
            markers.forEach(function (marker) {
                google.maps.event.trigger(marker, 'click');
            });
            map.acceptClicks = true;
        }, 400);
    }

    $http.get('styles/gmap.style.json').then(function(result){
        map.map = {
        center: {
            latitude: 46.84257184670688,
            longitude: 7.5476379394531445
        },
        zoom: 9,
        options: {
            styles: result.data,
            disableDefaultUI: true,
        },
        events: {
            zoom_changed: expand,
            tilesloaded: expand
        }};
    });

    map.typeOptions =  {
        keepSpiderfied: true,
        nearbyDistance: 40,
        circleSpiralSwitchover: 0,
        circleFootSeparation: 60,
        spiralFootSeparation: 60,
        spiralLengthFactor: 50,
        legWeight: 1.5
    };

    map.control = {};

    api.ready.then(function(){
        map.spaces = api.spaces;
        map.markers = api.spaces.map(function(space){
            return {
                id: space.id,
                coords: {
                    latitude: space.latitude,
                    longitude: space.longitude
                },
                options: {
                    icon: {
                        url: space.marker,
                        scaledSize : {width: 64, height: 64},
                        anchor: {x: 32, y: 32}
                    },
                    title: space.name,
                    slug: space.slug
                }
            };
        });
        expand();
    });

    map.typeEvents = {
        click: function(marker, type, obj){
            if( map.acceptClicks === true) {
                $location.path('/space/' + obj.options.slug);
            }
        }
    };

  });
