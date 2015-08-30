/**
 * Created by Pedrofuentes on 8/19/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var impersonationEndPoint = require('../endpoints/impersonationEndPoint.json');
var settings = require('../settings.json');

/*
This method receives as argument a .json configuration that sets impersonation to true and return
the request object set with an impersonation endpoint.
 */
exports.setImpersonation = function(serviceId, contentTypeInfo, token, impReq){
    var endpoint = impersonationEndPoint.impersonationById.replace('[server]', settings.server)
        .replace('[port]', settings.port).replace('[id]', serviceId);

    return request
        .put(endpoint)
        .set('Content-Type', contentTypeInfo)
        .set('Authorization', token)
        .send(impReq);
};

/*
 This method receives as argument a .json configuration that sets impersonation credentials and
 return the request object set with the impersonation endpoint and the authenticationState that
 is a requirement for setting any impersonation update.
 */
exports.setAuthentication = function(authenticationState, token){
    var endpoint = impersonationEndPoint.impersonationSettings.replace('[server]', settings.server)
        .replace('[port]', settings.port);

    return request
        .put(endpoint)
        .set('Authorization', token)
        .send(authenticationState);
};

