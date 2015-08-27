/**
 * Conference Rooms Smoke Test
 * Owner: Rebeca Vargas Garcia
 */
var expect = require('chai').expect;
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');

describe('Smoke Test - Conference Rooms', function(){
	this.timeout(settings.setDelayTime);
	this.slow(settings.setErrorMaxTime);

	/**
	 * Get a token
	 *
	 */
	var token;

	before('Setting the token', function(done){
		tokenLib
			.getToken(done, function(){
				token = arguments[0];
			});
	});

	/**
	 * Test Case
	 * Title: The GET rooms shortcut  API is present in the application
	 */
	it('Get All Rooms', function(done){
		rooms
			.getRooms()
			.end(function(err, res){
				var status = res.status;
			
				expect(status).to.equal(200);
				done();
			});		
	});
	
	/**
	 *Test Case
	 *Title: The GET rooms shortcut  API is present in the application using specific idRoom
	 */
	it('Get a Room', function(done){

		rooms
			.getRoom('123456')
			.end(function(err, res){
				var status = res.status;
			
				expect(status).to.equal(404);
				done();
			});		
	});
	
	/**
	 * Test Case
	 * Title: The PUT  rooms shortcut  API is present in the application
	 */
	it('Update a Room', function(done){
		var room ={
					"enabled": false,
  					"customDisplayName": "A better name"

					};
		rooms
			.updateRoom('123456', room, token)
			.end(function(err, res){
				var status = res.status;
			
				expect(status).to.equal(404);
				done();
			});		
	});
	
	/**
	 * Test Case
	 * Title: Associate Resource shortcut API to a Room is present in the application
	 */
	it('Associate a Resource', function(done){
		var resource ={
    					"resourceId": "54f79121b5f7d44",
   					 	"quantity": 5

					};
		rooms
			.associateRoom('12232',resource, token)
			.end(function(err, res){

				var status = res.status;

				expect(status).to.equal(404);
				done();

			});
	});
	
	/**
	 * Test Case
	 * Title: The GET rooms shortcut  API is present in the application when get rooms of specific service
	 */
	it('Get all rooms of specific service', function(done){
		rooms
			.getRoomsService('1234')
			.end(function(err, res){
				var status = res.status;

				expect(status).to.equal(404);
				done();
			});
	});

	/**
	 * Test Case
	 * Title: The GET rooms shortcut  API is present in the application when get a specific room of specific service
	 */
	it('Get a room of specific service', function(done){
		rooms
			.getRoomService('12344','56677')
			.end(function(err, res){
				var status = res.status;

				expect(status).to.equal(404);
				done();
			});
	});

	/**
	 * Test Case
	 * Title: The PUT rooms shortcut  API is present in the application
	 * when update a specific room of specific service
	 */
	it('Update a room of specific service', function(done){
		var room ={
			"enabled": false,
			"customDisplayName": "A better name"
		};
		rooms
			.updateRoomService('12344','56677',room, token)
			.end(function(err, res){
				var status = res.status;

				expect(status).to.equal(404);
				done();
			});
	});


	/**
	 * Test Case
	 * Title: The GET rooms shortcut  API is present in the application
	 * when gets all the specified room’s resources
	 */
	it('Get all resources of specific room', function(done){
		rooms
			.getResourcesRoom('12344')
			.end(function(err, res){
				var status = res.status;

				expect(status).to.equal(404);
				done();
			});
	});

	/**
	 * Test Case
	 * Title: The GET rooms shortcut  API is present in the application
	 * when gets a specific resource from a specific room
	 */
	it('Get specific resource from a specific room', function(done){
		rooms
			.getResourceRoom('12344', '26349')
			.end(function(err, res){
				var status = res.status;

				expect(status).to.equal(404);
				done();
			});
	});

	/**
	 * Test Case
	 * Title: Update a specific resource from specific room shortcut API  is present in the application
	 */
	it('Update a specific resource from specific room', function(done){
		var resource ={
			"quantity": 5
		};
		rooms
			.updateResourceRoom('12232','24345', resource, token)
			.end(function(err, res){

				var status = res.status;

				expect(status).to.equal(404);
				done();

			});
	});

	/**
	 * Test Case
	 * Title: Delete a especific resource from specific room shortcut API  is present in the application
	 */
	it('Delete a specific resource from specific room', function(done){
		rooms
			.updateResourceRoom('12232','24345', token)
			.end(function(err, res){

				var status = res.status;

				expect(status).to.equal(404);
				done();

			});
	});
});