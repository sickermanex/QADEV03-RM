var request = require('superagent');
require('superagent-proxy')(request);

var endpoints = require('..\\endpoints\\meetingsEndPoints.json');
var config = require('..\\config\\meetingsConfig.json');
var settings = require('..\\settings.json');

var rooms;

var getAllRooms = function(){
	rooms = endpoints.getRooms.replace(['[ipNport]'],settings.server+':'+settings.port);
	return request
		.get(rooms)
};

exports.getAllRooms = getAllRooms;