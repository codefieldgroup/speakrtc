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
  app.use('/user', user_route);

  /**
   * GET request methods.
   */

    // HTTP Path: /user/dashboard
  user_route.get('/dashboard', user.ensure_authenticated, user.get_dashboard);

  /**
   * User API routes.
   */

  // Create a new router.
  var api_user_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/api/users', api_user_route);

  // API /api/users
  api_user_route.route('/')
    .get(/*TODO: Victor: user.ensure_authenticated,*/ user.get_api_user_all)
    .put(user.put_api_user_all)
    .post(/*TODO: Victor: user.ensure_authenticated,*/ user.post_api_user_new)
    .delete(/*TODO: Victor: Implemented this method request to delete all users*/);

  // API /api/users/:user_id
  api_user_route.route('/:user_id')
    .get(/*TODO: Victor: Implemented this method request to get user by id*/)
    .put(/*TODO: Victor: Implemented this method request to update user by id*/)
    .delete(/*TODO: Victor: Implemented this method request to delete one user by id*/);

  /**
   * API SOCKETS.
   */
};
