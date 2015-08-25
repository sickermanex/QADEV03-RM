/**
<<<<<<< HEAD
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




=======
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
>>>>>>> 986ea7d56a4c21a699821a3d05cf653b3537e1c3
