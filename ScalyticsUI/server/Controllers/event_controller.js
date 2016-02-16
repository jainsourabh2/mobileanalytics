//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');

function matchCriteria(startDate, endDate, frequency, key, type)
{
  var increment = 0;
  var matchCondition = [];

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

module.exports.eventNames = function(req,res){

  console.log("events code is called");
  var db = mongojs(config.connectionstring);

  db.collection('agg_event_data').aggregate
  ({$match : {'_id.type' : 'Day'}}
   ,{$unwind : '$value'}
   ,{$group : {'_id' : '$value._id.event'}}
   ,function (err , result) {
      if (err || !result) {
          console.log(err);
          db.close();
          return;}

      db.close();
      return res.json(result);
    }); //end of db.collection
} //end of function eventNames

module.exports.eventCounts = function(req,res){

  console.log("eventscomparisiondata code is called");
  var startDate,endDate,frequency;
  var eventList=[];
  startDate = parseInt(req.query["param1"])/1000;
  endDate = parseInt(req.query["param2"])/1000;
  frequency = req.query["param3"];
  eventList = req.query["param4"];
  var db = mongojs(config.connectionstring);

  function generateResultSet(result,resultSet){

  for (i=0; i<result.length; i++){
      var resultItem = {};
      resultItem['event_name'] = result[i]._id.event;
      resultItem['event_date'] = result[i]._id.key;
      resultItem['Non_Unique_Event_Count'] = result[i].Non_Unique_Event_Count;
      resultItem['Unique_User_Count'] = result[i].Unique_User_Count;
      resultSet.push(resultItem);
  } //end of 'for' loop

  console.log(resultSet);
  return res.json(resultSet);
} //end of function generateResultSet

var key = {};
var type = {};
var eventname = {};
eventname['value._id.event'] = {$in : eventList};

matchCriteria(startDate,endDate,frequency,key,type);

db.collection('agg_event_data').aggregate(
  {$unwind : '$value'}
  ,{$match : {$and : [key,type,eventname]}}
  ,{$group : {'_id' : {event : '$value._id.event', key : '$value._id.key' }
              ,'Non_Unique_Event_Count' : {$sum : '$value.Non_Unique_Event_Count'}
              ,'Unique_User_Count' : {$sum : '$value.Unique_Event_Count'}
             }}
  ,{$sort : {'_id.event' : 1, '_id.key' : 1}}
        ,function (err , result) {
           if (err || !result) {
               console.log(err);
               db.close();
               return;} //end of function

           db.close();
           var output = [];
           generateResultSet(result,output);
       });
} //end of function eventCounts

module.exports.eventSummary = function(req,res){

  console.log("eventsdata code is called");
  var startDate,endDate,frequency;
  startDate = parseInt(req.query["param1"])/1000;
  endDate = parseInt(req.query["param2"])/1000;
  frequency = req.query["param3"];
  var db = mongojs(config.connectionstring);
  var key = {};
  var type = {};

  matchCriteria(startDate,endDate,frequency,key,type);

  db.collection('agg_event_data').aggregate(
  {$unwind : '$value'}
  ,{$match : {$and : [key,type]}}
  ,{$group : {'_id' : '$value._id.event'
              ,'Total_Event_Count' : {$sum : '$value.Non_Unique_Event_Count'}
             }}
  ,{$sort : {'Total_Event_Count' : -1}}
        ,function (err , result) {
           if (err || !result) {
               console.log(err);
               db.close();
               return;} //end of function

           db.close();
           console.log(result);
           return res.json(result);
       });
} //end of function eventSummary
