/**
 * Client side, sockets operations.
 *
 * @type {*|io.Socket}
 */
var socket = io.connect(location.protocol + '//' + location.host);

socket.on('flash message', flash_message_launch);

// Verify the connection and to show their state.
// Open Block Ping Client.
socket.on('connecting', function () {
  refresh_connection_state(0);
});

socket.on('connect', function () {
  refresh_connection_state(1);

  /**
   * TODO: Victor: Borrar este comentario.
   * Dentro de esta función colocar a todos los "on" de socket
   * que se deban ejecutar siempre que la página cargue.
   */
});

socket.on('disconnect', function () {
  refresh_connection_state(2);
});
// End Block Ping client.