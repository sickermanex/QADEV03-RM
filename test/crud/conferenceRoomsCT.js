/**
 * Conference Rooms CRUD Test
 */

var expect = require('chai').expect;
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var tokenLib = require('../../lib/tokenLib');
var settings = require('../../settings.json');




describe('CRUD Test - Conference Rooms', function(){
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
     * Title: GET room shortcut API returns the information of all rooms
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
     *Title: GET room shortcut API returns the information from a specific room
     */
    it('Get a Room', function(done){
        var roomId;

        rooms
            .getRooms()
            .end(function(err1, res1){
                roomId = res1.body[0]._id;
                rooms
                .getRoom(roomId)
                    .end(function(err, res) {
                        var status = res.status;
                        expect(status).to.equal(200);
                        done();
                    });
            });
    });

    /**
     * Test Case
     * Title: PUT room shortcut API  returns the information from a specific room
     */
    it('Update a Room', function(done){
        var roomId;
        var room ={
            "enabled": false,
            "customDisplayName": "A better name"
        };

        rooms
            .getRooms()
            .end(function(err, res){
                roomId = res.body[0]._id;


                rooms
                    .updateRoom(roomId, room, token)
                    .end(function(err, res){
                        var status = res.status;
                        var displayname = res.body.customDisplayName;
                        var nameChanged = room.customDisplayName;
                        expect(status).to.equal(200);
                        expect(nameChanged).to.equal(displayname);
                        done();
                    });

            });
    });

    /**
     * Test Case
     * Title: POST rooms shortcut API returns the information from associate Resource to a Room
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
     * Title: GET rooms shortcut  API returns the information when get rooms of specific service
     */
    it('Get all rooms of specific service', function(done){
        var serviceId;
        rooms
            .getRooms()
            .end(function(err, res) {
                serviceId = res.body[0].serviceId;
                rooms
                    .getRoomsService(serviceId)
                    .end(function (err, res) {
                        var status = res.status;
                        expect(status).to.equal(200);

                        done();
                    });
            });
    });

    /**
     * Test Case
     * Title: GET rooms shortcut  API is present in the application when get a specific room of specific service
     */
    it('Get a room of specific service', function(done){
        var roomId;
        var serviceId;

        rooms
            .getRooms()
            .end(function(err, res) {
                serviceId = res.body[0].serviceId;
                roomId = res.body[0]._id;
                rooms
            .getRoomService(serviceId,roomId)
            .end(function(err, res){
                var status = res.status;

                expect(status).to.equal(200);
                done();
            });

            });
    });



});