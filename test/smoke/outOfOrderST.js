/**
 * Created by Aleida on 21/08/2015.
 */
//Out of order Smoke Test
var expect = require('chai').expect;
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var config = require('..\\..\\config\\outOfOrderConfig.json');

describe('Smoke Test 1.0 - Out of order', function(){
    /*Variables*/
    var token;
    var roomId;
    var oooId;

    var oooCont = {
        "from": "2015-08-23T20:30:00.000Z",
        "to": "2015-08-23T21:00:00.000Z",
        "title": "Temporarily Out of Order",
        "sendEmail": false
    };
    var oooEdit = {
        "from": "2015-08-23T22:30:00.000Z",
        "to": "2015-08-23T23:00:00.000Z",
        "title": "Temporarily Out of Order",
        "sendEmail": false

    };

    /*Get token - Pre condition for some smoke test cases*/
    before('before',function(){
        outOfOrders
            .getToken(config)
            .end(function(error, resp) {
                token = resp.body.token;
            });
    });
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
   *Title: GET out of order from a specific room
   */
    it('Get a out of order', function(done){
        outOfOrders
            .getOutOfOrderbyRoom('0000')
            .end(function(error2, resp2){
                var response = resp2.status;
                expect(response).to.equal(404);
                done();
            });
    });
    /**Test Case
     *Title: CREATE out of order from a specific room
     */
    it('Create a out order', function(done){
        /*Test Case*/
        outOfOrders
           .createOutOfOrder(oooCont, token)
            .end(function(error3, resp3){
                roomId = resp3.body.roomId;
                var response = resp3.status;
                 expect(response).to.equal(404);
                 /*Post condition*/
                 outOfOrders
                    .deleteOutOfOrder(roomId, token)
                    .end(function(error4, resp4){
                     var respo = resp4.status;
                     expect(respo).to.equal(404);
                         done();
                 });

         });

    });
    /**Test Case
     *Title: DELETE out of order
     */
    it('Delete a out of order', function(done){
        /*Test Case*/
        outOfOrders
            .createOutOfOrder(oooCont, token)
            .end(function(error5, resp5){
                roomId = resp5.body.roomId;
                var response = resp5.status;
                expect(response).to.equal(404);
                /*Post condition*/
                outOfOrders
                    .deleteOutOfOrder(roomId, token)
                    .end(function(error6, resp6){
                        var respo = resp6.status;
                        expect(respo).to.equal(404);
                        done();
                    });
            });

    });

    describe('Smoke Test 1.1- Out of order', function(){
        /*Pre condition*/
        beforeEach('Before each-create',function(done){
            outOfOrders
                 .createOutOfOrder(oooCont, token)
                 .end(function(error7, resp7){
                    roomId = resp7.body.roomId;
                    oooId = resp7.body._id;
                    done();
                });

        });
        /*Post condition*/
        afterEach('After Each',function(){
            outOfOrders
                .deleteOutOfOrder(roomId,oooId, token)
                .end(function(error10, resp10){
                });
        });
        /**Test Case
         *Title: UPDATE a room with out of order
         */
        it('Update a room with out of order', function(done){
            /*Pre condition*/
            outOfOrders
                .updateOutOfOrder(roomId,oooId,oooEdit, token)
                .end(function(error8, resp8){
                    var response = resp8.status;
                    expect(response).to.equal(404);
                          done();
                     });
        });

    });

});

