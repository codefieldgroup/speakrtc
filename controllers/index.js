var log = require('../lib/log'),

  config = require('../config');

var fs = require('fs');

module.exports = {

  /**
   * GET request methods.
   */

  /**
   * Index page.
   *
   * @param req
   * @param res
   */
  get_index: function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    }
    else {
      res.redirect('/auth/login');
    }
  },

  get_test: function (req, res) {
    var json_return = {};
    json_return = {
      type: 'success',
      room: 'ok',
      msg : { msg: 'Ok todo ok', type: 'success' }
    }

    fs.readFile('./test', function (err, data) {
      if (err) throw err;
      // Log.
      log.save('success', req.ip, req.method, 'added test ' + data + '.', '');
    });

    res.json(json_return);
  }

  /**
   * POST request methods.
   */

  /**
   * API GET.
   */

  /**
   * API POST.
   */

  /**
   * API SOCKETS.
   */
};
