/**
 * Created by Pedrofuentes on 8/25/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var appearanceLib = require('../../lib/appearanceLib');
var appearanceRequest = require('../../requestJSONs/appearanceRequest.json');
var settings = require('../../settings.json');
var tokenLib = require('../../lib/tokenLib');

describe('Room Manager Tablet appearance Smoke Tests:', function(){
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

    /*
     This test case is to verify that the appearance panel API is present in the Room Manager API.
     For this the status response has to be lower than 500.
     */
    it('Get appearance panel', function(done){
        appearanceLib
            .getAppearancePanel()
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);
                done();
            });
    });

    /*
     This test case is to verify that the appearance color set API is present in the Room Manager API.
     For this the status response has to be lower than 500.
     */
    it('Set appearance color', function(done){
        var appearanceColor = appearanceRequest.appearanceBlue;

        appearanceLib
            .setColorAppearance(appearanceColor)
            .send(token)
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);
                done();
            });
    });
});
