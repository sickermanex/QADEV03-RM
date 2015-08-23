/**
 * Created by Pedro David on 23/08/2015.
 */

var request = require('superagent');
(require('superagent-proxy'))(request);
var endPoint = require('./../config/endPoint.json');

exports.getToken = function(login){
    return request
        .post(endPoint.endpoint.replace('[ep]', 'login'))
        .send(login);
};


