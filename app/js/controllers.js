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
      console.log(view);
      $scope.widgets.forEach(function(widget, i) {
        widget.view = view;
        if (i < 3) {
          view.ui.add(widget, 'top-right');
        } else {
          widget.startup();
        }
      });
    };

    // this.renderLayer = function(deps) {
    //   var deferred = $q.defer();
    //   geoService.getFeatures().query().$promise.then(function(features) {
    //     var featureLayer = new deps['FeatureLayer']({
    //       source: (function() {
    //         var source = [];
    //         for (var i = 0; i <= features.length; i++) {
    //           var f = Terraformer.ArcGIS.convert(features[i]);
    //           source.push(
    //             new Graphic({
    //               attributes: f.attributes,
    //               geometry: new deps['Point'](f.geometry),
    //               symbol: new deps['SimpleMarkerSymbol']()
    //             })
    //           );
    //         }
    //         return source;
    //       })(),
    //       fields: [
    //         new deps['Field']({ name: '_id', alias: 'ID', type: 'oid' }),
    //         new deps['Field']({ name: 'name', alias: 'Name', type: 'string' }),
    //         new deps['Field']({ name: 'category', alias: 'Category', type: 'string' }),
    //         new deps['Field']({ name: 'description', alias: 'Description', type: 'string' })
    //       ],
    //       objectIdField: '_id',
    //       spatialReference: new deps['SpatialReference']({
    //         wkid: 4326
    //       }),
    //       geometryType: 'point',
    //       popupTemplate: new deps['PopupTemplate']({
    //         title: '<h3>{name} <small>{category}</small></h3>',
    //         content: '<p>{description}</p>'
    //       }),
    //       id: 'points'
    //     });
    //     deferred.resolve(featureLayer);
    //     // map.add(featureLayer);
    //   });
    //   return deferred.promise;
    // };

    // this.startMap = function() {
      esriLoader.require([
        'esri/Map',
        'dojo/_base/array',
        'dojo/dom',
        'dojo/dom-construct',
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/layers/StreamLayer',
        'esri/Graphic',
        'esri/geometry/Point',
        'esri/renderers/SimpleRenderer',
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
        domConstruct,
        FeatureLayer,
        GraphicsLayer,
        StreamLayer,
        Graphic,
        Point,
        SimpleRenderer,
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
        // var streamLayer = new StreamLayer({
        //   url: 'http://localhost:3443/features/',
        //   renderer: new SimpleRenderer({
        //     symbol: new SimpleMarkerSymbol()
        //   }),
        //   fields: [
        //     new Field({ name: '_id', alias: 'ID', type: 'oid' }),
        //     new Field({ name: 'name', alias: 'Name', type: 'string' }),
        //     new Field({ name: 'category', alias: 'Category', type: 'string' }),
        //     new Field({ name: 'description', alias: 'Description', type: 'string' })
        //   ],
        //   objectIdField: '_id',
        //   spatialReference: new SpatialReference({
        //     wkid: 4326
        //   }),
        //   geometryType: 'point',
        //   popupTemplate: new PopupTemplate({
        //     title: '<h3>{name} <small>{category}</small></h3>',
        //     content: '<p>{description}</p>'
        //   }),
        //   purgeOptions: {
        //     displayCount: 1000
        //   }
        // });
        // Create the map
        this.map = new Map({
          basemap:'topo',
          ground: 'world-elevation'
          // ,layers: [streamLayer]
        });
        // Custom javascript class for BasemapSelect widget
        var BasemapSelect = (function(map) {
          function BasemapSelect(options, domNode) {
            this.options = options;
            this.node = domNode;

            this._template =
            // '<div class="esri-widget" widgetid="'+domNode.id+'">'+
              '<select id="basemap-select">'+
                '<option value="streets" selected>Streets</option>'+
                '<option value="hybrid">Satellite</option>'+
                '<option value="topo">Topographic</option>'+
                '<option value="terrain">Streets</option>'+
                '<option value="gray">Gray</option>'+
                '<option value="national-geographic">National Geographic</option>'+
                '<option value="streets">Streets</option>'+
              '</select>'
            // +'</div>';
            this._started = false;
            this._selected = map.basemap;
          }
          BasemapSelect.prototype.select = function(value) {
            map.basemap = value;
          };
          BasemapSelect.prototype.startup = function() {
            this._started = true;
            var node = domConstruct.toDom(this._template);
            console.log(node);
            this.node.appendChild(node);
            console.log('basemapselect started up!', map);
          };
          return BasemapSelect;
        })(this.map);
        // Grab widgets and put them in scope
        $scope.widgets.push(new Compass());
        $scope.widgets.push(new Zoom());
        $scope.widgets.push(new Track());
        $scope.widgets.push(new Legend({}, dom.byId('legend')));
        $scope.widgets.push(new Search({}, dom.byId('search')));
        $scope.widgets.push(new BasemapSelect({}, dom.byId('basemaps')));
        // query the server and create the feature class
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
            }),
            id: 'points'
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
    }, {
      title: 'Basemaps',
      widgetName: 'basemaps'
    }];
    $scope.panels.map(function(panel) {
      panel.id = idCount;
      panel.isOpen = false;
      idCount++;
      return panel;
    });
  }])

;