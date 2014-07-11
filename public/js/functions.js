/**
 * General functions.
 */
var $body = jQuery('body');

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
      $connection_state
        .html('connecting')
        .css('background-color', '#0b6e8b');
      break;
    case 1:
      $connection_state
        .html('connect')
        .css('background-color', '#447a44');
      break;
    case 2:
      $connection_state
        .html('disconnect')
        .css('background-color', '#be3935');
      break;
    case 3:
      $connection_state
        .html('reconnecting')
        .css('background-color', '#c7790a');
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
 * Refresh ul tag chat and ubicate in last li tag.
 */
var offset = 0;
function scrollChatBox() {
  var $ulMessages = $('.cf-chats ul');
  var $ulLastLi = $('.cf-chats ul li:last');

  offset = (offset == 0) ? $ulLastLi.offset().top : $ulLastLi.offset().top + offset;

  setTimeout(function () {
    $ulMessages.scrollTop(offset)
  }, 10)
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
  // Show notifications messages to admin.
  var $smallAdminMsg = jQuery('#socket-admin-notifications small');

  if (waitingList.length > 0) {
    var item = waitingList.shift();

    $smallAdminMsg.html('<span class="label label-default">' + item.type + '</span> ' + item.msg)
      .slideUp(500).fadeIn(400).delay(3000).hide(500);

    // Block show slide down logs when click in admin notifications bar.
    var $totalList = jQuery('#quick-last-logs').find('.cf-total-list-logs small');
    if ($totalList.children().length == 15) {
      $totalList.children().eq(-1).remove();
    }
    var oldHtml = $totalList.html();
    $totalList.html('<span><span class="label label-default">' + item.type + '</span> ' + item.msg + '<br></span>' + oldHtml);
  }

  // Show tags video when capture signal from others users.
  var $callers = $('.cf-client');

  $callers.each(function () {
    var $this = $(this);
    var dataCaller = $this.find('video').attr('data-caller');
    (dataCaller != '') ? $this.show("slow") : $this.hide();
  });
}, 4000);

// Slide Down execute when click in admin notifications bar.
$body
  .on('click', '#socket-admin-notifications', function () {
    $('#quick-last-logs').slideDown('slow');
  })
  .on('click', '#cf-btn-slide-down-close', function () {
    $('#quick-last-logs').slideUp('slow');
  });