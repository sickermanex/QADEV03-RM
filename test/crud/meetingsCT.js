//Test cases of meetings CRUDs
var expect = require('chai').expect;
var meetings = require('..\\..\\lib\\meetingsLib');
var rooms = require('..\\..\\lib\\roomsLib');
var services = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');

var roomId = [];
var meetingId;
var serviceId;
var authToken;
var response;

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
					.getAllRooms()
					.end(function(err,res){
						response = res.body;
						for(var i in response)
						{
							roomId.push(response[i]._id);							
						}
						done();
					});
			});					
	});
	
	/**
	Test case 1: Get all the meetings from a room
	*/	
	it('READ all the meetings from a room',function(done){
		meetings			
			.getAllRoomMeetings(serviceId,roomId[0])
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
			.getSpecificRoomMeeting(serviceId,roomId[0],meetingId)
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
		meetings
			.createNewMeeting(serviceId,roomId[0])
			.end(function(err,res){
				response = res.body;
				meetingId = response._id;
				expect(response.serviceId).to.equal(serviceId);
				expect(response.roomId).to.equal(roomId[0]);
				expect(res.status).to.equal(200);
				done();
			});
	});
	
	/**
	Test case 4: Update a specific meeting in a specific room
	*/
	it('UPDATE a specific meeting in a specific room',function(done){		
		meetings
			.updateMeeting(serviceId,roomId[0],meetingId)
			.end(function(err,res){
				response = res.body;				
				expect(response.serviceId).to.equal(serviceId);
				expect(response.roomId).to.equal(roomId[0]);
				expect(response._id).to.equal(meetingId);
				expect(res.status).to.equal(200);				
				done();
			});
	});
	
	/**
	Test case 5: Delete a specific meeting in a specific room
	*/
	it.skip('DELETE a specific meeting in a specific room',function(done){
		
		meetings
			.deleteMeeting(serviceId,roomId[0],meetingId)
			.end(function(err,res){
				response = res.body;				
				expect(response.serviceId).to.equal(serviceId);
				expect(response.roomId).to.equal(roomId[0]);
				expect(response._id).to.equal(meetingId);
				expect(res.status).to.equal(200);
				done();
			});
	});
});