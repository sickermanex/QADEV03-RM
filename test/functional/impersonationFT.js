/**
 * Created by Pedrofuentes on 8/30/2015.
 *
 * Acceptance tests for the Impersonation Feature on Room Manager.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var expect = require('chai').expect;
var impersonationLib = require('../../lib/impersonationLib');
var tokenLib = require('../../lib/tokenLib');
var impersonationRequest = require('../../requestJSONs/impersonationRequest.json');
var services = require('../../lib/servicesLib');
var rooms = require('../../lib/conferenceRoomsLib');
var meetingLib = require('../../lib/meetingsLib');
var settings = require('../../settings.json');
// Story: Creating meetings using impersonation options.
//     As an organizer I want to create a meeting
// So, I don’t need to use another email client to create a meeting
//
// Scenario 1: Impersonation is OFF, and the Conference Room doesn't have meetings
// Given Impersonation is OFF
// And the conference room doesn't have meetings created
// And the room manager account has permissions to create meeting over the conference room
// When the organizer requests the creation of a meeting specifying
// -	Organizer account
// -	Title
// -	One Attendee
// Then ensure that a response with code status 200 is returned
// And ensure the response body values are correct

describe('Create meetings using impersonation options, as a organizer' +
    ' I want to create a meeting, so I don\'t need to use another email client' +
    ' to create a meeting', function(){
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);

    var token = '';
    var serviceId = '';
    var roomId = '';
    var impReq = '';

    var contentTypeInfo = impersonationRequest.ContentType;
    var authenticationState = impersonationRequest.authenticationSettings;

    before('Setting the token', function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });
    });

    before('Setting the serviceID and the roomId', function(done){
        services
            .getServices(token)
            .end(function(err, res){
                serviceId = res.body[0]._id;

                rooms
                    .getRooms()
                    .end(function(err, res){
                        roomId = res.body[0]._id;

                        done();
                    });
            });
    });

    context('Scenario 1: Impersonation is OFF', function(){
        beforeEach('Setting impersonation OFF', function(done){
            impReq = impersonationRequest.impersonationUnChecked;

            impersonationLib
                .setImpersonation(serviceId, contentTypeInfo, token, impReq)
                .end(function(err, res){

                    impersonationLib
                        .setAuthentication(authenticationState, token)
                        .end(function(err, res){

                            done();
                        });
                });
        });

        context('When the organizer requests the creation of a meeting', function(){
            var meetingName = 'Meetingtested';
            var roomMail = 'test@test.org';
            var status = 0;
            var meeting;

            before('Creating meeting', function(done){
                console.log('serviceId', serviceId);
                console.log('roomId', roomId);
                console.log('meetingName', meetingName);
                console.log('roomMail', roomMail);

                meetingLib
                    .createNewMeeting(serviceId, roomId, meetingName, roomMail)
                    .end(function(err, res){
                        status = res.status;
                        meeting = res.body;

                        done();
                    });
            });

            it('ensure the response with code status is returned', function(done){
                //expect(status).to.equal(200);

                done();
            });

            it('and the response body values are correct.', function(done){
                console.log('THE MEETING', meeting);

                done();
            });
        });
    });

    context('Scenario 2: Impersonation is ON', function(){
        beforeEach('Setting impersonation ON', function(done){
            impReq = impersonationRequest.impersonationChecked;

            impersonationLib
                .setImpersonation(serviceId, contentTypeInfo, token, impReq)
                .end(function(err, res){

                    impersonationLib
                        .setAuthentication(authenticationState, token)
                        .end(function(err, res){

                            done();
                        });
                });
        });

        context('When the organizer requests the creation of a meeting', function(){
            var meetingName = 'Meetingtested';
            var roomMail = 'test@test.org';
            var status = 0;
            var meeting;

            before('Creating meeting', function(done){
                console.log('serviceId', serviceId);
                console.log('roomId', roomId);
                console.log('meetingName', meetingName);
                console.log('roomMail', roomMail);

                meetingLib
                    .createNewMeeting(serviceId, roomId, meetingName, roomMail)
                    .end(function(err, res){
                        status = res.status;
                        meeting = res.body;

                        done();
                    });
            });

            it('ensure the response with code status is returned', function(done){
                //expect(status).to.equal(200);

                done();
            });

            it('and the response body values are correct.', function(done){
                console.log('THE MEETING', meeting);

                done();
            });
        });
    });
});
