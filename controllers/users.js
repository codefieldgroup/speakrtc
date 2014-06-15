var config = require('../config');

module.exports = {

  /**
   * Validate if user is logged.
   *
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  ensure_authenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
};