/**
 * Controllers to working with rooms forms.
 */
'use strict';

/**
 * Controller Room Model.
 *
 * @param $scope
 * @param User
 * @param Room
 */
var room_Ctrl = function ($scope, User, Room) {
  $scope.rooms = [];
  $scope.users = {};

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
      }
      else {
        flash_message_launch(result.msg);
      }
    });
  }
};