var expect =  require('chai').expect;
var locationsLib = require('..\\..\\lib\\locationsLib.js');
var tokenLib = require('..\\..\\lib\\tokenLib.js');
var settings = require('..\\..\\settings.json');
describe('Locations Smoke Tests',function(){

	this.timeout(settings.setDelayTime);
	
    var locationId;
    var token;

    before(function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });
    it ('GET locations  api is present in the application',function(done){
        locationsLib
            .getAllLocations()
            .end(function(error, response){
                var response = response;
                expect(response.status).to.be.equal(200);
                console.log('Status: ', response.status);
                done();
            });
    });

    it ('POST locations  api is present in the application ',function(done){
        var location = {
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
                done();
            });
    });
    it ('GET locations  api is present in the application using a valid locationId',function(done){
        locationsLib
            .getLocations(locationId)
            .end(function(error, response){
                var response = response;
                expect(response.status).to.be.equal(200);
                console.log('Status: ', response.status);
                done();
            });
    });
    it ('PUT locations  api is present in the application  using a valid locationId ',function(done){
        var location = {
            "name"       : "New location renamed",
            "customName" : "LocRenamed"
        }
        locationsLib
            .updateLocations(locationId, location, token)
            .end(function(error, response){
                var response = response;
                expect(response.status).to.be.equal(200);
                console.log('Status: ', response.status);
                done();
            });
    });
    it ('DELETE  locations  api is present in the application  using a valid locationId',function(done){
        locationsLib
            .deleteLocations(locationId, token)
            .end(function(error, response){
                var response = response;
                expect(response.status).to.be.equal(200);
                console.log('Status: ', response.status);
                done();
            });
    });
});