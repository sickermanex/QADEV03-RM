/**
 * Created by Pedrofuentes on 8/19/2015.
 *
 * Smoke tests for the Impersonation Feature on Room Manager.
 */

var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var impersonationLib = require('./../lib/impersonationLib');
var config = require('./../config/impersonationConfig.json');

describe('Room Manager Smoke Test:', function(){

    it('User Impersonation is checked', function(done){
        impersonationLib
            .setImpersonation(config.setImpersonationToTrue)
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);

                impersonationLib
                    .setAuthentication(config.setAuthentication)
                    .end(function(err, res){
                        expect(err).to.be.not.OK;
                        expect(res.status).to.be.below(500);
                        done();
                    });
            });
    });

    it('User Impersonation is un checked', function(done){
        impersonationLib
            .setImpersonation(config.setImpersonationToFalse)
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);

                impersonationLib
                    .setAuthentication(config.setAuthentication)
                    .end(function(err, res){
                        expect(err).to.be.not.OK;
                        expect(res.status).to.be.below(500);
                        done();
                    });
            });
    });

    it('Create a meeting event using impersonation', function(done){
        impersonationLib
            .setImpersonation(config.setImpersonationToTrue)
            .end(function(err, res){

                impersonationLib
                    .setAuthentication(config.setAuthentication)
                    .end(function(err, res){

                        impersonationLib
                            .createMeetingEvent(config.createMeetingEvent)
                            .end(function(err, res){
                                expect(err).to.be.not.OK;
                                expect(res.status).to.be.below(500);
                                done();
                            });
                    });
            });
    });

    it('Create a meeting event without using impersonation', function(done){
        impersonationLib
            .setImpersonation(config.setImpersonationToFalse)
            .end(function(err, res){

                impersonationLib
                    .setAuthentication(config.setAuthentication)
                    .end(function(err, res){

                        impersonationLib
                            .createMeetingEvent(config.createMeetingEvent)
                            .end(function(err, res){
                                expect(err).to.be.not.OK;
                                expect(res.status).to.be.below(500);
                                done();
                            });
                    });
            });
    });
});
