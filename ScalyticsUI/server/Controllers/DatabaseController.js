//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');

var db6 = mongojs(config.connectionstring);

//var databaseurl = 'test';
//var db = mongojs(databaseurl);

// function matchCriteria(startDate, endDate, frequency, key, type)
// {
//   var increment = 0;
//   var matchCondition = [];

//   for(var i = startDate; i<=endDate; i=i+increment)
//   {
//     var matchField = new Date(0); // The 0 there is the key, which sets the date to the epoch
//     matchField.setUTCSeconds(i);

//     //Derive Day and Month
//     var dd = matchField.getDate();
//     var mm = matchField.getMonth()+1; //January is 0!
//     var yyyy = matchField.getFullYear();
//     if(dd<10) {   dd='0'+dd};
//     if(mm<10) {   mm='0'+mm};

//     //Derive Week
//     var weekDate = new Date(matchField);
//     var weekBegin = matchField.getDate() - matchField.getDay();
//     var weekEnd = weekBegin + 6; // last day is the first day + 6
//     var weekDay = new Date(weekDate.setDate(weekEnd));

//     var weekdd = weekDay.getDate();
//     var weekmm = weekDay.getMonth()+1; //January is 0!
//     var weekyyyy = weekDay.getFullYear();
//     if(weekdd<10) {   weekdd='0'+weekdd};
//     if(weekmm<10) {   weekmm='0'+weekmm};

//     //Derive Hour and Minutes
//     var hh = matchField.getHours();
//     if (hh<10) {  hh='0'+hh};

//     var hourKey = '' + yyyy + mm + dd + hh;
//     var dayKey = '' + yyyy + mm + dd;
//     var weekKey = '' + weekyyyy + weekmm + weekdd;
//     var monthKey = '' + yyyy + mm;

//     if (frequency == 'Hour') {
//       increment = (60*60);
//       matchCondition.push(hourKey);}
//     else if (frequency == 'Day') {
//       increment = (60*60*24);
//       matchCondition.push(dayKey);}
//     else if (frequency == 'Week') {
//       increment = (60*60*24*7);
//       matchCondition.push(weekKey);}
//     else if (frequency == 'Month') {
//       increment = (60*60*24*28);
//       matchCondition.push(monthKey);}

//   } //End of 'for' loop

//   key['_id.key'] = {$in : matchCondition};
//   type['_id.type'] = {$in : [frequency]};

// } //end of function matchCriteria
// function projectCriteria(startDate, endDate, frequency, projectQuery)
// {
//   var increment = 0;

//   for(var i = startDate; i<=endDate; i=i+increment)
//   {
//     var matchField = new Date(0); // The 0 there is the key, which sets the date to the epoch
//     matchField.setUTCSeconds(i);

//     //Derive Day and Month
//     var dd = matchField.getDate();
//     var mm = matchField.getMonth()+1; //January is 0!
//     var yyyy = matchField.getFullYear();
//     if(dd<10) {   dd='0'+dd};
//     if(mm<10) {   mm='0'+mm};

//     //Derive Week
//     var weekDate = new Date(matchField);
//     var weekBegin = matchField.getDate() - matchField.getDay();
//     var weekEnd = weekBegin + 6; // last day is the first day + 6
//     var weekDay = new Date(weekDate.setDate(weekEnd));

//     var weekdd = weekDay.getDate();
//     var weekmm = weekDay.getMonth()+1; //January is 0!
//     var weekyyyy = weekDay.getFullYear();
//     if(weekdd<10) {   weekdd='0'+weekdd};
//     if(weekmm<10) {   weekmm='0'+weekmm};

//     //Derive Hour and Minutes
//     var hh = matchField.getHours();
//     if (hh<10) {  hh='0'+hh};

//     var hourKey = '' + yyyy + mm + dd + hh;
//     var dayKey = '' + yyyy + mm + dd;
//     var weekKey = '' + weekyyyy + weekmm + weekdd;
//     var monthKey = '' + yyyy + mm;

//     if (frequency == 'Day') {
//       increment = (60*60*24);
//       projectQuery['value.' + dayKey] = 1;}
//     else if (frequency == 'Week') {
//       increment = (60*60*24*7);
//       projectQuery['value.' + weekKey] = 1}
//     else if (frequency == 'Month') {
//       increment = (60*60*24*28);
//       projectQuery['value.' + monthKey] = 1}

//   } //End of 'for' loop
// } //end of function matchCriteria


// module.exports.usersplit = function(req,res){

//  var start,end,selectedfrequency,istest;
//  var data;
//   console.log("usersplit code is called");
//   start = parseInt(req.query["param1"])/1000;
//   end = parseInt(req.query["param2"])/1000;
//   selectedfrequency = req.query["param3"];
//   istest = req.query["param4"];
//   var key = {};
//   var type = {};

//   if(istest == 0)
//   {
//     db1 = mongojs(databaseurl);
//   //  start = 1420204195 + (86400*150);
//    // end = start + (86400*30);
//    // selectedfrequency = 'Day';

//     matchCriteria(start,end,selectedfrequency,key,type);

//     db1.collection('agg_session_data').aggregate(
//        {$match : {$and : [key,type]}}
//        ,{$unwind : '$value'}
//        ,{$group : {'_id' : '$value._id.key'
//                    ,'New_User_Count' : {$sum : '$value.New_User_Count'}
//                    ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
                   
//                   }}
//       ,{$sort : {'_id' : 1}}
//              ,function (err , result) {
//                 if (err || !result) {
//                     console.log(err);
//                     db1.close();
//                     return;} //end of function
//                   data = result;
//                 console.log(result);
//                 db1.close();
//                 return res.json(result);
//             });

//     // console.log("database is called");
//     // console.log(data);
//     }
//     else
//     {
//      if(selectedfrequency == "Day")
//         {
//           data = [ 
//               {_id:"20151001",New_User_Count:"628",Unique_User_Count:"33"},
//               {_id:"20151002",New_User_Count:"530",Unique_User_Count:"27"},
//               {_id:"20151003",New_User_Count:"456",Unique_User_Count:"31"},
//               {_id:"20151004",New_User_Count:"312",Unique_User_Count:"29"},
//               {_id:"20151005",New_User_Count:"567",Unique_User_Count:"19"},
//               {_id:"20151006",New_User_Count:"413",Unique_User_Count:"13"},
//               {_id:"20151007",New_User_Count:"300",Unique_User_Count:"18"}
//            ];
//          }

//         if(selectedfrequency == "Month")
//         {
//           data = [ 
//               {_id:"201410",New_User_Count:"628",Unique_User_Count:"33"},
//               {_id:"201412",New_User_Count:"530",Unique_User_Count:"27"},
//               {_id:"201502",New_User_Count:"456",Unique_User_Count:"31"},
//               {_id:"201504",New_User_Count:"312",Unique_User_Count:"29"},
//               {_id:"201508",New_User_Count:"567",Unique_User_Count:"19"},
//               {_id:"201509",New_User_Count:"413",Unique_User_Count:"13"},
//               {_id:"201510",New_User_Count:"300",Unique_User_Count:"18"}
//            ];
//          }

//         if(selectedfrequency == "Week")
//         {
//           data = [ 
//                 {_id:"20150906",New_User_Count:"500",Unique_User_Count:"24"},
//                 {_id:"20150913",New_User_Count:"530",Unique_User_Count:"27"},
//                 {_id:"20150920",New_User_Count:"412",Unique_User_Count:"27"},
//                 {_id:"20150927",New_User_Count:"456",Unique_User_Count:"31"},
//                 {_id:"20151004",New_User_Count:"628",Unique_User_Count:"33"},
//                 {_id:"20151011",New_User_Count:"312",Unique_User_Count:"29"},
//                 {_id:"20151018",New_User_Count:"567",Unique_User_Count:"19"},
//                 {_id:"20151025",New_User_Count:"300",Unique_User_Count:"10"},
//                 {_id:"20151101",New_User_Count:"413",Unique_User_Count:"13"}
//              ];
//         }

//         if(selectedfrequency == "Hour")
//         {
//           data = [ 
//                 {_id:"2015100700",New_User_Count:"500",Unique_User_Count:"24"},
//                 {_id:"2015100701",New_User_Count:"530",Unique_User_Count:"27"},
//                 {_id:"2015100703",New_User_Count:"456",Unique_User_Count:"31"},
//                 {_id:"2015100704",New_User_Count:"628",Unique_User_Count:"33"},
//                 {_id:"2015100707",New_User_Count:"312",Unique_User_Count:"29"},
//                 {_id:"2015100708",New_User_Count:"567",Unique_User_Count:"19"},
//                 {_id:"2015100709",New_User_Count:"300",Unique_User_Count:"10"},
//                 {_id:"2015100712",New_User_Count:"413",Unique_User_Count:"13"},
//                 {_id:"2015100718",New_User_Count:"300",Unique_User_Count:"18"},
//                 {_id:"2015100719",New_User_Count:"234",Unique_User_Count:"45"}
//              ];
//         }
//         return res.json(data);
//     }

// }

// module.exports.sessioncounts = function(req,res){

//  var start,end,selectedfrequency,istest;
//  var data;
//   console.log("sessioncounts code is called");
//   start = parseInt(req.query["param1"])/1000;
//   end = parseInt(req.query["param2"])/1000;
//   selectedfrequency = req.query["param3"];
//   istest = req.query["param4"];
//   var key = {};
//   var type = {};

//   if(istest == 0)
//   {
//     db2 = mongojs(databaseurl);
//   //  start = 1420204195 + (86400*150);
//    // end = start + (86400*30);
//    // selectedfrequency = 'Day';

//     matchCriteria(start,end,selectedfrequency,key,type);

//   db2.collection('agg_session_data').aggregate(
//     {$match : {$and : [key,type]}}
//     ,{$unwind : '$value'}
//     ,{$group : {'_id' : '$value._id.key'
//                 ,'Non_Unique_User_Count' : {$sum : '$value.Non_Unique_User_Count'}
//                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
//                }}
//     ,{$sort : {'_id' : 1}}
//           ,function (err , result) {
//              if (err || !result) {
//                  console.log(err);
//                  db2.close();
//                  return;} //end of function

//              console.log(result);
//              db2.close();
//              return res.json(result);
//          });

//     // console.log("database is called");
//     // console.log(data);
//     }
//     else
//     {
//         if(selectedfrequency == "Day")
//         {
//           data = [ 
//               {_id:"20151001",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
//               {_id:"20151002",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
//               {_id:"20151003",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
//               {_id:"20151004",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
//               {_id:"20151005",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
//               {_id:"20151006",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
//               {_id:"20151007",Non_Unique_User_Count:"300",Unique_User_Count:"18"}
//            ];
//          }

//         if(selectedfrequency == "Month")
//         {
//           data = [ 
//               {_id:"201410",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
//               {_id:"201412",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
//               {_id:"201502",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
//               {_id:"201504",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
//               {_id:"201508",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
//               {_id:"201509",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
//               {_id:"201510",Non_Unique_User_Count:"300",Unique_User_Count:"18"}
//            ];
//          }

//         if(selectedfrequency == "Week")
//         {
//           data = [ 
//                 {_id:"20150906",Non_Unique_User_Count:"500",Unique_User_Count:"24"},
//                 {_id:"20150913",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
//                 {_id:"20150920",Non_Unique_User_Count:"412",Unique_User_Count:"27"},
//                 {_id:"20150927",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
//                 {_id:"20151004",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
//                 {_id:"20151011",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
//                 {_id:"20151018",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
//                 {_id:"20151025",Non_Unique_User_Count:"300",Unique_User_Count:"10"},
//                 {_id:"20151101",Non_Unique_User_Count:"413",Unique_User_Count:"13"}
//              ];
//         }

//         if(selectedfrequency == "Hour")
//         {
//           data = [ 
//                 {_id:"2015100700",Non_Unique_User_Count:"500",Unique_User_Count:"24"},
//                 {_id:"2015100701",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
//                 {_id:"2015100703",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
//                 {_id:"2015100704",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
//                 {_id:"2015100707",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
//                 {_id:"2015100708",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
//                 {_id:"2015100709",Non_Unique_User_Count:"300",Unique_User_Count:"10"},
//                 {_id:"2015100712",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
//                 {_id:"2015100718",Non_Unique_User_Count:"300",Unique_User_Count:"18"},
//                 {_id:"2015100719",Non_Unique_User_Count:"234",Unique_User_Count:"45"}
//              ];
//         }

//         return res.json(data);
//     }

// }

// module.exports.sessionduration = function(req,res){

//  var start,end,selectedfrequency,istest;
//  var data;
//   console.log("sessionduration code is called");
//   start = parseInt(req.query["param1"])/1000;
//   end = parseInt(req.query["param2"])/1000;
//   selectedfrequency = req.query["param3"];
//   istest = req.query["param4"];
//   console.log("istest value:" + istest);
//   var key = {};
//   var type = {};

//   if(istest == 0)
//   {
//     db3 = mongojs(databaseurl);
//   //  start = 1420204195 + (86400*150);
//    // end = start + (86400*30);
//    // selectedfrequency = 'Day';

//     matchCriteria(start,end,selectedfrequency,key,type);

//     db3.collection('agg_session_data').aggregate(
//        {$match : {$and : [key,type]}}
//        ,{$unwind : '$value'}
//        ,{$group : {'_id' : '$value._id.key'
//                    ,'Total_Time_Spent' : {$sum : '$value.Total_Time_Spent'}
//                    ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
//                   }}
//         ,{$sort : {'_id' : 1}}
//                ,function (err , result) {
//                   if (err || !result) {
//                       console.log(err);
//                       db3.close();
//                       return;} //end of function
//                     data = result;
//                   console.log(result);
//                   db3.close();
//                   return res.json(result);
//               });

//     // console.log("database is called");
//     // console.log(data);
//     }
//     else
//     {
//         if(selectedfrequency == "Day")
//         {
//           data = [ 
//               {date:"20151001",Total_Time_Spent:"628",Unique_User_Count:"33"},
//               {date:"20151002",Total_Time_Spent:"530",Unique_User_Count:"27"},
//               {date:"20151003",Total_Time_Spent:"456",Unique_User_Count:"31"},
//               {date:"20151004",Total_Time_Spent:"312",Unique_User_Count:"29"},
//               {date:"20151005",Total_Time_Spent:"567",Unique_User_Count:"19"},
//               {date:"20151006",Total_Time_Spent:"413",Unique_User_Count:"13"},
//               {date:"20151007",Total_Time_Spent:"300",Unique_User_Count:"18"}
//            ];
//          }

//         if(selectedfrequency == "Month")
//         {
//           data = [ 
//               {date:"201410",Total_Time_Spent:"628",Unique_User_Count:"33"},
//               {date:"201412",Total_Time_Spent:"530",Unique_User_Count:"27"},
//               {date:"201502",Total_Time_Spent:"456",Unique_User_Count:"31"},
//               {date:"201504",Total_Time_Spent:"312",Unique_User_Count:"29"},
//               {date:"201508",Total_Time_Spent:"567",Unique_User_Count:"19"},
//               {date:"201509",Total_Time_Spent:"413",Unique_User_Count:"13"},
//               {date:"201510",Total_Time_Spent:"300",Unique_User_Count:"18"}
//            ];
//          }

//         if(selectedfrequency == "Week")
//         {
//           data = [ 
//                 {date:"20150906",Total_Time_Spent:"500",Unique_User_Count:"24"},
//                 {date:"20150913",Total_Time_Spent:"530",Unique_User_Count:"27"},
//                 {date:"20150920",Total_Time_Spent:"412",Unique_User_Count:"27"},
//                 {date:"20150927",Total_Time_Spent:"456",Unique_User_Count:"31"},
//                 {date:"20151004",Total_Time_Spent:"628",Unique_User_Count:"33"},
//                 {date:"20151011",Total_Time_Spent:"312",Unique_User_Count:"29"},
//                 {date:"20151018",Total_Time_Spent:"567",Unique_User_Count:"19"},
//                 {date:"20151025",Total_Time_Spent:"300",Unique_User_Count:"10"},
//                 {date:"20151101",Total_Time_Spent:"413",Unique_User_Count:"13"}
//              ];
//         }

//         if(selectedfrequency == "Hour")
//         {
//           data = [ 
//                 {date:"2015100700",Total_Time_Spent:"500",Unique_User_Count:"24"},
//                 {date:"2015100701",Total_Time_Spent:"530",Unique_User_Count:"27"},
//                 {date:"2015100703",Total_Time_Spent:"456",Unique_User_Count:"31"},
//                 {date:"2015100704",Total_Time_Spent:"628",Unique_User_Count:"33"},
//                 {date:"2015100707",Total_Time_Spent:"312",Unique_User_Count:"29"},
//                 {date:"2015100708",Total_Time_Spent:"567",Unique_User_Count:"19"},
//                 {date:"2015100709",Total_Time_Spent:"300",Unique_User_Count:"10"},
//                 {date:"2015100712",Total_Time_Spent:"413",Unique_User_Count:"13"},
//                 {date:"2015100718",Total_Time_Spent:"300",Unique_User_Count:"18"},
//                 {date:"2015100719",Total_Time_Spent:"234",Unique_User_Count:"45"}
//              ];
//         }

 
//         return res.json(data);
//     }

// }

// module.exports.returninguserretention = function(req,res){

//  var start,end,selectedfrequency,istest;
//  var data;
//   console.log("returninguserretention code is called");
//   start = parseInt(req.query["param1"])/1000;
//   end = parseInt(req.query["param2"])/1000;
//   selectedfrequency = req.query["param3"];
//   istest = req.query["param4"];
//   console.log("istest value:" + istest);


//   if(istest == 0)
//   {
//     var key = {};
//     var type = {};
//     var user = {};
//     var projectQuery = {};

//     db4 = mongojs(databaseurl);
//     user['_id.user'] = 'Returning';
//   //  start = 1420204195 + (86400*150);
//    // end = start + (86400*30);
//    // selectedfrequency = 'Day';

//     matchCriteria(start,end,selectedfrequency,key,type);
//     projectCriteria(start,end,selectedfrequency,projectQuery);


//           db4.collection('agg_retention_data').find
//             ({$and : [key,type,user]}
//              ,projectQuery
//             ).sort({ '_id.key' : 1}
//                ,function (err , result) {
//                   if (err || !result) {
//                       console.log(err);
//                       db4.close();
//                       return;} //end of function
//                     data = result;
//                   console.log(result);
//                   db4.close();
//                   return res.json(result);
//               });

//     console.log("database is called");
//     console.log(data);
//     }
//     else
//     {
//         if((selectedfrequency == "Day") || (selectedfrequency == "Week"))
//         {
//           data = [ 
//                   { _id: { key: '20150822', type: 'Week', user: 'Returning' },
//                     value: [ {20150822: 10, 20150829: 8, 20150905: 7, 20150912: 5, 20150919: 4} ] },
//                   { _id: { key: '20150829', type: 'Week', user: 'Returning' },
//                     value: [ {20150829: 8, 20150905: 7, 20150912: 5, 20150919: 4} ]  },
//                   { _id: { key: '20150905', type: 'Week', user: 'Returning' },
//                     value: [ {20150905: 7, 20150912: 5, 20150919: 4} ] },
//                   { _id: { key: '20150912', type: 'Week', user: 'Returning' },
//                     value: [ {20150912: 5, 20150919: 4} ] },
//                   { _id: { key: '20150919', type: 'Week', user: 'Returning' },
//                     value: [ {20150919: 4} ] }
//                  ]
//         }
//         else 
//         {

//         }

//         return res.json(data);
//     }

// }

// module.exports.newuserretention = function(req,res){

//  var start,end,selectedfrequency,istest;
//  var data;
//   console.log("newuserretention code  is called");
//   start = parseInt(req.query["param1"])/1000;
//   end = parseInt(req.query["param2"])/1000;
//   selectedfrequency = req.query["param3"];
//   istest = req.query["param4"];
//   console.log("istest value:" + istest);


//   if(istest == 0)
//   {
//     var key = {};
//     var type = {};
//     var user = {};
//     var projectQuery = {};

//     db5 = mongojs(databaseurl);
//     user['_id.user'] = 'New';
//   //  start = 1420204195 + (86400*150);
//    // end = start + (86400*30);
//    // selectedfrequency = 'Day';

//     matchCriteria(start,end,selectedfrequency,key,type);
//     projectCriteria(start,end,selectedfrequency,projectQuery);


//           db5.collection('agg_retention_data').find
//             ({$and : [key,type,user]}
//              ,projectQuery
//             ).sort({ '_id.key' : 1}
//                ,function (err , result) {
//                   if (err || !result) {
//                       console.log(err);
//                       db5.close();
//                       return;} //end of function
//                     data = result;
//                   console.log(result);
//                   db5.close();
//                   return res.json(result);
//               });

//     console.log("database is called");
//     console.log(data);
//     }
//     else
//     {
//         if((selectedfrequency == "Day") || (selectedfrequency == "Week"))
//         {
//           data = [ 
//                   { _id: { key: '20150822', type: 'Week', user: 'Returning' },
//                     value: [ {20150822: 10, 20150829: 8, 20150905: 7, 20150912: 5, 20150919: 4} ] },
//                   { _id: { key: '20150829', type: 'Week', user: 'Returning' },
//                     value: [ {20150829: 8, 20150905: 7, 20150912: 5, 20150919: 4} ]  },
//                   { _id: { key: '20150905', type: 'Week', user: 'Returning' },
//                     value: [ {20150905: 7, 20150912: 5, 20150919: 4} ] },
//                   { _id: { key: '20150912', type: 'Week', user: 'Returning' },
//                     value: [ {20150912: 5, 20150919: 4} ] },
//                   { _id: { key: '20150919', type: 'Week', user: 'Returning' },
//                     value: [ {20150919: 4} ] }
//                  ]
//         }
//         else 
//         {

//         }

//         return res.json(data);
//     }

// }

module.exports.ticker = function(req,res){

 var data;
  console.log("ticker is called");
  var startDateEpoch = parseInt(req.query["param1"])/1000;
  var currentTime = new Date();
  var currentTimeEpoch = Math.round(currentTime.getTime()/1000);

  var resultSet = [];

  db6.collection('real_time_data').find
  ().sort({ '_id' : 1}
   ,function (err , result) {
     if (err || !result) {
              console.log(err);
              db6.close();
              return;}

     db6.close();
     //returnresult(result);
     var arrayItem = {};

      for (var i=0; i<result.length; i++){
        if (i !=0) result[i].count = result[i-1].count + result[i].count;
        arrayItem[result[i]._id] = result[i].count;
      }

      //console.log(arrayItem);

      for (var i=startDateEpoch; i<=currentTimeEpoch; i = i+15){
        if (i == startDateEpoch) {
          if ((arrayItem[i] % 1) != 0) arrayItem[i] = 0;
        }
        else {
          if ((arrayItem[i] % 1) != 0) 
            arrayItem[i] = arrayItem[i-15];
        }
        
        resultSet.push({'_id' : i*1000, 'count' : arrayItem[i]});

      }

        return res.json(resultSet);

  });



}
