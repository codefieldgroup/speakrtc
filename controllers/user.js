var socket = require('../routes/sockets'),

  log = require('../lib/log'),

  User = require('../models/user'),

  config = require('../config');

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
  },

  /**
   * Show Dashboard of user logged.
   *
   * @param req
   * @param res
   */
  get_dashboard: function (req, res) {
    var object_user = req.user;

    // Log.
    log.save('information', req.ip, req.method, 'Access to dashboard page.', object_user);

    res.render('user/dashboard', {
      user    : object_user,
      datetime: Date.now()
    });
  },

  /**
   * Display Form authentication.
   *
   * @param req
   * @param res
   */
  get_login: function (req, res) {
    var object_user = req.user;

    res.render('auth/login', {
      user: object_user,
      code: req.query.code || 0
    });
  },

  /**
   * Run the authentication and redirect to the home page.
   *
   * @param req
   * @param res
   */
  post_login: function (req, res) {
    var object_user = req.user;

    // Log.
    log.save('information', req.ip, req.method, 'Authenticated.', object_user);

    res.cookie('client.sid', String(object_user._id));
    res.redirect('/');
  },

  /**
   * Run out of the site (logout).
   *
   * @param req
   * @param res
   */
  get_logout: function (req, res) {
    var object_user = req.user;

    // Log.
    log.save('information', req.ip, req.method, 'Logout.', object_user);

    req.logout();
    res.clearCookie('client.sid', null);
    res.redirect('/');
  }

};