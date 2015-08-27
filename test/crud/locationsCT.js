var expect =  require('chai').expect;
var locationsLib = require('..\\..\\lib\\locationsLib.js');
var tokenLib = require('..\\..\\lib\\tokenLib.js');

describe('Locations CRUD Tests',function(){
    this.timeout(5000);
    this.slow(4000);
    var locationId;
    var location;
    var newLocation;
    var token;
    before(function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });

    });
    after(function (done) {
        locationsLib
            .getAllLocations()
            .end(function (error, response) {
                var totalLocations;
                totalLocations = response.body;
                function deleteAllLocations(done, locId) {
                    locationsLib
                        .deleteLocations(locId, token)
                        .end(function (error, response) {
                            done();
                        });
                }

                if (totalLocations.length > 0) {
                    for (var i = 0; i < totalLocations.length; i++) {
                        deleteAllLocations(done, totalLocations[i]._id);
                    }
                }
                else
                    done();
            });
    });
    describe('Test Cases set of POST, GET, PUT, DELETE that works with an specific location',function() {
        it ('POST locations api created a new location',function(done){
            location = {
                "name"       : "New location",
                "customName" : "NewLoc",
                "description": "this is a  new location"
            }
            locationsLib
                .createLocations(location, token)
                .end(function(error, response){
                    var response = response;
                    locationId = response.body._id;
                    expect(response.status).to.be.equal(200);
                    console.log('Status: ', response.status);
                    locationsLib
                        .getLocations(locationId)
                        .end(function(error, response) {
                            expect(response.body._id).to.be.equal(locationId);
                            expect(response.body.name).to.be.equal(location.name);
                            expect(response.body.customName).to.be.equal(location.customName);
                            expect(response.body.description).to.be.equal(location.description);
                            console.log('Body: ', response.body);
                            done();
                        });
                });
        });
        it ('GET locations api returns the information from a specific location',function(done){
            locationsLib
                .getLocations(locationId)
                .end(function(error, response){
                    var response = response;
                    expect(response.status).to.be.equal(200);
                    expect(response.body._id).to.be.equal(locationId);
                    expect(response.body.name).to.be.equal(location.name);
                    expect(response.body.customName).to.be.equal(location.customName);
                    expect(response.body.description).to.be.equal(location.description);
                    console.log('Body: ', response.body);
                    console.log('Status: ', response.status);
                    done();
                });
        });
        it ('PUT locations api updates the information from a specific location',function(done){
            location = {
                "name"       : "New location renamed",
                "customName" : "LocRenamed",
                "description": "location was updated"
            }
            locationsLib
                .updateLocations(locationId, location, token)
                .end(function(error, response){
                    var response = response;
                    expect(response.status).to.be.equal(200);
                    console.log('Status: ', response.status);
                    locationsLib
                        .getLocations(locationId)
                        .end(function(error, response) {
                            expect(response.body._id).to.be.equal(locationId);
                            expect(response.body.name).to.be.equal(location.name);
                            expect(response.body.customName).to.be.equal(location.customName);
                            expect(response.body.description).to.be.equal(location.description);
                            console.log('Body: ', response.body);
                            done();
                        });
                });
        });
        it ('DELETE  locations api removes a specific location',function(done){
            locationsLib
                .deleteLocations(locationId, token)
                .end(function(error, response){
                    var response = response;
                    expect(response.status).to.be.equal(200);
                    expect(response.body._id).to.be.equal(locationId);
                    expect(response.body.name).to.be.equal(location.name);
                    expect(response.body.customName).to.be.equal(location.customName);
                    expect(response.body.description).to.be.equal(location.description);
                    console.log('Body: ', response.body);
                    console.log('Status: ', response.status);
                    locationsLib
                        .getLocations(locationId)
                        .end(function(error, response) {
                            expect(response.status).to.be.equal(404);
                            console.log('Server response after search the location that was removed: ', response.status);
                            done();
                        });
                });
        });
    });
    describe('Test Cases set to test the GET method with all existing locations',function() {
        before(function (done) {
            locationsLib
                .getAllLocations()
                .end(function (error, response) {
                    var totalLocations;
                    totalLocations = response.body;
                    function deleteAllLocations(done, locId) {
                        locationsLib
                            .deleteLocations(locId, token)
                            .end(function (error, response) {
                                done();
                            });
                    }

                    if (totalLocations.length > 0) {
                        for (var i = 0; i < totalLocations.length; i++) {
                            deleteAllLocations(done, totalLocations[i]._id);
                        }
                    }
                    else
                        done();
                });
        });

        beforeEach(function (done) {
            newLocation = {
                "name": "New location1",
                "customName": "NewLoc1"
            }
            locationsLib
                .createLocations(newLocation, token)
                .end(function(error, response){
                    newLocation = {
                        "name": "New location2",
                        "customName": "NewLoc2"
                    }
                    locationsLib
                        .createLocations(newLocation, token)
                        .end(function(error, response){
                            newLocation = {
                                "name": "New location3",
                                "customName": "NewLoc3"
                            }
                            locationsLib
                                .createLocations(newLocation, token)
                                .end(function(error, response){
                                    done();
                                });
                        });
                });
        });

        it('GET locations api returns the information of all existing  locations', function (done) {
            locationsLib
                .getAllLocations()
                .end(function (error, response) {
                    var response = response;
                    expect(response.status).to.be.equal(200);
                    expect(response.body.length).to.be.equal(3);
                    console.log('Body: ', response.body);
                    console.log('Status: ', response.status);
                    done();
                });
        });
    });
});