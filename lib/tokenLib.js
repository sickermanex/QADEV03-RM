/**
 * Created by Pedro David on 23/08/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var endPoint = require("../config/endPoint.json");
var settings = require("../settings.json");

/*
The function getToken can be used to get a token inside the test suits of the project.
In order to use this token, a callback must be used to assign the return value to a global variable.

Usage Example:
 ------------------------------------------------

 ------------------------------------------------
 */
var getToken = function(done, callback){
    var login = {
        "username": settings.domain + "\\" + settings.roomManagerAccount,
        "password": settings.roomManagerPassword,
        "authentication": settings.authenticationLDAP
    };

    var endpoint = endPoint.endpoint.replace("[server]", settings.server)
        .replace("[port]", settings.port).replace("[ep]", settings.login);

    request
        .post(endpoint)
        .send(login)
        .end(function(err, res){
            var token = 'jwt ' + res.body.token;

            callback(token);

            done();
        });
};
exports.getToken = getToken;



