/**
 * Created by Pedrofuentes on 8/19/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var impersonationConfig = require('./../config/impersonationConfig.json');
var impersonationEndPoint = require('./../config/impersonationEndPoint.json');
var tokenLib = require('./tokenLib');

/*
This method receives as argument a .json configuration that sets impersonation to true.
 */
exports.setImpersonation = function(impersonationState){
    return request
        .put(impersonationEndPoint.putImpersonation)
        .send(impersonationState);
};

/*
 This method receives as argument a .json configuration that sets impersonation credentials.
 */
exports.setAuthentication = function(authenticationState){
    return request
        .put(impersonationEndPoint.putSettings)
        .send(authenticationState);
};

exports.createMeetingEventWithImp = function(meetingEvent){
    return request
        .post(impersonationEndPoint.eventMeetingWithImpersonation)
        .send(meetingEvent);
};

exports.createMeetingEventWithoutImp = function(meetingEvent){
    return request
        .post(impersonationEndPoint.eventMeetingWithoutImpersonation)
        .send(meetingEvent);
};
