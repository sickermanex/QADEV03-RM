/**
 * Created by Aleida on 21/08/2015.
 */
var request = require('superagent');
var points = require('..\\config\\outOfOrderEndPoint.json');
var config = require('..\\config\\outOfOrderConfig.json');
var setting = require('..\\setting.json');
var login = points.login.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var room = points.room.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var outoforder = points.outoforders.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var outoforderByID = points.outofordersById.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var outoforderByIDs = points.outofordersByIds.replace("[server]", setting.server)
    .replace("[port]", setting.port);
/*Get a token*/
var getToken = function(login){
    return request
        .post(login)
        .send(login);
};
exports.getToken = getToken;

/*Get rooms*/
var getRoomId = function(){
    return request
        .get(room);
};
exports.getRoomId = getRoomId;

/*Get all the out of orders
*/
var getOutOfOrders = function(){
    return request
        .get(outoforder);
};
exports.getOutOfOrders = getOutOfOrders;

/*Get a out of order by service by room
*/
var getOutOfOrderbyRoom = function(servId,roomId){
    return request
        .get(outoforderByID.replace('[serviceId]',servId).replace('[roomId]', roomId));
};
exports.getOutOfOrderbyRoom = getOutOfOrderbyRoom;

/*Create a out of order
 */
var createOutOfOrder = function (servId,roomId,oooCont,token) {
    return request
        .post(outoforderByID.replace('[serviceId]',servId).replace('[roomId]', roomId))
        .set('Authorization', 'jwt ' +token)
        .send(oooCont);
};
exports.createOutOfOrder = createOutOfOrder;

/*Get a out of order
 */
var getOutOfOrderById = function (servId,roomId,oooId) {
    return request
        .get(outoforderByIDs.replace('[serviceId]',servId).replace('[roomId]', roomId).replace('[outoforderId]',oooId));
};

exports.getOutOfOrderById = getOutOfOrderById;
/*Update a out of order
*/
var updateOutOfOrder = function (servId,roomId,editCont,token,oooId) {
    return request
        .put(outoforderByIDs.replace('[serviceId]',servId).replace('[roomId]', roomId).replace('[outoforderId]',oooId))
        .set('Authorization', 'jwt ' + token)
        .send(editCont);
};

exports.updateOutOfOrder = updateOutOfOrder;

/*Delete a out of order
*/
var deleteOutOfOrder = function (servId,roomId,token,oooId) {
    return request
        .put(outoforderByIDs.replace('[serviceId]',servId).replace('[roomId]', roomId).replace('[outoforderId]',oooId))
        .set('Authorization', 'jwt ' + token);
};

exports.deleteOutOfOrder = deleteOutOfOrder;
