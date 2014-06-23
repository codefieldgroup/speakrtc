'use strict';

// Declare app level module which depends on filters, and services.
var app = angular.module('speakrtc', ['ngResource']);

// Routes of APP.
app.config(['$routeProvider', function ($routeProvider) {

  $routeProvider

  /**
   * Room Routes.
   */

    // Show all rooms.
    .when('/rooms', {
      templateUrl: '_rooms',
      controller : rooms_Ctrl
    })

    // Show room by ID.
    .when('/rooms/:id', {
      templateUrl: '_room',
      controller : room_Ctrl
    })

  /**
   * User Routes.
   */

    .otherwise({
      redirectTo: '/'
    });
}]);

app.run(['$rootScope', '$http', function ($rootScope, $http) {
  // User logged.
  $rootScope.user = null;

  $http.get('/api/users/auth')
    .success(function (user, status) {
      if (user && status == 200) {
        $rootScope.user = user;
      }
    });
}]);
