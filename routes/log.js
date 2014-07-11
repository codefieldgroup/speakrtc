var express = require('express'),

  user = require('../controllers/user'),
  log = require('../controllers/log'),

  config = require('../config');

module.exports = function (app) {
  /**
   * Log routes.
   */

  /**
   * GET request methods.
   */

  /**
   * Log API routes.
   */

  // Create a new router.
  var api_log_route = express.Router();

  // Invoked for any requests passed to this router.
  app.use('/api/logs', api_log_route);

  // API /api/logs
  api_log_route.route('/')
    .get(/*TODO: Victor: user.ensure_authenticated*/ log.get_api_all)
    /*TODO: Victor: .put(log.put_api_log_all)*/
    .post(/*TODO: Victor: user.ensure_authenticated,*/ /*log.post_api_add*/)
    .delete(/*TODO: Victor: Implemented this method request to delete all logs*/);

  // API /api/logs/:log_id
  api_log_route.route('/:log_id')
    .get(user.ensure_authenticated/*, log.get_api_one*/)
    .put(user.ensure_authenticated/*, log.put_api_edit*/)
    .delete(user.ensure_authenticated/*, log.delete_api_del*/);
};