var app = angular.module('whatsForDinner', ['ngRoute', 'cgBusy', 'satellizer', 'ui.bootstrap'])
  .config(function($routeProvider, $locationProvider, $authProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html',
        controller: 'KitchenController'
      })
      .when('/about', {
        templateUrl: '/partials/about.html'
      })
      .when('/login', {
        templateUrl: '/partials/login.html',
        controller: 'LoginController',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .when('/create', {
        templateUrl: '/partials/create.html',
        controller: 'CreateController',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .when('/logout', {
        template: null,
        controller: 'LogoutController'
      })
      .otherwise({
        redirectTo: '/'
      })
    $locationProvider.html5Mode(true);

    $authProvider.facebook({
      clientId: '440187139521922'
    });

    $authProvider.google({
      clientId: '830279859046-enc7k4h5pjq81i4v654ic6dfcm27vf6c.apps.googleusercontent.com'
    });

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
  });