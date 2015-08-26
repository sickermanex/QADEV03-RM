/**
 * Conference Rooms library
 */
var request = require('superagent');

var endpoints = require('..\\endpoints\\conferenceRooms');
var settings = require('..\\settings');

var loginEndpoint = endpoints.login.replace("[server]", settings.server)
	.replace("[port]", settings.port);

var roomsEndpoint = endpoints.rooms.replace("[server]", settings.server)
	.replace("[port]", settings.port);
var roomIdEndpoint = endpoints.roomsById.replace("[server]", settings.server)
	.replace("[port]", settings.port);
var resourcesEndpoint = endpoints.resourcesbyRoom.replace("[server]", settings.server)
	.replace("[port]", settings.port);
var roomsServiceEndpoint = endpoints.roomsByService.replace("[server]", settings.server)
	.replace("[port]", settings.port);
var roomServiceEndpoint = endpoints.roomByService.replace("[server]", settings.server)
	.replace("[port]", settings.port);

/**
 * Get token
 */

var getToken = function(login){
return request
		.post(loginEndpoint)
		.send(login);
};

exports.getToken = getToken;

/*
 * Get all the rooms
 */
var getRooms = function(){
return request
		.get(roomsEndpoint);
};

exports.getRooms = getRooms;

/**
 * Get a especific room
 */
var getRoom = function(roomId){
return request
		.get(roomIdEndpoint.replace("[roomId]", roomId));
};

exports.getRoom = getRoom;

/**
 * Update a specific room
 */
var updateRoom = function(roomId, room, token){
return request
		.put(roomIdEndpoint.replace("[roomId]", roomId))
		.set('Authorization', 'jwt ' + token)
		.send(room);
};

exports.updateRoom = updateRoom;

/**
 * Associate room
 */

var associateRoom = function(roomId, rooms, token){
	return request
			.post(resourcesEndpoint.replace("[roomId]", roomId))
			.set('Authorization', 'jwt ' + token)
			.send(rooms)

};

exports.associateRoom = associateRoom;

var getRoomsService = function(serviceId){

	return request
		.get(roomsServiceEndpoint.replace("[serviceID]", serviceId));
};

exports.getRoomsService = getRoomsService;

var getRoomService = function(serviceId,roomId){

	return request
		.get(roomsServiceEndpoint.replace("[serviceId]", serviceId).replace("[roomI]", roomId));
};

exports.getRoomService = getRoomService;


