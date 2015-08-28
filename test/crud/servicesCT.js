/**
 * services CRUD test
 * author: luis Cachi
 * */
var expect = require('chai').expect;
var servicesLib = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
var mongoserv = require('..\\..\\lib\\mongoConnection.js');


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
var resmon;


describe('Room Manager Services CRUD Testing:', function() {
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);
    /**
     * this before get the token
     * for a specified user on the setting.json
     * and get all data about a specific collection
     * on the Mongo DB
     * pass the param (mane collection) in this case 'services'
     * */
    before('Setting the token', function(done){
        // mongoDB
        mongoserv
            .getcollection('services' ,function(){
                resmon = arguments[0];

            });
        // token
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });

    });


    describe( 'CRUD Testing: get , post and delete about services API' , function () {
        /**
         * get the service Id
         * if there is not added any services
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

        it('1. The information about the services is correct on mongoDB', function(done){
            servicesLib
                .getServices(token)
                .end(function(err, res){
                    var service = res.body;
                    var i;
                    for (i = 0; i < service.length; i++) {
                        expect(service[i].type).to.equal(resmon[i].type);
                        expect(service[i].serviceUrl).to.equal(resmon[i].serviceUrl);
                        expect(service[i].version).to.equal(resmon[i].version);
                        expect(service[i].name).to.equal(resmon[i].name);
                    }
                    done();
                });
        });

        /**
         * verify that the API services by Id return the correct information
         * about the services added with the specified ID
         * end point : '/services/{:serviceId}'
         * */

        it('2. The API services by Id return the correct data on mongoDB', function(done){
            servicesLib
                .getServicesById(token , serviceId)
                .end(function(err , res){
                    var status = res.body;
                    expect(status._id).to.equal(resmon[0]._id.toString());
                    expect(status.type).to.equal(resmon[0].type);
                    expect(status.serviceUrl).to.equal(resmon[0].serviceUrl);
                    expect(status.version).to.equal(resmon[0].version);
                    expect(status.name).to.equal(resmon[0].name);
                    done();
                })
        });

        /**
         * verify that the API get services-type
         * return the services-type support for the RoomManager
         * end point : '/service-types'
         * */

        it('3. The API service-Type return the SERVICE-TYPE supported ', function(done){
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

        it('4. The API GetServicesByType return the services with correct information', function(done){
            servicesLib
                .getservicebyType(serviceType,token)
                .end(function(err, res){
                    var service = res.body;
                    var i;
                    for (i = 0; i < service.length; i++) {
                        expect(service[i]._id).to.equal(resmon[i]._id.toString());
                        expect(service[i].type).to.equal(resmon[i].type);
                        expect(service[i].serviceUrl).to.equal(resmon[i].serviceUrl);
                        expect(service[i].version).to.equal(resmon[i].version);
                        expect(service[i].name).to.equal(resmon[i].name);
                    }
                    done();
                });
        });
        /**
         *this test si to verify that API to be delete a services
         * return the correct information about the service deleted
         * end point : '/services/{:serviceId}'
         */
        it('5. the API to be delete return the correct information about the services deleted', function(done){
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
        it('6. the API to be add/post a service add with the correct data', function(done){
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