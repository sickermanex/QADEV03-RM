/**
 * services CRUD test
 * author: luis Cachi
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



describe('Room Manager Services CRUD Testing:', function() {
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
    describe( 'CRUD Testing: get , post and delete about services API' , function () {
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
         * verify that the /services end poit
         * return a correct information about  the service added
         * end point : '/services'
         */

        it('verify the information about the services is correct', function(done){
            servicesLib
                .getServices(token)
                .end(function(err, res){
                    var service = res.body;
                    expect(service.length).to.equal(1);//verify that the array equals to one
                    service.forEach(function(ser){
                        expect(ser._id).to.equal(serviceId);
                        expect(ser.type).to.equal(serviceType);
                        expect(ser.serviceUrl).to.contain(loginExchange.hostname);
                        expect(ser.credential.username).to.equal(loginExchange.username);
                    });
                    done();
                });
        });

        /**
         * verify that the API services by Id return the correct information
         * about the services added with the specified ID
         * end point : '/services/{:serviceId}'
         * */

        it('verify that the API services by Id is correct', function(done){
            servicesLib
                .getServicesById(token , serviceId)
                .end(function(err , res){
                    var status = res.body;
                    expect(status._id).to.equal(serviceId);
                    expect(status.type).to.equal(serviceType);
                    expect(status.serviceUrl).to.contain(loginExchange.hostname);
                    expect(status.credential.username).to.equal(loginExchange.username);
                    done();
                })
        });

        /**
         * verify that the API get services-type
         * return the services-type support for the RoomManager
         * end point : '/service-types'
         * */

        it('verify that the API service-Type return the services type supported ', function(done){
            servicesLib
                .getserviceType()
                .end(function(err, res){
                    var service = res.body;
                    expect(service.length).to.equal(1); //verify that the array equals to one
                    service.forEach(function(servTyp){
                        expect(servTyp.name).to.equal(serviceType);
                    });
                    done();
                });
        });

        /**
         * verify that the API get services filtering by Type
         * return only the services that belong
         * to services specified on the settings.js
         * end point : '/services?type={service type} '
         * */

        it('verify that the API GetServicesByType return the services with correct information', function(done){
            servicesLib
                .getservicebyType(serviceType,token)
                .end(function(err, res){
                    var service = res.body;
                    expect(service.length).to.equal(1); //verify that the array equals to one
                    service.forEach(function(ser){
                        expect(ser.type).to.equal(serviceType);
                        expect(ser._id).to.equal(serviceId);
                        expect(ser.serviceUrl).to.contain(loginExchange.hostname);
                        expect(ser.credential.username).to.equal(loginExchange.username);
                    });
                    done();
                });
        });
        /**
         *this test si to verify that API to be delete a services
         * return the correct information about the service deleted
         * end point : '/services/{:serviceId}'
         */
        it('verify that the for do delete return the correct information about the services deleted', function(done){
            servicesLib
                .deleteservice(token,serviceId)
                .end(function(err, res){
                    var serv = res.body;
                    expect(serv.type).to.equal(serviceType);
                    expect(serv._id).to.equal(serviceId);
                    expect(serv.serviceUrl).to.contain(loginExchange.hostname);
                    done();
                });
        });

        /**
         *this test cases is to verify that a services added
         *  display a correct information about the new service added
         * end point : '/services?type={service type} '
         */
        it('verify that the API to be post exist', function(done){
            servicesLib
                .postservices(token,serviceType,loginExchange)
                .end(function(err, res){
                    var serv = res.body;
                    serviceId = serv._id;
                    expect(serv.type).to.equal(serviceType);
                    expect(serv.credential.username).to.equal(loginExchange.username);
                    expect(serv.serviceUrl).to.contain(loginExchange.hostname);
                    expect(serv._id).to.equal(serviceId);
                    done();
                });
        });


    });
});