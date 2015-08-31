/**
 * Created by aleidasarzuri on 8/29/2015.
 */
var expect = require('chai').expect;
var config = require('..\\..\\settings.json');
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var content = require('..\\..\\lib\\outOfOrderlib');
var tokenLib =require('..\\..\\lib\\tokenLib');
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var mongoserv = require('..\\..\\lib\\mongoConnection.js');
var token;
/*
 The before method creates a token that is stored in the "token" global variable, and it's used
 for the whole group of test cases in this test suit.
 */
before('Setting the token', function(done){
    tokenLib
        .getToken(done, function(){
            token = arguments[0];
        });

});
/*Scenario 1: Try of to create an out of order on disabled conference room

 Given there is a conference room “Conference Room 1”
 And the “Conference Room 1” is disabled
 When Try of to create an out-of-order “Temporarily Out of Order”
 Then ensure that a response with status code 4xx is returned
 And ensure that an out-of-order is not associated at room
* */
/**
 * Created by Aleida on 21/08/2015.
 */
/* Out of order Smoke Test*/

describe('There is a conference room “Conference Room xxx” ', function() {
    /*Variables
     * roomId- the id of a room
     * servId- the id of the mail service
     * arrayOutIDs- the list of ids of out-of-order
     * OutByRoomIDs- the list of ids "out-of-orders" by room
     * */
    var arrayOutIDs = [];
    var OutByRoomIDs = [];
    this.timeout(config.setDelayTime);
    this.slow(config.setErrorMaxTime);

    /*variable to test case delete*/
    var actualResDel;


    /*DESCRIBE-CRUD test cases for: UPDATE and GETs with precondition
     * */
    describe('Try of to create an out of order on disabled conference room ' , function () {
        context('',function(){
            var actualRoom;
            var stateBeforeUpdate = '';
            var roomId;
            var servId;


            before('Disabled a room',function(done){
                //update a room disabled
                var updateRoom = {
                    "enabled": false
                };
                rooms
                    .getRooms()
                    .end(function(err, res){
                        roomId = res.body[0]._id;
                        servId = res.body[0].serviceId;

                        stateBeforeUpdate = res.body[0].enabled;
                        rooms
                            .updateRoom(roomId, updateRoom, token)
                            .end(function(err, res){
                                var status = res.status;
                                actualRoom = res.body;
                                expect(status).to.equal(200);
                                expect(actualRoom.enabled).to.equal(updateRoom.enabled);
                                done();
                            });
                     });
            });
            after('Put a room on state prev',function(done){
                //update a room to enabled
                var restoredRoom = {
                    "enabled": stateBeforeUpdate
                };
                rooms
                    .updateRoom(roomId, restoredRoom, token)
                    .end(function(err, res){
                        done();
                    });

            });
            describe('Scenario 1: Try of to create an out-of-order “Temporarily Out of Order”',function(){
                context('When create an out-of-order on a disabled room ',function(){
                    var oooId;

                    after('after-Delete',function (done) {
                        outOfOrders
                            .deleteOutOfOrder(servId, roomId, token, oooId)
                            .end(function (error, resp) {
                                done();
                            });
                    });
                    it('ensure that a response with status code 4xx is returned',function(done){

                       var res = content.getContentCreate(roomId);
                           outOfOrders
                           .createOutOfOrder(servId, roomId, res, token)
                           .end(function (err, res) {
                                oooId = res.body._id;
                                expect(res.status).to.be.at.least(400);
                                done();
                                });
                    });
                    it('Ensure that an out-of-order is not associated at room',function(done){
                        outOfOrders
                            .getOutOfOrderById(servId, roomId, oooId)
                            .end(function (error, resp) {
                                expect(resp.status).to.equal(404);

                                done();
                            });

                    });

                });

            });
        });
    });
    describe('Create an out of order on a room that have a meeting ' , function () {

    });


});

