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
 * @param $rootScope
 * @param User
 * @param Room
 */
var roomsCtrl = function ($scope, $rootScope, User, Room) {
  $rootScope.title = 'SpeakRTC: Rooms';

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
 * @param $rootScope
 * @param $routeParams
 * @param $location
 * @param $roomRtc
 * @param User
 * @param Room
 */
var roomCtrl = function ($scope, $rootScope, $routeParams, $location, $http, $roomRtc, $socket, User, Room) {
  var roomId = $routeParams.id;
  var roomName = $routeParams.name;

  $scope.room = {};

  // Room options.
  $scope.roomOptions = {
    // Show or hide button Disconnect or Reconnect room.
    connect: true,
    buttons: false
  };

  // Camera options.
  $scope.cameraOptions = {
    // Enable / Disable Camera.
    enable    : true,
    fullscreen: false
  };

  // Get room by ID.
  Room.get({id: roomId}, function (result) {
    if (result.type == 'success') {
      $scope.room = result.room;
      $rootScope.title = 'SpeakRTC: Room - ' + result.room.name;
      $scope.tagsVideo = $roomRtc.videoIdList(result.room.total);

      setTimeout(function () {
        // Execute webrtc service.
        $roomRtc.initRoom(roomId, result.room.total, function (result) {
          if (result.type == 'success') {
            $scope.roomOptions.buttons = true;
            $socket.emit('new user room', {
              room_id: $scope.room._id
            });
          }
          else {
            $scope.roomOptions.buttons = false;
          }

          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      }, 100);
    }
    else {
      result.msg.msg = 'You do not have access to room: <strong>' + $routeParams.name + '</strong>.';
      flashMessageLaunch(result.msg);
      $location.path('/rooms');
    }
  });

  /**
   * Hangup (disconnect) Room.
   *
   * @param roomId
   */
  $scope.disconnectRoom = function (roomId) {
    $scope.roomOptions.connect = false;
    $roomRtc.hangupRoom(roomId);
  };

  /**
   * Reconnect Room.
   *
   * @param roomId
   */
  $scope.reconnectRoom = function (roomId, total) {
    $roomRtc.hangupRoom(roomId);

    $scope.tagsVideo = $roomRtc.videoIdList(total);

    setTimeout(function () {
      // Execute webrtc service.
      $roomRtc.initRoom(roomId, total);
    }, 100);
    $scope.roomOptions.connect = true;
  };

  /**
   * Enable/Disable Camera.
   *
   * @param enable
   */
  $scope.enableCamera = function (enable) {
    $roomRtc.enableCamera(enable);
    $scope.cameraOptions.enable = enable;
  };

  /**
   * Add message chat function.
   *
   * @param room
   */
  $scope.addMessageChat = function (chat) {
    var json_send = {
      room_name: roomName,
      room_id  : roomId,
      msg      : chat.message
    }

    $http.post('/api/rooms/message', json_send)
      .success(function (result) {
        if (result.type == 'error') {
          flashMessageLaunch(result.msg);
        }
      });
  };

  $socket.on('update chat messages ' + roomId, function (result) {
    result.json_msg.created = Date.now();
    $scope.room.chats.push(result.json_msg);

    $scope.chat = {
      message: ''
    }

    if (!$scope.$$phase) {
      $scope.$apply();
    }
  });

  $socket.on('notification new user room ' + roomId, function () {
    setTimeout(function () {
      showActiveVideo();
    }, 1000);
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
    is_blocked: false,
    total     : 4
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
          is_show   : true,
          is_blocked: false,
          total     : 4
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