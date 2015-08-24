/**
 * Created by luiscachi on 8/23/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
//var tokenlib = require('./../lib/tokenlib');
var endpoint = require('./../../config/endPoint.json');
var services = require('./../../lib/services');

describe('Room Manager Smoke Test:', function(){

    it('review that the services Api exist when did a  get to the services', function(done){
        request
            .get(endpoint.services)
            //.proxy('http://172.20.240.5:8080')
            .set('Authorization', tokenlib.token())
            //.send(prj)
            .end(function (err, resp) {
                expect(resp.status).to.be.below(500);
                done()
            });
    });

    it('review the meeting Api exists when did request to meetings', function(){
        request
            .get(endpoint.services)// cambiar el end point to meetings
            //.proxy('http://172.20.240.5:8080')
            .set('Authorization', tokenlib.token())
            //.send(prj)
            .end(function (err, resp) {
                expect(resp.status).to.be.below(500);
                done()
            });
    });
    it.only('return the services Id ', function(){
        console.log('this is the services Id',services.getservicesId());
    });


    it('hello service',function(done){
        request
            .get('http://172.20.208.142:4040/services')
            //.proxy()
            .set('Authorization','jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkQXQiOiIyMDE1LTA4LTIzVDIzOjE0OjAwLjUxOFoiLCJ1c2VybmFtZSI6InJvb21wcm9cXHJvb20iLCJyZW1vdGVBZGRyZXNzIjoiOjpmZmZmOjE3Mi4yMC4yMDAuMTciLCJwcml2aWxlZ2UiOm51bGwsImlhdCI6MTQ0MDM3MTY0MCwiZXhwIjoxNDQwMzkzMjQwfQ.wovV1gdtVlgPHL7zK3k92YVpbcbrEXLfSKKPEnJp5dU')
            .end(function (err, resp) {
                var service = resp.body[0]._id;
                console.log('serviceid not valid',service);
                done();
            });
    });


});