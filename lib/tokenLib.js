/**
 * Created by Pedro David on 23/08/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var settings = require('../settings.json');
var loginEndPoints = require('../endpoints/loginEndPoints.json');

/*
The function getToken can be used to get a token inside the test suits of the project.
In order to use this token, a callback must be used to assign the return value to a global variable.

Usage Example:
 ------------------------------------------------
 var token;
 before('Setting the token', function(done){
    tokenLib
    .getToken(done, function(){
        token = arguments[0];
    });
 });
 ------------------------------------------------
 */
var getToken = function(done, callback){
    var login;

    if(settings.authenticationLDAP == 'local'){
        login = {
            "username": settings.roomManagerAccount,
            "password": settings.roomManagerPassword,
            "authentication": settings.authenticationLDAP
        };
    }else{
        login = {
            "username": settings.domain + "\\" + settings.roomManagerAccount,
            "password": settings.roomManagerPassword,
            "authentication": settings.authenticationLDAP
        };
    }

    var endpoint = loginEndPoints.login.replace('[server]', settings.server)
        .replace('[port]', settings.port);

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



