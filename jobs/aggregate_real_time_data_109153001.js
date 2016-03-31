//Set the connection details
//var databaseurl = 'analytics';
var mongojs		= require('mongojs');
//var mongoUtil = require('../connection/mongoUtil' );
//var db 		= mongoUtil.getDbMongoJS();
var config 		= require('../config/config' );
var dbname              = '109153001';
var db                  = mongojs(config.connectionstring + dbname);

var dt = new Date();
var dtEpoch = Math.round(dt.getTime()/1000);

if (dtEpoch%15 != 0 ) dtEpoch = dtEpoch - (dtEpoch%15);

//To be scheduled every 1 hour
//Purge data older than 1 hour
dtEpoch = dtEpoch - (60*60);
//console.log(dtEpoch);

db.collection('real_time_data').aggregate
  ({$match : {'_id' : {$lt : dtEpoch}}}
   ,{$group : {'_id' : dtEpoch
               ,'count' : {$sum : '$count'}}}
  ,function (err , result) {
      if (err || !result) {
          console.log(err);
          db.close();
          return;}
      if (result.length == 0) db.close();
      else removePastData(result);
  });

function removePastData(output){
  //console.log(output);

  db.collection('real_time_data').remove
     ({"_id": {$lt : dtEpoch}}
     ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;}
      insertAggregateRecord(output);
      });
} //end of function removePastData

function insertAggregateRecord(output){
  db.collection('real_time_data').insert
    (output
    ,function (err , result) {
          if (err || !result) {
              console.log(err);
              db.close();
              return;}
       db.close();
    });
} //end of function insertAggregateRecord
