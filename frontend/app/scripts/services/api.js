'use strict';

/**
 * @ngdoc service
 * @name frontendApp.api
 * @description
 * # api
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('api', function ($http, $q) {
      var api = this;
      var API_ENDPOINT='/';
      var ready = $q.defer();
      api.ready = ready.promise;

      $http.get(API_ENDPOINT + 'api/spaces')
      .then(function(result){
          api.spaces = result.data;
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

  });
