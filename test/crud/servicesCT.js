/**
 * Created by luiscachi on 8/25/2015.
 */
/**
 * services smoke test
 * */
var expect = require('chai').expect;
var servicesLib = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');

/**
 * var needed
 * */

var loginExchange = {
    "username": settings.exchangeAccount,
    "password": settings.exchangeAccountPassword,
    "hostname": settings.domain+'.lab'
};

var serviceId;
var token;
var serviceType;



describe('Room Manager Smoke Test:', function() {
    this.timeout(50000);
    this.slow(40000);

    /**
     get token
     */
    before('Setting the token', function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });


    describe('runn test cases about RoomManager',function(){
        /**
         * this before obtain the service ID of the first exchange server
         * */
        before(function (done) {
            servicesLib
                .getServices(token)
                .end(function(err, res){
                    serviceId =  res.body[0]._id;
                    serviceType = res.body[0].type;
                    console.log('tjhe sercice Id' ,  serviceId);
                    done();
                });
        });

        /**
         * this test cases is to verify that the API return
         * all services added
         */
        // in this request missing the assersions
        it('verify that the API return the services added', function(done){
            servicesLib
                .getServices(token)
                .end(function(err, res){
                    var service = res.body;
                    service.forEach(function(ser){
                        console.log(ser._id);
                    });
                    done();
                });
        });

        /**
         * this test case is to verify that the API services by Id
         * return the service correct
         * */

        it('verify that the API services by Id exist', function(done){
            servicesLib
                .getServicesById(token , serviceId)
                .end(function(err , res){
                    var service = res.body;
                    expect(service._id).to.equal(serviceId);
                    expect(service.type).to.be.equal(serviceType);
                    done()
                })
        });

        /**
         * this test cases is to verify that the API get services-type
         * return all services with type 'exchange'
         * */
        // this test cases to will be change when room manager support more service-types
        it('verify that the API service-Type return the services type support', function(done){
            servicesLib
                .getserviceType()
                .end(function(err, res){
                    var service = res.body;
                    service.forEach(function(ser){
                        expect(ser.name).to.equal(serviceType);
                    });
                    done();
                });
        });

        /**
         * verify that the API get services by type return all services
         * whit the services specified
         * */

        it('verify that the API return all services of the same type', function(done){
            servicesLib
                .getservicebyType(serviceType,token)
                .end(function(err, res){
                    var service = res.body;
                    service.forEach(function(ser){
                        expect(ser.type).to.equal(serviceType);
                    });
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
             *this test cases is to verify
             * that has been added a services
             * with the data correct
             */

            it('verify tha has been added with correc data', function(done){
                servicesLib
                    .postservices(token,serviceType,loginExchange)
                    .end(function(err, res){
                        var serv = res.body;
                        newservice = serv._id;
                        expect(serv.type).to.equal(serviceType);
                        expect(serv._id).to.equal(newservice);
                        expect(serv.credential.username).to.equal(loginExchange.username);
                        expect(serv.serviceUrl).to.contain(loginExchange.hostname);

                        done();
                    });
            });

            /**
             *this describe test the  of the API when did delete
             */

            it('verify that the API to be delete exist', function(done){
                servicesLib
                    .deleteservice(token,serviceIDdel)
                    .end(function(err, res){
                        var serv = res.body;
                        expect(serv.type).to.equal(serviceType);
                        expect(serv._id).to.equal(serviceIDdel);
                        expect(serv.serviceUrl).to.contain(loginExchange.hostname);
                        done();
                    });
            });

        });

    });


});