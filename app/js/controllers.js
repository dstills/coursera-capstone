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
  .controller('MapController', ['$scope', 'esriLoader', 'geoService', 'viewOptions', '$q', function($scope, esriLoader, geoService, viewOptions, $q) {
    console.log('MapController');
    $scope.editButtonModel = '';
    this.viewOptions = viewOptions.value;

    this.onViewCreated = function(view) {
      console.log(view);
      view.ui.move('zoom', 'top-right');
      view.ui.move('compass', 'top-right');
      this.view = view;
    };

    esriLoader.require([
        'esri/Map', 'dojo/_base/array', 'esri/layers/FeatureLayer', 'esri/layers/GraphicsLayer', 'esri/geometry/SpatialReference'
      ], function(Map, array, FeatureLayer, GraphicsLayer, SpatialReference) {
      var map = new Map({
        basemap:'topo',
        ground: 'world-elevation'
      });
      // geoService.getFeatures().query().$promise.then(function(features) {
      //   var graphics = array.map(features, function(feature) {
      //     return Terraformer.ArcGIS.convert(feature);
      //   });
      //   console.log(graphics);
      //   map.add(new GraphicsLayer({
      //     graphics: graphics
      //   }));
      // }.bind(this));
    }.bind(this));



  }])

  .controller('SidebarController', ['$scope', function($scope) {
    console.log('SidebarController');
    var idCount = 0;
    $scope.isOpen = false;
    $scope.panels = [{
      title: 'First',
      text: 'This is the first panel',
      widgetName: 'measure'
    }, {
      title: 'Second',
      text: 'This is the second panel',
      widgetName: 'name'
    }];
    $scope.panels.map(function(panel) {
      panel.id = idCount;
      panel.isOpen = false;
      idCount++;
      return panel;
    });
  }])

  .controller('MyEditButtonsController', ['$scope', function($scope) {
    console.log('MyEditButtonsController');
  }])

;