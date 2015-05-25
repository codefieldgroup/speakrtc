/**
 * Model to manipulate log of the Ips.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  config = require('../config.json');

var Log = new Schema({
  type    : String,
  ip      : String,
  method  : String,
  msg     : String,
  datetime: {
    type   : Date,
    default: Date.now
  },
  success : Boolean
});

/*
 * Method definitions.
 */
/*
 * Static definitions.
 */

/**
 * Add new log in DB.
 *
 * @param new_log
 */
Log.statics.add = function (new_log, callback) {
  var this_model = this;

  var add = new this_model(new_log);

  add.save(function (error) {
    callback();
  });
};

/**
 * List of logs.
 * They will be shown of 10 in 10
 *
 * @param options
 * @param auth_user
 * @param callback
 * @returns {*|Promise}
 */
Log.statics.get = function (options, auth_user, callback) {
  var this_model = this;

  // Rules Filter.
  var and_filter = [];
  if (options.type) {
    and_filter.push({
      type: options.type
    })
  }
  if (options.method) {
    and_filter.push({
      method: options.method
    })
  }
  if (options.ip) {
    and_filter.push({
      ip: options.ip
    })
  }

  //if (auth_user.is_admin) {
  if (true) {
    return this_model.find({})
      .and((and_filter.length > 0) ? and_filter : null)
      .skip(options.skip)
      .limit(options.limit)
      .sort({ datetime: 'desc' })
      .exec(function (error, docs) {
        if (!error) {
          callback(null, docs);
        }
        else {
          callback({ msg: 'Internal error while get logs from DB.', type: 'error' }, null);
        }
      });
  }
  else {
    callback({ msg: 'You do not have access to this page.', type: 'error' }, null);
  }
};

module.exports = mongoose.model('Log', Log);
