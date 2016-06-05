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
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EventsCtrl', function ($scope, $http, api, API_ENDPOINT) {
    var events = this;
    events.mode = 1;
    events.events = [];

   // TODO: refactor? similar code as in news...
   $scope.$watch('events.mode', function(){
      events.next = API_ENDPOINT + 'api/events?direction=' + events.mode + '&limit=10&offset=0';
      events.events = [];
      events.loadMore();
   });

    // Change query fetching base on mode 0 now -> past, 1 now -> future

    function transform(events){
      for(var i=0; i < events.length; i++){
        var e = events[i];
      e.startdate = new Date(e.startdate);
      e.enddate = new Date(e.enddate);
      e.modified = new Date(e.modified);
      //startdate
      e.hasStartDateTime = !(e.startdate.getHours() === 0 && e.startdate.getMinutes() === 0);

      //enddate
      // if not same date hasEndDateDifferent
      e.hasEndDateDifferent = !(e.enddate.getDate() === e.startdate.getDate() &&
                                e.enddate.getMonth() === e.startdate.getMonth() &&
                                e.enddate.getYear() === e.startdate.getYear());
      e.hasEndDateTime = !(e.enddate.getHours() === 0 && e.enddate.getMinutes() === 0);

      //grab first link
      if (e.description){
        var match = e.description.match( /(?:https?\:\/\/|www\.)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?/i);
        if (match) {
          e.link = match[0];
        }
      }


        var tags = e.description.match(/#[a-z]+/gi) || [];
        e.tags = [];
        tags.forEach(function(tag) {
          if (e.tags.indexOf(tag) === -1) {
            e.tags.push(tag);
          }
        });
        e.tags.sort();
      }
      return events;

    }

     events.loadMore = function(){
          events.disabled = true;
        if(events.next){
            $http.get(events.next)
            .then(function(results){
                var newEvents = transform(results.data.results);
                events.events = events.events.concat(newEvents);
                events.next = results.data.next;
                events.disabled = false;
            });
        }
      };

      events.inFilter = function(e){
          return api.inFilterSpace(e.space);
      };


         function scrollHandler() {
          if (!events.disabled && $('.main').scrollTop() + $('.main').height()>$('.news').height() -200) {
              events.loadMore();
          }
      }

      $scope.$on('$destroy', function() {
          $('.main').unbind('scroll', scrollHandler);
      });

      $('.main').scroll(scrollHandler);


  });
