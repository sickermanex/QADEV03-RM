/**
 * require libs
 * */
var request = require('superagent');
(require('superagent-proxy'))(request);

/**
 * .jason requiere
 * */
var endpoints = require('..\\endpoints\\servicesEndPoint');
var settings = require('..\\settings');

/**
 * replace the json files
 * */
var services = endpoints.services.replace('[server]', settings.server)
    .replace("[port]", settings.port);
var servicesbyId = endpoints.servicesById.replace("[server]", settings.server)
    .replace("[port]", settings.port);
var servicesType = endpoints.servicesType.replace("[server]", settings.server)
    .replace("[port]", settings.port);
var servicesbyType = endpoints.servicesbyType.replace("[server]", settings.server)
    .replace("[port]", settings.port);

/**
 *  The function return servicsId.
 */
var getServicesId = function(token){
    return request
        .get(services)
        .set('Authorization',token)
};
exports.getServicesId = getServicesId;


/**
 * the function return the Services
 */
var getServices = function(token){
	
    return request
        .get(services)
        .set('Authorization',token)

};
exports.getServices = getServices;

/**
 * the function return the services by Id
 */
var getServicesById = function(token, servicesId){
    return request
        .get(servicesbyId.replace("[servicesId]" , servicesId))
        .set('Authorization',token)
};
exports.getServicesById = getServicesById;

/**
 * the function return the service-type
 * */
var getserviceType = function(){
    return request
        .get(servicesType)
};
exports.getserviceType = getserviceType;

/**
 *  the function return the serviceby type
 * */
var getservicebyType = function(servicetype,token){
    return request
        .get(servicesbyType.replace("[serviceType]",servicetype))
        .set('Authorization',token)
};
exports.getservicebyType = getservicebyType;

/**
 *  the function add a services this function use the same services by type
 * */

var postservices = function(token,servicetype,exchangelog){
  return request
      .post(servicesbyType.replace("[serviceType]",servicetype))
      .set('Content-Type','application/json')
      .set('Authorization',token)
      .send(exchangelog)

};
exports.postservices = postservices;


/**
 * the functions delete a specific service
 * */
var deleteservice = function(token, servicesId){
    return request
        .del(servicesbyId.replace("[servicesId]" , servicesId))
        .set('Authorization',token)
};
exports.deleteservice = deleteservice;