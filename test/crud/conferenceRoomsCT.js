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
     * Title: PUT room shortcut API update the information from a specific room
     */
    it.only('Update a Room', function(done){
        var roomId;
        var room ={
            "enabled": false,
            "customDisplayName": "A better name"
        };

        rooms
            .getRooms()
            .end(function(err2, res2){
                roomId = res2.body[0]._id;
        rooms
            .updateRoom(roomId, room, token)
            .end(function(err, res){
                var status = res.status;
                expect(status).to.equal(401);
                done();
            });

            });
    });


});