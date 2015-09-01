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


/**

Story: Create meetings without the proper values.

As a user with privileges on a conference room create 
a meeting without the resources pointed in the documentation

Scenario 1
Create a meeting without assigning resources.
Given: A enabled conference room.
When: A meeting without resources is created.
Then: Ensure than the status code is 409 of conflict with the server

Scenario 2
Create a meeting with special characters as an organizer.
Given: A enabled conference room.
When: A meeting with special characters as the organizer name is created.
Then: Ensure than the status code is 409 of conflict with the server because the organizer should be an user 
registered in the domain with privileges of meetings creation

**/

describe('Create meetings without the proper values.',function(){
	before('Obtain the authorization token access to another endpoints',function(done){
		tokenLib
			.getToken(done,function(){
				authToken = arguments[0];
			});			
	});
	context('A enabled conference room',function(){
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
		
		afterEach('Delete the meeting',function(done){
			console.log('Deleting the created meetings');
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
		describe('Scenario 1: Create a meeting without assigning resources',function(){				
			context('When: A meeting without resources is created',function(){							
				it('Then: Ensure than the status code is 409 of conflict with the server',function(done){
					jsonData = config.newMeeting;	
					jsonData.location = roomName;
					jsonData.roomEmail = roomMail;
					jsonData.resources = []; /*Removing the resources*/
					jsonData.organizer = settings.exchangeAccount;	
					jsonData.start = jsonData.start.replace('[date]',today);
					jsonData.end = jsonData.end.replace('[date]',today);
					meetings
						.createNewMeeting(serviceId,roomId,jsonData)
						.end(function(err,res){
							response = res.body;							
							meetingId = response._id;
							if(res.status==200)
							{								
								console.log('** Test case: FAILED because there are no conflicts with the server since there are not resources assigned **\n','resources current value: '+response.resources);						
							}
							else
							{
								console.log('** Test case: PASSED because there are conflicts with the server since there are not resources assigned **\n','resources current value: '+response.resources);
							}
							expect(response.serviceId).to.equal(serviceId);
							expect(response.roomId).to.equal(roomId);
							expect(res.status).to.equal(409);	
							done();							
						});
				});
			});
		});
		
		describe('Scenario 2: Create a meeting with special characters as an organizer.',function(){		
			context('When: A meeting with special characters as the organizer name is created',function(){
							
				it('Then: Ensure than the status code is 409 of conflict with the server because the organizer should be an user registered in the domain with privileges of meetings creation on the conference room',function(done){
					jsonData = config.newMeeting;	
					jsonData.location = roomName;
					jsonData.roomEmail = roomMail;
					jsonData.organizer = '«¼»';	/* Special characters on the organizer */
					jsonData.start = jsonData.start.replace('[date]',today);
					jsonData.end = jsonData.end.replace('[date]',today);
					meetings
						.createNewMeeting(serviceId,roomId,jsonData)
						.end(function(err,res){
							response = res.body;							
							meetingId = response._id;
							if(res.status==200)
							{								
								console.log('** Test case: FAILED because there are no conflicts with the server since the organizer is not a registered user with privileges of meetings creation on the conference room **\n','resources current value: '+response.organizer);						
							}
							else
							{
								console.log('** Test case: PASSED because there are conflicts with the server since the organizer is not a registered user with privileges of meetings creation on the conference room **\n','resources current value: '+response.organizer);
							}
							expect(response.serviceId).to.equal(serviceId);
							expect(response.roomId).to.equal(roomId);
							expect(res.status).to.equal(409);	
							done();							
						});
				});
			});
		});
	});		
});