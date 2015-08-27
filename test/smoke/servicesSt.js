/**
 * services smoke test
 * author: Luis Cachi
 * */
var expect = require('chai').expect;
var servicesLib = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');

/**
 * var needed
 * */
/**
 *this var is to add the exchange services
 * used in the post test and the smoke test before
 * in case that is not there added any services
 */

var loginExchange = {
        "username": settings.exchangeAccount,
        "password": settings.exchangeAccountPassword,
        "hostname": settings.domain+'.lab'
    };

var serviceId;
var token;
var serviceType = settings.typeservice;



describe('Room Manager Services Smoke Tests:', function() {
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);
    /**
     * this before get the token
     * for a specified user on the setting.json
     * */
    before('Setting the token', function(done){
        console.log('service Id', serviceId);
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });
    describe('Testing get , post and delete about services API ' , function () {
        /**
         * get the service Id
         * if there is not addes any services
         * this before add a services
         * */


         before(function (done) {
            servicesLib
                .getServices(token)
                .end(function(err, res){
                    var thereis =  res.body;
                    if( thereis.length === 0 )
                    {
                            servicesLib
                                .postservices(token,serviceType,loginExchange)
                                .end(function(erro, ress){
                                    serviceId = ress.body._id;
                                    done();
                                });
                    }else{
                        serviceId =  res.body[0]._id;
                        done();
                    }

                });
            });


        /**
         * verify that the services api is present
         * end point : '/services'
         * */

        it('Verify that the API services exist', function(done){
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
         * end point : '/services/{:serviceId}'
         * */

        it('Verify that the API services by Id exist', function(done){
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
         * end point : '/service-types'
         * */

        it('Verify that the API service-Type exist', function(done){
            servicesLib
                .getserviceType()
                .end(function(err, res){
                    var status = res.status;
                    expect(status).to.equal(200);
                    done();
                })
        });

        /**
         * verify that the API get services filtering by Type
         * end point : '/services?type={service type} '
         * */

        it('Verify that the API get services by type exist', function(done){
            servicesLib
                .getservicebyType(serviceType,token)
                .end(function(err, res){
                    var status = res.status;
                    expect(status).to.equal(200);
                    done();
                })
        });


        /**
         *this test cases delete the services added
         * end point : '/services/{:serviceId}'
         */

         it('Verify that the API to be delete exist', function(done){
             servicesLib
                 .deleteservice(token,serviceId)
                 .end(function(err, res){
                     var status = res.status;
                     expect(status).to.equal(200);
                     done();
                 });
         });

        /**
         *this test cases add a new services
         * end point : '/services?type={service type} '
         */
         it('Verify that the API to be post exist', function(done){
             servicesLib
                 .postservices(token,serviceType,loginExchange)
                 .end(function(err, res){
                     serviceId = res.body._id;
                     var status = res.status;
                     expect(status).to.equal(200);
                     done();
                 });
         });

    });
});