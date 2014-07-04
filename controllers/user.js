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
    log.save('success', req.ip, req.method, 'Access to dashboard page.', object_user);

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
    log.save('success', req.ip, req.method, 'Logout.', object_user);

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
    log.save('success', req.ip, req.method, 'Authenticated.', object_user);

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

    var json_return = {};
    User.list_all(object_user, function (error, users) {
      if (!error) {
        json_return = {
          type : 'success',
          users: users,
          msg  : {}
        }

        // Log.
        log.save('success', req.ip, req.method, 'Request to get all users.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'Request to get all users is failed.', object_user);
      }
      res.json(json_return);
    });
  },

  /**
   * Get user by ID.
   *
   * @param req
   * @param res
   */
  get_api_user: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    User.get(object_user, req.params.user_id, function (error, user) {
      if (!error) {
        json_return = {
          type: 'success',
          user: user,
          msg : {}
        }

        // Log.
        log.save('success', req.ip, req.method, 'get user "' + user.username + '" - ' + user._id + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'While get user with ID ' + req.params.user_id + ' , this user does not have permission to access this option.', object_user);
      }
      res.json(json_return);
    });
  },

  /**
   * API PUT.
   */

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

  put_api_edit: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    User.edit(object_user, req.body, function (error, result) {
      if (!error) {
        json_return = {
          type: 'success',
          msg : result
        }

        // Log.
        log.save('success', req.ip, req.method, 'The user is edited: "' + req.body.username + '" - ' + req.body._id + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'While edit user with ID ' + req.params.user_id + ' , this user does not have permission to access this option.', object_user);
      }
      res.json(json_return);
    });
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
    User.add(object_user, req.body, function (error, user) {
      var json_return = {};

      if (!error) {
        json_return = {
          type: 'success',
          user: user,
          msg : { msg: 'The user <strong>' + user.email + '</strong> is added.', type: 'success' }
        }

        // Log.
        log.save('success', req.ip, req.method, 'added user ' + user.email + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'Error while added user ' + req.body.email + ' , this user not added.', object_user);
      }

      res.json(json_return);
    });
  },

  /**
   * API DELETE.
   */

  /**
   * Delete user by ID.
   *
   * @param req
   * @param res
   */
  delete_api_del: function (req, res) {
    var object_user = req.user;

    var json_return = {};
    User.delete(object_user, req.params.user_id, function (error, result) {
      if (!error) {
        json_return = {
          type: 'success',
          msg : result
        }

        // Log.
        log.save('success', req.ip, req.method, 'The user is deleted: "' + result.user.username + '" - ' + req.params.user_id + '.', object_user);
      }
      else {
        json_return = {
          type: 'error',
          msg : error
        }

        // Log.
        log.save('error', req.ip, req.method, 'While delete user with ID ' + req.params.user_id + ' , this user does not have permission to access this option.', object_user);
      }
      res.json(json_return);
    });
  }

  /**
   * API SOCKETS.
   */
};