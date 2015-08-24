/**
 * Created by Pedrofuentes on 8/24/2015.
 */
var tokenLib = require('../../lib/tokenLib');
var config = require('../../config/config.json');

var login = config.userAdministratorPC102;

var y = tokenLib.tokenSlave(login, function(){});

console.log('Checking:', y);