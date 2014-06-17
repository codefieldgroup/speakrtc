var io = require('socket.io');

exports.socketServer = function (app, server) {
  var socket = io.listen(server);
  socket.set('log level', 1);
  socket.set("transports", ["xhr-polling"]);
  socket.set('browser client minification', true);
  //socket.set('browser client gzip', true);

  module.exports.export = socket;

  socket.sockets.on('connection', function (client) {
    console.log("New client is here!");

  });
};