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
        template: 
        '<div class="map-map-buttons btn-group">'+
          '<label class="btn btn-success" uib-btn-radio="\'Left\'" ng-model="editButtonModel" ng-click="editButtonsCtrl.setView()" uncheckable><i class="fa fa-map-marker"></i></label>'+
          '<label class="btn btn-danger" uib-btn-radio="\'Right\'" ng-model="editButtonModel" uncheckable><i class="fa fa-eraser"></i></label>'+
        '</div>',
        restrict: 'E',
        controller: 'MyEditButtonsController as editButtonsCtrl',
        bindToController: true,
        link: function myEditButtonsLink(scope, element, attrs, controller) {
          console.log(scope, element, attrs, controller);
        }
      };
    })
  ;
})(angular);