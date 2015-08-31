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
    "hostname": settings.domainExchange
};

var serviceId;
var token;
var serviceType = settings.serviceType;



describe('Room Manager Services Smoke Tests:', function() {
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);
    /**
     * this before get the token
     * for a specified user on the setting.json
     * */
    before('Setting the token', function(done){
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
        it('1. the API ger-services exist', function(done){
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

        it('2. The API get services by Id exist', function(done){
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

        it('3. the API service-Type exist and return the Type service', function(done){
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

        it('4. the API get services by type exist', function(done){
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

        it('5. the API to be delete a services exist', function(done){
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
        it('6. the API to be add/post a service exist', function(done){
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