var request = require('superagent');
require('superagent-proxy')(request);

var endpoints = require('..\\endpoints\\meetingsEndPoints.json');
var config = require('..\\config\\meetingsConfig.json');
var settings = require('../settings.json');

var token;
var services;

var getToken = function(){
	var jsonData = config.authLDAP;
	jsonData.username = jsonData.username.replace('[user]','atxrm\\elver');
	jsonData.password = jsonData.password.replace('[pass]','Control123');	
	token = endpoints.getToken.replace(['[ipNport]'],'172.20.208.105:4040');
	return request
		.post(token)
		.send(jsonData)
};

exports.getToken = getToken;

var getServices = function(){
	services = end
	request
		.get()

	services = endpoints.getServices.replace(['[ipNport]'],settings.server+':'+settings.port);	
	return request
		.get(services)
		.set('Authorization',authToken)
};
exports.getServices = getServices;