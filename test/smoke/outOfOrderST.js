/**
 * Created by Aleida on 21/08/2015.
 */
//Out of order Smoke Test
var expect = require('chai').expect;
var outOfOrders = require('..\\..\\lib\\outOfOrderlib');
var config = require('..\\..\\config\\outOfOrderConfig.json');

describe('Smoke Test 1.0 - Out of order', function(){
    /*Variables*/
    this.timeout(5000);
    this.slow(4000);

    var oooCont =
    {
        from: "2015-08-24T21:30:00.000Z",
        to: "2015-08-24T22:00:00.000Z",
        title: "Temporarily Out of Order",
        sendEmail: false
    };
    var oooEdit = {
        "from": "2015-08-24T22:30:00.000Z",
        "to": "2015-08-24T23:00:00.000Z",
        "title": "Temporarily Out of Order",
        "sendEmail": false

    };

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
    it('Get a out of order from a service from a room', function(done){
        //room id
         outOfOrders
            .getRoomId()
            .end(function(e,r){
            var roomId = r.body[0]._id;
            var servId = r.body[0].serviceId;
                 console.log(roomId);
            outOfOrders
             .getOutOfOrderbyRoom(servId,roomId)
             .end(function(error2, resp2){
                    expect(resp2.status).to.equal(200);
                    done();
              });
         });
    });
    /**Test Case
     *Title: CREATE out of order from a specific room
     */
    it('Create a out order', function(done){
        /*Test Case*/
        /*Get token - Pre condition for some smoke test cases*/
        outOfOrders
            .getToken(config)//token
            .end(function(error, resp) {
               var token = resp.body.token;
                /*Create a out of order from a service [serviceId] from a room [roomId]*/
               outOfOrders
               .createOutOfOrder(0000,0000,oooCont,token)
               .end(function(error3, resp3){
                    var response = resp3.status;
                    expect(response).to.equal(404);

                     done();

            });
        });
    });
    /**Test Case
     *Title: Get out of order by id from a service from a room
     */
    it('Get a out order by id', function(done) {
        /*Test Case*/
        /* Get roomId and Service Id*/
        var roomId;
        var oooId;
        var servId;
        outOfOrders
            .getRoomId()
            .end(function(err6,resp6){
                servId=resp6.body[0].serviceId;
                outOfOrders
                    .getOutOfOrders()
                    .end(function (err5, res5) {
                        roomId = res5.body[0].roomId;
                        oooId = res5.body[0]._id;
                        outOfOrders
                            .getOutOfOrderById(servId,roomId,oooId)
                            .end(function(error3, res3){
                                var response = res3.status;
                                expect(response).to.equal(200);
                                done();
                            });

                    });

            });

    });
    /**Test Case
     *Title: Update out of order by id from a service from a room
     */
    it('Update a out order', function(done){
        /*Test Case*/
        /*Get token - Pre condition for some smoke test cases*/
        outOfOrders
            .getToken(config)//token
            .end(function(error, resp) {
                var token = resp.body.token;

                outOfOrders//update
                .updateOutOfOrder(0000,0000,oooEdit,token,0000)
                .end(function(error3, resp3){
                     var response = resp3.status;
                     expect(response).to.equal(404);

                      done();

                });

        });
    });
    /**Test Case
     *Title: Delete out of order
     */
    it('Delete a out order', function(done){
        /*Test Case*/
        /*Get token - Pre condition for some smoke test cases*/
        outOfOrders
            .getToken(config)//token
            .end(function(error, resp) {
                var token = resp.body.token;

                outOfOrders//delete
                .deleteOutOfOrder(0000, token)
                .end(function(error4, resp4){
                     var respo = resp4.status;
                     expect(respo).to.equal(404);
                     done();

                });
            });
    });

});

