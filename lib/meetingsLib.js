//Functions for Smoke tests
var request = require('superagent');
require('superagent-proxy')(request);
var btoa = require('btoa');
var settings = require('..\\settings.json');
var endpoints = require('..\\endpoints\\meetingsEndPoints.json');
var config = require('..\\config\\meetingsConfig.json');

var meetings;


var basicAuth = config.authBasic;	
	
var jsonData;

/**
Get all the meetings from a specific room
Parameters: serviceId, roomId.
Returns: Function
*/

var getAllRoomMeetings = function(serviceId, roomId){	
	meetings = endpoints.roomMeetings.replace(['[ipNport]'],settings.server+':'+settings.port).replace('[serviceID]',serviceId).replace('[roomID]',roomId);
	return request
		.get(meetings)
};

exports.getAllRoomMeetings = getAllRoomMeetings;

/**
Get the information of a specific meeting in a specific room
Parameters: serviceId, roomId, meetingId.
Returns: Function
*/

var getSpecificRoomMeeting = function(serviceId,roomId,meetingId){
	meetings = endpoints.roomMeetings.replace(['[ipNport]'],settings.server+':'+settings.port).replace('[serviceID]',serviceId).
	replace('[roomID]',roomId).replace('[meetingID]',meetingId);
	return request
		.get(meetings)
};

exports.getSpecificRoomMeeting = getSpecificRoomMeeting;

/**
Create a new meeting in a specific room
Parameters: serviceId, roomId.
Returns: Function
*/

var createNewMeeting = function(serviceId,roomId,roomName,roomMail){
	
	var authKey = 'Basic '+btoa(basicAuth.user+':'+basicAuth.pass);
	
	jsonData = config.newMeeting;	
	
	jsonData.location = roomName;
	jsonData.roomEmail = roomMail;
	
	meetings = endpoints.allMeetings.replace(['[ipNport]'],settings.server+':'+settings.port).replace('[serviceID]',serviceId).replace('[roomID]',roomId);
	
	return request
		.post(meetings)
		.set('Authorization',authKey)
		.set('Content-Type','application/json')
		.send(jsonData)
};

exports.createNewMeeting = createNewMeeting;

/**
Update a meeting from a specific room
Parameters: serviceId, roomId, meetingId.
Returns: Function
*/

var updateMeeting = function(serviceId,roomId,meetingId,roomName,roomMail){
		
	var authKey = 'Basic '+btoa(basicAuth.user+':'+basicAuth.pass);

	jsonData = config.updateMeeting;		
	
	jsonData.location = roomName;
	jsonData.roomEmail = roomMail;
	
	meetings = endpoints.specificMeeting.replace(['[ipNport]'],settings.server+':'+settings.port).replace('[serviceID]',serviceId).replace('[roomID]',roomId).replace('[meetingID]',meetingId);
	return request
		.put(meetings)
		.set('Authorization',authKey)
		.send(jsonData)
};

exports.updateMeeting = updateMeeting;

/**
Delete a meeting from a specific room
Parameters: serviceId, roomId, meetingId.
Returns: Function
*/

var deleteMeeting = function(serviceId,roomId,meetingId){

	var authKey = 'Basic '+btoa(basicAuth.user+':'+basicAuth.pass);
	meetings = endpoints.specificMeeting.replace(['[ipNport]'],settings.server+':'+settings.port).replace('[serviceID]',serviceId).replace('[roomID]',roomId).replace('[meetingID]',meetingId);
	return request
		.del(meetings)
		.set('Authorization',authKey)
};

exports.deleteMeeting = deleteMeeting;