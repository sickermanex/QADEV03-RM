/**
 * Created by Pedrofuentes on 8/19/2015.
 */

var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;

var endPoint = require('./../config/impersonationEndPoint.json');
//var config = require('./../config/impersonationConfig.json');

exports.setImpersonation = function(impersonationState){
    return request
        .put(endPoint.putImpersonation)
        //.proxy()
        .auth(/* An authentication token should be set here */)
        .send(impersonationState);
};

exports.setAuthentication = function(authenticationState){
    return request
        .put(endPoint.putSettings)
        //.proxy()
        .auth(/* An authentication token should be set here */)
        .send(authenticationState);
};

exports.createMeetingEvent = function(meetingEvent){
    return request
        .post(endPoint.putEventMeeting)
        //.proxy()
        .auth(/* An authentication token should be set here */)
        .send(meetingEvent);
};
