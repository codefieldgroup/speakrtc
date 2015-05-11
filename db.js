/**
 * Set up and connect to the database in MongoDB via Mongoose ODM.
 *
 * @type {*}
 */

var mongoose = require('mongoose'),

  User = require('./models/user'),

  config = require('./config.json');

module.exports = {
  // initialize DB
  startup: function () {

    /*
     * Database checks.
     */
    mongoose.connection.on('error', function (error) {
      console.log('Connection error: ' + error);
    });

    mongoose.connection.once('open', function () {
      console.log('Connection opened.');
    });

    // Open DB connection to database.

    if (config.database.user && config.database.pass) {
      //mongoose.connect("mongodb://user:password@server/project");
      mongoose.connect("mongodb://" +
       config.database.user + ":" +
       config.database.pass + "@" +
       config.database.host + "/" +
       config.database.name);
    } else {
      mongoose.connect(config.database.host, config.database.name, { server: { poolSize: 1 }});
    }
  },

  install: function (callback) {
    // Create user administrator if none exists in the database.
    User.add_super_admin(callback);
  }
};
