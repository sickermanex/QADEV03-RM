/**
 * Created by Pedrofuentes on 8/24/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);


describe('Tests about impersonation over meetings', function(){
    this.timeout(5000);
    this.slow(4000);

    var token = '';

    /*
     This test case is to verify the status code is different than 5xx when a meeting event is
     scheduled without using impersonation.
     */
    it('Create a meeting event without using impersonation', function(done){
        impersonationLib
            .createMeetingEventWithoutImp(impersonationConfig.createEventMeetingWithoutImpersonation)
            .set('Authorization', token)
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);
                done();
            });
    });

    /*
     This test case is to verify the status code is different than 5xx when a meeting event is
     scheduled using impersonation.
     */
    it('Create a meeting event using impersonation', function(done){
        impersonationLib
            .createMeetingEventWithImp(impersonationConfig.createEventMeetingWithImpersonation)
            //.set('Authorization', token)
            .end(function(err, res){
                expect(err).to.be.not.OK;
                expect(res.status).to.be.below(500);
                done();
            });
    });
});
