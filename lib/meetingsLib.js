//Functions for Smoke tests
var request = require('superagent');
require('superagent-proxy')(request);
var btoa = require('btoa');

var endpoints = require('..\\endpoints\\meetingsEndPoints.json');
var config = require('..\\config\\meetingsConfig.json');

var meetings;


var basicAuth = config.authBasic;
	basicAuth.user = basicAuth.user.replace('[user64]','Administrator');
	basicAuth.pass = basicAuth.pass.replace('[pass64]','Control123');	
var jsonData;



var getAllRoomMeetings = function(serviceId, roomId){	
	meetings = endpoints.roomMeetings.replace(['[ipNport]'],'172.20.208.105:4040').replace('[serviceID]',serviceId).replace('[roomID]',roomId);
	return request
		.get(meetings)
};

exports.getAllRoomMeetings = getAllRoomMeetings;

var getSpecificRoomMeeting = function(serviceId,roomId,meetingId){
	meetings = endpoints.roomMeetings.replace(['[ipNport]'],'172.20.208.105:4040').replace('[serviceID]',serviceId).replace('[roomID]',roomId).replace('[meetingID]',meetingId);
	return request
		.get(meetings)
};

exports.getSpecificRoomMeeting = getSpecificRoomMeeting;

var createNewMeeting = function(serviceId,roomId){
	
	var authKey = 'Basic '+btoa(basicAuth.user+':'+basicAuth.pass);
	
	jsonData = config.newMeeting;
	jsonData.organizer = jsonData.organizer.replace('[user]','Administrator');
	jsonData.title = jsonData.title.replace('[title]','Whatever');
	jsonData.start = jsonData.start.replace('[sdate]','2015-08-25').replace('[stime]','14:00:00');
	jsonData.end = jsonData.end.replace('[edate]','2015-08-25').replace('[etime]','14:30:00');
	jsonData.location = jsonData.location.replace('[roomName]','CF001');
	jsonData.roomEmail = jsonData.roomEmail.replace('[roomMail]','ConferenceRoom001@atxrm.com');	
	
	meetings = endpoints.allMeetings.replace(['[ipNport]'],'172.20.208.105:4040').replace('[serviceID]',serviceId).replace('[roomID]',roomId);
	
	return request
		.post(meetings)
		.set('Authorization',authKey)
		.set('Content-Type','application/json')
		.send(jsonData)
};

exports.createNewMeeting = createNewMeeting;

var updateMeeting = function(serviceId,roomId,meetingId){
		
	var authKey = 'Basic '+btoa(basicAuth.user+':'+basicAuth.pass);

	jsonData = config.updateMeeting;		
	jsonData.title = jsonData.title.replace('[title]','Updated meeting :D');
	jsonData.start = jsonData.start.replace('[sdate]','2015-08-25').replace('[stime]','15:00:00');
	jsonData.end = jsonData.end.replace('[edate]','2015-08-25').replace('[etime]','15:30:00');	
	meetings = endpoints.specificMeeting.replace(['[ipNport]'],'172.20.208.105:4040').replace('[serviceID]',serviceId).replace('[roomID]',roomId).replace('[meetingID]',meetingId);
	return request
		.put(meetings)
		.set('Authorization',authKey)
		.send(jsonData)
};

exports.updateMeeting = updateMeeting;

var deleteMeeting = function(serviceId,roomId,meetingId){

	var authKey = 'Basic '+btoa(basicAuth.user+':'+basicAuth.pass);
	meetings = endpoints.specificMeeting.replace(['[ipNport]'],'172.20.208.105:4040').replace('[serviceID]',serviceId).replace('[roomID]',roomId).replace('[meetingID]',meetingId);
	return request
		.del(meetings)
		.set('Authorization',authKey)
};

exports.deleteMeeting = deleteMeeting;