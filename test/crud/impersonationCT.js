/**
 * Created by Pedrofuentes on 8/23/2015.
 *
 * CRUD tests for the Impersonation Feature on Room Manager.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var impersonationLib = require('../../lib/impersonationLib');
var tokenLib = require('../../lib/tokenLib');
var settings = require('../../settings.json');
var impersonationRequest = require('../../requestJSONs/impersonationRequest.json');

describe('Room Manager Impersonation Smoke Tests:', function(){
    this.timeout(5000);
    this.slow(4000);

    var token = '';

    /*
     The before method creates a token that is stored in the "token" global variable, and it's used
     for the whole group of test cases in this test suit.
     */
    before(function(done){
        var login = {
            "username": settings.domain + "\\" + settings.roomManagerAccount,
            "password": settings.roomManagerPassword,
            "authentication": "ldap"
        };

        tokenLib
            .getToken(login)
            .end(function(err, res){
                token = 'jwt ' + res.body.token;
                done();
            });
    });

    describe('', function(){

        /*
         This afterEach restores the initial non-impersonation state on Room Manager.
         */
        afterEach(function(){
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
         is checked.
         */
        it('User Impersonation is checked', function(done){
            var impersonationState = impersonationRequest.impersonationChecked;
            var contentTypeInfo = impersonationRequest.ContentType;

            impersonationLib
                .setImpersonation(impersonationState)
                .set('Content-Type', contentTypeInfo)
                .set('Authorization', token)
                .end(function(err, res){
                    var impersonation = res.body;

                    expect(err).to.be.not.OK;
                    expect(res.status).to.equal(200);
                    expect(impersonation.credential).to.equal('55d7580910832ed0071fe6c9');
                    expect(impersonation.type).to.equal('exchange');
                    expect(impersonation.name).to.equal('Microsoft Exchange Server 2010 SP3');
                    expect(impersonation.version).to.equal('14.3.123');
                    expect(impersonation.serviceUrl).to.equal('https://qad03lpedfu002.rmdom2012.lab/EWS/Exchange.asmx');
                    expect(impersonation._id).to.equal('55d7580910832ed0071fe6ca');
                    expect(impersonation.__v).to.equal(0);
                    expect(impersonation.impersonate).to.be.true;
                    expect(impersonation.alternativeServiceUrls).to.be.empty;

                    var authenticationState = impersonationRequest.authenticationSettings;

                    impersonationLib
                        .setAuthentication(authenticationState)
                        .set('Authorization', token)
                        .end(function(err, res){
                            var authState = res.body;

                            expect(err).to.be.not.OK;
                            expect(res.status).to.equal(200);
                            expect(authState.authentication).to.equal('credentials')
                            done();
                        });
                });
        });


    });

    /*
     This test case is to verify the status code is different than 5xx when the “Use Impersonation”
     is unchecked.
     */
    it('User Impersonation is unchecked', function(done){
        var impersonationState = impersonationRequest.impersonationUnChecked;
        var contentTypeInfo = impersonationRequest.ContentType;

        impersonationLib
            .setImpersonation(impersonationState)
            .set('Content-Type', contentTypeInfo)
            .set('Authorization', token)
            .end(function(err, res){
                var impersonation = res.body;

                expect(err).to.be.not.OK;
                expect(res.status).to.equal(200);
                expect(impersonation.credential).to.equal('55d7580910832ed0071fe6c9');
                expect(impersonation.type).to.equal('exchange');
                expect(impersonation.name).to.equal('Microsoft Exchange Server 2010 SP3');
                expect(impersonation.version).to.equal('14.3.123');
                expect(impersonation.serviceUrl).to.equal('https://qad03lpedfu002.rmdom2012.lab/EWS/Exchange.asmx');
                expect(impersonation._id).to.equal('55d7580910832ed0071fe6ca');
                expect(impersonation.__v).to.equal(0);
                expect(impersonation.impersonate).to.be.false;
                expect(impersonation.alternativeServiceUrls).to.be.empty;

                var authenticationState = impersonationRequest.authenticationSettings;

                impersonationLib
                    .setAuthentication(authenticationState)
                    .set('Authorization', token)
                    .end(function(err, res){
                        var authState = res.body;

                        expect(err).to.be.not.OK;
                        expect(res.status).to.equal(200);
                        expect(authState.authentication).to.equal('credentials')
                        done();
                    });
            });
    });
});
