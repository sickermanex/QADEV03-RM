/**
 * Created by Aleida on 21/08/2015.
 */
var request = require('superagent');
var points = require('..\\endPoints\\outOfOrderEndPoint.json');
var setting = require('..\\settings.json');
var outOfOrders = points.outOfOrders.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var outoforderByID = points.outoforderById.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var outoforderByIDs = points.outoforderByIds.replace("[server]", setting.server)
    .replace("[port]", setting.port);
var jsonContent = require('..\\requestJSONs\\outOfOrderRequest.json');

/*Get all the out of orders
 * @param ()
 * @returns {Function}
 */
var getOutOfOrders = function(){
    return request
        .get(outOfOrders);
};
exports.getOutOfOrders = getOutOfOrders;

/*GET a out of order from a room from a service
 * @param {String,String} servId,roomId
 * @returns {Function}
 */

var getOutOfOrderbyRoom = function(servId,roomId){
    return request
        .get(outoforderByID.replace('[serviceId]',servId).replace('[roomId]', roomId));
};
exports.getOutOfOrderbyRoom = getOutOfOrderbyRoom;

/*POST- CREATE a out of order from a room from a service
 * @param {String,String,object,String} servId,roomId,oooCont,token
 * @returns {Function}
 */
var createOutOfOrder = function (servId,roomId,oooCont,token) {
    return request
        .post(outoforderByID.replace('[serviceId]',servId).replace('[roomId]', roomId))
        .set('Authorization',token)
        .send(oooCont);
};
exports.createOutOfOrder = createOutOfOrder;

/*GET a out of order by ID from a room from a service
 * @param {String,String,object,String} servId,roomId,String
 * @returns {Function}
 */
var getOutOfOrderById = function (servId,roomId,oooId) {
    return request
        .get(outoforderByIDs.replace('[serviceId]',servId).replace('[roomId]', roomId).replace('[outoforderId]',oooId));
};

exports.getOutOfOrderById = getOutOfOrderById;
/*UPDATE a out of order from a room from a service
 * @param {String,String,object,String} servId,roomId,editCont,token
 * @returns {Function}
 */
var updateOutOfOrder = function (servId,roomId,editCont,token,oooId) {
    return request
        .put(outoforderByIDs.replace('[serviceId]',servId).replace('[roomId]', roomId).replace('[outoforderId]',oooId))
        .set('Content-Type', 'application/json')
        .set('Authorization',token)
        .send(editCont);
};
exports.updateOutOfOrder = updateOutOfOrder;

/*DELETE a out of order from a room from a service
 * @param {String,String,String,String} servId,roomId,token,oooId
 * @returns {Function}
 */
var deleteOutOfOrder = function (servId,roomId,token,oooId) {
    return request
        .del(outoforderByIDs.replace('[serviceId]',servId).replace('[roomId]', roomId).replace('[outoforderId]',oooId))
        .set('Authorization',token);
};
exports.deleteOutOfOrder = deleteOutOfOrder;

/*Get Content JSON to a"out-of-order"
 * @param {String} roomId
 * @returns JSON
 */

/*Variables to Current date*/
var date = new Date();
var from = date.getFullYear()+'-'+(date.getMonth()+1)+
    '-'+date.getDate()+'T'+(date.getHours()+1)+':00:00.000Z';
var to = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+
    date.getDate()+'T'+(date.getHours()+2)+':00:00.000Z';

var getContentCreate = function(roomId){
    var createContent;
    var date = new Date();

    createContent = jsonContent.newOutOfOrder;
    createContent.from = createContent.from.replace('[date]',from);
    createContent.to = createContent.to.replace('[date]',to);
    createContent.roomId = createContent.roomId.replace('[roomId]',roomId);
    return createContent;

};
exports.getContentCreate = getContentCreate;
/*Get Content JSON to modify a"out-of-order"
 * @param {}
 * @returns JSON
 */
var getCont = function(){
    var updateContent;

    updateContent = jsonContent.updateOutOfOrder;
    updateContent.from = updateContent.from.replace('[date]',from);
    updateContent.to = updateContent.to.replace('[date]',to);
    return updateContent;
};
exports.getCont = getCont;
