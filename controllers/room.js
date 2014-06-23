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

    Room.list_all(object_user, function (error, rooms) {
      if (!error) {
        // Log.
        log.save('information', req.ip, req.method, 'Request to get all rooms, the result is: ' + rooms, object_user);
        res.json(rooms);
      }
      else {
        // Log.
        log.save('error', req.ip, req.method, 'Request to get all rooms is failed.', object_user);
        res.json({});
      }
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

        res.json(json_return);
      }
      else {
        json_return = {
          type : 'error',
          msg: error
        };

        // Log.
        log.save('error', req.ip, req.method, 'While added room ' + req.body.name + ' , this room not added.', object_user);
        res.json(json_return);
      }
    });
  }

  /**
   * API SOCKETS.
   */
};