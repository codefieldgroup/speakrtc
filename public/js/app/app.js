'use strict';

// Declare app level module which depends on filters, and services.
var app = angular.module('speakrtc', ['ngResource']).

	// Routes of APP.
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

		$routeProvider.otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
	}]
);
