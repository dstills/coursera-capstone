'use strict';
// From: github.com/tc39/proposal-object-values-entries
(function(Object) {
  var reduce = Function.bind.call(Function.call, Array.prototype.reduce);
  var isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  var concat = Function.bind.call(Function.call, Array.prototype.concat);

  if (!Object.values) {
    Object.values = function(O) {
      return reduce(Object.keys(O), function(v, k) {
        return concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []);
      }, []);
    };
  }

  if (!Object.entries) {
    Object.entries = function(O) {
      return reduce(Object.keys(O), function(e, k) {
        return concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []);
      }, []);
    };
  }

  window.Object = Object;
})(window.Object);

// Custom directive for editing
(function(angular) {

  angular.module('esri.map')
    .directive('myEditButtons', ['geoService', '$uibModal', function(geoService, $uibModal) {
      return {
        require: '^^esriSceneView',
        template: 
        '<div class="map-map-buttons btn-group">'+
          '<label class="btn btn-success" uib-btn-radio="\'Left\'" ng-model="editButtonModel" uncheckable><i class="fa fa-map-marker"></i></label>'+
          '<label class="btn btn-danger" uib-btn-radio="\'Right\'" ng-model="editButtonModel" uncheckable><i class="fa fa-eraser"></i></label>'+
        '</div>',
        restrict: 'E',
        scope: {
          view: '@'
        },
        link: function (scope, element, attrs, vm) {
          var handles = [];
          element.on('click', function(e) {
            var btnClicked = scope.editButtonModel;
            console.log(btnClicked);
            if (btnClicked === null) {
              var handle = handles.pop();
              handle.remove();
              scope.editButtonModel = '';
              scope.$digest();
              return;
            }
            var handle = vm.view.on('click', function(e) {
              if (btnClicked === 'Left') {
                var point = {
                  type: 'Feature',
                  geometry: Terraformer.ArcGIS.parse({
                    x: e.mapPoint.x,
                    y: e.mapPoint.y,
                    spatialReference: {
                      wkid: e.mapPoint.spatialReference.wkid
                    }
                  }),
                  properties: {}
                };
                var propertiesModal = $uibModal.open({
                  templateUrl: '../views/map/modal.html',
                  controller: function($scope) {
                    var features = geoService.getFeatures();
                    console.log(this);

                    $scope.properties = {
                      name: '',
                      category: '',
                      description: ''
                    };

                    $scope.submitFeature = function(e) {

                      point.properties = {
                        name: $scope.properties.name,
                        category: $scope.properties.category.toLowerCase(),
                        description: $scope.properties.description
                      };
                      console.log(point);
                      features.query(function(arg) {
                        features.add(point);
                      });
                      propertiesModal.close();
                    };

                    $scope.cancel = function() {
                      propertiesModal.close();
                    };
                  }
                });
              } else if (btnClicked === 'Right') {
                console.log('Select point at ', e.mapPoint);
              }
              scope.editButtonModel = '';
              scope.$digest();
              handle.remove();
            });
            handles.push(handle);
          });
        }
      };
    }])
  ;
})(angular);