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
 *     controller : rooms_Ctrl
 * })
 *
 * @param $scope
 * @param User
 * @param Room
 */
var rooms_Ctrl = function ($scope, User, Room) {
  // Get all rooms.
  $scope.rooms = Room.query();
};

/**
 * Controller Room Model: Show room by ID.
 * Router:
 * .when('/rooms/:id', {
 *     templateUrl: '_room',
 *     controller : room_Ctrl
 * })
 *
 * @param $scope
 * @param User
 * @param Room
 */
var room_Ctrl = function ($scope, User, Room) {

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
var add_room_Ctrl = function ($scope, User, Room) {
  $scope.users = [];

  // Get all users.
  $scope.users = User.query();

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
        flash_message_launch(result.msg);

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
        flash_message_launch(result.msg);
      }
    });
  }
};