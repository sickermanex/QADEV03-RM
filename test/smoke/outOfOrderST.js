/**
 * Created by Aleida on 21/08/2015.
 */
/* Out of order Smoke Test*/
var expect = require('chai').expect;
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var content = require('..\\..\\lib\\outOfOrderRequestLib');
var tokenLib =require('..\\..\\lib\\tokenLib');
var config = require('..\\settings.json');

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

describe('Smoke Test Cases- Out of order', function() {
    /*Variables
     * roomId- the id of a room
     * servId- the id of the mail service
     * oooId- the id of out-of-order
     * */
    var roomId;
    var servId;
    var oooId;
    this.timeout(config.setDelayTime);
    this.slow(config.setErrorMaxTime);
    /**Test Case
     *Title: GET-All "out of order"
     */
    it('Get all out of order', function (done) {
        outOfOrders
            .getOutOfOrders()
            .end(function (error, resp) {
                expect(resp.status).to.equal(200);
                done();
            });
    });
    /**Test Case
     *Title: POST-Create a out of order from a room from a service
     */
    it('POST-Create a out of order from a room from a service', function(done){
        /*Test Case*/
        /*Create a out of order from a service [serviceId] from a room [roomId]*/
        outOfOrders
            .getRooms()
            .end(function(error,resp){
                roomId = resp.body[0]._id;
                servId =resp.body[0].serviceId;
                var res = content.getContentCreate(roomId);
                var res1 = content.getCont();
                outOfOrders
                    .createOutOfOrder(servId,roomId,res,token)
                    .end(function(err, res){
                        var response = res.status;
                        oooId = res.body._id;
                        expect(response).to.equal(200);
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
    /**Test Case
     *Title: DELETE a "out of order" from a service [serviceId] from a room [roomId]*
     */
    it('DELETE a "out of order" by id from a service from a room', function(done){
        /*Test Case*/
        outOfOrders
            .getRooms()
            .end(function(error,resp){
                roomId = resp.body[0]._id;
                servId =resp.body[0].serviceId;
                var contentBody = content.getContentCreate(roomId);
                outOfOrders
                    .createOutOfOrder(servId,roomId,contentBody,token)
                    .end(function(err, res){
                        var response = res.status;
                        oooId = res.body._id;
                        expect(response).to.equal(200);
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
    /*
    * Smoke test cases for: UPDATE and GETs with pre condition -CREATE and DELETE "out-of-order*/
    describe('Smoke test cases for: UPDATE and GETs with pre condition -CREATE and DELETE "out-of-order"' , function () {
        /*Pre condition-Create a out of order on a room*/
        before('Create a "out-of-order"',function(done) {
            outOfOrders
                .getRooms()
                .end(function (error, resp) {
                    roomId = resp.body[0]._id;
                    servId = resp.body[0].serviceId;
                    var res = content.getContentCreate(roomId);
                    outOfOrders
                        .createOutOfOrder(servId, roomId, res, token)
                        .end(function (err, res) {
                            var response = res.status;
                            oooId = res.body._id;
                            done();
                        });
                });
        });
        /*Post Condition-Delete a out of order*/
        after('deletes a out-of-order',function (done) {
            outOfOrders
                .deleteOutOfOrder(servId, roomId, token, oooId)
                .end(function (error, resp) {
                    var response = resp.status;
                    expect(response).to.equal(200);
                    done();
                });
        });

        /**Smoke Test Case
         *Title: GET a out of order from a room from a service
         */
        it('GET a out of order from a room from a service', function (done) {
            outOfOrders
                .getOutOfOrderbyRoom(servId, roomId)
                .end(function (error, resp) {
                    expect(resp.status).to.equal(200);
                    done();
                });
        });
        /**Test Case
         *Title: GET a out of order by ID from a room from a service
         */
        it('GET a out of order by ID from a room from a service', function (done) {
            /*Test Case*/
            /* Get roomId and Service Id*/
            outOfOrders
                .getOutOfOrderById(servId, roomId, oooId)
                .end(function (error, resp) {
                    expect(resp.status).to.equal(200);
                    done();
                });

        });
        /**Test Case
         *Title: UPDATE a "out of order" by id from a service from a room
         */
        it('UPDATE a "out of order" by id from a service from a room', function (done) {
            /*Test Case*/
            var res = content.getCont();
            outOfOrders
                .updateOutOfOrder(servId, roomId, res, token, oooId)
                .end(function (error, resp) {
                    var response = resp.status;
                    expect(response).to.equal(200);
                    done();
                });
        });
    });
});

