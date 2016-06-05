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

(function () {
    /* @ngInject */
    function SpacefilterCtrl (api) {
        var $ctrl = this;
        $ctrl.api = api;
        api.ready.then(function(){
            $ctrl.spaces = api.spaces.slice(0).reverse();
        });
    }

    angular.module('frontendApp')
    .component('spaceFilter', {
        templateUrl: 'views/space_filter.html',
        controller: SpacefilterCtrl,
    });
})();
