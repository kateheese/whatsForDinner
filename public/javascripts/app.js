var app = angular.module('whatsForDinner', ['ngRoute', 'cgBusy'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html',
        controller: 'KitchenController'
      })
      .when('/about', {
        templateUrl: '/partials/about.html'
      })
      .otherwise({
        redirectTo: '/'
      })
    $locationProvider.html5Mode(true);
  })