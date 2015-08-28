/**
 * Created by Pedrofuentes on 8/25/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var appearanceEndPoint = require('../endpoints/appearanceEndPoint.json');
var settings = require('../settings.json');

var getAppearancePanel = function(){
    var endpoint = appearanceEndPoint.appearanceSetting.replace('<server>', settings.server)
        .replace('<port>', settings.port);

    return request
        .get(endpoint);
};
exports.getAppearancePanel = getAppearancePanel;

var setColorAppearance = function(appearanceColor){
    var endpoint = appearanceEndPoint.appearanceSetting.replace('<server>', settings.server)
        .replace('<port>', settings.port);

    return request
        .get(endpoint)
        .send(appearanceColor);
};
exports.setColorAppearance = setColorAppearance;