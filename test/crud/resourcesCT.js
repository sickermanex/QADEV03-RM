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
                        var status1 = res1.status;
                        actualResult = res1.body;

                        expect(status1).to.equal(200);
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
                                var status2 = res2.status;
                                expect(status2).to.equal(200);
                                done();
                            });
                    });
            });
    });


    /**
     *Test Case
     * Title: PUT resource api updates the information of an specific resource
     */
    it.only('Update Resource', function(done){
        var actualResult;
        var expectedResult;
        var resourceList;
        var resourceSelected;

        function randomResource (list){
            var size = list.length;
            return Math.floor(Math.random() *(size));


        };

        //Get a random resource
        resources
            .getResources()
            .end(function (err, res) {
                resourceList = res.body;
                var index = randomResource(resourceList);
                resourceSelected = resourceList[index];

                //Update the resource selected
                resources
                    .updateResource(resourceSelected._id, requests.resourceUpdate.body, token)
                    .end(function(err1, res1){
                        var status = res1.status;
                        expectedResult = res1.body;

                        expect(status).to.equal(200);

                        //Get the resource selected
                        resources
                            .getResource(resourceSelected._id)
                            .end(function(err2, res2){
                                var status1 = res2.status;
                                actualResult = res2.body;

                                expect(status1).to.equal(200);
                                expect(actualResult._id).to.equal(expectedResult._id);
                                expect(actualResult.name).to.equal(expectedResult.name);
                                expect(actualResult.customName).to.equal(expectedResult.customName);
                                expect(actualResult.fontIcon).to.equal(expectedResult.fontIcon);
                                expect(actualResult.from).to.equal(expectedResult.from);
                                expect(actualResult.description).to.equal(expectedResult.description);

                                //Post Condition
                                resources
                                    .updateResource(resourceSelected._id, resourceSelected, token)
                                    .end(function(err3, res3){
                                        var status2 = res3.status;

                                        expect(status).to.equal(200);
                                        done();
                                    });
                            });
                    });
            });
    });

});