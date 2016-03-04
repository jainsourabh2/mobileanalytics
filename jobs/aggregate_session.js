//Set the connection details
var databaseurl = 'analytics';
var mongojs = require('mongojs');
//var mongoUtil = require('../connection/mongoUtil' );
//var db 		= mongoUtil.getDbMongoJS();
var config 		= require('../config/config' );
//var db 			= mongojs(config.connectionstring);
var db = mongojs(databaseurl);

//To be incremented daily
var endDate = new Date();
var startDate = new Date(endDate.getTime() - 1*24*60*60*1000);
//var startDate = new Date(2015, 0, 01);
//var endDate = new Date(2015, 10, 21);

//console.log('Test');

var prevSessionHour = '';
var prevSessionday = '';
var prevSessionWeek = '';
var prevSessionMonth = '';

var connectionCount = 0;

  function dbCloseConnection(){
    connectionCount--;
    //console.log('Connection');
    if (connectionCount == 0) {
      db.close();
    }}

  function updateAggregate(aggType, key, output) {
    //console.log(aggType + key);
    db.collection('agg_session_data').update
      ({'_id.type' : aggType, '_id.key' : key}
        ,{$set : {'value' : output}}
        ,{upsert : true}
       ,function (err , result) {
           if (err || !result) {
               //console.log('update aggreagte');
               //db.close();
               return;
          }
        dbCloseConnection();
        });
      } //end of function updateAggregate

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
  var sessionDay = 'SD' + dayKey;
  var sessionWeek = 'SW' + weekKey;
  var sessionMonth ='SM' + monthKey;

  var durationDay = 'DD' + dayKey;
  var durationWeek = 'DW' + weekKey;
  var durationMonth ='DM' + monthKey;

  for(var hour = 0;
          hour <= 23;
          hour++)
  {
   //Derive Hour
   var hh = hour;
   if (hh<10) {  hh='0'+hh};

   var hourKey = '' + yyyy + mm + dd + hh;
   var sessionHour = 'SH'+ hourKey;
   var durationHour = 'DH' + hourKey;

   var aggHourQuery = {};

   aggHourQuery['_id'] = {'key' : hourKey
                         ,'resolution' : '$lr'
                         ,'orientation' : '$lo'
                         ,'deviceManufacturer' : '$lm'
                         ,'deviceType' : '$lt'
                         ,'device' : '$ld'
                         ,'platform' : '$lp'
                         ,'operatingSystemVersion' : '$lov'
                         ,'appVersion' : '$lav'
                         ,'carrier' : '$lc'
                        };

   var sumQuery = {$sum : '$' + sessionHour};
   aggHourQuery['Non_Unique_User_Count'] = sumQuery;
   var sumQuery = {$sum : {$cond: [{$gt: ['$' + sessionHour, 0]},1,0]}};
   aggHourQuery['Unique_User_Count'] = sumQuery;
   var sumQuery = {$sum : '$' + durationHour};
   aggHourQuery['Total_Time_Spent'] = sumQuery;

   var sumQuery = {$sum :
                           {$cond: [{
                                     $and : [
                                               {$gt: ['$' + sessionHour, 0]}
                                             , {$eq : ['$flh',hourKey]}
                                             ]
                                   },1,0]
                           }
                  };
   aggHourQuery['New_User_Count'] = sumQuery;

   connectionCount++;

//   console.log(aggHourQuery);

   //Execute Aggregate query for Hour
/*
   db.collection('user_hourly_session_info').aggregate
     ({$group: aggHourQuery}
       ,function (err , result) {
          if (err || !result) {
              console.log('hourly');
              //db.close();
              return;}

          //console.log(result);
          console.log('Inside mongo');
          updateAggregate('Hour', result[0]['_id']['key'], result);
          //console.log(result);
      });
*/

    } //End of for loop for hourly aggregate

  if (prevSessionday != sessionDay)
  {
    prevSessionday = sessionDay;
    connectionCount++;

    //Form Aggregate query for Day
    aggDayQuery['_id'] = {'resolution' : '$lr'
                          ,'orientation' : '$lo'
                          ,'deviceManufacturer' : '$lm'
                          ,'deviceType' : '$lt'
                          ,'device' : '$ld'
                          ,'platform' : '$lp'
                          ,'operatingSystemVersion' : '$lov'
                          ,'appVersion' : '$lav'
                          ,'carrier' : '$lc'
                         };

//console.log(aggDayQuery);

    var sumQuery = {$sum : '$' + sessionDay};
    aggDayQuery['Non_Unique_User_Count'] = sumQuery;
    var sumQuery = {$sum : {$cond: [{$gt: ['$' + sessionDay, 0]},1,0]}};
    aggDayQuery['Unique_User_Count'] = sumQuery;
    var sumQuery = {$sum : '$' + durationDay};
    aggDayQuery['Total_Time_Spent'] = sumQuery;

//console.log(aggDayQuery);

    var sumQuery = {$sum :
                            {$cond: [{
                                      $and : [
                                                {$gt: ['$' + sessionDay, 0]}
                                              , {$eq : ['$fld',dayKey]}
                                              ]
                                    },1,0]
                            }
                   };
    aggDayQuery['New_User_Count'] = sumQuery;

//console.log(aggDayQuery);


    //Execute Aggregate query for Day
    db.collection('user_session_info').aggregate
      ({$group: aggDayQuery}
        ,function (err , result) {
           if (err || !result) {
               //console.log('user session');
		console.log(err);
               db.close();
               return;}

           //console.log(result);
           //console.log(result[0]['_id']['key']);
           console.log('Inside');
           updateAggregate('Day', result[0]['_id']['key'], result);
       });
     } // emd of 'if' for Day Check

  if (prevSessionWeek != sessionWeek)
  {
    prevSessionWeek = sessionWeek;
    connectionCount++;

    //Form Aggregate query for Week
    aggWeekQuery['_id'] = {'key' : weekKey
                          ,'resolution' : '$lr'
                          ,'orientation' : '$lo'
                          ,'deviceManufacturer' : '$lm'
                          ,'deviceType' : '$lt'
                          ,'device' : '$ld'
                          ,'platform' : '$lp'
                          ,'operatingSystemVersion' : '$lov'
                          ,'appVersion' : '$lav'
                          ,'carrier' : '$lc'
                         };

    var sumQuery = {$sum : '$' + sessionWeek};
    aggWeekQuery['Non_Unique_User_Count'] = sumQuery;
    var sumQuery = {$sum : {$cond: [{$gt: ['$' + sessionWeek, 0]},1,0]}};
    aggWeekQuery['Unique_User_Count'] = sumQuery;
    var sumQuery = {$sum : '$' + durationWeek};
    aggWeekQuery['Total_Time_Spent'] = sumQuery;

    var sumQuery = {$sum :
                            {$cond: [{
                                      $and : [
                                                {$gt: ['$' + sessionWeek, 0]}
                                              , {$eq : ['$flw',weekKey]}
                                              ]
                                    },1,0]
                            }
                   };
    aggWeekQuery['New_User_Count'] = sumQuery;
/*
    //Execute Aggregate query for Week
    db.collection('user_session_info').aggregate
     ({$group: aggWeekQuery}
       ,function (err , result) {
          if (err || !result) {
              console.log('info');
  //            db.close();
              return;}

console.log('Inside');
          updateAggregate('Week', result[0]['_id']['key'], result);
      });
*/ 
 } //end of 'if' for week check


  if (prevSessionMonth != sessionMonth)
  {
    prevSessionMonth = sessionMonth;
    connectionCount++;

    //Form Aggregate query for Month
    aggMonthQuery['_id'] = {'key' : monthKey
                          ,'resolution' : '$lr'
                          ,'orientation' : '$lo'
                          ,'deviceManufacturer' : '$lm'
                          ,'deviceType' : '$lt'
                          ,'device' : '$ld'
                          ,'platform' : '$lp'
                          ,'operatingSystemVersion' : '$lov'
                          ,'appVersion' : '$lav'
                          ,'carrier' : '$lc'
                         };

  var sumQuery = {$sum : '$' + sessionMonth};
  aggMonthQuery['Non_Unique_User_Count'] = sumQuery;
  var sumQuery = {$sum : {$cond: [{$gt: ['$' + sessionMonth, 0]},1,0]}};
  aggMonthQuery['Unique_User_Count'] = sumQuery;
  var sumQuery = {$sum : '$' + durationMonth};
  aggMonthQuery['Total_Time_Spent'] = sumQuery;

  var sumQuery = {$sum :
                          {$cond: [{
                                    $and : [
                                              {$gt: ['$' + sessionMonth, 0]}
                                            , {$eq : ['$flm',monthKey]}
                                            ]
                                  },1,0]
                          }
                 };
  aggMonthQuery['New_User_Count'] = sumQuery;

/*
  //Execute Aggregate query for Month
  db.collection('user_session_info').aggregate
   ({$group: aggMonthQuery}
     ,function (err , result) {
        if (err || !result) {
            console.log('monthly');
//            db.close();
            return;}

console.log('Inside');
        updateAggregate('Month', result[0]['_id']['key'], result);
    });
*/
  } //end of 'if' for month check

}; //end of for loop
