/**
 * Created by Pedrofuentes on 8/19/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var impersonationEndPoint = require('../endpoints/impersonationEndPoint.json');

/*
This method receives as argument a .json configuration that sets impersonation to true.
 */
exports.setImpersonation = function(impersonationState){
    var endpoint = impersonationEndPoint.impersonationById.replace('<server>', '172.20.208.102')
        .replace('<port>', '4040').replace('<id>', '55d7580910832ed0071fe6ca');

    return request
        .put(endpoint)
        .send(impersonationState);
};

/*
 This method receives as argument a .json configuration that sets impersonation credentials.
 */
exports.setAuthentication = function(authenticationState){
    var endpoint = impersonationEndPoint.impersonationSettings.replace('<server>', '172.20.208.102')
        .replace('<port>', '4040');

    return request
        .put(endpoint)
        .send(authenticationState);
};

