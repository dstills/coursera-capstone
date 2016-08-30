'use strict';

// Notes:
// Layers will be stored by 'category' on the server. Only able to query one category at a time
// Restrict number of points loaded based on date, location

angular.module('mapItApp')

  .constant('baseURL', 'http://localhost:3000')
  .constant('mapDefaults', {
    basemap: 'streets',
    ground: 'world-elevation'
  })
  .constant('widgetDefaults', [{
    "path": "esri/widgets/Locate",
    "params": {}
  }, {
    "path": "esri/widgets/Search",
    "params": {}
  }])

  // Map Factory
  // TODO: Need to design so that each individual geometry doesn't get it's own feature class
  .factory('mapFactory', ['$resource', 'esriLoader', '$q', 'baseURL', 'mapDefaults', 'widgetDefaults', function($resource, esriLoader, $q, baseURL, mapDefaults, widgetDefaults) {

    var geostore = new Terraformer.GeoStore({
      store: new Terraformer.GeoStore.Memory(),
      index: new Terraformer.RTree()
    });
    console.log(geostore);
    var mapFactory = {};
    var mapDeferred = $q.defer();
    var geoDeferred = $q.defer();
    // 'dummy' objects will be stored as configuration objects in production, either from resolve objects in the app.config or resources from a server

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

    var createMap = function(config) {
      esriLoader.require(['esri/Map'], function(Map) {
        var map = new Map( config );
        mapDeferred.resolve( map );
      });
    };

    var createWidget = function(widgetParams) {
      var widgetDeferred = $q.defer();
      esriLoader.require(widgetParams.path, function(Widget) {
        var widget = new Widget((widgetParams.options) ? widgetParams.options : {});
        widgetDeferred.resolve(widget);
      });
      return widgetDeferred.promise;
    };

    mapFactory.getLoadedMap = function() {
      return mapDeferred.promise;
    };
    mapFactory.getLoadedWidgets = function() {
      return $q.all(widgetDefaults.map(function(widgetParams) {
        return createWidget(widgetParams);
      }));
    };
    mapFactory.addLayer = function(url) {
      $resource(url).get().$promise.then(function(layer) {
        geostore.add(layer, function(err, res) {
          if (err) {throw new Error(err);}
          console.log('mapFactory.addLayer callback -->', res);
        });
      });
    };
    mapFactory.addLayers = function(urls) {
      $q.all(urls.map(function(url) {
        return $resource(url).get().$promise
      })).then(function(layers) {
        console.log('layers',layers);
        layers.forEach(function(layer, idx) {
          console.log(layer);
          geostore.add(layer, function(err, res) {
            if (err) throw new Error(err);
            console.log('mapFactory.addLayers callback'+idx+' -->', res);
          });
        });
        geoDeferred.resolve(geostore);
      });
    };
    mapFactory.getStore = function() {
      return geoDeferred.promise;
    };

    createMap(mapDefaults);

    return mapFactory;

  }])
;