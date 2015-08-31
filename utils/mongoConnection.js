/**
 * Created by luiscachi on 8/27/2015.
 */
var settings = require('..\\settings.json');
var mongodb = require('mongodb');

var mongoClient = mongodb.MongoClient;
var mongoConnect = "mongodb://"+settings.mongoserver+":"+settings.mongoport+"/"+settings.nameDataBase;



// the coollection can be recived
//
// (accounts credential location
// meetings outoforders privileges
// resourcemodels rooms and services )




var getcollection = function(collecmon ,callback ){
    var res;
    mongoClient.connect( mongoConnect, function(err, db) {
        if(!err) {
            db.collection(collecmon, function(err, collection){
                collection.find({}).toArray(function (err, result) {
                    if (result.length>0) {
                        res = result;
                    }
                    else
                        res=[];
                    callback(res);
                    db.close();
                });
            });
        }
    });
};

exports.getcollection = getcollection;
