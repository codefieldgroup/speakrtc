/**
 * General Routes.
 * */
module.exports = function (app) {

  // Route common app.
  require('./routes/index')(app);

  // Route user and auth.
  require('./routes/user')(app);
};

