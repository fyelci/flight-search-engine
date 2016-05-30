(function(){
  'use strict';
  /**
   * @ngdoc overview
   * @name flightSearchEngineApp
   * @description
   * # flightSearchEngineApp
   *
   * Main module of the application.
   */
  angular
    .module('flightSearchEngineApp', [
      'ui.router',
      'ngAnimate',
      'ngTouch',
      'ui.bootstrap',
      'rzModule'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/");
      $stateProvider
        .state('main', {
          url: "/",
          templateUrl: "views/main.html",
          controller: 'FlightSearchController',
          controllerAs: 'vm'
        });
    });

})();
