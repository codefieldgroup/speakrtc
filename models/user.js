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
 * @param auth_user
 * @param callback
 * @returns {*|find|type[]|Deferred|find|find}
 */
User.statics.list_all = function (auth_user, callback) {
  var this_model = this;

  if (auth_user.is_admin) {
    return this_model.find({}, function (error, docs) {
      if (!error) {
        callback(null, docs)
      }
      else {
        callback(error);
      }
    });
  }
  else {
    callback({ msg: 'You do not have access to this page.', type: 'error' }, null);
  }
};

/**
 * Add new user in the DB if not exist.
 *
 * @param auth_user
 * @param user
 * @param callback
 * @returns {*|find|type[]|Deferred|find|find}
 */
User.statics.add = function (auth_user, user, callback) {
  var this_model = this;

  if (auth_user.is_admin) {
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
  }
  else {
    callback({ msg: 'You do not have access to this page..', type: 'error' }, null);
  }
};

/**
 * Get user by ID.
 *
 * @param user
 * @param callback
 */
User.statics.get = function (auth_user, user_id, callback) {
  var this_model = this;

  if (auth_user.is_admin) {
    return this_model.findOne({
      _id: user_id
    }, function (error, doc) {
      if (!error) {
        if (doc) {
          callback(null, doc);
        }
        else {
          callback({ msg: 'The user not exist.', type: 'error' }, null);
        }
      }
      else {
        callback({ msg: error, type: 'error' }, null);
      }
    });
  }
  else {
    callback({ msg: 'You do not have access to this page..', type: 'error' }, null);
  }
};

/**
 * Edit user by ID.
 *
 * @param auth_user
 * @param user_edit
 * @param callback
 * @returns {*|type[]|Deferred|findOne|Query|findOne}
 */
User.statics.edit = function (auth_user, user_edit, callback) {
  var this_model = this;

  if (auth_user.is_admin) {
    return this_model.findOne({
      _id: user_edit._id
    }, function (error, doc) {
      if (!error) {
        if (doc) {
          doc.username = user_edit.email;
          doc.email = user_edit.email;
          doc.name = user_edit.name;
          doc.last_name = user_edit.last_name;
          doc.is_admin = user_edit.is_admin;
          doc.active = user_edit.active;

          doc.save();
          callback(null, {msg: 'The user is edited.', type: 'success'});
        }
        else {
          callback({ msg: 'The user not exist.', type: 'error' }, null);
        }
      }
      else {
        callback({ msg: error, type: 'error' }, null);
      }
    });
  }
  else {
    callback({ msg: 'You do not have access to this page..', type: 'error' }, null);
  }
};

/**
 * Delete user by ID.
 *
 * @param auth_user
 * @param user_id
 * @param callback
 * @returns {*|type[]|Deferred|findOne|Query|findOne}
 */
User.statics.delete = function (auth_user, user_id, callback) {
  var this_model = this;

  if (auth_user.is_admin) {
    return this_model.findOne({
      _id: user_id
    }, function (error, doc) {
      if (!error) {
        if (doc) {

          this_model.remove({
            _id: user_id
          }, function (error) {
            if (!error) {
              callback(null, {msg: 'The user is deleted.', type: 'success', user: doc});
            }
            else {
              callback({ msg: error, type: 'error' }, null);
            }
          });
        }
        else {
          callback({ msg: 'The user not exist.', type: 'error' }, null);
        }
      }
      else {
        callback({ msg: error, type: 'error' }, null);
      }
    });
  }
};

module.exports = mongoose.model('User', User);