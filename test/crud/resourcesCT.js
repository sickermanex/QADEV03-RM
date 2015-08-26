//acceptance test

var expect = require('chai').expect;
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

var resources = require('..\\..\\lib\\resourcesLib');
var requests = require('..\\..\\requestJSONs\\resourcesRequests');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');

describe('Acceptance Test Cases', function(){

    var token;
    this.timeout(settings.setDelayTime);

    /**
     * Get a token
     */
    before(function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    })


    /**
     *Test Case
     * Title: POST resource api creates a resource
     */
    it('Create a Resource', function(done){
        var actualResult;
        var expectedResult;

        resources
            .createResource(requests.resourceCreate.body, token)
            .end(function(err, res){
                expectedResult = res.body;
                resourceId = res.body._id;
                var status = res.status;

                expect(status).to.equal(200);

                resources
                    .getResource(resourceId)
                    .end(function(err1, res1){
                        var status = res.status;
                        var actualResult = res1.body;

                        expect(status).to.equal(200);
                        expect(actualResult._id).to.equal(expectedResult._id);
                        expect(actualResult.name).to.equal(expectedResult.name);
                        expect(actualResult.customName).to.equal(expectedResult.customName);
                        expect(actualResult.fontIcon).to.equal(expectedResult.fontIcon);
                        expect(actualResult.from).to.equal(expectedResult.from);
                        expect(actualResult.description).to.equal(expectedResult.description);

                        //Post Condition
                        resources
                            .deleteResource(resourceId, token)
                            .end(function(err2, res2){
                                var status1 = res2.status;
                                expect(status1).to.equal(200);
                                done();
                            });
                    });
            });
    });


});