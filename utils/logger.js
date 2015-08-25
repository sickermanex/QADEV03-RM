//logger
var config = require('..\\configLog.json');
var log4js = require('log4js');

/**
 Configuring the
 */
log4js.configure({
    appenders:[
        {
            type:'file',
            filename:'..\\..\\logs\\roommanager.log',
            category:'roommanager'
        }
        ,
        {
            type: 'console'
        }
    ]
});

var logger = log4js.getLogger('roommanager');
logger.setLevel(config.all);

module.exports=logger;