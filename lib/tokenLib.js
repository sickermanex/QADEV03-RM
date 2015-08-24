/**
 * Created by Pedro David on 23/08/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var endPoint = require('../config/endPoint.json');

/*
The function getToken can be used to get a token inside the test suits of the project.
 */
var getToken = function(login){
    var endpoint = endPoint.endpoint.replace('<server>', '172.20.208.102')
        .replace('<port>', '4040').replace('<ep>', 'login');

    return request
        .post(endpoint)
        .send(login);
};
exports.getToken = getToken;




