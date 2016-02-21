'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SpaceCtrl
 * @description
 * # SpaceCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SpaceCtrl', function (space) {

     angular.extend(this, space);

     this.map = {
        center: {
            latitude: space.latitude,
            longitude: space.longitude
        },
        zoom: 9,
        options: {
            disableDefaultUI: true
        } };

     this.marker = {
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
        }
    };
  });
