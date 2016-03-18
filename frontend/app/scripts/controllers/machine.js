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
 * @name frontendApp.controller:MachineCtrl
 * @description
 * # MachineCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MachineCtrl', function (api) {
      var machine = this;
      machine.categories = [{name:'3D Printing', type:'3d_printing'},{name:'Laser', type:'laser'},{name:'Vinyl Cutting', type:'vinyl_cutting'},{name:'CNC Miling', type:'cnc_miling'}];

      var machines = {};

      function getMachine(machine){
          if(!machines.hasOwnProperty(machine.type)){
              machines[machine.type] = [];
          }
          for(var i=0; i < machines[machine.type].length; i++){
              if(machines[machine.type][i].id === machine.id) {
                  return machines[machine.type][i];
              }
          }
          machine.spaces = [];
          machines[machine.type].push(machine);
          return machine;
      }

      function addSpace(machine, space) {
          for(var i=0; i < machine.spaces.length; i++){
              if(machine.spaces[i] === space.id){
                  return;
              }
          }
          machine.spaces.push(space);
      }

      machine.collectAttribute = function(attrib, list){
          return list
          .filter(function(item){
              return item.custom_data && item.custom_data.hasOwnProperty(attrib);
          })
          .map(function(item){
              return item.custom_data[attrib];
          });
      };

      api.ready.then(function(){
          machine.spaces = api.spaces.map(function(space){
              space.machines = {};
              space.resources.forEach(function(rs){
                  if(!space.machines.hasOwnProperty(rs.resource.type)){
                      space.machines[rs.resource.type] = [];
                  }
                  var m = getMachine(rs.resource);
                  addSpace(m, space);
                  space.machines[rs.resource.type].push(rs);
              });

              return space;
          });
          machine.machines = machines;
    });
  });
