var log = require('../lib/log'),

  config = require('../config');

module.exports = {
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
};