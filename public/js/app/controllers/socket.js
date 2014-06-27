/**
 * Client side, sockets operations.
 *
 * @type {*|io.Socket}
 */
var socket = io.connect(location.protocol + '//' + location.host);

socket.on('flash message', flashMessageLaunch);
socket.on('admin notifications', adminNotifications);

// Verify the connection and to show their state.
// Open Block Ping Client.
socket.on('connecting', function () {
  refreshConnectionState(0);
});

socket.on('connect', function () {
  refreshConnectionState(1);

  /**
   * TODO: Victor: Borrar este comentario.
   * Dentro de esta función colocar a todos los "on" de socket
   * que se deban ejecutar siempre que la página cargue.
   */
});

socket.on('disconnect', function () {
  refreshConnectionState(2);
});
// End Block Ping client.