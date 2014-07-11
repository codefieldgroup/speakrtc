var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  config = require('../config.json');

var Room = new Schema({
  _owner    : {
    type: Schema.Types.ObjectId,
    ref : 'User'
  },
  name      : String,
  total     : Number,
  is_blocked: Boolean,
  is_show   : Boolean,
  users     : [
    {
      type   : Schema.Types.ObjectId,
      ref    : 'User',
      default: []
    }
  ],
  chats     : [
    {
      msg    : String,
      user   : {
        email    : String,
        name     : String,
        last_name: String
      },
      created: {
        type   : Date,
        default: Date.now
      }
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
Room.statics.all = function (auth_user, callback) {
  var this_model = this;

  // Rules Filter.
  var or_filter = [];
  var and_filter = [];
  if (!auth_user.is_admin) {
    or_filter.push(
      {_owner: auth_user._id},
      {users: auth_user._id}
    );

    and_filter.push(
      {is_show: true}
    );
  }

  return this_model.find({})
    .or((or_filter.length > 0) ? or_filter : null)
    .and((and_filter.length > 0) ? and_filter : null)
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

  return this_model.findOne({
    name: room.name
  }, function (error, doc) {
    if (!error) {
      if (!doc) {

        var new_room = new this_model({
          _owner    : room.auth_user._id,
          name      : room.name,
          total     : room.total,
          is_blocked: room.is_blocked,
          is_show   : room.is_show,
          users     : (room.users) ? room.users : [],
          chats     : []
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

/**
 * Get room by ID.
 *
 * @param auth_user
 * @param room_id
 * @param callback
 * @returns {Promise}
 */
Room.statics.get = function (auth_user, room_id, callback) {
  var this_model = this;

  if (room_id) {
    // Rules Filter.
    var or_filter = [];
    var and_filter = [];
    if (!auth_user.is_admin) {
      or_filter.push(
        {_owner: auth_user._id},
        {users: auth_user._id}
      );

      and_filter.push(
        {is_show: true}
      );
    }

    return this_model.findOne({
      _id: room_id
    })
      .or((or_filter.length > 0) ? or_filter : null)
      .and((and_filter.length > 0) ? and_filter : null)
      .populate('_owner')
      .populate('users')
      .exec(function (error, doc) {
        if (!error) {
          if (doc) {
            callback(null, doc);
          }
          else {
            callback({ msg: 'You do not have access to this Room.', type: 'error' }, null);
          }
        }
        else {
          callback({ msg: error + ' - You do not have access to this page.', type: 'error' }, null);
        }
      });
  }
  else {
    callback({ msg: 'The id of room not include.', type: 'error' }, null);
  }
};

/**
 * Add message to chat of room.
 *
 * @param data
 * @param callback
 */
Room.statics.add_message = function (auth_user, data, callback) {
  var this_model = this;
  var room_id = data.room_id;

  if (room_id) {
    // Rules Filter.
    var or_filter = [];
    var and_filter = [];
    if (!auth_user.is_admin) {
      or_filter.push(
        {_owner: auth_user._id},
        {users: auth_user._id}
      );

      and_filter.push(
        {is_show: true}
      );
    }

    return this_model.findOne({
      _id: room_id
    })
      .or((or_filter.length > 0) ? or_filter : null)
      .and((and_filter.length > 0) ? and_filter : null)
      .populate('_owner')
      .populate('users')
      .exec(function (error, doc) {
        if (!error) {
          if (doc) {
            var json_chat = {
              msg : data.msg,
              user: {
                email    : auth_user.email,
                name     : auth_user.name,
                last_name: auth_user.last_name
              }
            }

            doc.chats.push(json_chat);
            doc.save(function (error) {
              if (!error) {
                callback(null, json_chat);
              }
              else {
                callback({ msg: 'Internal error while save chat message in DB.', type: 'error' }, null);
              }
            });
          }
          else {
            callback({ msg: 'You do not have access to this Room.', type: 'error' }, null);
          }
        }
        else {
          callback({ msg: error + ' - You do not have access to this page.', type: 'error' }, null);
        }
      });
  }
  else {
    callback({ msg: 'The id of room not include.', type: 'error' }, null);
  }
};

/**
 * Edit room by ID.
 *
 * @param auth_user
 * @param room_edit
 * @param callback
 * @returns {*|type[]|Deferred|findOne|Query|findOne}
 */
Room.statics.edit = function (auth_user, room_edit, callback) {
  var this_model = this;

  if (auth_user.is_admin) {
    return this_model.findOne({
      _id: room_edit._id
    }, function (error, doc) {
      if (!error) {
        if (doc) {
          doc.name = room_edit.name;
          doc.total = room_edit.total;
          doc.is_blocked = room_edit.is_blocked;
          doc.is_show = room_edit.is_show;
          doc.users = room_edit.users;

          doc.save();
          callback(null, {msg: 'The room is edited.', type: 'success'});
        }
        else {
          callback({ msg: 'The room not exist.', type: 'error' }, null);
        }
      }
      else {
        callback({ msg: error, type: 'error' }, null);
      }
    });
  }
  else {
    callback({ msg: 'You do not have access to this page.', type: 'error' }, null);
  }
};

/**
 * Delete room by ID.
 *
 * @param auth_user
 * @param room_id
 * @param callback
 * @returns {*|type[]|Deferred|findOne|Query|findOne}
 */
Room.statics.delete = function (auth_user, room_id, callback) {
  var this_model = this;

  if (auth_user.is_admin) {
    return this_model.findOne({
      _id: room_id
    }, function (error, doc) {
      if (!error) {
        if (doc) {

          this_model.remove({
            _id: room_id
          }, function (error) {
            if (!error) {
              callback(null, {msg: 'The room is deleted.', type: 'success', room: doc});
            }
            else {
              callback({ msg: error, type: 'error' }, null);
            }
          });
        }
        else {
          callback({ msg: 'The room not exist.', type: 'error' }, null);
        }
      }
      else {
        callback({ msg: error, type: 'error' }, null);
      }
    });
  }
};

module.exports = mongoose.model('Room', Room);