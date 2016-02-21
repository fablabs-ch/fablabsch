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
                        url: space.logo,
                        scaledSize : {width: 64, height: 64}
                    },
                    title: space.name
                },
                events:{
                    click: function(){
                        //TODO use slugs?
                        $location.path('/space/' + space.slug);
                    }
                }
            };
        });
    });

  });
