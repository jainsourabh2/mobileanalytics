//Set the connection details
var mongojs   = require('mongojs');
var config    = require('../../../config/config');

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

  if (frequency == 'Hour') {
     key['CH'] = {$in : matchCondition};
     type['_id'] = '$CH';}
  else if (frequency == 'Day') {
     key['CD'] = {$in : matchCondition};
     type['_id'] = '$CD';}
  else if (frequency == 'Week') {
     key['CW'] = {$in : matchCondition};
     type['_id'] = '$CW';}
  else if (frequency == 'Month') {
     key['CM'] = {$in : matchCondition};
     type['_id'] = '$CM';}

} //end of function matchCriteria

module.exports.crashDetail = function(req,res){

  console.log("crashSummary code is called");
  var startDate,endDate,frequency;
  startDate = parseInt(req.query["param1"])/1000;
  endDate = parseInt(req.query["param2"])/1000;
  frequency = req.query["param3"];
  crashTime = req.query["param4"];
  platform = req.query["param5"];
  OSVersion = req.query["param6"];
  AppVersion = req.query["param7"];

  var db = mongojs(config.connectionstring);

  var key = {};
  var plcondition = {};
  var OSVersionCondition = {};
  var AppVersionCondition = {};

  //console.log(frequency);

  if (frequency == 'Hour')
    key['CH'] = {$in : [crashTime]};
  else if (frequency == 'Day')
    key['CD'] = {$in : [crashTime]};
  else if (frequency == 'Week')
    key['CW'] = {$in : [crashTime]};
  else if (frequency == 'Month')
    key['CM'] = {$in : [crashTime]};

  plcondition['pl'] = {$in : [platform]};
  OSVersionCondition['osv'] = {$in : [OSVersion]};
  AppVersionCondition['ap'] = {$in : [AppVersion]};

  //console.log(key);
  //console.log(OSVersionCondition);
  //console.log(plcondition);
  //console.log(AppVersionCondition);

  db.collection('crash_data').find
    ({$and : [key,OSVersionCondition, plcondition, AppVersionCondition]}
    ).sort({'actT' : 1}
          ,function (err , result) {
             if (err || !result) {
                 console.log(err);
                 db.close();
                 return;} //end of function

             console.log(result);
             db.close();

             return res.json(result);
         });
} //end of function crashDetail

module.exports.crashSummary = function(req,res){

  console.log("crashSummary code is called");
  var startDate,endDate,frequency;
  startDate = parseInt(req.query["param1"])/1000;
  endDate = parseInt(req.query["param2"])/1000;
  frequency = req.query["param3"];

  var db = mongojs(config.connectionstring);
  var key = {};
  var type = {};

  matchCriteria(startDate,endDate,frequency,key,type);

  db.collection('crash_data').aggregate(
    {$match : key}
    ,{$group : {'_id' : {Time : type._id,Platform : '$pl', OSVersion : '$osv', AppVersion : '$ap'}
                ,'Total_Crash_Count' : {$sum : 1}
              }}
//    ,{$sort : {'Total_Event_Count' : -1}}
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

/*var startDate = 1455348048;
var endDate   = 1455348048 + 10000;
var frequency = 'Day';
var crashTime = '20160213';
var platform = 'Android';
var OSVersion = '1.0';
var AppVersion = '1.0';

//crashSummary();
crashDetail();*/
