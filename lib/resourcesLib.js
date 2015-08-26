/**
 * Resources library
 */
var request = require('superagent');

var endpoints = require('..\\endpoints\\servicesEndPoint.json');
var settings = require('..\\settings.json');
var loginEndpoint = endpoints.login.replace("<server>", settings.server)
	.replace("<port>", settings.port);
var resourcesEndpoint = endpoints.resources.replace("<server>", settings.server)
	.replace("<port>", settings.port);
var resourceIdEndpoint = endpoints.resourcesById.replace("<server>", settings.server)
	.replace("<port>", settings.port);

/**
 * Get a token
 * @param login
 * @returns {Function}
 */
var getToken = function(login){
return request
		.post(loginEndpoint)
		.send(login);
};

exports.getToken = getToken;

/**
 * Get all the resources
 * @
 */
var getResources = function(){
return request
		.get(resourcesEndpoint);
};

exports.getResources = getResources;

/**
 * Get a resource
 */
var getResource = function(resourceId){
return request
		.get(resourceIdEndpoint.replace("<resourceId>", resourceId));
};

exports.getResource = getResource;

/**
 * Update a resource
 */
var updateResource = function(resourceId, resource, token){
return request
		.put(resourceIdEndpoint.replace("<resourceId>", resourceId))
		.set('Authorization', 'jwt ' + token)
		.send(resource);
};

exports.updateResource = updateResource;

/**
 * Create a resource
 */
var createResource = function(resource, token){			
			return request
			.post(resourcesEndpoint)
			.set('Authorization', 'jwt ' + token)
			.send(resource);
};

exports.createResource = createResource;

/**
 * Delete a resource
 */
var deleteResource = function(resourceId, token){
return request
		.del(resourceIdEndpoint.replace("<resourceId>", resourceId))
		.set('Authorization', 'jwt ' + token);
};

exports.deleteResource = deleteResource;