/**
 * General functions.
 */

/**
 * Refresh and show connection state of socket.
 *
 * @param code Code of connection:
 * 0 -> connecting
 * 1 -> connect
 * 2 -> disconnect
 * 3 -> reconnecting
 */
function refreshConnectionState(code) {
  var $connection_state = $('#cf-connection-state');

  switch (code) {
    case 0:
      $connection_state.html('connecting');
      break;
    case 1:
      $connection_state.html('connect');
      break;
    case 2:
      $connection_state.html('disconnect');
      break;
    case 3:
      $connection_state.html('reconnecting');
      break;
  }
};

/**
 * Notifications messages.
 */

/**
 * Show messages from server.
 *
 * @param message
 */
function flashMessageLaunch(message) {
  if (message.type == 'error') {
    flashMessage(message.msg, message.type);
  }
  if (message.type == 'success') {
    flashMessage(message.msg, message.type);
  }
};

/**
 * Generate message depending of the type.
 *
 * @param msg String Is the message to show.
 * @param type String Is the type of message (success, notification, alert, error).
 * @param sticky If want it to fade out on its own or just sit there.
 * @param image Path of image to show.
 * @param class_name Class css.
 */
function flashMessage(msg, type, sticky, image, class_name) {
  var title = '';
  var path_default_image = '/vendors/gritter/images/023.png';

  switch (type) {
    case 'success':
      title = '<span class="label label-success">' + type.toUpperCase() + '</span>';
      break;
    case 'notification':
      title = '<span class="label label-info">' + type.toUpperCase() + '</span>';
      break;
    case 'alert':
      title = '<span class="label label-warning">' + type.toUpperCase() + '</span>';
      break;
    case 'error':
      title = '<span class="label label-danger">' + type.toUpperCase() + '</span>';
      path_default_image = '/vendors/gritter/images/018.png';
      break;
  }

  $.gritter.add({
    title     : title,
    text      : msg,
    image     : (image) ? image : path_default_image,
    sticky    : (sticky) ? sticky : false,
    time      : '',
    class_name: (class_name) ? class_name : ''
  });
};

/**
 * Show messages from server to admins.
 *
 * @param msg
 */
var waitingList = [];
function adminNotifications(msg) {
  waitingList.push(msg);
};

setInterval(function () {
  var $smallAdminMsg = jQuery('#socket-admin-notifications small');

  if (waitingList.length > 0) {
    var item = waitingList.shift();

    $smallAdminMsg.html('<span class="label label-default">' + item.type + '</span> ' + item.msg)
      .slideUp(500).fadeIn(400).delay(1600).hide(500);
  }
}, 3000)
