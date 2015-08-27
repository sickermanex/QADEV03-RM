var request =  require('superagent');
require('superagent-proxy')(request);
var endPoint = require('..\\endpoints\\locationsEndPoint.json');
var config = require('..\\settings.json');
/*** Method to make a GET request to server to obtain all locations***/
var getAllLocations = function(){
    return request
        .get(endPoint.locations.replace('[server]',config.server).replace('[port]',config.port))
};
exports.getAllLocations = getAllLocations;

/*** Method to make a GET request to server to obtain a specific location,
   * it needs as parameter the id of the location***/
var getLocations = function(locationId){
    return request
        .get(endPoint.locationsId.replace('[id]',locationId).replace('[server]',config.server).replace('[port]',config.port))
};
exports.getLocations = getLocations;

/*** Method to make a POST request to server to create a new location,
   * it needs as parameters a valid token and the data of new location***/
var createLocations = function(location, token){
    return request
        .post(endPoint.locations.replace('[server]',config.server).replace('[port]',config.port))
        .set('Authorization',token)
        .send(location)
};
exports.createLocations = createLocations;

/*** Method to make a PUT request to server to update the data of a specific location,
   * it needs as parameters a valid token, the id of the location that will be updated
   * and the new data of location***/
var updateLocations = function(locationId, location, token){
    return request
        .put(endPoint.locationsId.replace('[id]',locationId).replace('[server]',config.server).replace('[port]',config.port))
        .set('Authorization',token)
        .send(location)
};
exports.updateLocations = updateLocations;

/*** Method to make a DELETE request to server to remove a specific location,
   * it needs as parameters a valid token, the id of the location that will be removed***/
var deleteLocations = function(locationId, token){
    return request
        .del(endPoint.locationsId.replace('[id]',locationId).replace('[server]',config.server).replace('[port]',config.port))
        .set('Authorization',token)
};
exports.deleteLocations = deleteLocations;


