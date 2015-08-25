/**
 * Created by luiscachi on 8/23/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);

//json files needed
var endpoints = require('..\\endpoints\\loginEndPoints');
var settings = require('..\\settings.json');

//replace the end point
var login = endpoints.login.replace("[server]", settings.server)
    .replace("[port]", settings.port);

/*
 The function getToken can be used to get a token inside the test suits of the project.
 */
var getToken = function(userAut){
    return request
        .post(login)
        .send(userAut);

};
exports.getToken = getToken;
