var socket = require('../routes/sockets'),

  log = require('../lib/log'),

  Log = require('../models/log'),

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
   * Get all.
   *
   * @param req
   * @param res
   */
  get_api_all: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    Log.get(req.query, object_user, function (error, logs) {
      if (!error) {
        json_return = {
          type : 'success',
          logs: logs,
          msg  : {}
        }
      } else {
        json_return = {
          type: 'error',
          msg : error
        }
      }
      res.json(json_return);
    });
  }

  /**
   * API PUT.
   */

  /**
   * API POST.
   */

  /**
   * API DELETE.
   */

  /**
   * API SOCKETS.
   */
};