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
            templateUrl: 'views/header.html'
          },
          'content': {
            templateUrl: 'views/home.html',
            controller: 'IndexController'
          },
          'footer': {
            templateUrl: 'views/footer.html'
          }
        }
      })

      // About
      .state('app.about', {
        url: 'about',
        views: {
          'content@': {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
          }
        }
      })

      // Contact
      .state('app.contact', {
        url: 'contact',
        views: {
          'content@': {
            templateUrl: 'views/contact.html',
            controller: 'ContactController'
          }
        }
      })

      // Map
      .state('app.map', {
        url: 'map',
        views: {
          'content@': {
            templateUrl: 'views/map.html',
            controller: 'MapController as vm'
          }
        }
      })
    ;

    $urlRouterProvider.otherwise('/');

  })
;