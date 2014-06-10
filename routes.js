/**
 * Routes.
 * */
var express = require('express');

module.exports = function (app) {

	// Create sub-routes for API.
	var api_route = express.Router();

	// Route with sub-routes in api_route variable.
	// Access by: http://<server>/api/<sub-routes>.
	app.use('/api', api_route);

	api_route.param('id', function (req, res, next, id) {
		console.log('testing ok get id ' + id);
		next();
	});

	// Access by: http://<server>/api/config/:id
	api_route.get('/config/:id', function (req, res, next) {
		console.log(req.params.id)
		next();
	});

	// Access by: http://<server>/api/config
	api_route.route('/config')
		.all(function (req, res, next) {
			console.log('testing, entry in route "all"');
			next();
		})
		.get(function (req, res, next) {
			console.log('testing ok GET config');
			res.send('Hello Winner');
		})
		.post(function (req, res, next) {
			console.log('testing ok POST config');
			next();
		});
}