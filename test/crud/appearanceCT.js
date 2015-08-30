/**
 * Created by Pedrofuentes on 8/28/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var appearanceLib = require('../../lib/appearanceLib');
var appearanceRequest = require('../../requestJSONs/appearanceRequest.json');
var settings = require('../../settings.json');
var tokenLib = require('../../lib/tokenLib');

describe('Room Manager Tablet appearance Acceptance Tests:', function(){
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
     This test case is to verify that the API can get the appearance tablet configuration panel.
     */
    it('Get appearance panel', function(done){
        var expectedResponse = {
            "authentication":"credentials",
            "daysWarningExpirationDateAccount":5
        };
        var actualResponse = '';

        appearanceLib
            .getAppearancePanel(token)
            .end(function(err, res){
                actualResponse = res.body;

                expect(err).to.be.not.OK;
                expect(res.status).to.equal(200);
                expect(expectedResponse.authentication).to.equal(actualResponse.authentication);
                expect(expectedResponse.daysWarningExpirationDateAccount).to.equal(actualResponse.daysWarningExpirationDateAccount);

                done();
            });
    });

    /*
     This test case is to verify that the API can set the tablet's appearance color.
     */
    it('Set appearance color', function(done){
        var appearanceColor = {
            "tabletColorPalette":"green"
        };
        var expectedColor = "green";
        var actualColor = '';

        appearanceLib
            .setColorAppearance(token, appearanceColor)
            .end(function(err, res){
                actualColor = res.body.tabletColorPalette;

                expect(err).to.be.not.OK;
                expect(res.status).to.equal(200);
                expect(actualColor).to.equal(expectedColor);

                done();
            });
    });
});
