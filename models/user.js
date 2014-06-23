var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose'),

  config = require('../config.json');

var User = new Schema({
  email    : String,
  name     : String,
  last_name: String,
  is_admin : Boolean,
  active   : Boolean,
  banned   : Boolean,
  deleted  : Boolean,
  expired  : Date,
  created  : {
    type   : Date,
    default: Date.now
  }
});

User.plugin(passportLocalMongoose);

/*
 * Method definitions.
 */
/*
 * Static definitions.
 */

/**
 * Add Super admin and site configuration if not exist.
 */
User.statics.add_super_admin = function (callback) {
  var this_model = this;

  return this.find({}, function (error, docs) {
    if (!error) {
      if (!docs.length) {
        var super_admin = new this_model({
          username: config.website.super_admin.name,
          email   : config.website.super_admin.name,
          is_admin: true,
          name    : 'Administrator',
          active  : true
        });

        this_model.register(super_admin, config.website.super_admin.password, function (error) {
          if (!error) {
            console.log('Create Super Admin: Administrator - ' + config.website.super_admin.name);
            callback(null, super_admin._id);
          }
          else {
            callback(error);
          }
        });
      }
      else {
        // There is no need of a super admin user.
        callback(null, null);
      }
    }
    else {
      callback(error);
    }
  });
};

/**
 * List all users.
 *
 * @param callback
 * @returns {*}
 */
User.statics.list_all = function (callback) {
  var this_model = this;

  return this_model.find({}, function (error, docs) {
    if (!error) {
      callback(null, docs)
    }
    else {
      callback(error);
    }
  });
};

/**
 * Add new user in the DB if not exist.
 *
 * @param user    json
 * @param callback
 * @returns {*}
 */
User.statics.add = function (user, callback) {
  var this_model = this;

  return this.find({
    email: user.email
  }, function (error, docs) {
    if (!error) {
      if (!docs.length) {

        var new_user = new this_model({
          username : user.email,
          email    : user.email,
          is_admin : user.is_admin,
          name     : user.name,
          last_name: user.last_name,
          active   : true
        });

        this_model.register(new_user, user.password, function (error) {
          if (!error) {
            callback(null, new_user);
          }
          else {
            callback({ msg: 'The user could not be added.', type: 'error' }, null);
          }
        });
      }
      else {
        callback({ msg: 'The user ' + user.email + ' already exists', type: 'error' }, null);
      }
    }
    else {
      callback({ msg: error, type: 'error' }, null);
    }
  });
};

module.exports = mongoose.model('User', User);