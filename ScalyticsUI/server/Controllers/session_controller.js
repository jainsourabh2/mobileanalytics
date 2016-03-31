//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');

function matchCriteria(startDate, endDate, frequency, key, type, matchCondition)
{
  var increment = 0;
//  var matchCondition = [];

  for(var i = startDate; i<=endDate; i=i+increment)
  {
    var matchField = new Date(0); // The 0 there is the key, which sets the date to the epoch
    matchField.setUTCSeconds(i);

    //Derive Day and Month
    var dd = matchField.getDate();
    var mm = matchField.getMonth()+1; //January is 0!
    var yyyy = matchField.getFullYear();
    if(dd<10) {   dd='0'+dd};
    if(mm<10) {   mm='0'+mm};

    //Derive Week
    var weekDate = new Date(matchField);
    var weekBegin = matchField.getDate() - matchField.getDay();
    var weekEnd = weekBegin + 6; // last day is the first day + 6
    var weekDay = new Date(weekDate.setDate(weekEnd));

    var weekdd = weekDay.getDate();
    var weekmm = weekDay.getMonth()+1; //January is 0!
    var weekyyyy = weekDay.getFullYear();
    if(weekdd<10) {   weekdd='0'+weekdd};
    if(weekmm<10) {   weekmm='0'+weekmm};

    //Derive Hour and Minutes
    var hh = matchField.getHours();
    if (hh<10) {  hh='0'+hh};

    var hourKey = '' + yyyy + mm + dd + hh;
    var dayKey = '' + yyyy + mm + dd;
    var weekKey = '' + weekyyyy + weekmm + weekdd;
    var monthKey = '' + yyyy + mm;

    if (frequency == 'Hour') {
      increment = (60*60);
      matchCondition.push(hourKey);}
    else if (frequency == 'Day') {
      increment = (60*60*24);
      matchCondition.push(dayKey);}
    else if (frequency == 'Week') {
      increment = (60*60*24*7);
      matchCondition.push(weekKey);}
    else if (frequency == 'Month') {
      increment = (60*60*24*28);
      matchCondition.push(monthKey);}

  } //End of 'for' loop

  key['_id.key'] = {$in : matchCondition};
  type['_id.type'] = {$in : [frequency]};

} //end of function matchCriteria
/*
module.exports.sessioncounts = function(req,res){

  var startDate,endDate,frequency;
  console.log("sessioncounts code is called");
  var dbname = req.query["param1"];
  startDate = parseInt(req.query["param2"])/1000;
  endDate = parseInt(req.query["param3"])/1000;
  frequency = req.query["param4"];
  var db = mongojs(config.connectionstring + dbname);
  var key = {};
  var type = {};

  matchCriteria(startDate,endDate,frequency,key,type);

  db.collection('agg_session_data').aggregate(
    {$match : {$and : [key,type]}}
    ,{$unwind : '$value'}
    ,{$group : {'_id' : '$value._id.key'
                ,'Non_Unique_User_Count' : {$sum : '$value.Non_Unique_User_Count'}
                ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
               }}
    ,{$sort : {'_id' : 1}}
          ,function (err , result) {
             if (err || !result) {
                 console.log(err);
                 db.close();
                 return;} //end of function

             console.log(result);
             db.close();
             return res.json(result);
         });
} //end of fucntion sessioncounts

module.exports.sessionduration = function(req,res){

  var startDate,endDate,frequency;
  console.log("sessionduration code is called");
  var dbname = req.query["param1"];
  startDate = parseInt(req.query["param2"])/1000;
  endDate = parseInt(req.query["param3"])/1000;
  frequency = req.query["param4"];
  var db = mongojs(config.connectionstring + dbname);
  var key = {};
  var type = {};

  matchCriteria(startDate,endDate,frequency,key,type);

  db.collection('agg_session_data').aggregate(
     {$match : {$and : [key,type]}}
     ,{$unwind : '$value'}
     ,{$group : {'_id' : '$value._id.key'
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                }}
      ,{$sort : {'_id' : 1}}
             ,function (err , result) {
                if (err || !result) {
                    console.log(err);
                    db.close();
                    return;} //end of function

                console.log(result);
                db.close();
                return res.json(result);
            });
} //end of function sessionduration

module.exports.usersplit = function(req,res){

	var startDate,endDate,frequency;
	console.log("usersplit code is called");
        var dbname = req.query["param1"];
	startDate = parseInt(req.query["param2"])/1000;
	endDate = parseInt(req.query["param3"])/1000;
	frequency = req.query["param4"];
        var db = mongojs(config.connectionstring + dbname);
	var key = {};
	var type = {};

  matchCriteria(startDate,endDate,frequency,key,type);

  db.collection('agg_session_data').aggregate(
     {$match : {$and : [key,type]}}
     ,{$unwind : '$value'}
     ,{$group : {'_id' : '$value._id.key'
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                 ,'New_User_Count' : {$sum : '$value.New_User_Count'}
                }}
    ,{$sort : {'_id' : 1}}
           ,function (err , result) {
              if (err || !result) {
                  console.log(err);
                  db.close();
                  return;} //end of function

              console.log(result);
              db.close();
              return res.json(result);
          });
} //end of function usersplit
*/
module.exports.insightsession = function(req,res){

  var startDate,endDate,frequency;
  console.log("insightsession code is called");
  var dbname = req.query["param1"];
  startDate = parseInt(req.query["param2"])/1000;
  endDate = parseInt(req.query["param3"])/1000;
  frequency = req.query["param4"];
  var db = mongojs(config.connectionstring + dbname);
  var key = {};
  var type = {};
  var matchCondition = [];

  matchCriteria(startDate,endDate,frequency,key,type,matchCondition);

  db.collection('agg_session_data').aggregate(
     {$match : {$and : [key,type]}}
     ,{$unwind : '$value'}
     ,{$group : {'_id' : '$value._id.key'
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}
                 ,'Non_Unique_User_Count' : {$sum : '$value.Non_Unique_User_Count'}
                 //,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                }}
      ,{$sort : {'_id' : 1}}
             ,function (err , result) {
                if (err || !result) {
                    console.log(err);
                    db.close();
                    return;} //end of function

                console.log(result);
                db.close();

                var resultSet = [];
                for (j=0;j<matchCondition.length;j++){
                    var resultItem = {};
                    resultItem['_id'] = matchCondition[j];
                    resultItem['Total_Time_Spent'] = 0;
                    resultItem['Non_Unique_User_Count'] = 0;
                     //var reset = 0;
 
                   for (k=0;k<result.length;k++){
                       if(matchCondition[j] == result[k]._id){
                          //reset = 1;
                          resultItem['_id'] = result[k]._id;
                          resultItem['Total_Time_Spent'] = result[k].Total_Time_Spent;
                          resultItem['Non_Unique_User_Count'] = result[k].Non_Unique_User_Count;
                       }
                    } //Enf of 'for' loop
                    
                resultSet.push(resultItem);
                } //End of 'for' loop
                return res.json(resultSet);
            });
} //end of function insightsession

module.exports.insightuser = function(req,res){

  var startDate,endDate,frequency;
  console.log("insightuser code is called");
  var dbname = req.query["param1"];
  startDate = parseInt(req.query["param2"])/1000;
  endDate = parseInt(req.query["param3"])/1000;
  frequency = req.query["param4"];
  var db = mongojs(config.connectionstring + dbname);
  var key = {};
  var type = {};
  var matchCondition = [];

  matchCriteria(startDate,endDate,frequency,key,type,matchCondition);

  db.collection('agg_session_data').aggregate(
     {$match : {$and : [key,type]}}
     ,{$unwind : '$value'}
     ,{$group : {'_id' : '$value._id.key'
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                 ,'New_User_Count' : {$sum : '$value.New_User_Count'}
                 //,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                }}
      ,{$sort : {'_id' : 1}}
             ,function (err , result) {
                if (err || !result) {
                    console.log(err);
                    db.close();
                    return;} //end of function

                console.log(result);
                db.close();

                var resultSet = [];
                for (j=0;j<matchCondition.length;j++){
                    var resultItem = {};
                    resultItem['_id'] = matchCondition[j];
                    resultItem['Total_Time_Spent'] = 0;
                    resultItem['Unique_User_Count'] = 0;
                    resultItem['New_User_Count'] = 0;
                     //var reset = 0;

                   for (k=0;k<result.length;k++){
                       if(matchCondition[j] == result[k]._id){
                          //reset = 1;
                          resultItem['_id'] = result[k]._id;
                          resultItem['Total_Time_Spent'] = result[k].Total_Time_Spent;
                          resultItem['Unique_User_Count'] = result[k].Unique_User_Count;
                          resultItem['New_User_Count'] = result[k].New_User_Count;
                       }
                    } //Enf of 'for' loop

                resultSet.push(resultItem);
                } //End of 'for' loop

                return res.json(resultSet);
            });
} //end of function insightsession
