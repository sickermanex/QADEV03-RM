/**
 * Created by luiscachi on 8/29/2015.
 */
var expect = require('chai').expect;
var servicesLib = require('..\\..\\lib\\servicesLib');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
var mongoserv = require('..\\..\\utils\\mongoConnection.js');
var rooms = require('..\\..\\lib\\conferenceRoomsLib');
/*
 escenario 1 get rooms with any services associated
             Given the rooms’
             When the services no is added on the room manager
             Then ensure that no has any service added in room manager
             And ensure that any room is returned

 escenario 2 get rooms with a services associated
             given the rooms
             when the service is added on the room manager
             then ensure that a service is added in room manager
             and ensure that returned all rooms in the data base
*/

describe('services room scenarios', function(){
    var loginExchange = {
        "username": settings.exchangeAccount,
        "password": settings.exchangeAccountPassword,
        "hostname": settings.domainExchange
    };

    var token;
    var serviceType = settings.serviceType;
    var servicedb;

    context('',function(){
      before('Setting the token', function(done){
        // mongoDB
        mongoserv
            .getcollection('services' ,function(){
              servicedb = arguments[0];
            });
        // token
        tokenLib
            .getToken(done, function(){
              token = arguments[0];
            });

      });
      after(function(){
        // add a services
      });
      describe('scenario 1: get rooms with any services associated ',function(){
        context('When the services no is added on the room manager', function(){
          before(function(done) {
            servicesLib
              .getServices(token)
                 .end(function (err, res) {
                   var servis = res.body;
                      for(var i = 0 ; i < servis.length ; i++){
                        servicesLib
                            .deleteservice(token, servis[i]._id)
                            .end(function (err, res) {
                                done();
                            });
                      }

                 });
            });
          after(function(done){
            servicesLib
              .postservices(token,serviceType,loginExchange)
              .end(function(err, res){
               done();
              });
          });

            it('Then ensure that no has any service added in room manager', function(done){
              servicesLib
               .getServices(token)
               .end(function(err, res){
                 var service = res.body;
                   expect(service.length).to.equal(0);
                     done();
               });
            });
            it('And ensure that any room is returned', function(done){
              rooms
                .getRooms()
                .end(function(err,res){
                  var rooms = res.body;
                  expect(rooms.length).to.equal(0);
                  done();
                });
            });
          })
        });

        describe('escenario 2 get rooms with a services associated', function(){

          context('when the service is added on the room manager',function(){
            before(function(done) {
                servicesLib
                    .getServices(token)
                    .end(function (err, res) {
                        var service = res.body;
                        if (service.length === 0) {
                            servicesLib
                                .postservices(token, serviceType, loginExchange)
                                .end(function (err, res) {
                                    var serv = res.body;
                                    done();
                                });
                        }
                        done();
                    });
            });
            after(function(){

            });
            it('then ensure that one service is added in room manager',function(done){
                servicesLib
                    .getServices(token)
                    .end(function(err, res){
                        var service = res.body;
                        expect(service.length).to.equal(1);
                        done();
                    });
            });
            it('and ensure that returned all rooms in the data base', function(done){
                mongoserv
                    .getcollection('rooms' ,function(){
                        var roomsbd = arguments[0];
                    });
                rooms
                    .getRooms()
                    .end(function(err,res){
                        var roomAPI = res.body;
                        for(var i ; i <roomAPI.length ; i++)
                        {
                            expect(roomAPI[i]._id).to.equal(roombd[i]._id.toString());
                        }
                        done();
                    });
            });
          })
        })
    });
});


