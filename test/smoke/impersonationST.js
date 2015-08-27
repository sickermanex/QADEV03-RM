/**
 * Created by Pedrofuentes on 8/19/2015.
 *
 * Smoke tests for the Impersonation Feature on Room Manager.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var impersonationLib = require('../../lib/impersonationLib');
var tokenLib = require('../../lib/tokenLib');
var impersonationRequest = require('../../requestJSONs/impersonationRequest.json');
var settings = require('../../settings.json');

/*
This test suit is used for smoke tests on the Room Manager Impersonation feature.
 */
describe('Room Manager Impersonation Smoke Tests:', function(){
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);

    var token = '';

    /*
    The before method creates a token that is stored in the "token" global variable, and it's used
    for the whole group of test cases in this test suit.
     */
    before('Setting the token', function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });

    describe('', function(){

        /*
        This afterEach restores the initial non-impersonation state on Room Manager.
         */
        afterEach(function(done){
            var impersonationState = impersonationRequest.impersonationUnChecked;
            var contentTypeInfo = impersonationRequest.ContentType;

            impersonationLib
                .setImpersonation(impersonationState)
                .set('Content-Type', contentTypeInfo)
                .set('Authorization', token)
                .end(function(err, res){

                    var authenticationState = impersonationRequest.authenticationSettings;

                    impersonationLib
                        .setAuthentication(authenticationState)
                        .set('Authorization', token)
                        .end(function(err, res){
                            done();
                        });
                });
        });

        /*
         This test case is to verify the status code is different than 5xx when the “Use Impersonation”
         is checked (API presence).
         */
        it('User Impersonation is checked', function(done){
            var impersonationState = impersonationRequest.impersonationChecked;
            var contentTypeInfo = impersonationRequest.ContentType;

            impersonationLib
                .setImpersonation(impersonationState)
                .set('Content-Type', contentTypeInfo)
                .set('Authorization', token)
                .end(function(err, res){
                    expect(err).to.be.not.OK;
                    expect(res.status).to.be.below(500);

                    var authenticationState = impersonationRequest.authenticationSettings;

                    impersonationLib
                        .setAuthentication(authenticationState)
                        .set('Authorization', token)
                        .end(function(err, res){
                            expect(err).to.be.not.OK;
                            expect(res.status).to.be.below(500);
                            done();
                        });
                });
        });


    });

    /*
     This test case is to verify the status code is different than 5xx when the “Use Impersonation”
     is unchecked (API presence).
     */
    it('User Impersonation is unchecked', function(done){
        var impersonationState = impersonationRequest.impersonationUnChecked;
        var contentTypeInfo = impersonationRequest.ContentType;

        impersonationLib
            .setImpersonation(impersonationState)
            .set('Content-Type', contentTypeInfo)
            .set('Authorization', token)
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);

                var authenticationState = impersonationRequest.authenticationSettings;

                impersonationLib
                    .setAuthentication(authenticationState)
                    .set('Authorization', token)
                    .end(function(err, res){
                        expect(err).to.be.not.OK;
                        expect(res.status).to.be.below(500);
                        done();
                    });
            });
    });
});
