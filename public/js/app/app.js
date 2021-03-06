'use strict';

// Declare app level module which depends on filters, and services.
var app = angular.module('speakrtc', ['ngResource', 'ngRoute', 'localytics.directives']);

// Routes of APP.
app.config(['$routeProvider', function ($routeProvider) {

  $routeProvider

  /**
   * Room Routes.
   */

    // Show all rooms.
    .when('/rooms', {
      templateUrl: '_rooms',
      controller : roomCtrl.all
    })

    // Show room by ID.
    .when('/rooms/:id/:name', {
      templateUrl: '_room',
      controller : roomCtrl.one
    })

    // Edit user.
    .when('/rooms/:id', {
      templateUrl: '_roomEdit',
      controller : roomCtrl.edit
    })

  /**
   * User Routes.
   */

    // Show all users.
    .when('/users', {
      templateUrl: '_users',
      controller : userCtrl.all
    })

    // Edit user.
    .when('/users/:id', {
      templateUrl: '_user',
      controller : userCtrl.one
    })

  /**
   * Logs Routes.
   */

    // Show all users.
    .when('/logs', {
      templateUrl: '_logs',
      controller : logCtrl.all
    })

    .otherwise({
      redirectTo: '/'
    });
}]);

app.run(['$rootScope', '$http', '$location', '$roomRtc', function ($rootScope, $http, $location, $roomRtc) {
  // User logged.
  $rootScope.user = null;

  // Set title of pages (html-tag title).
  $rootScope.title = 'SpeakRTC: Welcome';

  $http.get('/api/users/auth')
    .success(function (user, status) {
      if (user && status == 200) {
        $rootScope.user = user;
      }
    });

  $rootScope.$on('$routeChangeSuccess', function () {
    $roomRtc.hangupRoom();

    // Refresh menu page with current path.
    $rootScope.pathLocation = $location.path();
  });
}]);
