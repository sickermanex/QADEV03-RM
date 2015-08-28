/**
 * Conference Rooms library
 * Owner: Rebeca Vargas Garcia
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
var resourceEndpoint = endpoints.resourceByRoom.replace("[server]", settings.server)
	.replace("[port]", settings.port);

/*
 * Get all the rooms
 * @returns {Function}
 */
var getRooms = function(){
return request
		.get(roomsEndpoint);
};

exports.getRooms = getRooms;

/**
 * Get a especific room
 * @param {String} roomId
 * @returns {Function}
 */
var getRoom = function(roomId){
return request
		.get(roomIdEndpoint.replace("[roomId]", roomId));
};

exports.getRoom = getRoom;

/**
 * Update a specific room
 * @param {String} roomId
 * @param {Object} room
 * @param {String} token
 * @returns {Function}
 */
var updateRoom = function(roomId, room, token){
return request
		.put(roomIdEndpoint.replace("[roomId]", roomId))
		.set('Authorization', token)
		.send(room);
};

exports.updateRoom = updateRoom;

/**
 * Associate room
 * @param {String} roomId
 * @param {Object} resource
 * @param {String} token
 * @returns {Function}
 */

var associateRoom = function(roomId, resource, token){
	return request
			.post(resourcesEndpoint.replace("[roomId]", roomId))
			.set('Authorization', token)
			.send(resource)

};

exports.associateRoom = associateRoom;

/**
 * Get all room of specific service
 * @param {String} serviceId
 * @returns {Function}
 */

var getRoomsService = function(serviceId){

	return request
		.get(roomsServiceEndpoint.replace("[serviceId]", serviceId));
};

exports.getRoomsService = getRoomsService;

/**
 * Get a specific room of specific service
 * @param {String} serviceId
 * @param {String} roomId
 * @returns {Function}
 */

var getRoomService = function(serviceId,roomId){

	return request
		.get(roomServiceEndpoint.replace("[serviceId]", serviceId).replace("[roomId]", roomId));
};

exports.getRoomService = getRoomService;

/**
 * Update a specific room of specific service
 * @param {String} serviceId
 * @param {String} roomId
 * @param {Object} room
 * @param {String} token
 * @returns {Function}
 */

var updateRoomService = function(serviceId,roomId,room,token){

	return request
		.put(roomServiceEndpoint.replace("[serviceId]", serviceId).replace("[roomId]", roomId))
		.set('Authorization', token)
		.send(room);
};

exports.updateRoomService = updateRoomService;

/**
 * Get all resources of specific room
 * @param {String} roomId
 * @returns {Function}
 */

var getResourcesRoom = function(roomId){
	return request
		.get(resourcesEndpoint.replace("[roomId]", roomId));
};

exports.getResourcesRoom = getResourcesRoom;

/**
 * Get a specific resource of specific room
 * @param {String} roomId
 * @param {String} roomResourceId
 * @returns {Function}
 */


var getResourceRoom = function(roomId, roomResourceId){
	return request
		.get(resourceEndpoint.replace("[roomId]", roomId).replace("roomResourceId", roomResourceId));


};

exports.getResourceRoom = getResourceRoom;


/**
 * Update a specific resource of specific room
 * @param {String} roomId
 * @param {String} roomResourceId
 * @param {Object} resource
 * @param {String} token
 * @returns {Function}
 */

var updateResourceRoom = function(roomId, roomResourceId,resource, token){
	return request
		.put(resourceEndpoint.replace("[roomId]", roomId).replace("roomResourceId", roomResourceId))
		.set('Authorization', token)
		.send(resource);
};

exports.updateResourceRoom = updateResourceRoom;


/**
 * Delete a specific resource of specific room
 * @param {String} roomId
 * @param {String} roomResourceId
 * @param {String} token
 * @returns {Function}
 */

var deleteResourceRoom = function(roomId, roomResourceId, token){
	return request
		.del(resourceEndpoint.replace("[roomId]", roomId).replace("roomResourceId", roomResourceId))
		.set('Authorization', token)
};

exports.deleteResourceRoom = deleteResourceRoom;