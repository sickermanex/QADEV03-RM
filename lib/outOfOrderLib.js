/**
 * Created by Aleida on 21/08/2015.
 */
var request = require('superagent');
var points = require('..\\config\\outOfOrderEndPoint.json');
var config = require('..\\config\\outOfOrderConfig.json');

/*Get a token*/
var getToken = function(login){
    return request
        .post(points.endpoint.replace('[point1]', 'login'))
        .send(login);
};

exports.getToken = getToken;

/*Get all the out of orders
*/
var getOutOfOrders = function(){
    return request
        .get(points.endpoint.replace('[point1]', 'out-of-orders'));
};

exports.getOutOfOrders = getOutOfOrders;

/*Get a out of order
*/
var getOutOfOrderbyRoom = function(roomId){
    return request
        .get(points.endpointById.replace('[point1]', 'rooms').replace('[id]', roomId).replace('[point2]', 'out-of-orders'));
};

exports.getOutOfOrderbyRoom = getOutOfOrderbyRoom;

/*Update a out of order
*/
var updateOutOfOrder = function (roomId, oooId, token, oooCont) {
    return request
        .put(points.endpointByIds.replace('[point1]', 'rooms').replace('[id]', roomId).replace('[point2]', 'out-of-orders').replace('[id2]', oooId))
        .set('Authorization', 'jwt ' + token)
        .send(oooCont);
};

exports.updateOutOfOrder = updateOutOfOrder;

/*Create a out of order
*/
var createOutOfOrder = function (roomId,oooCont, token) {
    return request
        .post(points.endpointById.replace('[point1]', 'rooms').replace('[id]', 'roomId').replace('[point2]', 'out-of-orders'))
        .set('Authorization', 'jwt ' + token)
        .send(oooCont);
};

exports.createOutOfOrder = createOutOfOrder;

/*Delete a out of order
*/
var deleteOutOfOrder = function (roomId, oooId,oooCont, token ) {
    return request
        .del(points.endpointByIds.replace('[point1]', 'rooms').replace('[id]', roomId).replace('[point2]', 'out-of-orders').replace('[id2]', oooId))
        .set('Authorization', 'jwt ' + token);
};

exports.deleteOutOfOrder = deleteOutOfOrder;
