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
    'uiGmapgoogle-maps',
    'wu.masonry'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsCtrl',
        controllerAs: 'news'
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
      .otherwise({
        redirectTo: '/news'
      });
  })
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
    });
  })