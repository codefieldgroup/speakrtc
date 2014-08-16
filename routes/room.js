var express = require('express'),
  socket = require('../routes/sockets'),

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

  api_room_route.post('/message', user.ensure_authenticated, room.post_api_add_message);

  // API /api/rooms
  api_room_route.route('/')
    .get(/*TODO: Victor: user.ensure_authenticated*/ room.get_api_all)
    /*TODO: Victor: .put(room.put_api_room_all)*/
    .post(/*TODO: Victor: user.ensure_authenticated,*/ room.post_api_add)
    .delete(/*TODO: Victor: Implemented this method request to delete all rooms*/);

  // API /api/rooms/:room_id
  api_room_route.route('/:room_id')
    .get(user.ensure_authenticated, room.get_api_one)
    .put(user.ensure_authenticated, room.put_api_edit)
    .delete(user.ensure_authenticated, room.delete_api_del);
};