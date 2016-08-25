'use strict';

angular.module('mapItApp')

  .controller('IndexController', ['$scope', function($scope) {
    console.log('IndexController');
  }])

  .controller('AboutController', ['$scope', function($scope) {
    console.log('AboutController');
  }])

  .controller('ContactController', ['$scope', function($scope) {
    console.log('ContactController');
  }])

  // MapController
  .controller('MapController', ['mapFactory', '$scope', 'esriLoader', function(mapFactory, $scope, esriLoader) {
      console.log('MapController');
      // Set View configurations
      // TODO: Resolve these values first, then assign to this object
      this.viewOptions = {
        ui: {
          components: ['zoom', 'compass']
        },
        extent: {
          xmax: -12938281.754,
          xmin: -14112354.509,
          ymax: 4839254.171,
          ymin: 4461349.503,
          spatialReference: { wkid: 3857 }
        }
      };

      this.onViewCreated = function(view) {
        mapFactory.getLoadedWidgets().then(function(widgets) {
          for (var i = 0; i < widgets.length; i++) {
            var widget = widgets[i];
            var name = widget.id.split('_')[2].toLowerCase();
            var pos;
            widget.view = view;
            switch (name) {
              case 'search':
                pos = 'top-right';
                break;
              case 'legend':
                pos = 'bottom-right';
                break;
              default:
                pos = 'top-left';
                break;
            }
            view.ui.add(widget, pos);
          }
        });
      }.bind(this);

      // Add the map to the controller from the mapFactory
      mapFactory.getLoadedMap().then(function(map) {
        this.map = map;
      }.bind(this));
  }])

;