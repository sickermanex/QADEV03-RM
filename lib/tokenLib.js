/**
 * Created by luiscachi on 8/23/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
//var endPoint = require('./../config/endPoint.json');

/*
 The function getToken can be used to get a token inside the test suits of the project.
 */
var getToken = function(login){
    return request
        .post('http://172.20.208.142:4040//login')
        .send(login);

};
exports.getToken = getToken;
