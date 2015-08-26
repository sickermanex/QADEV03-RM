/**
 * Created by Aleida on 21/08/2015.
 */
var request = require('superagent');
var points = require('..\\endPoints\\outOfOrderEndPoint.json');
var setting = require('..\\settings.json');
var endPoint = points.endPoint.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var endPointById = points.endPointById.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var outoforderByID = points.outoforderById.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var outoforderByIDs = points.outoforderByIds.replace("[server]", setting.server)
    .replace("[port]", setting.port);
/*Get a token*/
//var getToken = function(login){
//    return request
//        .post(endPoint.replace('[ep]','login'))
//        .send(login);
//};
//exports.getToken = getToken;
/*Get rooms*/
var getRoomId = function(roomId){
    return request
        .get(endPointById.replace('[ep]','rooms').replace('[roomId]',roomId));
};
exports.getRoomId = getRoomId;

var getRooms = function(){
    return request
        .get(endPoint.replace('[ep]','rooms'));
};
exports.getRooms = getRooms;
/*Get all the out of orders
*/
var getOutOfOrders = function(){
    return request
        .get(endPoint.replace('[ep]','out-of-orders'));
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
        .set('Authorization',token)
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
        .set('Authorization',token)
        .send(editCont);
};

exports.updateOutOfOrder = updateOutOfOrder;

/*Delete a out of order
*/
var deleteOutOfOrder = function (servId,roomId,token,oooId) {
    return request
        .put(outoforderByIDs.replace('[serviceId]',servId).replace('[roomId]', roomId).replace('[outoforderId]',oooId))
        .set('Authorization',token);
};
exports.deleteOutOfOrder = deleteOutOfOrder;
