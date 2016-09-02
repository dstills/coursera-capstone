(function(angular) {
  'use strict';

  angular.module('esri.map')
    .directive('myEditButtons', function() {
      return {
        template:
        // `
        // <div class="map-map-buttons btn-group">
        //   <label class="btn btn-success" uib-btn-radio="'Left'" ng-model="editButtonModel" uncheckable><i class="fa fa-map-marker"></i></label>
        //   <label class="btn btn-danger" uib-btn-radio="'Right'" ng-model="editButtonModel" uncheckable><i class="fa fa-eraser"></i></label>
        // </div>
        // `,
        restrict: 'E',
        scope: {
          map: '='
        }
      };
    })
  ;
})(angular);