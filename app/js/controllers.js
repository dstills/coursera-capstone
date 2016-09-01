'use strict';

angular.module('mapItApp')

  .controller('IndexController', ['$scope', function($scope) {
    console.log('IndexController');
  }])

  .controller('NavController', ['$scope', function($scope) {
    console.log('NavController');
    $scope.isCollapsed = true;
  }])

  .controller('AboutController', ['$scope', function($scope) {
    console.log('AboutController');
  }])

  .controller('ContactController', ['$scope', function($scope) {
    console.log('ContactController');
  }])

  .controller('InfoController', ['$scope', function($scope) {
    console.log('InfoController');
  }])

  .controller('TableController', ['$scope', function($scope) {
    console.log('TableController');
  }])

  // MapController
  .controller('MapController', ['$scope', 'esriLoader', 'geoService', 'viewOptions', function($scope, esriLoader, geoService, viewOptions) {
    console.log('MapController', viewOptions);
    this.viewOptions = viewOptions.value;

    this.onViewCreated = function(view) {
      console.log(view);
      view.ui.move('zoom', 'top-right');
      view.ui.move('compass', 'top-right');
    };

    esriLoader.require(['esri/Map'], function(Map) {
      this.map = new Map({
        basemap:'topo',
        ground: 'world-elevation'
      });
    }.bind(this));
  }])

  .controller('SidebarController', ['$scope', function($scope) {
    console.log('SidebarController');
  }])

;