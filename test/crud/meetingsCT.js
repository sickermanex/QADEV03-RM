//Test cases of meetings CRUDs
var expect = require('chai').expect;
var meetings = require('..\\..\\lib\\meetingsLib');
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var services = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
var config = require('..\\..\\config\\meetingsConfig.json');

var roomsInfo = [];
var roomId;
var roomName;
var roomMail;
var meetingId;
var serviceId;
var authToken;
var response;
var jsonData;

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd;

var enabledRooms = function(roomsInfo){
	for(var i in roomsInfo)
	{
		if(roomsInfo[i].enabled)
		{
			roomId = roomsInfo[i]._id;
			roomName = roomsInfo[i].displayName;
			roomMail = roomsInfo[i].emailAddress;
			break;
		}
	}
};

describe('..:: Meetings CRUD Test cases ::..',function(){	
	
	this.timeout(settings.setDelayTime);
	this.slow(settings.setErrorMaxTime);
	
	/**
	Get the authorization token
	*/
	
	before('Obtain the authorization token access to another endpoints',function(done){
		tokenLib
			.getToken(done,function(){
				authToken = arguments[0];
			});			
	});
	
	/**
	Get the IDs from the exchange service and the rooms
	*/
	
	before('Getting the Service and the Rooms IDs',function(done){	
		services
			.getServicesId(authToken)
			.end(function(err,res){			
				response = res.body;
				serviceId = response[0]._id;
				rooms
					.getRooms()
					.end(function(err,res){
						response = res.body;
						for(var i in response)
						{
							roomsInfo.push(response[i]);								
						}						
						enabledRooms(roomsInfo);
						done();
					});
			});					
	});
	
	/**
	Test case 1: Get all the meetings from a room
	*/	
	it('READ all the meetings from a room',function(done){
		meetings			
			.getAllRoomMeetings(serviceId,roomId)
			.end(function(err,res){
				response = res.body;					
				meetingId = response._id;
				expect(response.serviceId).to.equal(serviceId);
				expect(res.status).to.equal(200);	
				done();
			});
	});
	
	/**
	Test case 2: Get the information of a specific meeting
				 from a specific room
	*/
	it('READ a specific meeting',function(done){		
		meetings
			.getSpecificRoomMeeting(serviceId,roomId,meetingId)
			.end(function(err,res){
				response = res.body;
				expect(response.serviceId).to.equal(serviceId);
				expect(response._id).to.equal(meetingId);
				expect(res.status).to.equal(200);				
				done();
			});
	});
	
	/**
	Test case 3: Create a new meeting in a specific room
	*/
	it('CREATE a new meeting in a specific room',function(done){
		jsonData = config.newMeeting;	
		jsonData.location = roomName;
		jsonData.roomEmail = roomMail;
		jsonData.organizer = settings.exchangeAccount;	
		jsonData.start = jsonData.start.replace('[date]',today);
		jsonData.end = jsonData.end.replace('[date]',today);
		meetings
			.createNewMeeting(serviceId,roomId,jsonData)
			.end(function(err,res){
				response = res.body;	
				meetingId = response._id;
				expect(response.serviceId).to.equal(serviceId);
				expect(response.roomId).to.equal(roomId);
				expect(res.status).to.equal(200);
				done();
			});
	});
	
	/**
	Test case 4: Update a specific meeting in a specific room
	*/
	it('UPDATE a specific meeting in a specific room',function(done){			
		meetings
			.updateMeeting(serviceId,roomId,meetingId)
			.end(function(err,res){
				response = res.body;				
				expect(response.serviceId).to.equal(serviceId);
				expect(response.roomId).to.equal(roomId);
				expect(response._id).to.equal(meetingId);
				expect(res.status).to.equal(200);				
				done();
			});
	});
	
	/**
	Test case 5: Delete a specific meeting in a specific room
	*/
	it('DELETE a specific meeting in a specific room',function(done){
		
		meetings
			.deleteMeeting(serviceId,roomId,meetingId)
			.end(function(err,res){
				response = res.body;				
				expect(response.serviceId).to.equal(serviceId);
				expect(response.roomId).to.equal(roomId);
				expect(response._id).to.equal(meetingId);
				expect(res.status).to.equal(200);
				done();
			});
	});
});
