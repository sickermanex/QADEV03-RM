var expect =  require('chai').expect;
var locationsLib = require('..\\..\\lib\\locationsLib.js');
var tokenLib = require('..\\..\\lib\\tokenLib.js');
var settings = require('..\\..\\settings.json')
var mongoserv = require('..\\..\\utils\\mongoConnection.js');
describe('Locations CRUD Tests',function(){
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);
    var locationId;
    var location;
    var listLocation;
    var token;
    before(function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
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
                    locationsLib
                        .getLocations(locationId)
                        .end(function(error, response) {
                            expect(response.body._id).to.be.equal(locationId);
                            expect(response.body.name).to.be.equal(location.name);
                            expect(response.body.customName).to.be.equal(location.customName);
                            expect(response.body.description).to.be.equal(location.description);
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
                    locationsLib
                        .getLocations(locationId)
                        .end(function(error, response) {
                            expect(response.body._id).to.be.equal(locationId);
                            expect(response.body.name).to.be.equal(location.name);
                            expect(response.body.customName).to.be.equal(location.customName);
                            expect(response.body.description).to.be.equal(location.description);
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
                    locationsLib
                        .getLocations(locationId)
                        .end(function(error, response) {
                            expect(response.status).to.be.equal(404);
                            done();
                        });
                });
        });
    });
    describe('Test Cases set to test the GET method with all existing locations',function() {

        before(function (done) {
            mongoserv
                .getcollection('locations',function(){
                    listLocation = arguments[0];
                    done();
                });

        });

        it('GET locations api returns the information of all existing  locations', function (done) {
            locationsLib
                .getAllLocations()
                .end(function (error, response) {
                    var response = response;
                    var idBody;
                    var idList;
                    for(var i = 0; i < response.body.length; i++)
                    {
                        idBody = response.body[i]._id;
                        idList = listLocation[i]._id;
                        idList = idList.toString();
                        expect(idBody).to.be.equal(idList);
                        expect(response.body[i].__v).to.be.equal(listLocation[i].__v);
                        expect(response.body[i].customName).to.be.equal(listLocation[i].customName);
                        expect(response.body[i].name).to.be.equal(listLocation[i].name);
                        expect(response.body[i].description).to.be.equal(listLocation[i].description);
                        expect(response.body[i].path).to.be.equal(listLocation[i].path);
                    }
                    expect(response.status).to.be.equal(200);
                    expect(response.body.length).to.be.equal(listLocation.length);
                    done();
                });
        });
    });
});