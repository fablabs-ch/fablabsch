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
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'wu.masonry',
    'linkify',
    'ui-leaflet'
  ])
  .config(function ($routeProvider, API_ENDPOINT, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      API_ENDPOINT + '**']);
    $routeProvider
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsCtrl',
        controllerAs: 'news'
      })
      .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl',
        controllerAs: 'events'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/space/:slug', {
        templateUrl: 'views/space.html',
        controller: 'SpaceCtrl',
        controllerAs: 'space',
        resolve: {
            'space': ['api', '$route', function(api, $route){
                return api.getSpacePromiseBySlug($route.current.params.slug);
            }]
        }
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .when('/machine', {
        templateUrl: 'views/machine.html',
        controller: 'MachineCtrl',
        controllerAs: 'machine'
      })
      .when('/page/:name*', {
         templateUrl: function(urlattr){
          return API_ENDPOINT + 'pages/' + urlattr.name + '.html';
         }
      })
      .otherwise({
        redirectTo: '/news'
      });
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('amazingPaletteName', {
    '50': 'e10707',
    '100': 'e10707',
    '200': 'e10707',
    '300': 'e10707',
    '400': 'e10707',
    '500': 'e10707',
    '600': 'e10707',
    '700': 'e10707',
    '800': 'e10707',
    '900': 'e10707',
    'A100': 'e10707',
    'A200': 'e10707',
    'A400': 'e10707',
    'A700': 'e10707',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName')
    .accentPalette('amazingPaletteName');
});
