/**
 * Created by Pedrofuentes on 8/25/2015.
 */
var request = require('superagent');
(require('superagent-proxy'))(request);
var appearanceEndPoint = require('../endpoints/appearanceEndPoint.json');
var settings = require('../settings.json');

var getAppearancePanel = function(token){
    var endpoint = appearanceEndPoint.appearanceSetting.replace('[server]', settings.server)
        .replace('[port]', settings.port);

    return request
        .get(endpoint)
        .set('Authorization', token);
};
exports.getAppearancePanel = getAppearancePanel;

var setColorAppearance = function(token, appearanceColor){
    var endpoint = appearanceEndPoint.appearanceSetting.replace('[server]', settings.server)
        .replace('[port]', settings.port);

    return request
        .put(endpoint)
        .set('Authorization', token)
        .send(appearanceColor);
};
exports.setColorAppearance = setColorAppearance;