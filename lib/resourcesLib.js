//Resources library
var request = require('superagent');

var endpoints = require('..\\config\\endPoint.json');
var auth = require('..\\config\\resourcesConfig.json');

/*Get a token*/
var getToken = function(login){
return request
		.post(endpoints.endpoint.replace('[ep]', 'login'))
		.send(login);
};

exports.getToken = getToken;

/*Get all the resources*/
var getResources = function(){
return request
		.get(endpoints.endpoint.replace('[ep]', 'resources'))
		.set('Authorization', 'jwt '+getToken(auth));
};

exports.getResources = getResources;

/*Get a resource*/
var getResource = function(resourceId){
return request
		.get(endpoints.endpointById.replace('[ep]', 'resources').replace('[id]', resourceId));
};

exports.getResource = getResource;

/*Update a resource*/
var updateResource = function(resourceId, resource, token){
return request
		.put(endpoints.endpointById.replace('[ep]', 'resources').replace('[id]', resourceId))
		.set('Authorization', 'jwt ' + token)
		.send(resource);
};

exports.updateResource = updateResource;

/*Create a resource*/
var createResource = function(resource, token){			
			return request
			.post(endpoints.endpoint.replace('[ep]', 'resources'))
			.set('Authorization', 'jwt ' + token)
			.send(resource);
};

exports.createResource = createResource;

/*Delete a resource*/
var deleteResource = function(resourceId, token){
return request
		.del(endpoints.endpointById.replace('[ep]', 'resources').replace('[id]', resourceId))
		.set('Authorization', 'jwt ' + token);
		// .send(resource);
};

exports.deleteResource = deleteResource;