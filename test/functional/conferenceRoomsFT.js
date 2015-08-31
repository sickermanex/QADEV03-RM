/**
 * Conference Rooms Functional Test
 * Owner: Rebeca Vargas Garcia
 */
var expect = require('chai').expect;
var roomsLib = require('..\\..\\lib\\conferenceRoomsLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
var locationLib = require('..\\..\\lib\\locationsLib');

/*
 Scenario 1:Associate a conference room not assigned to a Location
 Given A new location ‘LocationA’ is created
 When the location ‘LocationA’ is creating, associate it with an existing room that is not assigned
 Then ensure the room is associated with the location ‘LocationA’
 And ensure the associated room’s LocationId is the same than ‘LocationA’ Id

 */
describe('Story 1: I want to create a new location and associate it to a new room',function(){
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);


    /**
     * Get a token
     *
     */
    var token;
    var room;
    var roomId;
    var roomArray;
    var roomsArrayId = [];
    var location;
    var locationId;

    var status;
    var updateResponse;

    before('Setting the token', function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });

    before('Getting a room', function(done){
        roomsLib
            .getRooms()
            .end(function(err, res){
                roomArray = res.body;
                room = res.body[0];
                roomId = room._id;


                roomArray.forEach(function(room){
                    roomsArrayId.push(room._id);
                });

                done();
            });
    });

    describe('Scenario 1: Creating a Location and assigning 1 room to it',function(){

        before('Creating location', function(done){
            var locationRequest = {
                "name"       : "New location",
                "customName" : "NewLoc",
                "description": "this is a  new location"
            };

            locationLib
                .createLocations(locationRequest, token)
                .end(function(err, res){
                    location = res.body;
                    locationId = location._id;

                    done();
                });
        });

        after('Deleting location', function(done){
            locationLib
                .deleteLocations(locationId, token)
                .end(function(err, res){

                    done();
                });
        });

        describe('Assigning a room to a location', function(){

            before(function(done){
                var locationRequest = {"roomIds":[roomId]};

                locationLib
                    .updateLocations(locationId, locationRequest, token)
                    .end(function(err, res){
                        status = res.status;
                        updateResponse = res.body;

                        done();
                    });
            });

            after('Restoring the location', function(done){
                var locationRequest = {"roomIds":[]};

                locationLib
                    .updateLocations(locationId, locationRequest, token)
                    .end(function(err, res){
                        status = res.status;

                        done();
                    });
            });

            it('ensure the response with code status is returned', function(done){
                expect(status).to.equal(200);

                done();
            });

            it('and the response body values are correct.', function(done){
                expect(updateResponse.path).to.equal(location.path);
                expect(updateResponse.name).to.equal(location.name);
                expect(updateResponse.customName).to.equal(location.customName);
                expect(updateResponse._id).to.equal(location._id);
                expect(updateResponse.description).to.equal(location.description);

                done();
            });
        });
    });

    describe.only('Scenario 2: Creating a Location and assigning all rooms to it',function(){

        before('Creating location', function(done){
            var locationRequest = {
                "name"       : "New location",
                "customName" : "NewLoc",
                "description": "this is a  new location"
            };

            locationLib
                .createLocations(locationRequest, token)
                .end(function(err, res){
                    location = res.body;
                    locationId = location._id;

                    done();
                });
        });

        after('Deleting location', function(done){
            locationLib
                .deleteLocations(locationId, token)
                .end(function(err, res){

                    done();
                });
        });

        describe('Assigning all rooms to a location', function(){

            before(function(done){
                var locationRequest = {"roomIds":roomsArrayId};

                locationLib
                    .updateLocations(locationId, locationRequest, token)
                    .end(function(err, res){
                        status = res.status;
                        updateResponse = res.body;

                        done();
                    });
            });

            after('Restoring the location', function(done){
                var locationRequest = {"roomIds":[]};

                locationLib
                    .updateLocations(locationId, locationRequest, token)
                    .end(function(err, res){
                        status = res.status;

                        done();
                    });
            });

            it('ensure the response with code status is returned', function(done){
                expect(status).to.equal(200);

                done();
            });

            it('and the response body values are correct.', function(done){
                expect(updateResponse.path).to.equal(location.path);
                expect(updateResponse.name).to.equal(location.name);
                expect(updateResponse.customName).to.equal(location.customName);
                expect(updateResponse._id).to.equal(location._id);
                expect(updateResponse.description).to.equal(location.description);

                done();
            });
        });
    });
});
