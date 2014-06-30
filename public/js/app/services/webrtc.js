/**
 * Service to working with webrtc standard.
 */
'use strict';

/**
 * Service to control of Rooms.
 */
app.service('$roomRtc', ['$rootScope', function ($rootScope) {
  var this_service = this;

  // Using "easyrtc" webrtc framework.
  var appRtc = easyrtc;
  var appName = "speakrtc";

  /**
   * Execute webrtc service.
   *
   * @param nameJoinRoom
   * @param total
   */
  this_service.initRoom = function (nameJoinRoom, total, callback) {
    if (appRtc.supportsGetUserMedia() == true) {
      // Disconnecting of the App.
      // appRtc.hangupAll();

      // Disconnect from all rooms connecting.
      this_service.leaveAllRooms();

      // Join to Room.
      this_service.joinRoom(nameJoinRoom);

      appRtc.setRoomOccupantListener(roomListener);
      appRtc.easyApp(appName, "self", this_service.videoIdList(total),
        function (rtcId) {
          flashMessageLaunch({msg: "Successfully connected to room: " + nameJoinRoom, type: 'success'});
          console.log("Successfully connected, I am ID: " + rtcId);
          callback({type: 'success'});
        },
        function (errorCode, errorText) {
          flashMessageLaunch({msg: errorText, type: 'error'});
          callback({type: 'error'});
        }
      );
    }
    else {
      flashMessageLaunch({
        msg : 'This browser not supports WebRTC GetUserMedia (access to camera and microphone).',
        type: 'error'
      });
    }
  };

  /**
   * Hangs up on all current connections.
   *
   * @param roomId
   */
  this_service.hangupRoom = function (roomId) {
    if (roomId) {
      appRtc.leaveRoom(roomId, function (roomName) {
          flashMessageLaunch({msg: "Disconnected from room: " + roomName, type: 'warning'});
        },
        function (errorCode, errorText, roomName) {
          flashMessageLaunch({msg: "Had problems leaving room: " + roomName, type: 'error'});
        });
    }
    else {
      this_service.leaveAllRooms();
      appRtc.hangupAll();
    }
  };

  /**
   * Enable/Disable Camera Service.
   *
   * @param enable
   */
  this_service.enableCamera = function (enable) {
    appRtc.enableCamera(enable);
    (enable == true)
      ? flashMessageLaunch({msg: 'Enable camera. All users of room see you.', type: 'success'})
      : flashMessageLaunch({msg: 'Disable camera. The users of the room cannot see you.', type: 'success'});
  };

  /**
   * Generate callers list.
   * Example:
   * ["caller1", "caller2", "caller3", "caller4"]
   *
   * @param total
   * @returns {Array}
   */
  this_service.videoIdList = function (total) {
    if (total) {
      var list = [];
      for (var i = 1; i <= total; i++) {
        list.push('caller' + i);
      }
      return list;
    }
    else {
      return ["caller1", "caller2"];
    }
  };

  /**
   * Join to Room by ID.
   *
   * @param nameJoinRoom
   */
  this_service.joinRoom = function (nameJoinRoom) {
    appRtc.joinRoom(nameJoinRoom, null,
      function (roomName) {
        flashMessageLaunch({msg: "You are now in room " + roomName, type: 'success'});
      },
      function (errorCode, errorText, roomName) {
        flashMessageLaunch({msg: "Had problems joining " + roomName, type: 'error'});
      });
  };

  /**
   * Disconnect from all rooms connecting.
   */
  this_service.leaveAllRooms = function () {
    var roomsJoined = appRtc.getRoomsJoined();
    for (var key in roomsJoined) {
      appRtc.leaveRoom(key, function (roomName) {
          console.log("Disconnected from room: " + roomName);
        },
        function (errorCode, errorText, roomName) {
          console.log("Had problems leaving room: " + roomName);
        });
    }
  };

  /**
   * Initiates a call to others users.
   *
   * @param rtcId
   */
  this_service.roomCall = function (rtcId) {
    appRtc.call(
      rtcId,
      function (rtcId) {
        console.log("Completed call to " + rtcId);
      },
      function (errorCode, errorText) {
        console.log("Error: " + errorText);
      },
      function (accepted, byWho) {
        console.log((accepted ? "Accepted" : "Rejected") + " by " + byWho);
      }
    );
  };

  /**
   * Private Functions.
   */

  /**
   * Get all clients of room.
   *
   * @param roomName
   * @param otherPeers
   */
  function roomListener(roomName, otherPeers) {
    appRtc.setRoomOccupantListener(null);

    for (var i in otherPeers) {
      this_service.roomCall(i);
    }
  };
}]);