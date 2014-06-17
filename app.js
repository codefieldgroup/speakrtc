// Module dependencies.
var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  logger = require('logger'),
  http = require('http'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,

  sockets = require('./routes/sockets.js'),

  User = require('./models/user'),

  config = require('./config.json');

var app = express();

// Configuration express.
app.set('port', config.website.port || process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser());
app.use(methodOverride());

app.use(cookieParser('your secret here'));
app.use(session());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.engine('jade', require('jade').__express);

// Configure passport.
passport.use(new LocalStrategy(User.authenticate()));

// Use static serialize and deserialize of model for passport session support.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect mongoose.
require('./db.js').startup();
require('./db.js').install(function (error) {
  if (error) {
    console.log('Error setting the database.');
  }
});

// Setup express routes.
require('./routes')(app);

// Server Block.
var server = http.createServer(app);

// Socket.
sockets.socketServer(app, server);

server.listen(app.get('port'), function () {
  console.log("Web Monitor server listening by port: " + app.get('port'));
});
