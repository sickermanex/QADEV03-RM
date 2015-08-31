/**
 * Created by Aleida on 21/08/2015.
 */
/* Out of order Smoke Test*/
var expect = require('chai').expect;
var config = require('..\\..\\settings.json');
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var content = require('..\\..\\lib\\outOfOrderlib');
var tokenLib =require('..\\..\\lib\\tokenLib');
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
var mongoserv = require('..\\..\\lib\\mongoConnection.js');
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
    var roomID;
    var servID;
    var oooID;
    var arrayOutIDs = [];
    var OutByRoomIDs = [];
    this.timeout(config.setDelayTime);
    this.slow(config.setErrorMaxTime);

    /*variable to test case delete*/
    var actualResDel;

    /**Test Case
     *Title: POST-Create a out of order from a room from a service
     */
    it('POST-Create a out of order from a specific room from a specific service', function(done){
        rooms
        .getRooms()
            .end(function(error,resp){
                roomID = resp.body[0]._id;
                servID =resp.body[0].serviceId;
                var res = content.getContentCreate(roomID);
                    outOfOrders
                      .createOutOfOrder(servID,roomID,res,token)
                      .end(function(err, res){
                      var expectResult = res.body;
                      oooID = res.body._id;
                      expect(res.status).to.equal(200);
                      outOfOrders
                      .getOutOfOrderById(servID, roomID, oooID)
                      .end(function (error, resp) {
                           var actualResult = resp.body;
                                actualResDel = resp.body;
                                    expect(resp.status).to.equal(200);
                                    expect(error).to.be.OK;
                                    expect(actualResult._id).to.equal(expectResult._id);
                                    expect(actualResult.roomId).to.equal(expectResult.roomId);
                                    expect(actualResult.title).to.equal(expectResult.title);
                                done();
                                });
                        });
                });
    });
    /**Test Case
     *Title: DELETE a "out of order" by id from a service from a room
     */
        it('DELETE a "out of order" by id from a specific room from a specific service', function(done) {
            /*Test Case*/
            outOfOrders
            .deleteOutOfOrder(servID, roomID, token, oooID)
            .end(function (er, re) {
                  var expectResult = re.body;
                  var response = re.status;
                  expect(response).to.equal(200);
                  expect(expectResult.roomId).to.equal(actualResDel.roomId);
                  expect(expectResult.title).to.equal(actualResDel.title);

                  outOfOrders
                        .getOutOfOrderById(servID, roomID, oooID)
                        .end(function (error, resp) {
                            var actualResult = resp.body;
                            expect(resp.status).to.equal(404);

                            done();
                        });
                  });
        });
    /*DESCRIBE-CRUD test cases for: UPDATE and GETs with precondition
    * */
    describe('CRUD test cases for: UPDATE and GETs with precondition' , function () {
        /*Pre condition-Create a out of order on a specific room */
        /*Variables for this describe */
        var roomId;
        var servId;
        var oooId;
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
            var arrayOutsBD;
            var idList;
            var roomidBD;
            outOfOrders
                .getOutOfOrders()
                .end(function (error, resp) {
                    expect(error).to.be.OK;
                    expect(resp.status).to.equal(200);
                    arrayOut =  resp.body;
                    arrayOut.forEach(function(outOO){
                        arrayOutIDs.push(outOO._id);
                    });
                    /*Using MongoDB */
                    mongoserv
                        .getcollection('outoforders',function(){
                            arrayOutsBD = arguments[0];
                            for(var i = 0; i < arrayOutsBD.length; i++)
                            {
                                idList = arrayOut[i]._id;
                                idList = idList.toString();
                                roomidBD = arrayOutsBD[i].roomId;
                                roomidBD = roomidBD.toString();
                                expect(arrayOut[i]._id).to.be.equal(idList);
                                expect(arrayOut[i].title).to.be.equal(arrayOutsBD[i].title);
                                expect(arrayOut[i].roomId).to.be.equal(roomidBD);
                            }
                            expect(resp.status).to.be.equal(200);
                            expect(arrayOut.length).to.be.equal(arrayOutsBD.length);
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
                        expect(actualResult.from).to.equal(expectedResult.from);
                        expect(actualResult.to).to.equal(expectedResult.to);
                        done();
                    });
            });
    });
  });
});

