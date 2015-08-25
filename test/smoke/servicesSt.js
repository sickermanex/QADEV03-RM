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
var login = {
    "username": settings.domain + "\\" + settings.roomManagerAccount,
    "password": settings.roomManagerPassword,
    "authentication": "ldap"
};
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
    get token and services ID
    */
    before(function (done) {
        tokenLib
            .getToken(login)
            .end(function (err, res) {
                token = 'jwt ' + res.body.token;
                servicesLib
                    .getServices(token)
                    .end(function(err, res){
                        serviceId =  res.body[0]._id;
                        serviceType = res.body[0].type;
                        done();
                    });
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
     *this describe test the existence of the API when did post and delete
     */
    describe('create and delete services' ,  function(){
        var serviceIDdel;
        var newservice;
        before(function(done){
            servicesLib
                .postservices(token,serviceType,loginExchange)
                .end(function(err, ress){
                    serviceIDdel = ress.body._id;
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
            servicesLib
                .deleteservice(token,serviceIDdel)
                .end(function(err, res){
                    var status = res.status;
                    expect(status).to.equal(200);
                    done();
                });
        });

    });

});