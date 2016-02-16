//Set the connection details
//var databaseurl = 'test';
var databaseurl = 'test';
var mongojs= require('mongojs');
var resultSet = [];


module.exports.devicepiecharts = function(req,res){
var db = mongojs(databaseurl);
 var start,end,selectedfrequency,istest;
 var data;
  console.log("device pie chart code is called");
  start = parseInt(req.query["param1"])/1000;
  end = parseInt(req.query["param2"])/1000;
  selectedfrequency = req.query["param3"];
  istest = req.query["param4"];
  // var key = {};
  // var type = {};

  var startDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
  startDate.setUTCSeconds(start);

  var endDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
  endDate.setUTCSeconds(end);


    var matchCondition = [];
    matchCriteria(startDate,endDate,matchCondition);

    var groupQuery = {};
    groupQuery['_id'] = {'key' : 'Custom'
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

    var sumQuery = {$sum : 1};
    groupQuery['Unique_User_Count'] = sumQuery;

    db.collection('user_session_info').aggregate(
      {$match : {$or : matchCondition}}
      ,{$group : groupQuery}
            ,function (err , result) {
               if (err || !result) {
                   console.log(err);
                   //db.close();
                   return;} //end of function

           console.log("got first output from database");

           //data = writeResult(result);
             db.collection('device_details_temp').insert(result);

            //resolution
            connectionCount++;
            db.collection('device_details_temp').aggregate
              ({$group : {'_id' : '$_id.resolution'
                          ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
               ,function (err , result) {
                if (err || !result) {
                   console.log(err);
                   //db.close();
                   return;} //end of function

                resultSet.push({'_id' : 'resolution', 'value' : result});
                dbCloseConnection();

            //deviceManufacturer
            connectionCount++;
            db.collection('device_details_temp').aggregate
              ({$group : {'_id' : '$_id.deviceManufacturer'
                          ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
               ,function (err , result) {
                 if (err || !result) {
                     console.log(err);
                     //db.close();
                     return;} //end of function

                 resultSet.push({'_id' : 'deviceManufacturer', 'value' : result});
                 dbCloseConnection();

              //deviceType
              connectionCount++;
              db.collection('device_details_temp').aggregate
                ({$group : {'_id' : '$_id.deviceType'
                            ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
                 ,function (err , result) {
                   if (err || !result) {
                       console.log(err);
                       //db.close();
                       return;} //end of function

                   resultSet.push({'_id' : 'deviceType', 'value' : result});
                   dbCloseConnection();

                  //device
                  connectionCount++;
                  db.collection('device_details_temp').aggregate
                    ({$group : {'_id' : '$_id.device'
                               ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
                     ,function (err , result) {
                       if (err || !result) {
                           console.log(err);
                           //db.close();
                           return;} //end of function

                       resultSet.push({'_id' : 'device', 'value' : result});
                       dbCloseConnection();

                    //platform
                    connectionCount++;
                    db.collection('device_details_temp').aggregate
                      ({$group : {'_id' : '$_id.platform'
                                 ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
                       ,function (err , result) {
                         if (err || !result) {
                             console.log(err);
                             //db.close();
                             return;} //end of function

                         resultSet.push({'_id' : 'platform', 'value' : result});
                         dbCloseConnection();

                      //operatingSystemVersion
                      connectionCount++;
                      db.collection('device_details_temp').aggregate
                        ({$group : {'_id' : '$_id.operatingSystemVersion'
                                   ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
                         ,function (err , result) {
                           if (err || !result) {
                               console.log(err);
                               //db.close();
                               return;} //end of function

                           resultSet.push({'_id' : 'operatingSystemVersion', 'value' : result});
                           dbCloseConnection();

                        //appVersion
                        connectionCount++;
                        db.collection('device_details_temp').aggregate
                          ({$group : {'_id' : '$_id.appVersion'
                                     ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
                           ,function (err , result) {
                             if (err || !result) {
                                 console.log(err);
                                 //db.close();
                                 return;} //end of function

                             resultSet.push({'_id' : 'appVersion', 'value' : result});
                             dbCloseConnection();

                          //carrier
                          connectionCount++;
                          db.collection('device_details_temp').aggregate
                            ({$group : {'_id' : '$_id.carrier'
                                       ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
                             ,function (err , result) {
                               if (err || !result) {
                                   console.log(err);
                                   //db.close();
                                   return;} //end of function

                               resultSet.push({'_id' : 'carrier', 'value' : result});
                               //dbCloseConnection();
                               db.close();
                              console.log("i got the last data from writeresult");
                               return res.json(resultSet);
                               
                            });
                          });
                        });
                      });                       
                    });
                 });
               });
              });           
           
       });



    // console.log("database is called");
    // console.log(data);
 }

function matchCriteria(startDate, endDate, matchCondition)
{
  for(var i = new Date(startDate); i<=endDate; i)
  {
    //Derive Day and Month
    var dd = i.getDate();
    var mm = i.getMonth()+1; //January is 0!
    var yyyy = i.getFullYear();
    if(dd<10) {   dd='0'+dd};
    if(mm<10) {   mm='0'+mm};

    var dayKey = yyyy + mm + dd;
    var monthKey = yyyy + mm;

    var matchQuery = {};

    if (dd == '01'){
      var increment = new Date(new Date(i).setMonth(i.getMonth()+1));
      if (increment <= endDate) {
        i = increment;
        matchQuery['SM' + monthKey] = {$gt : 0};
      }
      else {
        i.setDate(i.getDate() + 1);
        matchQuery['SD' + dayKey] = {$gt : 0};
      }
    }
    else {
      i.setDate(i.getDate() + 1);
      matchQuery['SD' + dayKey] = {$gt : 0};
    }

    matchCondition.push(matchQuery);

  } //End of 'for' loop
} //end of function matchCriteria



var connectionCount = 0;

 function dbCloseConnection(){
   connectionCount--;
   if (connectionCount == 0) {
     console.log(resultSet[0]);
     console.log(resultSet[1]);
     console.log(resultSet[2]);
     console.log(resultSet[3]);
     console.log(resultSet[4]);
     console.log(resultSet[5]);
     console.log(resultSet[6]);
     console.log(resultSet[7]);
     //db.close();
   }
 }


// function writeResult(output){
//   //console.log(output);
//   db.collection('device_details_temp').insert(output);

//   //resolution
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.resolution'
//                 ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//       if (err || !result) {
//          console.log(err);
//          db.close();
//          return;} //end of function

//       resultSet.push({'_id' : 'resolution', 'value' : result});
//       dbCloseConnection();
//     });

//   //deviceManufacturer
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.deviceManufacturer'
//                 ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//        if (err || !result) {
//            console.log(err);
//            db.close();
//            return;} //end of function

//        resultSet.push({'_id' : 'deviceManufacturer', 'value' : result});
//        dbCloseConnection();
//      });

//   //deviceType
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.deviceType'
//                 ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//        if (err || !result) {
//            console.log(err);
//            db.close();
//            return;} //end of function

//        resultSet.push({'_id' : 'deviceType', 'value' : result});
//        dbCloseConnection();
//     });

//   //device
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.device'
//                ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//        if (err || !result) {
//            console.log(err);
//            db.close();
//            return;} //end of function

//        resultSet.push({'_id' : 'device', 'value' : result});
//        dbCloseConnection();
//     });

//   //platform
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.platform'
//                ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//        if (err || !result) {
//            console.log(err);
//            db.close();
//            return;} //end of function

//        resultSet.push({'_id' : 'platform', 'value' : result});
//        dbCloseConnection();
//     });

//   //operatingSystemVersion
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.operatingSystemVersion'
//                ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//        if (err || !result) {
//            console.log(err);
//            db.close();
//            return;} //end of function

//        resultSet.push({'_id' : 'operatingSystemVersion', 'value' : result});
//        dbCloseConnection();
//     });

//   //appVersion
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.appVersion'
//                ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//        if (err || !result) {
//            console.log(err);
//            db.close();
//            return;} //end of function

//        resultSet.push({'_id' : 'appVersion', 'value' : result});
//        dbCloseConnection();
//     });

//   //carrier
//   connectionCount++;
//   db.collection('device_details_temp').aggregate
//     ({$group : {'_id' : '$_id.carrier'
//                ,'Unique_User_Count' : {$sum : '$Unique_User_Count'}}}
//      ,function (err , result) {
//        if (err || !result) {
//            console.log(err);
//            db.close();
//            return;} //end of function

//        resultSet.push({'_id' : 'carrier', 'value' : result});
//        dbCloseConnection();
//        return resultSet;
       
//     });
// } //end of function writeResult
