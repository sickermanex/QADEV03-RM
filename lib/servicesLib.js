/**
 * Created by luiscachi on 8/23/2015.
 */

var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;

//var endPoint = require('./../config/impersonationEndPoint.json');
//var config = require('./../config/impersonationConfig.json');
var reterned
exports.getservicesId = function(done){
     request
        .get('http://172.20.208.142:4040/services')
        //.proxy()
        .set('Authorization','jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkQXQiOiIyMDE1LTA4LTIzVDIzOjE0OjAwLjUxOFoiLCJ1c2VybmFtZSI6InJvb21wcm9cXHJvb20iLCJyZW1vdGVBZGRyZXNzIjoiOjpmZmZmOjE3Mi4yMC4yMDAuMTciLCJwcml2aWxlZ2UiOm51bGwsImlhdCI6MTQ0MDM3MTY0MCwiZXhwIjoxNDQwMzkzMjQwfQ.wovV1gdtVlgPHL7zK3k92YVpbcbrEXLfSKKPEnJp5dU')
        .end(function (err, resp) {
             var service = resp.body[0]._id;
             if(!service){
                 console.log('serviceid not valid number 1',service);
             }
             return service;
             done();
         });
    //return serviceid;
};
//exports.idserv = getservicesId;
