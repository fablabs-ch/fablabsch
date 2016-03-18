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
  .controller('MapCtrl', function ($http, $location, api) {
    var map = this;
    $http.get('styles/gmap.style.json').then(function(result){
        map.map = {
        center: {
            latitude: 46.84257184670688,
            longitude: 7.5476379394531445
        },
        zoom: 9,
        options: {
            styles: result.data,
            disableDefaultUI: true
        } };
    });

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
                        scaledSize : {width: 64, height: 64}
                    },
                    title: space.name
                },
                events:{
                    click: function(){
                        $location.path('/space/' + space.slug);
                    }
                }
            };
        });
    });

  });
