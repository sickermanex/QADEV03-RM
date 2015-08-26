/**
 * services smoke test
 * /** reques to post a service */

var expect = require('chai').expect;
var servicesLib = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
//var serreq = require('..\\..\\requestJSONs\\serviceRequest.json');

/**
 * var needed
 * */
/*
var loginExchange = serreq.postexchange;
loginExchange.replace("[exchangeAccount]",settings.exchangeAccount)
    .replace("[exchangePw]",settings.exchangeAccountPassword).replace("[domain]",settings.domain);
*/

var loginExchange = {
    "username": settings.exchangeAccount,
    "password": settings.exchangeAccountPassword,
    "hostname": settings.domain+'.lab'
};


var serviceId;
var token;
var serviceType;



describe('Room Manager Smoke Test:', function() {

    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);

    /**
    get token
    */
    before('Setting the token', function(done){
        console.log(loginExchange);
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });


    describe('runn test cases about RoomManager',function(){
        /**
         * this before obtain the service ID
         * */
        before(function (done) {
            servicesLib
                .getServices(token)
                .end(function(err, res){
                    serviceId =  res.body[0]._id;
                    serviceType = res.body[0].type;
                    done();
                });
        });

        /**
         verify that the services api is present
         */

        it('verify that the API services exist', function(done){
            servicesLib
                .getServices(token)
                .end(function(err, res){
                    var status = res.status;
                    expect(status).to.equal(200);
                    done();
                });
        });

        /**
         * verify that the API services by Id exist
         * */

        it('verify that the API services by Id exist', function(done){
            servicesLib
                .getServicesById(token , serviceId)
                .end(function(err , res){
                    var status = res.status;
                    expect(status).to.equal(200);
                    done();
                })
        });

        /**
         * verify that the API get services-type exist
         * */

        it('verify that the API service-Type exist', function(done){
            servicesLib
                .getserviceType()
                .end(function(err, res){
                    var status = res.status;
                    expect(status).to.equal(200);
                    done();
                })
        });

        /**
         * verify that the API get services by type exist
         * */

        it('verify that the API get servicesbytype exist', function(done){
            servicesLib
                .getservicebyType(serviceType,token)
                .end(function(err, res){
                    var status = res.status;
                    expect(status).to.equal(200);
                    done();
                })
        });

        /**
         *this describe, test the existence of the API when did post and delete
         */
        describe('add and delete services test' ,  function(){
            var serviceIDdel;
            var newservice;

            before(function(done){
                servicesLib
                    .postservices(token,serviceType,loginExchange)
                    .end(function(err, ress){
                        serviceIDdel = ress.body._id;
                        console.log('new services lib', serviceIDdel);
                        done();
                    });
            });
            after(function(done){
                servicesLib
                    .deleteservice(token,newservice)
                    .end(function(err, res){
                        done();
                    });
            });

            /**
             *this describe test the existence of the API when did post
             */

            it('verify that the API to be post exist', function(done){
                servicesLib
                    .postservices(token,serviceType,loginExchange)
                    .end(function(err, res){
                        newservice = res.body._id;
                        var status = res.status;
                        expect(status).to.equal(200);
                        done();
                    });
            });

            /**
             *this describe test the existence of the API when did delete
             */

            it('verify that the API to be delete exist', function(done){
                console.log('service to be delete' , serviceIDdel);
                servicesLib
                    .deleteservice(token,newservice)
                    .end(function(err, res){
                        var status = res.status;
                        expect(status).to.equal(200);
                        done();
                    });
            });

        });

    });
});