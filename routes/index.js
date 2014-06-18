var express = require('express'),

  user = require('../controllers/user'),
  index = require('../controllers/index'),

  config = require('../config');

module.exports = function (app) {

  /**
   * Index routes.
   */

  // Create a new router.
  var app_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/', app_route);

  /**
   * GET request methods.
   */

  // HTTP Path: /
  app_route.get('/', index.get_index);
  
  /**
   * Index API routes.
   */
   
   // Create a new router.
   
   // Invoked for any requests passed to this router.

  /**
   * API SOCKETS.
   */
};
