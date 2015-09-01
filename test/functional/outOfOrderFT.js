//Test cases of meetings CRUDs
var expect = require('chai').expect;
var meetings = require('..\\..\\lib\\meetingsLib');
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var services = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var content = require('..\\..\\lib\\outOfOrderlib');

var roomsInfo = [];
var roomId;
var roomName;
var roomMail;
var meetingId;
var serviceId;
var token;
var response;

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

describe('',function(){

    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);

    /**
     Get the authorization token
     */

    before('Obtain the authorization token access to another endpoints',function(done){
        tokenLib
            .getToken(done,function(){
                token = arguments[0];
            });
    });


    before('Getting the Service and the Rooms IDs',function(done){
        var response;
        services
            .getServicesId(token)
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
    /*Scenario 1: Try of to create an out of order on disabled conference room
     Given there is a conference room “Conference Room 1”
     And the “Conference Room 1” is disabled
     When Try of to create an out-of-order “Temporarily Out of Order”
     Then ensure that a response with status code 4xx is returned
     And ensure that an out-of-order is not associated at room
     * */
    /*Scenario 3: Create an out of order on a room that have a meeting
     Given there is a conference room “Conference Room 1”
     And a meeting “meeting1” is assigned to that room
     When create an out of order with a different hour than the meeting
     Then ensure that a response with status code 200 is returned
     And ensure that the out-of-orders are associated at room
     * */
    describe('Create an out of order on a room that have a meeting',function(){
        var actualBody;
        var actualRes;
        context('Scenario 1 : Create a out-of-order in a room that has a meeting, with different',function(){
            before('Create a meeting for a room',function(done){
                meetings
                    .createNewMeeting(serviceId,roomId,roomName,roomMail)
                    .end(function(err,res){
                        response = res.body;
                        meetingId = response._id;
                        expect(response.serviceId).to.equal(serviceId);
                        expect(response.roomId).to.equal(roomId);
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
            after('Delete a meeting for a room',function(done){
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
        describe('',function(){
            before(function(done){
                var res = content.getContentCreate(roomId);
                outOfOrders
                    .createOutOfOrder(serviceId, roomId, res, token)
                    .end(function (err, res) {
                        actualRes = res.status;
                        actualBody = res.body;
                        oooId = res.body._id;
                        done();
                    });
            });
            after(function(done){
                outOfOrders
                    .deleteOutOfOrder(serviceId, roomId, token, oooId)
                    .end(function (error, resp) {
                        done();
                    });
            });
            it('Ensure that a response with status code 200 is returned',function(){
                expect(actualRes).to.equal(200);
            });
            it('Ensure that the out-of-orders are associated at room',function(){
                expect(actualBody.roomId).to.equal(roomId);
            });
        });
        });
    });

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
});
