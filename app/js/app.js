'use strict';

angular.module('mapItApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'esri.core', 'esri.map'])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      // Routes

      // Homepage
      .state('app', {
        url: '/',
        views: {
          'navigation': {
            templateUrl: 'views/navigation.html',
            controller: 'NavController'
          },
          'content': {
            templateUrl: 'views/content.html',
            controller: 'IndexController'
          },
          'info': {
            templateUrl: 'views/info.html',
            controller: 'InfoController'
          }
        }
      })

      // Table data
      .state('app.table', {
        url: 'table',
        views: {
          'content@': {
            templateUrl: '',
            controller: 'TableController'
          }
        }
      })

      // Map
      .state('app.map', {
        url: 'map',
        resolve: {
          viewOptions: function() {
            return {value:{
              center: [-121.500, 38.500],
              zoom: 10,
              ui: {
                components: []
              }
            }};
          }
        },
        views: {
          'content@': {
            templateUrl: 'views/map/content.html'
          },
          'map@app.map': {
            templateUrl: 'views/map/map.html',
            controller: 'MapController as vm'
          },
          'sidebar@app.map': {
            templateUrl: 'views/map/sidebar.html',
            controller: 'SidebarController'
          }
        }
      })

      .state('app.about', {
        url: 'about',
        views: {
          'content@': {
            templateUrl: 'views/about/content.html',
            controller: 'AboutController'
          }
        }
      })

      .state('app.contact', {
        url: 'contact',
        views: {
          'content@': {
            templateUrl: 'views/contact/content.html',
            controller: 'ContactController'
          }
        }
      })
    ;

    $urlRouterProvider.otherwise('/');

  })
;