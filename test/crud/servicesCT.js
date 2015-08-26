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
    "hostname": settings.domain+'.lab'
};

var serviceId;
var token;
var serviceType = settings.typeservice;



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
                    serviceId =  res.body[0]._id;
                    if(!serviceId)
                    {
                        servicesLib
                            .postservices(token,serviceType,loginExchange)
                            .end(function(err, res){
                                serviceId = res.body._id;
                                done();
                            });
                    }else
                        done();
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
                    expect(service.length).to.equal(1);
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


    });
});