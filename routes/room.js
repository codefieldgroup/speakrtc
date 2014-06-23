var express = require('express'),

  user = require('../controllers/user'),
  room = require('../controllers/room'),

  config = require('../config');

module.exports = function (app) {

  /**
   * Room routes.
   */

  /**
   * GET request methods.
   */

  /**
   * Room API routes.
   */

  // Create a new router.
  var api_room_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/api/rooms', api_room_route);

  // API /api/rooms
  api_room_route.route('/')
    .get(/*TODO: Victor: user.ensure_authenticated, Implemented this method to get all rooms*/)
    /*TODO: Victor: .put(room.put_api_room_all)*/
    .post(/*TODO: Victor: user.ensure_authenticated,*/ room.post_api_room_add)
    .delete(/*TODO: Victor: Implemented this method request to delete all rooms*/);

  // API /api/rooms/:room_id
  api_room_route.route('/:room_id')
    .get(/*TODO: Victor: Implemented this method request to get room by id*/)
    .put(/*TODO: Victor: Implemented this method request to update room by id*/)
    .delete(/*TODO: Victor: Implemented this method request to delete one room by id*/);

  /**
   * API SOCKETS.
   */

};