var express = require('express'),
  passport = require('passport'),

  user = require('../controllers/user'),

  config = require('../config');

module.exports = function (app) {

  /**
   * Authentication routes.
   */

  // Create a new router.
  var user_auth_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/auth', user_auth_route);

  // HTTP Path: /auth/login
  user_auth_route.get('/login', user.get_login);
  user_auth_route.get('/logout', user.ensure_authenticated, user.get_logout);

  user_auth_route.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login?code=1'
  }), user.post_login);

  /**
   * User routes.
   */

  // Create a new router.
  var user_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/dashboard', user_route);

  /**
   * GET request methods.
   */

    // HTTP Path: /user/dashboard
  user_route.get('/', user.ensure_authenticated, user.get_dashboard);

  /**
   * User API routes.
   */

  // Create a new router.
  var api_user_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/api/users', api_user_route);

  api_user_route.get('/auth', user.ensure_authenticated, user.get_api_user_auth);

  // API /api/users
  api_user_route.route('/')
    .get(user.ensure_authenticated, user.get_api_users)
    .put(user.put_api_user_all)
    .post(user.ensure_authenticated, user.post_api_user_add)
    .delete(/*TODO: Victor: Implemented this method request to delete all users*/);

  // API /api/users/:user_id
  api_user_route.route('/:user_id')
    .get(user.ensure_authenticated, user.get_api_user)
    .put(user.ensure_authenticated, user.put_api_edit)
    .delete(user.ensure_authenticated, user.delete_api_del);

  /**
   * API SOCKETS.
   */
};
