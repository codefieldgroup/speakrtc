var io = require('socket.io'),
  easyrtc = require("easyrtc"),

  room = require('../controllers/room');

exports.socketServer = function (app, server) {
  var socket = io.listen(server);
  socket.set('log level', 1);
  //socket.set("transports", ["xhr-polling"]);
  //socket.set('browser client minification', true);
  //socket.set('browser client gzip', true);

  module.exports.export = socket;

  /**
   * Socket operations.
   */
  socket.sockets.on('connection', function (client) {
    console.log("New client is here!");

    client.on('new user room', function (data) {
      room.new_user_room(io, client, data);
    });
  });

  /**
   * EasyRTC operations.
   */
  var rtc = easyrtc.listen(app, socket);

  // TODO: Victor: Borrar estas líneas comentareadas.
  /*easyrtc.events.on('roomJoin', function (parameters) {
   console.log(parameters.socket.id);
   });*/
};