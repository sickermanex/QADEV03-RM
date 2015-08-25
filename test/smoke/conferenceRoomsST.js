/**
 * Conference Rooms Smoke Test
 *
 */

var expect = require('chai').expect;
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var tokenLib = require('../../lib/tokenLib');
var settings = require('../../settings.json');

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
			.associateRoom('12232',rooms, token)
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



});
