//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');

var db = mongojs(config.connectionstring);

function matchCriteria(startDateEpoch, endDateEpoch, frequency, key, type, matchCondition)
{
  var increment = 0;

  for(var i = startDateEpoch; i<=endDateEpoch; i=i+increment)
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

function projectCriteria(startDateEpoch, endDateEpoch, frequency, projectQuery)
{
  var increment = 0;

  for(var i = startDateEpoch; i<=endDateEpoch; i=i+increment)
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

    if (frequency == 'Day') {
      increment = (60*60*24);
      projectQuery['value.' + dayKey] = 1;}
    else if (frequency == 'Week') {
      increment = (60*60*24*7);
      projectQuery['value.' + weekKey] = 1}
    else if (frequency == 'Month') {
      increment = (60*60*24*28);
      projectQuery['value.' + monthKey] = 1}

  } //End of 'for' loop
} //end of function projectCriteria

function generateResult(output,user,frequency,matchCondition,resultSet){

  for (i=0;i<matchCondition.length;i++){
    //console.log(matchCondition[i]);
    var matchfound = 0;
    var resultItem = {};
    for (j=0;j<output.length;j++){
      if (matchCondition[i] == output[j]._id.key) {
        matchfound = 1;
        resultItem['_id'] = output[j]._id;
        resultItem['value'] = output[j].value[0];
      }
    }
    if (matchfound == 0) {
      resultItem['_id'] = {'key' : matchCondition[i]
                          ,'type' : frequency
                          ,'user' : user['_id.user']};
      var valueArray = {};
      for (k=0;k<matchCondition.length;k++){
        if (i <= k) valueArray[matchCondition[k]] = 0;
      }
      resultItem['value'] = valueArray;
    }
    //console.log(resultItem);
    resultSet.push(resultItem);
  }
} //end of function generateResult

module.exports.userretention = function(req,res){

  console.log("userretention code is called");
  var startDateEpoch,endDateEpoch,frequency,userType;  
  var dbname = req.query["param1"];
  startDateEpoch = parseInt(req.query["param2"])/1000;
  endDateEpoch = parseInt(req.query["param3"])/1000;
  frequency = req.query["param4"];
  userType = req.query["param5"];

  var db = mongojs(config.connectionstring + dbname);
  var matchCondition = [];
  var key = {};
  var type = {};  
  var resultSet = [];
  var projectQuery = {};

  var user = {};
  user['_id.user'] = userType;

  matchCriteria(startDateEpoch,endDateEpoch,frequency,key,type,matchCondition);
  projectCriteria(startDateEpoch,endDateEpoch,frequency,projectQuery);

  db.collection('agg_retention_data').find
    ({$and : [key,type,user]}
     ,projectQuery
    ).sort({ '_id.key' : 1}
     ,function (err , result) {
        if (err || !result) {
            console.log(err);
            db.close();
            return;} //end of function

        db.close();
        generateResult(result,user,frequency,matchCondition,resultSet);
        console.log(resultSet);
        return res.json(resultSet);
    });
} //end of function userretention

// module.exports.newuserretention = function(req,res){

//   console.log("newuserretention code  is called");
//   var startDateEpoch,endDateEpoch,frequency;
//   startDateEpoch = parseInt(req.query["param1"])/1000;
//   endDateEpoch = parseInt(req.query["param2"])/1000;
//   frequency = req.query["param3"];
//   var db = mongojs(databaseurl);
//   var matchCondition = [];
//   var key = {};
//   var type = {};
//   var resultSet = [];
//   var projectQuery = {};

//   var user = {};
//   user['_id.user'] = 'New';

//   matchCriteria(startDateEpoch,endDateEpoch,frequency,key,type,matchCondition);
//   projectCriteria(startDateEpoch,endDateEpoch,frequency,projectQuery);

//   db.collection('agg_retention_data').find
//     ({$and : [key,type,user]}
//      ,projectQuery
//     ).sort({ '_id.key' : 1}
//      ,function (err , result) {
//         if (err || !result) {
//             console.log(err);
//             db.close();
//             return;} //end of function

//         db.close();
//         generateResult(result,user,frequency,matchCondition,resultSet);
//         console.log(resultSet);
//         return res.json(resultSet);
//     });
// } //end of function newuserretention
