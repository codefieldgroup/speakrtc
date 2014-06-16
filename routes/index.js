var express = require('express'),

  user = require('../controllers/user'),
  index = require('../controllers/index'),

  config = require('../config');

module.exports = function (app) {
  // Create a new router.
  var app_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/', app_route);

  app_route.get('/', index.get_index);
};