var request = require('superagent');
require('superagent-proxy')(request);

var endpoints = require('..\\endpoints\\meetingsEndPoints.json');
var config = require('..\\config\\meetingsConfig.json');

var rooms;

var getAllRooms = function(){
	rooms = endpoints.getRooms.replace(['[ipNport]'],'172.20.208.105:4040');
	return request
		.get(rooms)
};

exports.getAllRooms = getAllRooms;