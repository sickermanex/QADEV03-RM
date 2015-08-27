//acceptance test

var expect = require('chai').expect;
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;

var resources = require('..\\..\\lib\\resourcesLib');
var requests = require('..\\..\\requestJSONs\\resourcesRequests');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');

describe('Acceptance Test Cases - Resources', function() {
    this.timeout(settings.setDelayTime);

    var token;
    var expectedResult;
    var resourceId;

    /**
     * Get a token
     */
    before(function (done) {
        tokenLib
            .getToken(done, function () {
                token = arguments[0];
            });
    });

    describe('Create Operations', function () {
        /**
         * Delete the resource created for each test
         */
        afterEach(function (done) {
            resources
                .deleteResource(resourceId, token)
                .end(function (err, res) {
                    done();
                });
        });

        /**
         *Test Case
         * Title: POST resource api creates a resource
         */
        it('Create a Resource', function (done) {
            var actualResult;

            //Test Case: Create a resource
            resources
                .createResource(requests.resourceCreate.body, token)
                .end(function (err, res) {
                    expectedResult = res.body;
                    resourceId = res.body._id;
                    var status = res.status;

                    expect(status).to.equal(200);

                    //Get the resource created
                    resources
                        .getResource(resourceId)
                        .end(function (err1, res1) {
                            var status1 = res1.status;
                            actualResult = res1.body;

                            expect(status1).to.equal(200);
                            expect(actualResult._id).to.equal(expectedResult._id);
                            expect(actualResult.name).to.equal(expectedResult.name);
                            expect(actualResult.customName).to.equal(expectedResult.customName);
                            expect(actualResult.fontIcon).to.equal(expectedResult.fontIcon);
                            expect(actualResult.from).to.equal(expectedResult.from);
                            expect(actualResult.description).to.equal(expectedResult.description);

                            done();
                        });
                });
        });
    });

    describe('Read and Update operations', function () {
        /**
         * Create a resource for each test
         */
        beforeEach(function (done) {
            resources
                .createResource(requests.resourceCreate.body, token)
                .end(function (err, res) {
                    expectedResult = res.body;
                    resourceId = res.body._id;
                    done();
                });
        });

        /**
         * Delete the resource created for each test
         */
        afterEach(function (done) {
            resources
                .deleteResource(resourceId, token)
                .end(function (err, res) {
                    done();
                });
        });

        /**
         *Test Case
         * Title: GET resource api returns the information of an specific resource
         */
        it('Get a Resource', function (done) {
            var actualResult;

            resources
                .getResource(resourceId)
                .end(function (err, res) {
                    var status = res.status;
                    actualResult = res.body;

                    expect(status).to.equal(200);
                    expect(actualResult._id).to.equal(expectedResult._id);
                    expect(actualResult.name).to.equal(expectedResult.name);
                    expect(actualResult.customName).to.equal(expectedResult.customName);
                    expect(actualResult.fontIcon).to.equal(expectedResult.fontIcon);
                    expect(actualResult.from).to.equal(expectedResult.from);
                    expect(actualResult.description).to.equal(expectedResult.description);

                    done();
                });
        });

        /**
         *Test Case
         * Title: GET resources api returns the information of all the resources
         */
        it('Get all Resources', function(done){
            resources
                .getResources()
                .end(function (err, res) {
                    var status = res.status;


                    expect(status).to.equal(200);

                    done();
                });
        });

        /**
         *Test Case
         * Title: PUT resource api updates the information of an specific resource
         */
        it('Update a Resource', function (done) {
            var actualResult;

            resources
                .updateResource(resourceId, requests.resourceUpdate.body, token)
                .end(function (err, res) {
                    var status = res.status;
                    expectedResult = res.body;

                    expect(status).to.equal(200);

                    //Get the resource selected
                    resources
                        .getResource(resourceId)
                        .end(function (err1, res1) {
                            var status1 = res1.status;
                            actualResult = res1.body;

                            expect(status1).to.equal(200);
                            expect(actualResult._id).to.equal(expectedResult._id);
                            expect(actualResult.name).to.equal(expectedResult.name);
                            expect(actualResult.customName).to.equal(expectedResult.customName);
                            expect(actualResult.fontIcon).to.equal(expectedResult.fontIcon);
                            expect(actualResult.from).to.equal(expectedResult.from);
                            expect(actualResult.description).to.equal(expectedResult.description);

                            done();
                        });
                });
        });
    });

    describe('Delete Operations', function (done) {
        /**
         * Create a resource for each test
         */
        beforeEach(function (done) {
            resources
                .createResource(requests.resourceCreate.body, token)
                .end(function (err, res) {
                    expectedResult = res.body;
                    resourceId = res.body._id;
                    done();
                });
        });

        /**
         * Test Case
         * Title: DELETE resource API is present in the application
         */
        it('Delete a Resource', function (done) {
            var actualResult;

            resources
                .deleteResource(resourceId, token)
                .end(function (err, res) {
                    var status = res.status;
                    actualResult = res.body;

                    expect(status).to.equal(200);
                    expect(actualResult._id).to.equal(expectedResult._id);
                    expect(actualResult.name).to.equal(expectedResult.name);
                    expect(actualResult.customName).to.equal(expectedResult.customName);
                    expect(actualResult.fontIcon).to.equal(expectedResult.fontIcon);
                    expect(actualResult.from).to.equal(expectedResult.from);
                    expect(actualResult.description).to.equal(expectedResult.description);

                    resources
                        .getResource(resourceId)
                        .end(function (err1, res1) {
                            var status1 = res1.status;

                            expect(status1).to.equal(404);
                            done();
                        });
                });
        });
    });
});









