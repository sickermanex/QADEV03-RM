//Test cases of meetings CRUDs
var expect = require('chai').expect;
var meetings = require('..\\..\\lib\\meetingsLib');
var rooms = require('..\\..\\lib\\roomsLib');
var services = require('..\\..\\lib\\serviceLib');

var roomId = [];
var meetingId;
var serviceId;
var authToken;
var response;

describe('..:: Meetings ::..',function(){	
	
	this.timeout(10000);

	before(function(done){
		rooms
			.getAllRooms()
			.end(function(er,res){
				response = res.body;
				for(var i in response)
				{
					roomId.push(response[i]._id);						
				}
				services
					.getToken()
					.end(function(err,res){
						response = res.body;
						authToken = "jwt "+response.token;	
						services
							.getServices(authToken)
							.end(function(err,res){
								response = res.body;
								serviceId = response[0]._id;								
								done();
							});
					});
			});		
	});
	
	
	it('3.1 READ all the meetings from a room',function(done){
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
	it('3.2 READ a specific meeting',function(done){
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
	it('3.3 Create a new meeting in a specific room',function(done){
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
	
	it('3.4 Edit a specific meeting in a specific room',function(done){		
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
	
	it('3.5 Delete a specific meeting in a specific room',function(done){
		
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