var express = require('express'),
  config = require('../config'),

  users = require('../controllers/users'),
  index = require('../controllers/index');

module.exports = function (app) {
  // Create a new router.
  var app_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/', app_route);

  /**
   * API GET.
   */

  app_route.get('/', index.get_index);

  /**
   * API POST.
   */


}