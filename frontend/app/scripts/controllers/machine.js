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
