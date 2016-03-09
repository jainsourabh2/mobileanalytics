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

module.exports.summarydata = function(req,res){

  var startDate,endDate,frequency;
  console.log("summarydata code is called");
  startDate = parseInt(req.query["param1"])/1000;
  endDate = parseInt(req.query["param2"])/1000;
  frequency = req.query["param3"];

  var key = {};
  var type = {};
  var connectionCount = 0;
  var resultSet = {};
  var db = mongojs(config.connectionstring);


  matchCriteria(startDate,endDate,frequency,key,type);

  function dbCloseConnection(){
     connectionCount--;
     if (connectionCount == 0) {
       console.log(resultSet);
       db.close();
       return res.json(resultSet);
  }} //end of function dbCloseConnection

  connectionCount++;
  db.collection('agg_session_data').aggregate(
    {$match : {$and : [key,type]}}
    ,{$unwind : '$value'}
    ,{$group : {'_id' : '$value._id.key'
                ,'Non_Unique_User_Count' : {$sum : '$value.Non_Unique_User_Count'}
                ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}
                ,'New_User_Count' : {$sum : '$value.New_User_Count'}
               }}
    ,{$sort : {'_id' : 1}}
          ,function (err , result) {
             if (err || !result) {
                 console.log(err);
                 db.close();
                 return;} //end of function

            if (result.length > 0) {

              resultSet.Non_Unique_User_Count = result[0].Non_Unique_User_Count;
              resultSet.Unique_User_Count = result[0].Unique_User_Count;
              resultSet.Total_Time_Spent = result[0].Total_Time_Spent;
              resultSet.New_User_Count = result[0].New_User_Count;
/*              resultSet.push({'Non_Unique_User_Count' : result[0].Non_Unique_User_Count});
              resultSet.push({'Unique_User_Count' : result[0].Unique_User_Count});
              resultSet.push({'Total_Time_Spent' : result[0].Total_Time_Spent});
              resultSet.push({'New_User_Count' : result[0].New_User_Count});*/
            }
             dbCloseConnection();
         });

  connectionCount++;
  db.collection('agg_event_data').aggregate(
     {$unwind : '$value'}
     ,{$match : {$and : [key,type]}}
     ,{$group : {'_id' : 'Event'
                 ,'Total_Event_Count' : {$sum : '$value.Non_Unique_Event_Count'}
                }}
     ,{$sort : {'Total_Event_Count' : -1}}
           ,function (err , result) {
              if (err || !result) {
                  console.log(err);
                  db.close();
                  return;} //end of function

              if (result.length > 0) {
/*                resultSet.push({'Total_Event_Count' : result[0].Total_Event_Count});*/
                resultSet.Total_Event_Count = result[0].Total_Event_Count;
              }
              else
              {
/*                resultSet.push({'Total_Event_Count' : 0});*/
                resultSet.Total_Event_Count = 0;
              }
              dbCloseConnection();
      });  

    var crashKey = {};

  if (frequency == 'Hour')
    crashKey['CH'] = key['_id.key'];
  else if (frequency == 'Day')
    crashKey['CD'] = key['_id.key'];
  else if (frequency == 'Week')
    crashKey['CW'] = key['_id.key'];
  else if (frequency == 'Month')
    crashKey['CM'] = key['_id.key'];

  connectionCount++;
  db.collection('crash_data').aggregate(
     {$match : crashKey}
     ,{$group : {'_id' : 'Crash'
                 ,'Total_Crash_Count' : {$sum : 1}
                }}
     ,{$sort : {'Total_Crash_Count' : -1}}
           ,function (err , result) {
              if (err || !result) {
                  console.log(err);
                  db.close();
                  return;} //end of function

              if (result.length > 0) {
/*                resultSet.push({'Total_Crash_Count' : result[0].Total_Crash_Count});*/
                resultSet.Total_Crash_Count = result[0].Total_Crash_Count;
              }
              else
              {
/*                resultSet.push({'Total_Crash_Count' : 0});*/
                resultSet.Total_Crash_Count = 0;
              }
              dbCloseConnection();

      });
  } //end of fucntion summarydata
