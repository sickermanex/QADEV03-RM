/**
 * Conference Rooms CRUD Test
 * Owner: Rebeca Vargas Garcia
 */

var expect = require('chai').expect;
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
var services = require('..\\..\\lib\\servicesLib');
var resources = require('..\\..\\lib\\resourcesLib');
var requests = require('..\\..\\requestJSONs\\resourcesRequests');




describe('Acceptance Test - Conference Rooms', function(){
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
        var serviceId;
        var roomsGetByService = [];
        var roomsGetByRoom = [];
        var roomsIdInServices = [];
        var roomsIdInRooms = [];
        services
            .getServicesId(token)
            .end(function(err,res){
                serviceId = res.body[0]._id;

                rooms
                    .getRoomsService(serviceId)
                    .end(function(err,res){
                        roomsGetByService = res.body;

                        roomsGetByService.forEach(function(rooms){
                            roomsIdInServices.push(rooms._id);
                        });

                        rooms
                            .getRooms()
                            .end(function(err,res){
                                roomsGetByRoom = res.body;
                                roomsGetByRoom.forEach(function(rooms){
                                    roomsIdInRooms.push(rooms._id);
                                });

                                expect(roomsIdInServices).to.eql(roomsIdInRooms);
                                var status = res.status;
                                expect(status).to.equal(200);
                                expect(roomsIdInRooms).to.have.members(roomsIdInServices);
                                expect(roomsIdInServices).to.include.members(roomsIdInRooms);
                                done();

                            });

                    });
        });

    });

    /**
     *Test Case
     *Title: GET room shortcut API returns the information from a specific room
     */
    it('Get a Room', function(done){
        var actualRoom;
        var expectedRoom;
        var roomId;

        rooms
            .getRooms()
            .end(function(err, res){
                roomId = res.body[0]._id;
                expectedRoom = res.body[0];

                rooms
                .getRoom(roomId)
                    .end(function(err, res){
                        actualRoom = res.body;
                        var status = res.status;

                        expect(status).to.equal(200);
                        expect(actualRoom.__v).to.equal(expectedRoom.__v);
                        expect(actualRoom._id).to.equal(expectedRoom._id);

                        done();
                    });
            });
    });

    /**
     * Test Case
     * Title: PUT room shortcut API  returns the information from a specific room
     */
    it('Update a Room', function(done){
        var actualRoom;
        var expectedRoom;
        var roomId;
        var room ={
            "enabled": false,
            "customDisplayName": "A better name"
        };

        rooms
            .getRooms()
            .end(function(err, res){
                roomId = res.body[1]._id;
                expectedRoom = res.body[1];
                console.log(expectedRoom);

                rooms
                    .updateRoom(roomId, room, token)
                    .end(function(err, res){
                        var status = res.status;
                        actualRoom = res.body;
                        console.log(actualRoom);

                        expect(status).to.equal(200);
                        expect(actualRoom.enabled).to.equal(expectedRoom.enabled);
                        expect(actualRoom.customDisplayName).to.equal(expectedRoom.customDisplayName);

                        done();
                    });

            });
    });

    /**
     * Test Case
     * Title: POST rooms shortcut API returns the information from associate Resource to a Room
     */
    it('Associate a Resource', function(done) {

        var resource;
        var roomId;
        resources
            .createResource(requests.resourceCreate.body, token)
            .end(function(err,res){
             resource = res.body;
                resourceId = res.body._id;
                rooms
                    .getRooms()
                    .end(function (err, res) {
                        roomId = res.body[0]._id;

                        rooms
                            .associateRoom(roomId, resource, token)
                            .end(function (err, res) {

                                var status = res.status;
                                expect(status).to.equal(200);

                                resources
                                    .deleteResource(resourceId,token)
                                    .end(function(err,res){

                                        done();
                                    });


                            });
                    });

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
     * Title: GET rooms shortcut  API returns the information when get a specific room of specific service
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

        /**
         * Test Case
         * Title: PUT rooms shortcut  API returns the information
         * when update a specific room of specific service
         */
        it('Update a room of specific service', function(done) {
            var serviceId;
            var roomId;

            var room = {
                "enabled": false,
                "customDisplayName": "A better name"
            };

            rooms
                .getRooms()
                .end(function (err, res) {
                    serviceId = res.body[0].serviceId;
                    roomId = res.body[0]._id;
                    rooms
                        .updateRoomService(serviceId, roomId, room, token)
                        .end(function (err, res) {
                            var status = res.status;
                            expect(status).to.equal(200);
                            done();
                        });
                });
        });

    /**
     * Test Case
     * Title: GET rooms shortcut  API returns the information
     * when gets all the specified room’s resources
     */
    it('Get all resources of specific room', function(done) {
        var roomId;
        rooms
            .getRooms()
            .end(function (err, res) {
                roomId = res.body[0]._id;
                rooms
                    .getResourcesRoom(roomId)
                    .end(function (err, res) {
                        var status = res.status;

                        expect(status).to.equal(200);
                        done();
                    });
            });
    });

    /**
     * Test Case
     * Title: GET rooms shortcut  API returns the information
     * when gets a specific resource from a specific room
     */
    it('Get specific resource from a specific room', function(done) {
        var roomId;
        var serviceId;
        rooms
            .getRooms()
            .end(function (err, res) {
                serviceId = res.body[0].serviceId;
                roomId = res.body[0]._id;
                rooms
                    .getResourceRoom(serviceId, roomId)
                    .end(function (err, res) {
                        var status = res.status;

                        expect(status).to.equal(200);
                        done();
                    });
            });
    });

    /**
     * Test Case
     * Title: PUT shortcut API  returns the information
     * when update a specific resource from specific room
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
     * Title: Delete shortcut API  returns the information
     * when delete specific resource from specific room
     */
    it.only('Delete a specific resource from specific room', function(done){
        var testedRoom;
        var roomId;
        var testedResource;
        var testedResourceId;

        rooms
            .getRooms()
            .end(function(err, res){
                roomId = res.body[0]._id;
                console.log('DUNO', res.body[0]);

                rooms
                    .getRoom(roomId)
                    .end(function(err, res){
                        testedRoom = res.body;
                        console.log('ME NEITHER', testedRoom);

                        resources
                            .createResource(requests.resourceCreate.body, token)
                            .end(function(err, res){
                                testedResource = res.body;
                                testedResourceId = res.body._id;
                                console.log('THE RESOURCE', testedResource);

                                rooms
                                    .associateRoom(roomId, testedResource, token)
                                    .end(function(err, res){
                                        var roomResourceId = res.body.resources[0]._id;
                                        console.log(roomResourceId);

                                        rooms
                                            .deleteResourceRoom(roomId, roomResourceId, token)
                                            .end(function(err, res){

                                                console.log('LETS CHECK IT', res.body);
                                                //expect(testedResource).to.not.exist;

                                                done();
                                            });
                                    });
                            });
                    });
            });
    });
});