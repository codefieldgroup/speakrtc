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
   * GET request methods.
   */

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
  },

  /**
   * POST request methods.
   */

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
   * API GET.
   */

  /**
   * Get user if is logged.
   *
   * @param req
   * @param res
   */
  get_api_user_auth: function (req, res) {
    var object_user = req.user;

    if (object_user) {
      res.json(object_user);
    }
    else {
      res.json(null);
    }
  },

  /**
   * Get all users.
   *
   * @param req
   * @param res
   */
  get_api_users: function (req, res) {
    var object_user = req.user;

    User.list_all(function (error, users) {
      if (!error) {
        // Log.
        log.save('information', req.ip, req.method, 'Request to get all users, the result is: ' + users, object_user);
        res.json(users);
      }
      else {
        // Log.
        log.save('error', req.ip, req.method, 'Request to get all users is failed.', object_user);
        res.json({});
      }
    });
  },

  /**
   * Put modifying all users.
   *
   * @param req
   * @param res
   */
  put_api_user_all: function (req, res) {
    var object_user = req.user;

    // Log.
    log.save('warning', req.ip, req.method, 'PUT method request, not execute . this operation is not implemented.', object_user);

    res.json({ msg: 'This operation is not implemented.', type: 'alert' });
  },

  /**
   * API POST.
   */

  /**
   * Post Create new user.
   *
   * @param req
   * @param res
   */
  post_api_user_add: function (req, res) {
    var object_user = req.user;

    // To call to the model to add a new user.
    User.add(req.body, function (error, user) {
      var json_return = {};

      if (!error) {
        json_return = {
          type: 'success',
          user: user,
          msg : { msg: 'The user <strong>' + user.email + '</strong> is added.', type: 'success' }
        };

        // Log.
        log.save('information', req.ip, req.method, 'added user ' + user.email + '.', object_user);

        res.json(json_return);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        };

        // Log.
        log.save('error', req.ip, req.method, 'Error while added user ' + req.body.email + ' , this user not added.', object_user);
        res.json(json_return);
      }
    });
  }

  /**
   * API SOCKETS.
   */
};