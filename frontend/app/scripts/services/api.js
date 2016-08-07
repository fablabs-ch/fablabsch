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
 * @ngdoc service
 * @name frontendApp.api
 * @description
 * # api
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('api', function ($http, $q, API_ENDPOINT) {
      var FILTER_SPACE_KEY = 'filter_space';
      var api = this;
      var ready = $q.defer();
      api.ready = ready.promise;

      $http.get(API_ENDPOINT + 'api/spaces')
      .then(function(result){
          api.spaces = result.data;
          var rawFilter = localStorage.getItem(FILTER_SPACE_KEY);
          if (rawFilter) {
              api.filterSpace = JSON.parse(rawFilter);
          } else {
              api.filterSpace = {};
          }
          var existingSpaces = [];
          api.spaces.forEach(function (s) {
              existingSpaces.push(s.slug);
              if (api.filterSpace.hasOwnProperty(s.slug)) {
                  s.visible = api.isSpaceVisible(s);
              } else {
                  // by default display new spaces
                  s.visible = true;
                  api.filterSpace[s.slug] = true;
                  api.saveFilter();
              }

          });
          Object.keys(api.filterSpace).forEach(function(key){
              if (existingSpaces.indexOf(key) < 0) {
                  delete api.filterSpace[key];
                  api.saveFilter();
              }
          });
          ready.resolve();
      });

      api.getSpacePromiseBySlug = function(slug){
          var d = $q.defer();
          api.ready.then(function(){
              for(var i=0;  i < api.spaces.length; i++){
                  if(api.spaces[i].slug === slug){
                      d.resolve(api.spaces[i]);
                      return;
                  }
              }
              d.reject('NOT_FOUND');
          });
          return d.promise;
      };

      api.isSpaceVisible = function (space) {
         return api.filterSpace && api.filterSpace.hasOwnProperty(space.slug) && api.filterSpace[space.slug];
      };

      api.allSpaceVisible = function () {
          return Object.keys(api.filterSpace).every(function(key){
              return api.filterSpace[key];
          });
      };

      api.noSpaceVisible = function () {
          return Object.keys(api.filterSpace).every(function(key){
              return !api.filterSpace[key];
          });
      };

      api.toggleSpaceFilterAll = function (visible) {
           api.spaces.forEach(function(space) {
               space.visible = visible;
               api.filterSpace[space.slug] = visible;
           });
           api.saveFilter();
      };

      api.toggleSpaceFilter = function (space) {
        var visible = api.isSpaceVisible(space);
        if (api.allSpaceVisible()) {
            api.toggleSpaceFilterAll(false);
            visible = !visible;
        }
        api.filterSpace[space.slug] = !visible;
        space.visible = !visible;
        if (api.noSpaceVisible()) {
            api.toggleSpaceFilterAll(true);
        }
	    api.saveFilter();
      };

      api.saveFilter = function () {
          localStorage.setItem(FILTER_SPACE_KEY, JSON.stringify(api.filterSpace));
      };


  });
