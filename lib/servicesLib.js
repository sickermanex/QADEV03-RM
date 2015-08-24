/**
 * Created by luiscachi on 8/23/2015.
 */

var request = require('superagent');
(require('superagent-proxy'))(request);

/*
 The function getToken can be used to get the servicsId.
 */
 exports.getServicesId = function(token){
    return request
        .get('http://172.20.208.142:4040/services')
        .set('Authorization',token)
};