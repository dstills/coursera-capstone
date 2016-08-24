'use strict';

// Notes:
// Layers will be stored by 'category' on the server. Only able to query one category at a time
// Restrict number of points loaded based on date, location

angular.module('mapItApp')

  .constant('baseURL', 'http://localhost:3000')

  // Map Factory
  // TODO: Need to design so that each individual geometry doesn't get it's own feature class
  .factory('mapFactory', ['$resource', 'baseURL', 'esriLoader', '$q', function($resource, baseURL, esriLoader, $q) {

    var mapFactory = {};
    var mapDeferred = $q.defer();
    // 'dummy' objects will be stored as configuration objects in production, either from resolve objects in the app.config or resources from a server

    var dummyWidgets = [{
      "path": "esri/widgets/Locate",
      "params": {}
    }, {
      "path": "esri/widgets/Search",
      "params": {}
    }];

    var dummyMapOptions = {
      'basemap': 'streets',
      'ground': 'world-elevation'
    };

    var convertToArcGISFieldType = function(value) {
      if (typeof value === 'number') {
        // Check if the number is an integer or decimal
        if (value % 1 === 0) {
          var length = value.toString().length;
          if (length >= 12 && length < 14) {
            return 'date';
          }
          return 'integer';
        }
        return 'double';
      }

      if (typeof value === 'string' || typeof value === 'boolean') {
        return 'string';
      }
      return typeof value;
    };

    var createMap = function() {
      esriLoader.require(['esri/Map'], function(Map) {
        var map = new Map( dummyMapOptions );
        mapDeferred.resolve( map );
      });
    };

    var createJSONFeatureObject = function(feature) {
      feature.geometryType = feature.geometry.type;
      feature.geometry = Terraformer.ArcGIS.convert( feature.geometry );
      return feature;
    };

    var getLayer = function(url) {
      return $resource(url, null, {getAll: {method: 'GET', isArray: false}}).getAll().$promise;
    };

    var createLayer = function(url) {
      var layerDeferred = $q.defer();
      getLayer(url).then(function(response) {
        var features = response.features.map( createJSONFeatureObject );
        console.log('features',features);
        var fields = Object.entries(features[0].properties).map(function(item) { // Might be unsafe to assume all features have the same fields, grabbing the first to build the fields object might be bad idea
          var key = item[0];
          var value = item[1];
          var type = convertToArcGISFieldType(value);
          return {
            name: key.toUpperCase().slice(0, 11),
            alias: key,
            type: type
          };
        });
        fields.unshift({
          name: 'FID',
          alias: 'FID',
          type: 'oid'
        });
        console.log('fields',fields);

        esriLoader.require([
          'esri/core/Collection',
          'esri/Graphic',
          'esri/layers/Layer',
          'esri/layers/FeatureLayer',
          'esri/layers/support/Field',
          'esri/geometry/Multipoint',
          'esri/geometry/Point',
          'esri/geometry/Polyline',
          'esri/geometry/Polygon',
          'esri/geometry/SpatialReference',
          'esri/renderers/SimpleRenderer',
          'esri/symbols/SimpleMarkerSymbol',
          'esri/symbols/SimpleLineSymbol',
          'esri/symbols/SimpleFillSymbol'
        ], function(
          Collection, Graphic, Layer, FeatureLayer, Field, Multipoint, Point, Polyline, Polygon, SpatialReference, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol
        ) {
          var featureLayer;
          var renderer = new SimpleRenderer({
            symbol: new SimpleMarkerSymbol()
          });
          var spatialReference = new SpatialReference({ wkid: 4326 });
          var graphics = features.map(function(feature, idx) {
            var geometry;
            var attributes = feature.properties;
            attributes['FID'] = idx;
            // Assign the geometry object based on the geometry type
            switch (feature.geometryType) {
              case 'Point':
                geometry = new Point(feature.geometry);
                break;
              case 'MultiPoint':
                geometry = new Multipoint(feature.geometry);
                break;
              case 'LineString':
                geometry = new Polyline(feature.geometry);
                break;
              case 'Polygon':
                geometry = new Polygon(feature.geometry);
                break;
              default:
                break;
            }
            return {
              geometry: geometry,
              attributes: attributes
            };
          });
          // TODO: IN FUTURE, ACCOMODATE ALL GEOMETRY TYPES
          featureLayer = new FeatureLayer({
            source: graphics,
            objectIdField: 'FID',
            renderer: renderer,
            spatialReference: spatialReference,
            geometryType: 'point',
            fields: fields
          });
          console.log('featureLayer', featureLayer);
          layerDeferred.resolve(featureLayer);
        });
      });
      return layerDeferred.promise;
    };

    var createWidget = function(path, params) {
      var widgetDeferred = $q.defer();
      esriLoader.require(path, function(Widget) {
        var widget = new Widget((params) ? params : {});
        widgetDeferred.resolve(widget);
      });
      return widgetDeferred.promise;
    };

    mapFactory.getLoadedMap = function() {
      return mapDeferred.promise;
    };
    mapFactory.getLoadedWidgets = function() {
      return $q.all([
        createWidget('esri/widgets/Locate', null),
        createWidget('esri/widgets/Search', null)
      ]);
    };
    mapFactory.getLayers = function() {
      var lyr = createLayer('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
      console.log(lyr);
      lyr.then(function(l) {console.log('l',l);});
      // return $q.all([
      //   createLayer('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      // ]);
    };

    createMap();

    return mapFactory;

  }])
;