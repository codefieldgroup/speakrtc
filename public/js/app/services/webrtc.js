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
  this_service.initRoom = function (nameJoinRoom, total) {
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
          console.log("Successfully connected, I am ID: " + rtcId);
        },
        function (errorCode, errorText) {
          console.log(errorText);
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
          console.log("Disconnected from room: " + roomName);
        },
        function (errorCode, errorText, roomName) {
          console.log("Had problems leaving room: " + roomName);
        });
    }
    else {
      this_service.leaveAllRooms();
      appRtc.hangupAll();
    }
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
        console.log("I'm now in room " + roomName);
      },
      function (errorCode, errorText, roomName) {
        console.log("Had problems joining " + roomName);
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