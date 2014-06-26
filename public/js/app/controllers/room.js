/**
 * Controllers to working with rooms forms.
 */
'use strict';

/**
 * Controllers by Routes.
 */

/**
 * Controller Room Model: Show all rooms.
 * Router:
 * .when('/rooms', {
 *     templateUrl: '_rooms',
 *     controller : roomsCtrl
 * })
 *
 * @param $scope
 * @param User
 * @param Room
 */
var roomsCtrl = function ($scope, User, Room) {
  // Get all rooms.
  Room.query(function (result) {
    if (result.type == 'success') {
      $scope.rooms = result.rooms;
    }
    else {
      flashMessageLaunch(result.msg);
    }
  });
};

/**
 * Controller Room Model: Show room by ID.
 * Router:
 * .when('/rooms/:id', {
 *     templateUrl: '_room',
 *     controller : roomCtrl
 * })
 *
 * @param $scope
 * @param $routeParams
 * @param $location
 * @param roomRtc
 * @param User
 * @param Room
 */
var roomCtrl = function ($scope, $routeParams, $location, roomRtc, User, Room) {

  Room.get({id: $routeParams.id}, function (result) {
    if (result.type == 'success') {
      $scope.room = result.room;

      // Execute webrtc service.
      roomRtc.initRoom($routeParams.id);
    }
    else {
      result.msg.msg = 'You do not have access to room: <strong>' + $routeParams.name + '</strong>.';
      flashMessageLaunch(result.msg);
      $location.path('/rooms');
    }
  });
};

/**
 * Controllers without Routes.
 * These controllers have Templates instead of Routes.
 */

/**
 * Controller Room Model: Add room.
 * Template:
 * div(ng-include src=" '_add_room' ")
 *
 * @param $scope
 * @param User
 * @param Room
 */
var addRoomCtrl = function ($scope, User, Room) {
  $scope.users = [];

  // Get all users.
  User.query(function (result) {
    if (result.type == 'success') {
      $scope.users = result.users;
    }
  });

  $scope.room = {
    is_show   : true,
    is_blocked: false
  };

  /**
   * Add room function.
   *
   * @param room
   */
  $scope.add = function (room) {
    Room.create({}, room, function (result) {
      if (result.type == 'success') {
        $scope.rooms.push(result.room);
        flashMessageLaunch(result.msg);

        $scope.room = {
          name      : '',
          users     : $scope.users,
          is_show   : true,
          is_blocked: false
        };

        if (!$scope.$$phase) {
          // This will kickstart angular to recognize the change.
          $scope.$apply();
        }
      }
      else {
        flashMessageLaunch(result.msg);
      }
    });
  }
};