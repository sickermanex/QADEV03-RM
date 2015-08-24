/**
 * Created by Pedrofuentes on 8/19/2015.
 *
 * Smoke tests for the Impersonation Feature on Room Manager.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var impersonationLib = require('../../lib/impersonationLib');
var impersonationConfig = require('../../config/impersonationConfig.json');
var tokenLib = require('../../lib/tokenLib');
var config = require('../../config/config.json');

describe('Room Manager Impersonation Smoke Tests:', function(){
    this.timeout(5000);
    this.slow(4000);

    var token = '';

    /*
    The before method creates a token that is stored in the "token" global variable, and it's used
    for the whole group of test cases in this test suit.
     */
    before(function(done){
        var login = config.userAdministratorPC102;

        tokenLib
            .getToken(login)
            .end(function(err, res){
                token = 'jwt ' + res.body.token;
                console.log('The token is:', token);
                done();
            });
    });

    describe('', function(){

        /*
        This afterEach restores the initial non-impersonation state on Room Manager.
         */
        afterEach(function(){
            impersonationLib
                .setImpersonation(impersonationConfig.setImpersonationToFalse)
                .set('Authorization', token)
                .end(function(err, res){

                    impersonationLib
                        .setAuthentication(impersonationConfig.setAuthentication)
                        .set('Authorization', token)
                        .end(function(err, res){
                            done();
                        });
                });
        });

        /*
         This test case is to verify the status code is different than 5xx when the �Use Impersonation�
         is checked.
         */
        it('User Impersonation is checked', function(done){
            impersonationLib
                .setImpersonation(impersonationConfig.setImpersonationToTrue)
                .set('Authorization', token)
                .end(function(err, res){
                    expect(err).to.be.not.OK;
                    expect(res.status).to.be.below(500);

                    impersonationLib
                        .setAuthentication(impersonationConfig.setAuthentication)
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
     This test case is to verify the status code is different than 5xx when the �Use Impersonation�
     is unchecked.
     */
    it('User Impersonation is unchecked', function(done){
        impersonationLib
            .setImpersonation(impersonationConfig.setImpersonationToFalse)
            .set('Authorization', token)
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);

                impersonationLib
                    .setAuthentication(impersonationConfig.setAuthentication)
                    .set('Authorization', token)
                    .end(function(err, res){
                        expect(err).to.be.not.OK;
                        expect(res.status).to.be.below(500);
                        done();
                    });
            });
    });
});
