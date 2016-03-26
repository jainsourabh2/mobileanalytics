//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');

module.exports.devicepiecharts = function(req,res){
  var startDateEpoch,endDateEpoch,frequency;
  console.log("device pie chart code is called");
  var dbname = req.query["param1"];
  startDateEpoch = parseInt(req.query["param2"])/1000;
  endDateEpoch = parseInt(req.query["param3"])/1000;
  frequency = req.query["param4"];

  var db = mongojs(config.connectionstring + dbname);

  var startDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
  startDate.setUTCSeconds(startDateEpoch);

  var endDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
  endDate.setUTCSeconds(endDateEpoch);

  var connectionCount = 0;
  var resultSet = [];

  function matchCriteria(startDate, endDate, matchCondition, addQuery)
  {
    for(var i = new Date(startDate); i<=endDate; i)
    {
      //Derive Day and Month
      var dd = i.getDate();
      var mm = i.getMonth()+1; //January is 0!
      var yyyy = i.getFullYear();
      if(dd<10) {   dd='0'+dd};
      if(mm<10) {   mm='0'+mm};

      var dayKey = '' + yyyy + mm + dd;
      var monthKey = '' + yyyy + mm;

      var matchQuery = {};

      if (dd == '01'){
        var increment = new Date(new Date(i).setMonth(i.getMonth()+1));
        if (increment <= endDate) {
          i = increment;
          matchQuery['SM' + monthKey] = {$gt : 0};
          addQuery.push({$ifNull : ['$' + 'DM' + monthKey,0]});
        }
        else {
          i.setDate(i.getDate() + 1);
          matchQuery['SD' + dayKey] = {$gt : 0};
          addQuery.push({$ifNull : ['$' + 'DD' + dayKey,0]});
        }
      }
      else {
        i.setDate(i.getDate() + 1);
        matchQuery['SD' + dayKey] = {$gt : 0};
        addQuery.push({$ifNull : ['$' + 'DD' + dayKey,0]});
      }

      matchCondition.push(matchQuery);

    } //End of 'for' loop
  } //end of function matchCriteria

  var matchCondition = [];
  var addQuery = [];
  matchCriteria(startDate,endDate,matchCondition,addQuery);

  var groupQuery = {};
  groupQuery['_id'] = { 'resolution' : '$lr'
                        ,'deviceManufacturer' : '$lm'
                        ,'deviceType' : '$lt'
                        ,'device' : '$ld'
                        ,'platform' : '$lp'
                        ,'operatingSystemVersion' : '$lov'
                        ,'appVersion' : '$lav'
                        ,'carrier' : '$lc'
                       };

  var sumQuery = {$sum : 1};
  groupQuery['Unique_User_Count'] = sumQuery;
  sumQuery = {$sum : '$Total_Time_Spent'};
  groupQuery['Total_Time_Spent'] = sumQuery;

  db.collection('user_session_info').aggregate(
    {$match : {$or : matchCondition}}
    ,{$project : {_id:1, lr:1, lm:1, lt:1, ld:1, lp:1, lov:1, lav:1, lc:1, Total_Time_Spent : {$add : addQuery}}}
    ,{$group : groupQuery}
          ,function (err , result) {
             if (err || !result) {
                 console.log(err);
                 db.close();
                 return;} //end of function

             writeResult(result);
      });

  function writeResult(output){
    db.collection('device_details_temp').update
      ({'_id' : 'Custom'}
      ,{$set : {'value' : output}}
      ,{upsert : true}
      ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;
        }
       generateResult();
      });
  } //end of function writeResult

  function dbCloseConnection(){
     connectionCount--;
     if (connectionCount == 0) {
       console.log(resultSet[0]._id);
       console.log(resultSet[0].value);
       return res.json(resultSet);
       db.close();
  }} //end of function dbCloseConnection

  function generateResult(){

    //resolution
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.resolution'
                  ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                  ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
        if (err || !result) {
           console.log(err);
           db.close();
           return;} //end of function

        resultSet.push({'_id' : 'resolution', 'value' : result});
        //console.log(result);
        dbCloseConnection();
      });

    //deviceManufacturer
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.deviceManufacturer'
                  ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                  ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;} //end of function

         resultSet.push({'_id' : 'deviceManufacturer', 'value' : result});
         //console.log(result);
         dbCloseConnection();
       });

    //deviceType
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.deviceType'
                  ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                  ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;} //end of function

         resultSet.push({'_id' : 'deviceType', 'value' : result});
         //console.log(result);
         dbCloseConnection();
      });

    //device
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.device'
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;} //end of function

         resultSet.push({'_id' : 'device', 'value' : result});
         //console.log(result);
         dbCloseConnection();
      });

    //platform
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.platform'
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;} //end of function

         resultSet.push({'_id' : 'platform', 'value' : result});
         //console.log(result);
         dbCloseConnection();
      });

    //operatingSystemVersion
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.operatingSystemVersion'
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;} //end of function

         resultSet.push({'_id' : 'operatingSystemVersion', 'value' : result});
         //console.log(result);
         dbCloseConnection();
      });

    //appVersion
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.appVersion'
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;} //end of function

         resultSet.push({'_id' : 'appVersion', 'value' : result});
         //console.log(result);
         dbCloseConnection();
      });

    //carrier
    connectionCount++;
    db.collection('device_details_temp').aggregate
      ({$match : {'_id' : 'Custom'}}
       ,{$unwind : '$value'}
       ,{$group : {'_id' : '$value._id.carrier'
                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                 ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}}}
       ,function (err , result) {
         if (err || !result) {
             console.log(err);
             db.close();
             return;} //end of function

         resultSet.push({'_id' : 'carrier', 'value' : result});
         //console.log(result);
         dbCloseConnection();
      });

  } //end of function generateResult
}
