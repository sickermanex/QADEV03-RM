/**
 * Created by aleidasarzuri on 8/26/2015.
 */
var request = require('superagent');
var getContentCreate = function(roomId){
    var date = new Date();
    var from = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'T'+(date.getHours()+1)+':00:00.000Z';
    var to = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'T'+(date.getHours()+2)+':00:00.000Z';
     var oooCont ={
        "from": from,
        "roomId": roomId,
        "sendEmail": false,
        "title": "Temporarily Out of Order",
        "to": to
    };
    return oooCont;

};
exports.getContentCreate = getContentCreate;
var getCont = function(){
    var date = new Date();
    var from = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'T'+(date.getHours()+3)+':00:00.000Z';
    var to = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'T'+(date.getHours()+4)+':00:00.000Z';
    var cont ={
        "from":"",
        "to": "",
        "title": "Closed for reparations",
        "sendEmail": false
    };
    return cont;
};
exports.getCont = getCont;