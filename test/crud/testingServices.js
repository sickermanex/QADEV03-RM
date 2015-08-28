/**
 * Created by Pedrofuentes on 8/25/2015.
 */
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
var services = require('../../lib/servicesLib');

describe('Room Manager trying services:', function(){
    this.timeout(5000);
    this.slow(4000);

    var token = '';

    before('Setting the token', function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });

    it('Getting Service', function(done){
        services
            .getServicesById(token, '55d7580910832ed0071fe6ca')
            .end(function(err, res){
                console.log('The body:', res.body);
                done();
            });
    });
});
