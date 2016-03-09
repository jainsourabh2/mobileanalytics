//Set the connection details
var mongojs	= require('mongojs');
var config	= require('../config/config');
var db = mongojs(config.connectionstring);
process.env.TZ = 'Asia/Kolkata';
//To be incremented daily
var endDate = new Date();
var startDate = new Date(endDate.getTime() - 15*24*60*60*1000);

var prevEventHour = '';
var prevEventday = '';
var prevEventWeek = '';
var prevEventMonth = '';

var connectionCount = 0;

for (var dt = startDate;
         dt <= endDate;
         dt.setDate(dt.getDate() + 1))
{

  var aggDayQuery = {};
  var aggWeekQuery = {};
  var aggMonthQuery = {};

  //Derive Day and Month
  var dd = dt.getDate();
  var mm = dt.getMonth()+1; //January is 0!
  var yyyy = dt.getFullYear();
  if(dd<10) {   dd='0'+dd};
  if(mm<10) {   mm='0'+mm};

  //Derive Week
  var weekDate = new Date(dt);
  var weekBegin = dt.getDate() - dt.getDay();
  var weekEnd = weekBegin + 6; // last day is the first day + 6
  var weekDay = new Date(weekDate.setDate(weekEnd));

  var weekdd = weekDay.getDate();
  var weekmm = weekDay.getMonth()+1; //January is 0!
  var weekyyyy = weekDay.getFullYear();
  if(weekdd<10) {   weekdd='0'+weekdd};
  if(weekmm<10) {   weekmm='0'+weekmm};

  //Derive Day, Week and Month Key values
  var dayKey = '' + yyyy + mm + dd;
  var weekKey = '' + weekyyyy + weekmm + weekdd;
  var monthKey = '' + yyyy + mm;

  //Derive columns to be apply aggregate functions
  var eventDay = 'ED' + dayKey;
  var eventWeek = 'EW' + weekKey;
  var eventMonth ='EM' + monthKey;

  function dbCloseConnection(){
    connectionCount--;
    if (connectionCount == 0) {
      db.close();
    }}

  function updateAggregate(aggType, key, output) {
    //console.log(aggType + key);
    db.collection('agg_event_data').update
      ({'_id.type' : aggType, '_id.key' : key}
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

  for(var hour = 0;
          hour <= 23;
          hour++)
  {
   //Derive Hour
   var hh = hour;
   if (hh<10) {  hh='0'+hh};

   var hourKey = '' + yyyy + mm + dd + hh;
   var eventHour = 'EH'+ hourKey;

   var aggHourQuery = {};

   aggHourQuery['_id'] = {'key' : hourKey
                         ,'event' : '$' + eventHour + '.name'
/*                         ,'resolution' : '$lr'
                         ,'orientation' : '$lo'
                         ,'deviceManufacturer' : '$lm'
                         ,'deviceType' : '$lt'
                         ,'device' : '$ld'
                         ,'platform' : '$lp'
                         ,'operatingSystemVersion' : '$lov'
                         ,'appVersion' : '$lav'
                         ,'carrier' : '$lc'
*/                        };

   var sumQuery = {$sum : '$' + eventHour + '.value'};
   aggHourQuery['Non_Unique_Event_Count'] = sumQuery;
   var sumQuery = {$sum : {$cond: [{$gt: ['$' + eventHour + '.value', 0]},1,0]}};
   aggHourQuery['Unique_Event_Count'] = sumQuery;

   connectionCount++;

   //console.log(eventHour);

   //Execute Aggregate query for Hour
   db.collection('user_event_info').aggregate
     ({$unwind : '$' + eventHour}
       ,{$group: aggHourQuery}
       ,function (err , result) {
          if (err || !result) {
              console.log(err);
              db.close();
              return;}

          if (result.length > 0) {
          //console.log(result);
          updateAggregate('Hour', result[0]['_id']['key'], result);
          } else dbCloseConnection();
      }); //end of db.collection('user_event_info').aggregate
    } //End of for loop for hourly aggregate

  if (prevEventday != eventDay)
  {
    prevEventday = eventDay;
    connectionCount++;

    //Form Aggregate query for Day
    aggDayQuery['_id'] = {'key' : dayKey
                          ,'event' : '$' + eventDay + '.name'
/*                          ,'resolution' : '$lr'
                          ,'orientation' : '$lo'
                          ,'deviceManufacturer' : '$lm'
                          ,'deviceType' : '$lt'
                          ,'device' : '$ld'
                          ,'platform' : '$lp'
                          ,'operatingSystemVersion' : '$lov'
                          ,'appVersion' : '$lav'
                          ,'carrier' : '$lc'
*/                         };

    var sumQuery = {$sum : '$' + eventDay + '.value'};
    aggDayQuery['Non_Unique_Event_Count'] = sumQuery;
    var sumQuery = {$sum : {$cond: [{$gt: ['$' + eventDay + '.value', 0]},1,0]}};
    aggDayQuery['Unique_Event_Count'] = sumQuery;

    //Execute Aggregate query for Day
    db.collection('user_event_info').aggregate
      ({$unwind : '$' + eventDay}
        ,{$group: aggDayQuery}
        ,function (err , result) {
           if (err || !result) {
               console.log(err);
               db.close();
               return;}

           if (result.length > 0)
           updateAggregate('Day', result[0]['_id']['key'], result);
           else dbCloseConnection();
       }); //end of db.collection('user_event_info').aggregate
     } // emd of 'if' for Day Check

  if (prevEventWeek != eventWeek)
  {
    prevEventWeek = eventWeek;
    connectionCount++;

    //Form Aggregate query for Week
    aggWeekQuery['_id'] = {'key' : weekKey
                          ,'event' : '$' + eventWeek + '.name'
/*                          ,'resolution' : '$lr'
                          ,'orientation' : '$lo'
                          ,'deviceManufacturer' : '$lm'
                          ,'deviceType' : '$lt'
                          ,'device' : '$ld'
                          ,'platform' : '$lp'
                          ,'operatingSystemVersion' : '$lov'
                          ,'appVersion' : '$lav'
                          ,'carrier' : '$lc'
*/                         };

    var sumQuery = {$sum : '$' + eventWeek + '.value'};
    aggWeekQuery['Non_Unique_Event_Count'] = sumQuery;
    var sumQuery = {$sum : {$cond: [{$gt: ['$' + eventWeek + '.value', 0]},1,0]}};
    aggWeekQuery['Unique_Event_Count'] = sumQuery;

    //Execute Aggregate query for Week
    db.collection('user_event_info').aggregate
     ({$unwind : '$' + eventWeek}
       ,{$group: aggWeekQuery}
       ,function (err , result) {
          if (err || !result) {
              console.log(err);
              db.close();
              return;}

          if (result.length > 0)
          updateAggregate('Week', result[0]['_id']['key'], result);
          else dbCloseConnection();
      }); //end of db.collection('user_event_info').aggregate
  } //end of 'if' for week check


  if (prevEventMonth != eventMonth)
  {
    prevEventMonth = eventMonth;
    connectionCount++;

    //Form Aggregate query for Month
    aggMonthQuery['_id'] = {'key' : monthKey
                          ,'event' : '$' + eventMonth + '.name'
/*                          ,'resolution' : '$lr'
                          ,'orientation' : '$lo'
                          ,'deviceManufacturer' : '$lm'
                          ,'deviceType' : '$lt'
                          ,'device' : '$ld'
                          ,'platform' : '$lp'
                          ,'operatingSystemVersion' : '$lov'
                          ,'appVersion' : '$lav'
                          ,'carrier' : '$lc'
*/                         };

  var sumQuery = {$sum : '$' + eventMonth + '.value'};
  aggMonthQuery['Non_Unique_Event_Count'] = sumQuery;
  var sumQuery = {$sum : {$cond: [{$gt: ['$' + eventMonth + '.value', 0]},1,0]}};
  aggMonthQuery['Unique_Event_Count'] = sumQuery;

  //Execute Aggregate query for Month
  db.collection('user_event_info').aggregate
   ({$unwind : '$' + eventMonth}
     ,{$group: aggMonthQuery}
     ,function (err , result) {
        if (err || !result) {
            console.log(err);
            db.close();
            return;}

        if (result.length > 0)
        updateAggregate('Month', result[0]['_id']['key'], result);
        else dbCloseConnection();
    }); //end of db.collection('user_event_info').aggregate
  } //end of 'if' for month check

}; //end of for loop
