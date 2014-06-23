var log = require('../lib/log'),

  config = require('../config');

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
      res.redirect('/user/dashboard');
    }
    else {
      res.redirect('/auth/login');
    }
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
