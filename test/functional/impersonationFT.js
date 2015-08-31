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

describe('Create meetings using impersonation options, as a organizer' +
    ' I want to create a meeting, so I don\'t need to use another email client' +
    ' to create a meeting', function(){
    this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);

    var token = '';
    var serviceId = '';
    var room = '';
    var impReq;

    var contentTypeInfo = impersonationRequest.ContentType;
    var authenticationState = impersonationRequest.authenticationSettings;

    var roomId;
    var roomName = '';
    var roomMail = '';
    var status = 0;

    var impersonationState;
    var meeting;

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
                        room = res.body[0];
                        console.log('THE FIRST ROOM', room);
                        roomId = room._id;
                        roomName = room.displayName;
                        roomMail = room.emailAddress;
                        console.log('THE TOKEN', token);
                        done();
                    });
            });
    });

    context('Scenario 1: Impersonation is OFF', function(){

        before('Setting impersonation OFF', function(done){
            impReq = impersonationRequest.impersonationUnChecked;

            impersonationLib
                .setImpersonation(serviceId, contentTypeInfo, token, impReq)
                .end(function(err, res){
                    impersonationState = res.body;

                    impersonationLib
                        .setAuthentication(authenticationState, token)
                        .end(function(err, res){

                            done();
                        });
                });
        });

        context('When the organizer requests the creation of a meeting', function(){

            before('Creating meeting', function(done){
                meetingLib
                    .createNewMeeting(serviceId, roomId, roomName, roomMail)
                    .end(function(err, res){
                        status = res.status;
                        meeting = res.body;

                        done();
                    });
            });

            after('Deleting meeting', function(done){
                meetingLib
                    .deleteMeeting(serviceId, roomId, meeting._id)
                    .end(function(err, res){

                        done();
                    });
            });

            it('ensure the response with code status is returned', function(done){
                expect(status).to.equal(200);

                done();
            });

            it('and the response body values are correct.', function(done){
                expect(impersonationState._id).to.equal(meeting.serviceId);
                expect(roomId).to.equal(meeting.roomId);
                expect(roomName).to.equal(meeting.location);
                expect(roomMail).to.equal(meeting.roomEmail);

                done();
            });
        });
    });

    context('Scenario 2: Impersonation is ON', function(){

        before('Setting impersonation ON', function(done){
            impReq = impersonationRequest.impersonationChecked;

            impersonationLib
                .setImpersonation(serviceId, contentTypeInfo, token, impReq)
                .end(function(err, res){
                    console.log('The Impersonation object', res.body);

                    impersonationLib
                        .setAuthentication(authenticationState, token)
                        .end(function(err, res){

                            done();
                        });
                });
        });

        context('When the organizer requests the creation of a meeting', function(){

            before('Creating meeting', function(done){
                meetingLib
                    .createNewMeeting(serviceId, roomId, roomName, roomMail)
                    .end(function(err, res){
                        status = res.status;
                        meeting = res.body;
                        console.log('THE MEETING', meeting);

                        done();
                    });
            });

            after('Deleting meeting', function(done){
                meetingLib
                    .deleteMeeting(serviceId, roomId, meeting._id)
                    .end(function(err, res){

                        done();
                    });
            });

            it('ensure the response with code status is returned', function(done){
                expect(status).to.equal(200);

                done();
            });

            it('and the response body values are correct.', function(done){
                expect(impersonationState._id).to.equal(meeting.serviceId);
                expect(roomId).to.equal(meeting.roomId);
                expect(roomName).to.equal(meeting.location);
                expect(roomMail).to.equal(meeting.roomEmail);

                done();
            });
        });
    });
});

