'use strict';

angular.module('mapItApp')
  .constant('serverUrl', 'http://localhost:3443/')
  .service('geoService', ['$resource', 'serverUrl', function($resource, serverUrl) {
  	this.getFeatures = function() {
  		return $resource(serverUrl + 'features', null, { 'add': { method: 'POST' } });
  	};
  }])
;