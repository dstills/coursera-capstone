'use strict';

angular.module('mapItApp', ['ui.router', 'ngResource','esri.core', 'esri.map'])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // Routes

      // Homepage
      .state('app', {
        url: '/',
        views: {
          'header': {
            templateUrl: 'views/shared/header.html'
          },
          'content': {
            templateUrl: 'views/home/content.html',
            controller: 'IndexController'
          },
          'footer': {
            templateUrl: 'views/shared/footer.html'
          }
        }
      })

      // About
      .state('app.about', {
        url: 'about',
        views: {
          'content@': {
            templateUrl: 'views/about/content.html',
            controller: 'AboutController'
          }
        }
      })

      // Contact
      .state('app.contact', {
        url: 'contact',
        views: {
          'content@': {
            templateUrl: 'views/contact/content.html',
            controller: 'ContactController'
          }
        }
      })

      // Map
      .state('app.map', {
        url: 'map',
        resolve: {
          layerUrls: function() {
            return {value: ['http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson', 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson']}
          }
        },
        views: {
          'content@': {
            templateUrl: 'views/map/content.html',
            controller: 'MapController as vm'
          },
          'sidebar@': {
            templateUrl: 'views/map/sidebar.html',
            controller: 'SidebarController'
          }
        }
      })
    ;

    $urlRouterProvider.otherwise('/');

  })
;