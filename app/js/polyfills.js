'use strict';
// From: github.com/tc39/proposal-object-values-entries
(function(Object) {
  var reduce = Function.bind.call(Function.call, Array.prototype.reduce);
  var isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  var concat = Function.bind.call(Function.call, Array.prototype.concat);
  // var keys = Reflect.ownKeys;

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
    .directive('myEditButtons', function() {
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
          console.log(scope, element, attrs, vm);
          element.on('click', function(e) {
            var btnClicked = scope.editButtonModel;
            if (btnClicked === 'Left') {
              var handle = vm.view.on('click', function(e) {
                var point = e.mapPoint;
                console.log(point);
                scope.editButtonModel = '';
                scope.$digest();
                handle.remove();
              });
            } else if (btnClicked === 'Right') {
              var handle = vm.view.on('click', function(e) {
                var point = e.mapPoint;
                console.log(point);
                scope.editButtonModel = '';
                scope.$digest();
                handle.remove();
              });
            } else {
              return;
            }
          });
        }
      };
    })
  ;
})(angular);