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
        }

        // Log.
        log.save('success', req.ip, req.method, 'Request to get all rooms.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

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
        }

        // Log.
        log.save('success', req.ip, req.method, 'get room "' + room.name + '" - ' + room._id + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'While get room with ID ' + req.params.room_id + ' , this user does not have permission to access the room.', object_user);
      }
      res.json(json_return);
    });
  },

  /**
   * API PUT.
   */

  /**
   * Put edit room by ID.
   *
   * @param req
   * @param res
   */
  put_api_edit: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    Room.edit(object_user, req.body, function (error, result) {
      if (!error) {
        json_return = {
          type: 'success',
          msg : result
        }

        // Log.
        log.save('success', req.ip, req.method, 'The room is edited: "' + req.body.name + '" - ' + req.body._id + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'While edit room with ID ' + req.params.room_id + ' , this user does not have permission to access this option.', object_user);
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
        }

        // Log.
        log.save('success', req.ip, req.method, 'added room ' + room.name + '.', object_user);
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
  },

  /**
   * Post Add new message chat to room.
   *
   * @param req
   * @param res
   */
  post_add_message: function (req, res, next) {
    var object_user = req.user;

    Room.add_message(object_user, req.body, function (error, json_msg) {
      var json_return = {};

      if (!error) {
        // Log.
        log.save('success', req.ip, req.method, 'Added message chat to room ' + req.body.room_name + '.', object_user);

        json_return = {
          type    : 'success',
          json_msg: json_msg,
          msg     : { msg: 'The room <strong>' + req.body.room_name + '</strong> accept new message chat.', type: 'success' }
        }

        socket.export.sockets.emit('update chat messages ' + req.body.room_id, json_return);
        res.json(json_return);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        };

        // Log.
        log.save('error', req.ip, req.method, 'While added message chat to room ' + req.body.room_name + ' , this room not added.', object_user);
        res.json(json_return);
      }
    });
  },

  /**
   * API DELETE.
   */

  /**
   * Delete room by ID.
   *
   * @param req
   * @param res
   */
  delete_api_del: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    Room.delete(object_user, req.params.room_id, function (error, result) {
      if (!error) {
        json_return = {
          type: 'success',
          msg : result
        }

        // Log.
        log.save('success', req.ip, req.method, 'The room is deleted: "' + result.room.name + '" - ' + req.params.room_id + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'While delete room with ID ' + req.params.room_id + ' , this user does not have permission to access this option.', object_user);
      }
      res.json(json_return);
    });
  },

  /**
   * API SOCKETS.
   */

  /**
   * Get when user connect in room and send notification to
   * others clients of same room.
   *
   * @param io
   * @param client
   * @param data
   */
  new_user_room: function (io, client, data) {
    if (data) {
      socket.export.sockets.emit('notification new user room ' + data.room_id, data);
    }
  }
};