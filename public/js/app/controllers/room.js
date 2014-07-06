/**
 * Controllers to working with rooms templates.
 */
'use strict';

/**
 * Object Room.
 * @type {{}}
 */
var roomCtrl = {
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
  rooms: function ($scope, $rootScope, User, Room) {
    $rootScope.title = 'SpeakRTC: Rooms';

    // Get all rooms.
    Room.query(function (result) {
      if (result.type == 'success') {
        $rootScope.rooms = result.rooms;
      }
      else {
        flashMessageLaunch(result.msg);
      }
    });
  },

  /**
   * Controller Room Model: Show all rooms.
   * Router:
   * .when('/rooms/:id', {
   *  templateUrl: '_roomEdit',
   *   controller : roomCtrl.edit
   * })
   *
   * @param $scope
   * @param $rootScope
   * @param $routeParams
   * @param Room
   * @param User
   */
  edit: function ($scope, $rootScope, $routeParams, Room, User) {
    var roomId = $routeParams.id;
    $rootScope.title = 'SpeakRTC: Edit Room';

    $scope.room = {};

    // Get room by ID.
    Room.get({id: roomId}, function (result) {
      if (result.type == 'success') {
        $scope.room = result.room;
        $rootScope.room = result.room;

        // Get all users.
        User.query(function (result) {
          if (result.type == 'success') {
            $scope.users = result.users;
          }
        });
      }
      else {
        flashMessageLaunch(result.msg);
      }
    });

    /**
     * Action Edit room.
     *
     * @param room
     */
    $scope.edit = function (room) {
      Room.update({id: room._id}, room, function (result) {
        if (result.type == 'success') {
          flashMessageLaunch(result.msg);
        }
        else {
          flashMessageLaunch(result.msg);
        }
      });
    }
  },

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
   * @param $http
   * @param $roomRtc
   * @param $socket
   * @param User
   * @param Room
   */
  room: function ($scope, $rootScope, $routeParams, $location, $http, $roomRtc, $socket, User, Room) {
    var roomId = $routeParams.id;
    var roomName = $routeParams.name;
    $rootScope.title = 'SpeakRTC: Room: ' + roomName;

    $scope.room = {};

    // Room options.
    $scope.roomOptions = {
      // Show or hide button Disconnect or Reconnect room.
      connect: true
    };

    // Camera options.
    $scope.cameraOptions = {
      // Enable / Disable Camera.
      enable: true
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

              if (!$scope.cameraOptions.enable) {
                $scope.enableCamera(false);
              }

              if (!$scope.roomOptions.connect) {
                $scope.disconnectRoom(roomId);
              }

              $socket.emit('new user room', {
                room_id: $scope.room._id,
                user   : {
                  email: $rootScope.user.email,
                  name : $rootScope.user.name
                }
              });
            }

            if (!$scope.$$phase) {
              $scope.$apply();
            }
          });

          scrollChatBox();
        }, 100);
      }
      else {
        result.msg.msg = 'You do not have access to room: <strong>' + $routeParams.name + '</strong>.';
        flashMessageLaunch(result.msg);
        $location.path('/rooms');
      }
    });

    /**
     * Action Hangup (disconnect) Room.
     *
     * @param roomId
     */
    $scope.disconnectRoom = function (roomId) {
      $scope.roomOptions.connect = false;
      $roomRtc.hangupRoom(roomId);
    };

    /**
     * Action Reconnect Room.
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
     * Action Enable/Disable Camera.
     *
     * @param enable
     */
    $scope.enableCamera = function (enable) {
      $roomRtc.enableCamera(enable);
      $scope.cameraOptions.enable = enable;
    };

    /**
     * Action Add message chat function.
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

    /**
     * Action Set fullscreen video tag of some client.
     *
     * @param videoId
     */
    $scope.setFullscreen = function (videoId) {
      var $clientBlock = $('#client-' + videoId)
      var $fullscreenButton = $clientBlock.find('.cf-client-button-fullscreen');
      var state = $fullscreenButton.attr('data-cf-fullscreen-state');

      var $selfFullscreen = $('#cf-self-fullscreen');
      var $clientFullscreen = $('#cf-client-fullscreen');

      var $streamBlockSelf = $('#cf-self-stream-block');
      var $self = $streamBlockSelf.find('#self');

      var $client = $clientBlock.find('video');

      $fullscreenButton.removeClass('cf-text-muted text-danger');
      if (state == 'false') {
        $fullscreenButton.attr('data-cf-fullscreen-state', true).addClass('text-danger');
        $scope.fullscreen = true;

        var selfSrcStream = $self.attr('src');
        $selfFullscreen.attr('src', selfSrcStream);
        $streamBlockSelf.hide();

        var clientSrcStream = $client.attr('src');
        $clientFullscreen.attr('src', clientSrcStream);
      }
      else {
        $fullscreenButton.attr('data-cf-fullscreen-state', false).addClass('cf-text-muted');
        $scope.fullscreen = false;

        $selfFullscreen.attr('src', '');
        $clientFullscreen.attr('src', '');

        $streamBlockSelf.show();
      }
    };

    /**
     * Sockets.
     */

    /**
     * Socket update chat messages by room ID.
     */
    $socket.on('update chat messages ' + roomId, function (result) {
      result.json_msg.created = Date.now();
      $scope.room.chats.push(result.json_msg);

      $scope.chat = {
        message: ''
      }

      scrollChatBox();

      if (!$scope.$$phase) {
        $scope.$apply();
      }
    });

    /**
     * Notification when other users connect to this room.
     */
    $socket.on('notification new user room ' + roomId, function (result) {
    });
  },

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
   * @param $rootScope
   * @param User
   * @param Room
   */
  add: function ($scope, $rootScope, User, Room) {
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
     * Action Add room function.
     *
     * @param room
     */
    $scope.add = function (room) {
      Room.create({}, room, function (result) {
        if (result.type == 'success') {
          $rootScope.rooms.push(result.room);
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
  },

  /**
   * Controller Room Model: Delete room by ID.
   * Template:
   * span.badge
   *    span.glyphicon.glyphicon-remove-circle.text-danger(ng-controller="roomCtrl.delete",ng-click="delete(room)")
   *
   * @param $scope
   * @param $rootScope
   * @param Room
   */
  delete: function ($scope, $rootScope, Room) {

    /**
     * Action Delete room button.
     *
     * @param room
     */
    $scope.delete = function (room) {
      Room.destroy({id: room._id}, function (result) {
        if (result.type == 'success') {
          flashMessageLaunch(result.msg);

          var old_rooms = $rootScope.rooms;
          var new_rooms = [];

          angular.forEach(old_rooms, function (room_check) {
            if (room_check._id !== room._id) {
              new_rooms.push(room_check);
            }
          });

          $rootScope.rooms = new_rooms;
        }
        else {
          flashMessageLaunch(result.msg);
        }
      });
    };
  }
};
