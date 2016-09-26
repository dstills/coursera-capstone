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
    $scope.widgets = [];
    this.viewOptions = viewOptions.value;

    this.onViewCreated = function(view) {
      $scope.widgets.forEach(function(widget) {
        widget.view = view;
        view.ui.add(widget, 'top-right');
      });
    };

    // this.startMap = function() {
      esriLoader.require([
        'esri/Map',
        'dojo/_base/array',
        'dojo/dom',
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/Graphic',
        'esri/geometry/Point',
        'esri/geometry/SpatialReference',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/layers/support/Field',
        'esri/PopupTemplate',
        'esri/widgets/Compass',
        'esri/widgets/Legend',
        'esri/widgets/Track',
        'esri/widgets/Search',
        'esri/widgets/Zoom'
      ], function(
        Map,
        array,
        dom,
        FeatureLayer,
        GraphicsLayer,
        Graphic,
        Point,
        SpatialReference,
        SimpleMarkerSymbol,
        Field,
        PopupTemplate,
        Compass,
        Legend,
        Track,
        Search,
        Zoom
      ) {
        this.map = new Map({
          basemap:'topo',
          ground: 'world-elevation'
        });
        $scope.widgets.push(new Compass());
        $scope.widgets.push(new Zoom());
        $scope.widgets.push(new Track());
        var legend = new Legend({
          view: this.map.view
        }, dom.byId('legend'));
        var search = new Search({
          view: this.map.view
        }, dom.byId('search'));
        geoService.getFeatures().query().$promise.then(function(features) {
          var featureLayer = new FeatureLayer({
            source: array.map(features, function(feature) {
              var f = Terraformer.ArcGIS.convert(feature);
              var graphic = new Graphic({
                attributes: f.attributes,
                geometry: new Point(f.geometry),
                symbol: new SimpleMarkerSymbol()
              });
              return graphic;
            }),
            fields: [
              new Field({ name: '_id', alias: 'ID', type: 'oid' }),
              new Field({ name: 'name', alias: 'Name', type: 'string' }),
              new Field({ name: 'category', alias: 'Category', type: 'string' }),
              new Field({ name: 'description', alias: 'Description', type: 'string' })
            ],
            objectIdField: '_id',
            spatialReference: new SpatialReference({
              wkid: 4326
            }),
            geometryType: 'point',
            popupTemplate: new PopupTemplate({
              title: '<h3>{name} <small>{category}</small></h3>',
              content: '<p>{description}</p>'
            })
          });
          this.map.add(featureLayer);
        }.bind(this));
      }.bind(this));
    // }

    // esriLoader.bootstrap({
    //   url: '//js.arcgis.com/4.1'
    // }).then(function() {
    //   this.startMap();
    // }.bind(this));

  }])

  .controller('SidebarController', ['$scope', function($scope) {
    console.log('SidebarController');
    var idCount = 0;
    $scope.isOpen = false;
    $scope.panels = [{
      title: 'Search',
      widgetName: 'search'
    }, {
      title: 'Legend',
      widgetName: 'legend'
    }];
    $scope.panels.map(function(panel) {
      panel.id = idCount;
      panel.isOpen = false;
      idCount++;
      return panel;
    });
  }])

;