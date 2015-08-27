//Test cases of meetings CRUDs
var expect = require('chai').expect;
var meetings = require('..\\..\\lib\\meetingsLib');
var rooms = require('..\\..\\lib\\roomsLib');
var services = require('..\\..\\lib\\serviceLib');

var roomId = [];
var serviceId;
var authToken;
var response;

describe('..:: Meetings ::..',function(){
	it('3.1 All the meetings from a room',function(done){
		meetings
			.getAllRoomMeetings('a1b2c3d4','e4f6g7h8')
			.end(function(err,res){
				response = res.body;
				console.log('The response status code should be different than 500 and is: '+res.status);					
				expect(res.status).to.not.equal(500);
				done();
			});
	});
	it('3.2 Get all the meetings from a specific room',function(done){
		meetings
			.getSpecificRoomMeeting('a1b2c3','d4e5f6','g7h8i9')
			.end(function(err,res){
				response = res.body;
				console.log('The response status code should be different than 500 and is: '+res.status);
				expect(res.status).to.not.equal(500);
				done();
			});
	});
	it('3.3 Create a new meeting in a specific room',function(done){
		var jsonData = {
			"Here":"val1",
			"Goes":"val2",
			"Something":"val3"
		};
		meetings
			.createNewMeeting('a1b2c3','d4e5f6',jsonData)
			.end(function(err,res){
				response = res.body;
				console.log('The response status code should be different than 500 and is: '+res.status);
				expect(res.status).to.not.equal(500);
				done();
			});
	});
	
	it('3.4 Edit a specific meeting in a specific room',function(done){
		var jsonData = {
			"Here":"val1",
			"Goes":"val2",
			"Something":"val3"
		};
		meetings
			.updateMeeting('a1b2c3','d4e5f6','g7h8i9',jsonData)
			.end(function(err,res){
				response = res.body;
				console.log('The response status code should be different than 500 and is: '+res.status);
				expect(res.status).to.not.equal(500);				
				done();
			});
	});
	
	it('3.5 Delete a specific meeting in a specific room',function(done){
		
		meetings
			.deleteMeeting('a1b2c3','d4e5f6','g7h8i9')
			.end(function(err,res){
				response = res.body;
				console.log('The response status code should be different than 500 and is: '+res.status);
				expect(res.status).to.not.equal(500);				
				done();
			});
	});
});