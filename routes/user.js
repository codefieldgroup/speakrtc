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

  // HTTP Path: /user/dashboard
  user_route.get('/dashboard', user.ensure_authenticated, user.get_dashboard);
};