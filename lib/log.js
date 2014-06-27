/**
 * Library to process logs.
 */

var socket = require('../routes/sockets'),

  Log = require('../models/log');

module.exports = {

  /**
   * Save new log.
   *
   * @param type
   * @param ip
   * @param method
   * @param msg
   * @param object_user
   */
  save: function (type, ip, method, msg, object_user) {
    msg = (object_user) ? 'User ' + object_user.email + ' - ' + msg : msg;

    // New log to add in DB.
    var new_log = {
      type   : type,
      ip     : ip,
      method : method,
      msg    : msg,
      success: (type != 'error') ? true : false
    };

    Log.add(new_log, function () {
      socket.export.sockets.emit('admin notifications', { msg: msg, type: type });
    });
  }
};
