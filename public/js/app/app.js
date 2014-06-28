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
      controller : roomsCtrl
    })

    // Show room by ID.
    .when('/rooms/:id/:name', {
      templateUrl: '_room',
      controller : roomCtrl
    })

  /**
   * User Routes.
   */

    // Show all users.
    .when('/users', {
      templateUrl: '_users',
      controller : usersCtrl
    })

    .otherwise({
      redirectTo: '/'
    });
}]);

app.run(['$rootScope', '$http', '$roomRtc', function ($rootScope, $http, $roomRtc) {
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
  });
}]);
