//Set the connection details
//var databaseurl = 'analytics';
var mongojs		= require('mongojs');
//var mongoUtil = require('../connection/mongoUtil' );
//var db 		= mongoUtil.getDbMongoJS();
var config 		= require('../config/config' );
var db 			= mongojs(config.connectionstring);
process.env.TZ = 'Asia/Kolkata';
//To be executed for past 31 days
var dayEndDate = new Date();
var dayStartDate = new Date(dayEndDate.getTime() - 31*24*60*60*1000);
//var dayStartDate = new Date(2015, 10, 02);
//var dayEndDate = new Date(2015, 10, 02);

//To be executed for past 26 weeks
var weekEndDate = new Date();
var weekStartDate = new Date(weekEndDate.getTime() - 180*24*60*60*1000);
//var weekStartDate = new Date(2015, 0, 01);
//var weekEndDate = new Date(2015, 10, 30);

//To be executed for past 12 months
var monthEndDate = new Date();
var monthStartDate = new Date(monthEndDate.getTime() - 365*24*60*60*1000);
//var monthStartDate = new Date(2015, 0, 01);
//var monthEndDate = new Date(2015, 10, 30);

var connectionCount = 0;

function dbCloseConnection(){
  connectionCount--;
  if (connectionCount == 0) {
    //console.log(connectionCount);
    db.close();
  }}

function updateAggregate(aggType, userType, key, output) {
  //console.log(key);
  db.collection('agg_retention_data').update
    ({'_id.type' : aggType, '_id.user' : userType, '_id.key' : key}
      ,{$set : {'value' : output}}
      ,{upsert : true}
     ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;
        }
      dbCloseConnection();
      });
    } //end of function updateAggregate

//retention calculation for DAY
for (var daydt = new Date(dayStartDate);
         daydt <= dayEndDate;
         daydt.setDate(daydt.getDate() + 1))
{
  //Derive Day and Month
  var dd = daydt.getDate();
  var mm = daydt.getMonth()+1; //January is 0!
  var yyyy = daydt.getFullYear();
  if(dd<10) {   dd='0'+dd};
  if(mm<10) {   mm='0'+mm};

  //Derive Day
  var dayKey = '' + yyyy + mm + dd;
  //console.log(dayKey);

  var matchQueryNewUser = {};
  matchQueryNewUser['fld'] = {$in : [dayKey]};

  var matchQuery1ReturningUser = {};
  matchQuery1ReturningUser['SD' + dayKey] = {$gt : 0};

  var matchQuery2ReturningUser = {};
  matchQuery2ReturningUser['fld'] = {$nin : [dayKey]};

  var groupQuery = {};
  groupQuery['_id'] = {key : dayKey};

  //For each day, determine the user activity for the next 30 days
  for (var i = 0; i<=30; i++)
  {
    var nextDay = new Date(daydt);
    nextDay.setDate(daydt.getDate() + i);

    var nextDay_dd = nextDay.getDate();
    var nextDay_mm = nextDay.getMonth()+1; //January is 0!
    var nextDay_yyyy = nextDay.getFullYear();
    if(nextDay_dd<10) {   nextDay_dd='0'+nextDay_dd};
    if(nextDay_mm<10) {   nextDay_mm='0'+nextDay_mm};

    nextDayKey = '' + nextDay_yyyy + nextDay_mm + nextDay_dd;
    var sessionDay = 'SD' + nextDayKey;
    groupQuery[nextDayKey] = {$sum : {$cond: [{$gt: ['$' + sessionDay, 0]},1,0]}};
    }

  console.log(matchQueryNewUser);
  console.log(groupQuery);

  //Aggregate data for New User
  connectionCount++;
  db.collection('user_session_info').aggregate
    ({$match : matchQueryNewUser}
     ,{$group: groupQuery}
//     ,{$sort : {'_id' : 1}}
     ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;}

        //console.log(result);
        if(result.length > 0)
        updateAggregate('Day', 'New', result[0]['_id']['key'], result);
        else connectionCount--;
     });

   //Aggregate data for Returning User
   connectionCount++;
   db.collection('user_session_info').aggregate
    ({$match : {$and : [matchQuery1ReturningUser,matchQuery2ReturningUser]}}
     ,{$group: groupQuery}
//     ,{$sort : {'_id' : 1}}
     ,function (err , result) {
        if (err || !result) {
            console.log(err);
            db.close();
            return;}

        //console.log(result);
        if(result.length > 0)
        updateAggregate('Day', 'Returning', result[0]['_id']['key'], result);
        else connectionCount--;
    });
}

//retention calculation for WEEK
for (var weekdt = new Date(weekStartDate);
         weekdt <= weekEndDate;
         weekdt.setDate(weekdt.getDate() + 7))
{
  //Derive Week
  var weekDate = new Date(weekdt);
  var weekBegin = weekdt.getDate() - weekdt.getDay();
  var weekEnd = weekBegin + 6; // last day is the first day + 6
  var weekDay = new Date(weekDate.setDate(weekEnd));

  var weekdd = weekDay.getDate();
  var weekmm = weekDay.getMonth()+1; //January is 0!
  var weekyyyy = weekDay.getFullYear();
  if(weekdd<10) {   weekdd='0'+weekdd};
  if(weekmm<10) {   weekmm='0'+weekmm};

  var weekKey = '' + weekyyyy + weekmm + weekdd;
  var deriveKey = weekyyyy + '/' + weekmm + '/' + weekdd;

  var matchQueryNewUser = {};
  matchQueryNewUser['flw'] = {$in : [weekKey]};

  var matchQuery1ReturningUser = {};
  matchQuery1ReturningUser['SW' + weekKey] = {$gt : 0};

  var matchQuery2ReturningUser = {};
  matchQuery2ReturningUser['flw'] = {$nin : [weekKey]};

  var groupQuery = {};
  groupQuery['_id'] = {key : weekKey};

  //For each week, determine the user activity for the next 26 weeks
  for (var i = 0; i<=26; i++)
  {
    var nextWeek = new Date(deriveKey);
    nextWeek.setDate(nextWeek.getDate() + (i*7));

    var nextWeek_dd = nextWeek.getDate();
    var nextWeek_mm = nextWeek.getMonth()+1; //January is 0!
    var nextWeek_yyyy = nextWeek.getFullYear();
    if(nextWeek_dd<10) {   nextWeek_dd='0'+nextWeek_dd};
    if(nextWeek_mm<10) {   nextWeek_mm='0'+nextWeek_mm};

    nextWeekKey = '' + nextWeek_yyyy + nextWeek_mm + nextWeek_dd;
    var sessionWeek = 'SW' + nextWeekKey;
    groupQuery[nextWeekKey] = {$sum : {$cond: [{$gt: ['$' + sessionWeek, 0]},1,0]}};
    }

  //Aggregate data for New User
  connectionCount++;
  db.collection('user_session_info').aggregate
    ({$match : matchQueryNewUser}
     ,{$group: groupQuery}
//     ,{$sort : {'_id' : 1}}
     ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;}

         if(result.length > 0)
         updateAggregate('Week', 'New', result[0]['_id']['key'], result);
         else connectionCount--;
     });

    //Aggregate data for Returning User
    connectionCount++;
    db.collection('user_session_info').aggregate
     ({$match : {$and : [matchQuery1ReturningUser,matchQuery2ReturningUser]}}
      ,{$group: groupQuery}
//      ,{$sort : {'_id' : 1}}
      ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;}

         if(result.length > 0)
         updateAggregate('Week', 'Returning', result[0]['_id']['key'], result);
         else connectionCount--;
     });
}

//retention calculation for MONTH
for (var monthdt = new Date(monthStartDate);
         monthdt <= monthEndDate;
         monthdt.setDate(monthdt.getDate() + 28))
{
  //Derive Month
  var mm = monthdt.getMonth()+1; //January is 0!
  var yyyy = monthdt.getFullYear();
  if(mm<10) {   mm='0'+mm};

  var monthKey = '' + yyyy + mm;
  var deriveKey = yyyy + '/' + mm + '/' + '01';

  var matchQueryNewUser = {};
  matchQueryNewUser['flm'] = {$in : [monthKey]};

  //console.log(matchQueryNewUser);

  var matchQuery1ReturningUser = {};
  matchQuery1ReturningUser['SM' + monthKey] = {$gt : 0};

  var matchQuery2ReturningUser = {};
  matchQuery2ReturningUser['flm'] = {$nin : [monthKey]};

  var groupQuery = {};
  groupQuery['_id'] = {key : monthKey};

  //For each week, determine the user activity for the next 26 weeks
  for (var i = 0; i<=12; i++)
  {
    var nextMonth = new Date(deriveKey);
    nextMonth = new Date(new Date(nextMonth).setMonth(nextMonth.getMonth()+i));

    var nextMonth_mm = nextMonth.getMonth()+1; //January is 0!
    var nextMonth_yyyy = nextMonth.getFullYear();
    if(nextMonth_mm<10) {   nextMonth_mm='0'+nextMonth_mm};

    nextMonthKey = '' + nextMonth_yyyy + nextMonth_mm;
    var sessionMonth = 'SM' + nextMonthKey;
    groupQuery[nextMonthKey] = {$sum : {$cond: [{$gt: ['$' + sessionMonth, 0]},1,0]}};
    }

  //Aggregate data for New User
  connectionCount++;
  db.collection('user_session_info').aggregate
    ({$match : matchQueryNewUser}
     ,{$group: groupQuery}
//     ,{$sort : {'_id' : 1}}
     ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;}

         if(result.length > 0)
         updateAggregate('Month', 'New', result[0]['_id']['key'], result);
         else connectionCount--;
     });

    //Aggregate data for Returning User
    connectionCount++;
    db.collection('user_session_info').aggregate
     ({$match : {$and : [matchQuery1ReturningUser,matchQuery2ReturningUser]}}
      ,{$group: groupQuery}
//      ,{$sort : {'_id' : 1}}
      ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;}

         if(result.length > 0)
         updateAggregate('Month', 'Returning', result[0]['_id']['key'], result);
         else connectionCount--;
     });
}
