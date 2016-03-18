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
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('NewsCtrl', function ($scope, $http, API_ENDPOINT) {
      var news = this;
      news.posts = [];
      news.next = API_ENDPOINT + 'api/posts?limit=10&offset=0';
      news.disabled = true;

      news.loadMore = function(){
          console.log(news.next);
          news.disabled = true;
        if(news.next){
            $http.get(news.next)
            .then(function(results){
                news.posts = news.posts.concat(results.data.results);
                news.next = results.data.next;
                news.disabled = false;
            });
        }
      };
      news.loadMore();


      this.format = function (message) {
          var n = message.split('\n\n');
          if (n.length === 1) {
              return message;
          } else {
              return n.slice(1).join('<br/>');
          }
      };

      function scrollHandler() {
          if (!news.disabled && $('.main').scrollTop() + $('.main').height()>$('.news').height() -200) {
              news.loadMore();
          }
      }

      $scope.$on('$destroy', function() {
          $('.main').unbind('scroll', scrollHandler);
      });

      $('.main').scroll(scrollHandler);


  });
