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
 * @param callback
 * @returns {*}
 */
Room.statics.list_all = function (callback) {
  var this_model = this;

  return this_model.find({})
    .populate('_owner')
    .exec(function (error, docs) {
      if (!error) {

        callback(null, docs);

      }
      else {
        callback({ msg: 'Internal error while get videos from DB.', type: 'error' }, null);
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