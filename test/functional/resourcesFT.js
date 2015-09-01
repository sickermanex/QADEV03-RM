//Functional Test Cases

/**
 * Created by vanessavargas on 8/24/2015.
 */
var expect = require('chai').expect;
var resources = require('..\\..\\lib\\resourcesLib');
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var requests = require('..\\..\\requestJSONs\\resourcesRequests');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');



/**
 * STORY: Create a Resource
 * As Administrator
 * I want to create resources
 * So, I will be able to assign them to conference rooms
 * SCENARIOS
 * Scenario 3: Create a resource with a name that another resource already has
 *      Given there is a resource "Android"?
 *      When a new resource is created
 *      And has the same name as the "Android" resource
 *      Then ensure that a response with status code 400 is returned
 *          And ensure the response body has a descriptive message about the error
 * Scenario 4: Create a resource without the field "name"?
 * 		Given there are no resources
 *		When a new resource is created
 *		    And the value "name"? is not sent in the request's body
 *		Then ensure that a response with status code 400 is returned
 *		    And ensure the response's body has a descriptive message about the error
 * Scenario 5: Create a resource without an image
 * 		Given there are no resources
 *		When a new resource is created
 *		    And the value "fontIcon"? is not sent in the request's body
 *		Then ensure that a response with status code 400 is returned
 *		    And ensure the response's body has a descriptive message about the error
 */

describe('Create a Resource', function () {
    this.timeout(settings.setDelayTime);

    var token;

    /**
     * Get a token
     */
    before(function (done) {
        tokenLib
            .getToken(done, function () {
                token = arguments[0];
            });
    });

    describe('Scenario 3: Create a resource with a name that another resource already has', function () {

        var firstResource;
        var secondResource;

        context('Given there is a resource "Android"', function () {

            before('Creating the resource "Android"',function (done) {
                resources
                    .createResource(requests.resourceScenario.body, token)
                    .end(function (err, res) {
                        firstResource = res.body;
                        done();
                    });
            });

            after('Deleting the resource created', function (done) {
                resources
                    .deleteResource(firstResource._id, token)
                    .end(function (err, res) {
                        done();
                    });
            });


            context('When a new resource is created', function () {
                var status;
                var error;

                before('Creating another resource with the same name', function (done) {
                    resources
                        .createResource(requests.resourceScenario.body, token)
                        .end(function (err, res) {
                            status = res.status;
                            error = err.response.error.text.message;
                            secondResource = res.body;
                            done();
                        });
                });

                it('And has the same name as the "Android" resource', function (done) {
                    expect(firstResource.name).to.equal(requests.resourceScenario.body.name);
                    done();
                });

                it('Then ensure that a response with status code 400 is returned', function (done) {
                    expect(status).to.equal(400);
                    done();
                });
            });
        });
    });


    describe('Scenario 4: Create a resource without the field "name"', function () {

        context('Given there are no resources', function () {

            before('Checking there are no resources', function (done) {
                resources
                    .getResources()
                    .end(function (err, res) {
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            context('When a new resource is created', function () {
                var status;
                var error;

                before('Creating a new resource', function (done) {
                    resources
                        .createResource(requests.resourceWithoutName.body, token)
                        .end(function (err, res) {
                            status = res.status;
                            done();
                        });
                });

                it('And the value "name" is not sent in the requests body', function (done) {
                    expect(requests.resourceWithoutName.body.name).to.be.empty;
                    done();
                });

                it('Then ensure that a response with status code 400 is returned', function (done) {
                    expect(status).to.equal(400);
                    done();
                });
            });
        });
    });

    describe('Scenario 5: Create a resource without an icon', function () {
        context('Given there are no resources', function () {

            before('Checking there are no resources', function (done) {
                resources
                    .getResources()
                    .end(function (err, res) {
                        expect(res.body).to.be.empty;
                        done();
                    });
            });

            context('When a new resource is created', function () {
                var status;
                var error;
                var resourceCreated;

                before('Creating a new resource', function (done) {
                    resources
                        .createResource(requests.resourceWithoutIcon.body,token)
                        .end(function (err, res) {
                            status = res.status;
                            resourceCreated = res.body;
                            done();
                        });
                });
                after('Deleting the resource created', function (done) {
                    resources
                        .deleteResource(resourceCreated._id, token)
                        .end(function (err, res) {
                            expect(res.status).to.equal(200);
                            done();
                        });
                });


                it('And the value "fontIcon" is not sent in the requests body', function (done) {
                    expect(requests.resourceWithoutIcon.body.fontIcon).to.be.empty;
                    done();

                });

                it('Then ensure that a response with status code 400 is returned', function (done) {
                    expect(status).to.equal(400);
                    done();
                });
            });
        });
    });
});


/**
 * STORY: Assigning Resources
 * As Administrator
 * I want to create resources
 * So, I will be able to assign them to conference rooms
 *  SCENARIOS
 *   Scenario 1: Assigning resource to a conference room with no resources
 *      Given there is a conference room "Conference Room 1"? with no resources assigned
 *          And a resource "computer"? exits
 *      When the "computer"? is assigned to the room
 *          And the quantity assigned of "computer"? is 2
 *      Then ensure that a response with status code 200 is returned
 *          And ensure the "computer"? is associated with the room "Conference Room 1"?
 *          And ensure the quantity of computer is 2
 *
 *   Scenario 2: Assigning resource to a conference room with resources
 *      Given there is a conference room "Conference Room 1"? with resources assigned
 *          And a resource "computer"? exits
 *      When the "computer"? is assigned to the room
 *          And the quantity assigned of "computer"? is 2
 *      Then ensure that a response with status code 200 is returned
 *          And ensure the "computer"? is associated with the room "Conference Room 1"?
 *          And ensure the quantity of computer is 2
 *
 *   Scenario 3: Assign a resource that has a long name to a conference room with no resources
 *      Given there is a conference room "Conference Room 1"? with no resources assigned
 *          And a resource "thisisanewreourceswithareallylongnamethatwillbeassignedtoaconferenceroom"? exits
 *      When the "thisisanewreourceswithareallylongnamethatwillbeassignedtoaconferenceroom"? is assigned to the room
 *          And the quantity assigned of "thisisanewreourceswithareallylongnamethatwillbeassignedtoaconferenceroom"? is 2
 *      Then ensure that a response with status code 200 is returned
 *          And ensure the "thisisanewreourceswithareallylongnamethatwillbeassignedtoaconferenceroom"? is associated with the room “Conference Room 1�?
 *          And ensure the quantity of computer is 2
 *
 */

describe('Assigning Resources', function () {
    this.timeout(settings.setDelayTime);

    var token;

    /**
     * Get a token
     */
    before(function (done) {
        tokenLib
            .getToken(done, function () {
                token = arguments[0];
            });
    });

    describe('Scenario 1: Assigning resource to a conference room with no resources', function () {
        context('Given there is a conference room "Conference Room 1" ' +
            'with no resources assigned', function () {
            var allRooms;
            var selectedRoom;
            var resourceCreated;

            before('Getting the room "Conference Room 1"', function (done) {
                rooms
                    .getRooms()
                    .end(function (err, res) {
                        allRooms = res.body;

                        for(var i = 0; i < allRooms.length; i++){
                            if(allRooms[i].customDisplayName == requests
                                    .roomCustomName.customDisplayName)
                                selectedRoom = allRooms[i];
                        };

                        done();
                    });
            });

            after('Deleting resource created', function (done) {
                resources
                    .deleteResource(resourceCreated._id, token)
                    .end(function (err, res) {
                        done();
                    });
            });

            it('And a resource "computer" exits', function (done) {
                resources
                    .createResource(requests.resourceScenario2.body,token)
                    .end(function (err, res) {
                        resourceCreated = res.body;
                        expect(res.status).to.equal(200);
                        
                        done();
                    });
            });
            context('When the "computer" is assigned to the room', function () {
                
                before('Assigning "computer" to "Conference Room 1"', function (done) {
                    var assign = {"associations":[{"resourceId":resourceCreated._id,
                        "name":resourceCreated.name,
                        "customName":resourceCreated.customName,
                        "fontIcon":resourceCreated.fontIcon,
                        "quantity":"0"}]};

                    rooms
                        .associateRoomAnother(selectedRoom._id, assign, token)
                        .end(function (err, res) {
                            expect(res.status).to.equal(200);
                            done();
                        });
                });

                context('And the quantity assigned of "computer" is 2', function () {
                    var status;

                    before('Assigning the quantity of 2 to "computer"', function (done) {
                        var assign = {"associations":[{"resourceId":resourceCreated._id,
                            "name":resourceCreated.name,
                            "customName":resourceCreated.customName,
                            "fontIcon":resourceCreated.fontIcon,
                            "quantity":"2"}]};

                        rooms
                            .associateRoomAnother(selectedRoom._id, assign, token)
                            .end(function (err, res) {
                                status = res.status;

                                done();
                            });
                    });

                    it('Then ensure that a response with status code 200 is returned', function (done) {
                        expect(status).to.equal(200);
                        done();

                    });

                    it('And ensure the "computer" is associated with the room "Conference Room 1"', function (done) {
                        rooms
                            .getRoom(selectedRoom._id)
                            .end(function (err, res) {
                                selectedRoom = res.body;

                                expect(selectedRoom.resources[0].resourceId).to.equal(resourceCreated._id);
                                expect(resourceCreated.name).to.equal("computer");

                                done();
                            });
                    });

                    it('And ensure the quantity of "computer" is 2', function (done) {
                        expect(selectedRoom.resources[0].quantity).to.equal(2);
                        done();
                    });
                });
            });
        });
    });



    describe('Scenario 2: Assigning resource to a conference room ' +
        'with resources', function () {
        context('Given there is a conference room "Conference Room 1" ' +
            'with resources assigned', function () {

            var allRooms;
            var selectedRoom;
            var resourceCreated;
            var resourceCreatedAlready;

            before('Getting the room "Conference Room 1 and ' +
                'assigning a resource"', function (done) {
                rooms
                    .getRooms()
                    .end(function (err, res) {
                        allRooms = res.body;

                        for(var i = 0; i < allRooms.length; i++){
                            if(allRooms[i].customDisplayName == requests
                                    .roomCustomName.customDisplayName)
                                selectedRoom = allRooms[i];
                        };

                        resources
                            .createResource(requests.resourceScenario.body, token)
                            .end(function (err1, res1) {
                                resourceCreatedAlready = res1.body;

                                var assign = {"associations":[{"resourceId":resourceCreatedAlready._id,
                                    "name":resourceCreatedAlready.name,
                                    "customName":resourceCreatedAlready.customName,
                                    "fontIcon":resourceCreatedAlready.fontIcon,
                                    "quantity":"3"}]};

                                rooms
                                    .associateRoomAnother(selectedRoom._id, assign, token)
                                    .end(function (err2, res2) {

                                        done();
                                    });
                            });
                    });
            });

            after('Deleting resources created', function (done) {
                resources
                    .deleteResource(resourceCreatedAlready._id, token)
                    .end(function (err, res) {
                        resources
                            .deleteResource(resourceCreated._id, token)
                            .end(function (err, res) {
                                done();
                            });
                    });
            });

            it('And a resource "computer" exits', function (done) {
                resources
                    .createResource(requests.resourceScenario2.body,token)
                    .end(function (err, res) {
                        resourceCreated = res.body;
                        expect(res.status).to.equal(200);

                        done();
                    });
            });
            context('When the "computer" is assigned to the room', function () {

                before('Assigning "computer" to "Conference Room 1"', function (done) {
                    var assign = {"associations":[{"resourceId":resourceCreated._id,
                        "name":resourceCreated.name,
                        "customName":resourceCreated.customName,
                        "fontIcon":resourceCreated.fontIcon,
                        "quantity":"0"}]};

                    rooms
                        .getRoom(selectedRoom._id)
                        .end(function (err, res) {
                            selectedRoom = res.body;

                            rooms
                                .associateRoomAnother(selectedRoom._id, assign, token)
                                .end(function (err, res) {
                                    expect(res.status).to.equal(200);
                                    done();
                                });
                        });
                });

                context('And the quantity assigned of "computer" is 2', function (done) {
                    var status;

                    before('Assigning the quantity of 2 to "computer"', function (done) {
                        var assign = {"associations":[{"resourceId":resourceCreated._id,
                            "name":resourceCreated.name,
                            "customName":resourceCreated.customName,
                            "fontIcon":resourceCreated.fontIcon,
                            "quantity":"2"},
                            {"resourceId":resourceCreatedAlready._id,
                                "name":resourceCreatedAlready.name,
                                "customName":resourceCreatedAlready.customName,
                                "fontIcon":resourceCreatedAlready.fontIcon,
                                "quantity":"3"}
                            ]};

                        rooms
                            .associateRoomAnother(selectedRoom._id, assign, token)
                            .end(function (err, res) {
                                status = res.status;

                                done();
                            });
                    });

                    it('Then ensure that a response with status code ' +
                        '200 is returned', function (done) {
                        expect(status).to.equal(200);
                        done();


                    });

                    it('And ensure the "computer" is associated ' +
                        'with the room "Conference Room 1"', function (done) {
                        rooms
                            .getRoom(selectedRoom._id)
                            .end(function (err, res) {
                                selectedRoom = res.body;

                                expect(selectedRoom.resources[0].resourceId).to.equal(resourceCreated._id);
                                expect(resourceCreated.name).to.equal("computer");

                                done();
                            });
                    });

                    it('And ensure the quantity of computer is 2', function (done) {
                        expect(selectedRoom.resources[0].quantity).to.equal(2);
                        done();

                    });
                });
            });
        });
    });


    describe('Scenario 3: Assign a resource that has a long name to a conference ' +
        'room with no resources', function () {
        var allRooms;
        var selectedRoom;
        var resourceCreated;

        context('Getting the room "Conference Room 1"', function () {

            before('Getting the room "Conference Room 1 and ' +
                'assigning a resource"', function (done) {
                rooms
                    .getRooms()
                    .end(function (err, res) {
                        allRooms = res.body;

                        for(var i = 0; i < allRooms.length; i++){
                            if(allRooms[i].customDisplayName == requests
                                    .roomCustomName.customDisplayName)
                                selectedRoom = allRooms[i];
                        };

                        done();
                    });
            });

            after('Deleting resource created', function (done) {
                resources
                    .deleteResource(resourceCreated._id, token)
                    .end(function (err, res) {
                        done();
                    });
            });

            it('And a resource "thisisanewreourceswithareallylongnamethatwill' +
                'beassignedtoaconferenceroom" exits', function (done) {
                resources
                    .createResource(requests.resourceScenario3.body,token)
                    .end(function (err, res) {
                        resourceCreated = res.body;
                        expect(res.status).to.equal(200);

                        done();
                    });
            });

            context('When the resource is assigned to the room', function () {
                before('Assigning resource to "Conference Room 1"', function (done) {
                    var assign = {"associations":[{"resourceId":resourceCreated._id,
                        "name":resourceCreated.name,
                        "customName":resourceCreated.customName,
                        "fontIcon":resourceCreated.fontIcon,
                        "quantity":"0"}]};

                    rooms
                        .associateRoomAnother(selectedRoom._id, assign, token)
                        .end(function (err, res) {
                            expect(res.status).to.equal(200);
                            done();
                        });
                });

                context('And the quantity assigned of the resource is 2', function () {
                    var status;

                    before('Assigning the quantity of 2 to "computer"', function (done) {
                        var assign = {"associations":[{"resourceId":resourceCreated._id,
                            "name":resourceCreated.name,
                            "customName":resourceCreated.customName,
                            "fontIcon":resourceCreated.fontIcon,
                            "quantity":"2"}]};

                        rooms
                            .associateRoomAnother(selectedRoom._id, assign, token)
                            .end(function (err, res) {
                                status = res.status;
                                done();
                            });
                    });

                    it('Then ensure that a response with status code ' +
                        '200 is returned', function (done) {
                        expect(status).to.equal(200);
                        done();

                    });

                    it('And ensure the "thisisanewreourceswithareallylongnamethatwil' +
                        'lbeassignedtoaconferenceroom" ' +
                        'is associated with the room "Conference Room 1"', function (done) {
                        rooms
                            .getRoom(selectedRoom._id)
                            .end(function (err, res) {
                                selectedRoom = res.body;

                                expect(selectedRoom.resources[0].resourceId).to.equal(resourceCreated._id);
                                expect(resourceCreated.name).to.equal("thisisanewreourceswithareallylongnamethatwillbeassignedtoaconferenceroom");

                                done();
                            });

                    });

                    it('And ensure the quantity of computer is 2', function (done) {
                        expect(selectedRoom.resources[0].quantity).to.equal(2);
                        done();
                    });

                });
            });
        });
    });
});




