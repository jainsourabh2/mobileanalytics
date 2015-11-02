//Set the connection details
var databaseurl = 'test';
//var collections = ['users_session_info'];
var mongojs= require('mongojs');
var db = mongojs(databaseurl);
//var aggregateCollection = db.collection(collections);

//To be incremented daily
var startDate = new Date(2015, 6, 1);
var endDate = new Date(2015, 6, 1);

var prevSessionday = '';
var prevSessionWeek = '';
var prevSessionMonth = '';

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
  var dayKey = dd+'-'+mm+'-'+yyyy;
  var weekKey = weekdd+'-'+weekmm+'-'+weekyyyy;
  var monthKey = mm+'-'+yyyy;

  //Derive columns to be apply aggregate functions
  var sessionDay = 'SD'+dd+'-'+mm+'-'+yyyy;
  var sessionMonth ='SM'+mm+'-'+yyyy;
  var sessionWeek = 'SW'+weekdd+'-'+weekmm+'-'+weekyyyy;

  var durationDay = 'DD'+dd+'-'+mm+'-'+yyyy;
  var durationMonth ='DM'+mm+'-'+yyyy;
  var durationWeek = 'DW'+weekdd+'-'+weekmm+'-'+weekyyyy;

  function dbCloseConnection(){
    connectionCount--;
    if (connectionCount == 0) {
      db.close();
    }}

  function updateAggregate(aggType, key, output) {
    //console.log(aggType + key);
    db.collection('agg_data').update
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
      }

  if (prevSessionday != sessionDay)
  {
    prevSessionday = sessionDay;
    connectionCount++;

    //Form Aggregate query for Day
    aggDayQuery['_id'] = {'key' : dayKey
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

    var sumQuery = {$sum : '$' + sessionDay};
    aggDayQuery['Non_Unique_Session_Count'] = sumQuery;
    var sumQuery = {$sum : {$cond: [{$gt: ['$' + sessionDay, 0]},1,0]}};
    aggDayQuery['Unique_Session_Count'] = sumQuery;
    var sumQuery = {$sum : '$' + durationDay};
    aggDayQuery['Total_Time_Spent'] = sumQuery;

    //Execute Aggregate query for Day
    db.collection('user_session_info').aggregate
      ({$group: aggDayQuery}
        ,function (err , result) {
           if (err || !result) {
               console.log(err);
               db.close();
               return;}

           //console.log(result);
           //console.log(result[0]['_id']['key']);
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
    aggWeekQuery['Non_Unique_Session_Count'] = sumQuery;
    var sumQuery = {$sum : {$cond: [{$gt: ['$' + sessionWeek, 0]},1,0]}};
    aggWeekQuery['Unique_Session_Count'] = sumQuery;
    var sumQuery = {$sum : '$' + durationWeek};
    aggWeekQuery['Total_Time_Spent'] = sumQuery;

    //Execute Aggregate query for Week
    db.collection('user_session_info').aggregate
     ({$group: aggWeekQuery}
       ,function (err , result) {
          if (err || !result) {
              console.log(err);
              db.close();
              return;}

          updateAggregate('Week', result[0]['_id']['key'], result);
      });
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
  aggMonthQuery['Non_Unique_Session_Count'] = sumQuery;
  var sumQuery = {$sum : {$cond: [{$gt: ['$' + sessionMonth, 0]},1,0]}};
  aggMonthQuery['Unique_Session_Count'] = sumQuery;
  var sumQuery = {$sum : '$' + durationMonth};
  aggMonthQuery['Total_Time_Spent'] = sumQuery;

  //Execute Aggregate query for Month
  db.collection('user_session_info').aggregate
   ({$group: aggMonthQuery}
     ,function (err , result) {
        if (err || !result) {
            console.log(err);
            db.close();
            return;}

        updateAggregate('Month', result[0]['_id']['key'], result);
    });
  } //end of 'if' for month check

}; //end of for loop

