'use strict';

// Notes:
// Layers will be stored by 'category' on the server. Only able to query one category at a time
// Restrict number of points loaded based on date, location

angular.module('mapItApp')

  .constant('baseURL', 'http://localhost:3000')

  // Map Factory
  .factory('mapFactory', ['$resource', 'baseURL', 'esriLoader', '$q', function($resource, baseURL, esriLoader, $q) {

    var mapFactory = {};
    var mapDeferred = $q.defer();
    var layersDeferred = $q.defer();
    // TEST LAYER. This object is the shape of the point layer objects that will be stored on the server.
    var dummyGraphics = [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-121.500, 38.500]
      },
      "properties": {
        "FID": 0,
        "name": "Sacramento"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-121.500, 38.600]
      },
      "properties": {
        "FID": 1,
        "name": "Sacramento_N"
      }
    }];

    var dummyWidgets = [{
      "path": "esri/widgets/Locate",
      "params": {}
    }, {
      "path": "esri/widgets/Search",
      "params": {}
    }];

    // var convertToArcGIS = function(geometry) {
    //   return Terraformer.ArcGIS.convert(geometry);
    // };

    var createMap = function() {
      esriLoader.require([
        'esri/Map',
        'esri/layers/FeatureLayer',
        'esri/layers/support/Field',
        'esri/geometry/Point',
        'esri/renderers/SimpleRenderer',
        'esri/symbols/SimpleMarkerSymbol',
        'dojo/_base/array'
      ], function(
        Map,
        FeatureLayer,
        Field,
        Point,
        SimpleRenderer,
        SimpleMarkerSymbol,
        array
      ) {
        var renderer = new SimpleRenderer({
          symbol: SimpleMarkerSymbol()
        });
        var graphics = array.map(dummyGraphics, function(graphic, i) {
          return {
            geometry: new Point({
              x: graphic.geometry.coordinates[0],
              y: graphic.geometry.coordinates[1]
            }),
            attributes: {
              ObjectID: graphic.properties.FID,
              title: graphic.properties.name,
              type: 'point'
            }
          };
        });
        var featureLayer = new FeatureLayer({
          source: graphics,
          objectIdField: 'ObjectID',
          renderer: renderer,
          spatialReference: {
            wkid: 4326
          },
          geometryType: 'point',
          fields: [{
            name: 'ObjectID',
            alias: 'ObjectID',
            type: 'oid'
          }, {
            name: 'title',
            alias: 'title',
            type: 'string'
          }]
        });
        var map = new Map({
          basemap: 'streets',
          ground: 'world-elevation'
        });
        map.add(featureLayer);
        mapDeferred.resolve(map);
      });
    };

    var createWidget = function(path, params) {
      var widgetDeferred = $q.defer();
      esriLoader.require(path, function(Widget) {
        var widget = new Widget((params) ? params : {});
        widgetDeferred.resolve(widget);
      });
      return widgetDeferred.promise;
    };

    // var createLayers = function(params) {
    //   esriLoader.require(['esri/layers/GraphicsLayer', 'esri/Graphic'], function(GraphicsLayer, Graphic) {

    //   });
    // };

    mapFactory.getLoadedMap = function() {
      return mapDeferred.promise;
    };
    mapFactory.getLoadedWidgets = function() {
      return $q.all([
        createWidget('esri/widgets/Locate', null),
        createWidget('esri/widgets/Search', null)
      ]);
    };
    // mapFactory.getLayers = function() {
    //   return $q.all([
    //     createLayer({})
    //   ]);
    // };

    createMap();

    return mapFactory;

  }])
;