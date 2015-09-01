/**
 * Created by Aleida on 21/08/2015.
 */
/* Out of order Smoke Test*/
var expect = require('chai').expect;
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var content = require('..\\..\\lib\\outOfOrderlib');
var tokenLib =require('..\\..\\lib\\tokenLib');
var config = require('..\\..\\settings.json');
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

describe('Smoke Test Cases- Out of order', function() {
    /*Variables
     * roomId- the id of a room
     * servId- the id of the mail service
     * oooId- the id of out-of-order
     * */
    var roomID;
    var servID;
    var oooID;
    this.timeout(config.setDelayTime);
    this.slow(config.setErrorMaxTime);
    var roomId;
    var servId;
    var oooId;

    /**Test Case
     *Title: POST-Create a out of order from a specific room from a specific service
     */
    it('POST-Create a out of order from a specific room from a specific service', function(done){
        rooms
            .getRooms()
            .end(function(error,resp){
                var res = content.getContentCreate(roomID);
                var res1 = content.getCont();
                outOfOrders
                    .createOutOfOrder(000,000,res,token)
                    .end(function(err, res){
                        var response = res.status;
                        oooID = res.body._id;
                        expect(response).to.equal(404);
                        done();
                    });
            });
    });
    /**
     * Test Case
     *Title: DELETE a "out of order" from a specific room from a specific service*
     */
    it('DELETE a "out of order" by id from a service from a room', function(done){
        /*Test Case*/
        outOfOrders
            .deleteOutOfOrder(000, 000, token, 0000)
            .end(function (er, re) {
                 var response = re.status;
                expect(response).to.equal(404);
                 done();
                 });

    });
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

    /**Smoke Test Case
     *Title: GET a out of order from a specific room from a specific service
     */
    it('GET a out of order from a specific room from a specific service', function (done) {
        outOfOrders
            .getOutOfOrderbyRoom(000, 000)
            .end(function (error, resp) {
                expect(resp.status).to.equal(404);
                done();
            });
    });
    /**Test Case
     *Title: GET a out of order by ID from a specific room from a specific service
     */
    it('GET a out of order by ID from a specific room from a specific service', function (done) {
        outOfOrders
            .getOutOfOrderById(000, 000, 000)
            .end(function (error, resp) {
                expect(resp.status).to.equal(404);
                done();
            });

    });
    /**Test Case
     *Title: UPDATE a "out of order" by id from a specific room from a specific service
     */
    it('UPDATE a "out of order" by id from a specific room from a specific service', function (done) {
        var res = content.getCont();
        outOfOrders
            .updateOutOfOrder(000, 000, res, token, 000)
            .end(function (error, resp) {
                var response = resp.status;
                expect(response).to.equal(404);
                done();
            });
    });





});

