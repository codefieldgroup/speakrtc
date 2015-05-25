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

  // Create a new router.
  var api_test_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/api/test', api_test_route);

  api_test_route.route('/')
    .get(/*TODO: Victor: user.ensure_authenticated*/ index.get_test)
    /*TODO: Victor: .put(room.put_api_room_all)*/
    .post(/*TODO: Victor: user.ensure_authenticated,*/)
    .delete(/*TODO: Victor: Implemented this method request to delete all rooms*/);

  /**
   * Index API routes.
   */
   
   // Create a new router.
   
   // Invoked for any requests passed to this router.

  /**
   * API SOCKETS.
   */
};
