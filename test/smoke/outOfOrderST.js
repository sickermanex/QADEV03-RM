/**
 * Created by Aleida on 21/08/2015.
 */
/* Out of order Smoke Test*/
var expect = require('chai').expect;
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var tokenLib =require('..\\..\\lib\\tokenLib');
//var config = require('..\\settings.json');
var content = require('..\\..\\requestJSONs\\outOfOrderRequest.json');
var token;
before('Setting the token', function(done){
    tokenLib
        .getToken(done, function(){
            token = arguments[0];
        });

});
describe('Smoke Test 1.0 - Out of order', function(){
    /*Variables*/
    var roomId;
    var servId;
    this.timeout(5000);
    this.slow(4000);
    var oooCont = content.createOutOfOrder;
    var oooEdit = content.editOutOfOrder;

    /**Smoke Test Case
     *Title: GET all out of order
     */
        it('Get all out of order', function(done){
            outOfOrders
                .getOutOfOrders()
                .end(function(error1, resp1){
                    expect(resp1.status).to.equal(200);
                    done();
                });
        });
        /**Smoke Test Case
         *Title: GET a out of order from a room from a service
         */
        it('GET a out of order from a room from a service', function(done){
            outOfOrders
                .getOutOfOrders()
                .end(function(error2, resp2){
                    var roomId = resp2.body[0].roomId;
                    outOfOrders
                        .getRoomId(roomId)
                        .end(function(er,re){
                            var servId = re.body.serviceId;
                            console.log(roomId);
                            outOfOrders
                                .getOutOfOrderbyRoom(servId,roomId)
                                .end(function(e,r){
                                    expect(r.status).to.equal(200);
                                    done();
                                });

                        });
                });
        });
        /**Test Case
         *Title: POST-Create a out of order from a room from a service
         */
        it('POST-Create a out of order from a room from a service', function(done){
            /* Pre condition
            Create a out of order from a service [serviceId] from a room [roomId]*/
            outOfOrders
                .createOutOfOrder(0000,0000,oooCont,token)
                .end(function(error3, resp3){
                    var response = resp3.status;
                    expect(response).to.equal(404);
                    done();
                });
        });
        /**Test Case
         *Title: GET a out of order by ID from a room from a service
         */
        it('GET a out of order by ID from a room from a service', function(done) {
            /* Pre condition Get roomId and Service Id*/
            outOfOrders
                .getOutOfOrders()
                .end(function(error2, resp2){
                    var roomId = resp2.body[0].roomId;
                    var oooId = resp2.body[0]._id;
                    outOfOrders
                        .getRoomId(roomId)
                        .end(function(er,re){
                            var servId = re.body.serviceId;
                            console.log(roomId);
                            outOfOrders
                                .getOutOfOrderById(servId,roomId,oooId)
                                .end(function(e,r){
                                    expect(r.status).to.equal(200);
                                    done();
                                });

                        });
                });

        });
        /**Test Case
         *Title: UPDATE a "out of order" by id from a service from a room
         */
        it('UPDATE a "out of order" by id from a service from a room', function(done){
            outOfOrders
                .updateOutOfOrder(0000,0000,oooEdit,token,0000)
                .end(function(error3, resp3){
                    var response = resp3.status;
                    expect(response).to.equal(404);

                    done();
                });
        });
        /**Test Case
         *Title: DELETE a "out of order" by id from a service from a room
         */
        it('DELETE a "out of order" by id from a service from a room', function(done){
            outOfOrders
                .deleteOutOfOrder(0000, token)
                .end(function(error4, resp4){
                    var respo = resp4.status;
                    expect(respo).to.equal(404);
                    done();
                });
        });
});

