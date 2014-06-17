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
function refresh_connection_state(code) {
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
}

/**
 * Notifications messages.
 */

/**
 * Show messages from server.
 *
 * @param message
 */
function flash_message_launch(message) {
  if (message.type == 'error') {
    flash_message(message.msg, message.type, 'top', 4000);
  }
  if (message.type == 'success') {
    flash_message(message.msg, message.type, 'top', 4000);
  }
}

/**
 * Generate message depending of the type.
 *
 * @param msg String Is the message to show.
 * @param type String Is the type of message (success, notification, information, alert, error).
 * @param layout String It is the position in which the message will be shown (top, topCenter, topLeft, topRight, center, centerLeft, centerRight, bottom, bottomCenter, bottomLeft, bottomRight).
 * @param interval Number Seconds to hide, by default 10000.
 */
function flash_message(msg, type, layout, interval) {
  var n = noty({
      text        : msg,
      type        : type,
      dismissQueue: false,
      layout      : layout,
      theme       : 'defaultTheme'
    },
    setTimeout(function () {
      $.noty.closeAll(n.options.id);
    }, interval)
  );
}
