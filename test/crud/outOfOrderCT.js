/**
 * Created by Aleida on 21/08/2015.
 */
/* Out of order Smoke Test*/
var expect = require('chai').expect;
var config = require('..\\..\\settings.json');
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var content = require('..\\..\\lib\\outOfOrderRequestLib');
var tokenLib =require('..\\..\\lib\\tokenLib');
var rooms = require('..\\..\\lib\\conferenceRoomsLib');

var token;
/*
 The before method creates a token that is stored in the "token" global variable, and it's used
 for the whole group of test cases in this test suit.
 */
before('Setting the token', function(done){
    tokenLib
        .getToken(done, function(){
            token = arguments[0];
        });

});

describe('CRUD Test Cases- Out of order', function() {
    /*Variables
    * roomId- the id of a room
    * servId- the id of the mail service
    * arrayOutIDs- the list of ids of out-of-order
    * OutByRoomIDs- the list of ids "out-of-orders" by room
    * */
    var roomId;
    var servId;
    var oooId;
    var arrayOutIDs = [];
    var OutByRoomIDs = [];
    this.timeout(config.setDelayTime);
    this.slow(config.setErrorMaxTime);

    /**Test Case
     *Title: POST-Create a out of order from a room from a service
     */
    it('POST-Create a out of order from a specific room from a specific service', function(done){
        /**/
        rooms
        .getRooms()
            .end(function(error,resp){
                roomId = resp.body[0]._id;
                servId =resp.body[0].serviceId;
                var res = content.getContentCreate(roomId);
                var res1 = content.getCont();
                    outOfOrders
                      .createOutOfOrder(servId,roomId,res,token)
                      .end(function(err, res){
                      var expectedResult = res.body;
                      oooId = res.body._id;
                      expect(res.status).to.equal(200);
                      outOfOrders
                      .getOutOfOrderById(servId, roomId, oooId)
                      .end(function (error, resp) {
                           var actualResult = resp.body;
                                    expect(resp.status).to.equal(200);
                                    expect(error).to.be.OK;
                                    expect(actualResult._id).to.equal(expectedResult._id);
                                    expect(actualResult.roomId).to.equal(expectedResult.roomId);
                                    expect(actualResult.title).to.equal(expectedResult.title);

                                    outOfOrders
                                        .deleteOutOfOrder(servId, roomId, token, oooId)
                                        .end(function (er, re) {
                                            var response = re.status;
                                            expect(response).to.equal(200);
                                            done();
                                        });
                                });
                        });
                });
    });
    /**Test Case
     *Title: DELETE a "out of order" by id from a service from a room
     */
        it('DELETE a "out of order" by id from a specific room from a specific service', function(done) {
            /*Test Case*/
            rooms
                .getRooms()
                .end(function (error, resp) {
                    roomId = resp.body[0]._id;
                    servId = resp.body[0].serviceId;
                    var contentBody = content.getContentCreate(roomId);
                    outOfOrders
                        .createOutOfOrder(servId, roomId, contentBody, token)
                        .end(function (err, res) {
                            var expectedResult = res.body;
                            oooId = res.body._id;
                            outOfOrders
                                .deleteOutOfOrder(servId, roomId, token, oooId)
                                .end(function (er, re) {
                                    var actualResult = re.body;
                                    var response = re.status;
                                    expect(response).to.equal(200);
                                    expect(actualResult.roomId).to.equal(expectedResult.roomId);
                                    expect(actualResult.title).to.equal(expectedResult.title);

                                   done();
                                });
                        });
                });
        });
    /*DESCRIBE-CRUD test cases for: UPDATE and GETs with precondition
    * */
    describe('CRUD test cases for: UPDATE and GETs with precondition' , function () {
        /*Pre condition-Create a out of order on a specific room */
        before('Before for update and GETs by id',function(done) {
            rooms
                .getRooms()
                .end(function (error, resp) {
                    roomId = resp.body[0]._id;
                    servId = resp.body[0].serviceId;
                    var res = content.getContentCreate(roomId);
                    outOfOrders
                        .createOutOfOrder(servId, roomId, res, token)
                        .end(function (err, res) {
                            oooId = res.body._id;
                            done();
                        });
                });
        });
        /*Post Condition-Delete a out of order, from a specific room from a specific service*/
        after('after-Delete',function (done) {
            outOfOrders
                .deleteOutOfOrder(servId, roomId, token, oooId)
                .end(function (error, resp) {
                    done();
                });
        });
        /**Test Case
         *Title: GET-All "out of order"
         */
        it('GET all out of order', function (done) {
            var arrayOut = [];
            outOfOrders
                .getOutOfOrders()
                .end(function (error, resp) {
                    expect(error).to.be.OK;
                    expect(resp.status).to.equal(200);
                    arrayOut =  resp.body;
                    arrayOut.forEach(function(outOO){
                        arrayOutIDs.push(outOO._id);
                    });
                    done();
                });
        });

        /**Smoke Test Case
         *Title: GET a out of order from a specific room from a specific service
         */
        it('GET a out of order from a specific room from a specific service', function (done) {
            var arrayOutByRoom = [];
            outOfOrders
                .getOutOfOrderbyRoom(servId, roomId)
                .end(function (error, resp){
                    expect(resp.status).to.equal(200);
                    arrayOutByRoom =  resp.body;
                    arrayOutByRoom.forEach(function(outOO){
                        OutByRoomIDs.push(outOO._id);
                    });
                    expect(arrayOutIDs).to.include.members(OutByRoomIDs);
                    done();
                });
    });
    /**Test Case
     *Title: GET a out of order by ID from a specific room from a specific service
     */
    it('GET a out of order by ID from a specific room from a specific service', function (done) {
        /*Test Case*/
        /* Get roomId and Service Id*/
        outOfOrders
            .getOutOfOrderById(servId, roomId, oooId)
            .end(function (error, resp) {
                var expectedResult = [];
                expectedResult.push(resp.body._id);
                expect(resp.status).to.equal(200);
                expect(OutByRoomIDs).to.include.members(expectedResult);
                expect(arrayOutIDs).to.include.members(expectedResult);
                done();
            });

    });
    /**Test Case
     *Title: UPDATE a "out of order" by id from a specific room from a specific service
     */
    it('UPDATE a "out of order" by id from a specific room from a specific service', function (done) {
        /*Test Case*/
        /*Get token - Pre condition for some smoke test cases*/

        var bodyContent = content.getCont();/*Body content for update a out-of-order*/
        outOfOrders
            .updateOutOfOrder(servId, roomId, bodyContent, token, oooId)
            .end(function (error, resp) {
                var expectedResult = resp.body;
                expect(resp.status).to.equal(200);
                outOfOrders
                    .getOutOfOrderById(servId, roomId, oooId)
                    .end(function (error, resp) {
                        var actualResult = resp.body;
                        expect(resp.status).to.equal(200);
                        expect(error).to.be.OK;
                        expect(actualResult._id).to.equal(expectedResult._id);
                        expect(actualResult.roomId).to.equal(expectedResult.roomId);
                        expect(actualResult.title).to.equal(expectedResult.title);
                        expect(actualResult.from).to.equal(expectedResult.from);
                        expect(actualResult.to).to.equal(expectedResult.to);
                        done();
                    });
            });
    });
  });
});

