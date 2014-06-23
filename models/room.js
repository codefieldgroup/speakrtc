var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  config = require('../config.json');

var Room = new Schema({
  _owner    : {
    type: Schema.Types.ObjectId,
    ref : 'User'
  },
  name      : String,
  is_blocked: Boolean,
  is_show   : Boolean,
  users     : [
    {
      type   : Schema.Types.ObjectId,
      ref    : 'User',
      default: []
    }
  ],
  created   : {
    type   : Date,
    default: Date.now
  }
});

/*
 * Method definitions.
 */
/*
 * Static definitions.
 */

/**
 * List all rooms.
 *
 * @param auth_user
 * @param callback
 * @returns {Promise}
 */
Room.statics.list_all = function (auth_user, callback) {
  var this_model = this;

  // Rules Filter.
  var or_filter = [];
  if (!auth_user.is_admin) {
    or_filter.push(
      {is_show: true},
      {_owner: auth_user._id},
      {users: auth_user._id}
    );
  }

  return this_model.find({})
    .or((or_filter.length > 0) ? or_filter : null)
    .populate('_owner')
    .populate('users')
    .exec(function (error, docs) {
      if (!error) {
        callback(null, docs);
      }
      else {
        callback({ msg: 'Internal error while get rooms from DB.', type: 'error' }, null);
      }
    });
};

/**
 * Add new room in the DB if not exist.
 *
 * @param room
 * @param callback
 * @returns {*|find|type[]|Deferred|find|find}
 */
Room.statics.add = function (room, callback) {
  var this_model = this;

  return this.find({
    name: room.name
  }, function (error, docs) {
    if (!error) {
      if (!docs.length) {

        var new_room = new this_model({
          _owner    : room.auth_user._id,
          name      : room.name,
          is_blocked: room.is_blocked,
          is_show   : room.is_show,
          users     : room.users
        });

        new_room.save(function (error, doc) {
          if (!error) {
            callback(null, doc);
          }
          else {
            callback({ msg: 'Internal error while room save in DB.', type: 'error' }, null);
          }
        });
      }
      else {
        callback({ msg: 'The room ' + room.name + ' already exists', type: 'error' }, null);
      }
    }
    else {
      callback({ msg: error, type: 'error' }, null);
    }
  });
};

module.exports = mongoose.model('Room', Room);