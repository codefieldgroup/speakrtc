var config = require('../config'),

  log = require('../lib/log');

module.exports = {
  /**
   * Index page.
   *
   * @param req
   * @param res
   */
  get_index: function (req, res) {
    var object_user = req.user;

    // Log.
    log.save('information', req.ip, req.method, 'Access to index page.', object_user);

    res.render('index', {
      user    : object_user,
      datetime: Date.now()
    });
  }
};