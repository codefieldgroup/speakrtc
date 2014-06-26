var socket = require('../routes/sockets'),

  log = require('../lib/log'),

  Room = require('../models/room'),

  config = require('../config');

module.exports = {
  /**
   * GET request methods.
   */

  /**
   * POST request methods.
   */

  /**
   * API GET.
   */

  /**
   * Get all rooms.
   *
   * @param req
   * @param res
   */
  get_api_rooms: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    Room.list_all(object_user, function (error, rooms) {
      if (!error) {
        json_return = {
          type : 'success',
          rooms: rooms,
          msg  : {}
        };

        // Log.
        log.save('information', req.ip, req.method, 'Request to get all rooms, the result is: ' + rooms, object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        };

        // Log.
        log.save('error', req.ip, req.method, 'Request to get all rooms is failed.', object_user);
      }

      res.json(json_return);
    });
  },

  /**
   * Get room by ID.
   *
   * @param req
   * @param res
   */
  get_api_room: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    Room.get(object_user, req.params.room_id, function (error, room) {
      if (!error) {
        json_return = {
          type: 'success',
          room: room,
          msg : {}
        };

        // Log.
        log.save('information', req.ip, req.method, 'get room "' + room.name + '" - ' + room._id + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        };

        // Log.
        log.save('error', req.ip, req.method, 'While get room with ID ' + req.params.room_id + ' , this user does not have permission to access the room.', object_user);
      }
      res.json(json_return);
    });
  },

  /**
   * API POST.
   */

  /**
   * Post Add new room.
   *
   * @param req
   * @param res
   */
  post_api_room_add: function (req, res) {
    var object_user = req.user;
    var new_room = req.body;
    new_room.auth_user = object_user;

    // To call to the model to add a new user.
    Room.add(new_room, function (error, room) {
      var json_return = {};

      if (!error) {
        json_return = {
          type: 'success',
          room: room,
          msg : { msg: 'The room <strong>' + room.name + '</strong> is added.', type: 'success' }
        };

        // Log.
        log.save('information', req.ip, req.method, 'added room ' + room.name + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        };

        // Log.
        log.save('error', req.ip, req.method, 'While added room ' + req.body.name + ' , this room not added.', object_user);
      }

      res.json(json_return);
    });
  }

  /**
   * API SOCKETS.
   */
};