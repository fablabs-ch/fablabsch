'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('NewsCtrl', function ($http) {
      var news = this;
      news.posts = [];
      news.next = '/api/posts?limit=10&offset=0';
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

      $('.main').scroll(function() {
          console.log($('.main').scrollTop() + $('.main').height(), $('.news').height() - 400)
          if (!news.disabled && $('.main').scrollTop() + $('.main').height()>$('.news').height() -200) {
              news.loadMore();
          }
        });
  });
