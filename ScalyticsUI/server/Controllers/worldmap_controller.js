//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');

function generateResult(result,res){

  var resultSet = [];

  for(var i=0;i<result.length;i++){
    var arrayItem = {};

    if (result[i]._id.lat != undefined) {
    arrayItem['cityname'] = result[i]._id.cityname;
    arrayItem['country'] = result[i]._id.country;
    arrayItem['totnumberofusers'] = result[i].totnumberofusers;
    arrayItem['lat'] = result[i]._id.lat;
    arrayItem['lon'] = result[i]._id.lon;

    resultSet.push(arrayItem);
    }
  }
  console.log(resultSet);
  return res.json(resultSet);
} //end of function generateResult

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

    var dayKey = '' + yyyy + mm + dd;
    var monthKey = '' + yyyy + mm;

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

module.exports.deviceusersbycities = function(req,res){

  var startDateEpoch,endDateEpoch,frequency,istest;
  console.log("deviceusersbycities code is called");
  var dbname = req.query["param1"];
  startDateEpoch = parseInt(req.query["param2"])/1000;
  endDateEpoch = parseInt(req.query["param3"])/1000;
  frequency = req.query["param4"];
  var db = mongojs(config.connectionstring + dbname);
  var data = [];

  //istest = req.query["param4"];

  //Temporarily hard coded as 1. This can be controlled from client side until code is stable
  istest = 0;

  if(istest==1)
  {

      if((frequency == "Hour") || (frequency == "Day"))
      {
         data = [
                      {"cityname":"ZANZIBAR","country":"TANZANIA","totnumberofusers":"100","lat":"-6.13","lon":"39.31"},
                      {"cityname":"TOKYO","country":"JAPAN","totnumberofusers":"200","lat":"35.68","lon":"139.76"},
                      {"cityname":"AUCKLAND","country":"NEW ZEALAND","totnumberofusers":"300","lat":"-36.85","lon":"174.78"},
                      {"cityname":"BANGKOK","country":"THAILAND","totnumberofusers":"400","lat":"13.75","lon":"100.48"},
                      {"cityname":"DELHI","country":"INDIA","totnumberofusers":"500","lat":"29.01","lon":"77.38"},
                      {"cityname":"SINGAPORE","country":"SINGAPORE","totnumberofusers":"600","lat":"1.36","lon":"103.75"},
                      {"cityname":"BRASILIA","country":"BRAZIL","totnumberofusers":"700","lat":"-15.67","lon":"-47.43"},
                      {"cityname":"RIO DE JANEIRO","country":"BRAZIL","totnumberofusers":"800","lat":"-22.90","lon":"-43.24"},
                      {"cityname":"TORONTO","country":"CANADA","totnumberofusers":"900","lat":"43.64","lon":"-79.40"},
                      {"cityname":"EASTER ISLAND","country":"CHILE","totnumberofusers":"1000","lat":"-27.11","lon":"-109.36"},
                      {"cityname":"SEATTLE","country":"USA","totnumberofusers":"1100","lat":"47.61","lon":"-122.33"}
                 ];
      }
      else
      {
         data = [
                      {"cityname":"ZANZIBAR","country":"TANZANIA","totnumberofusers":"2000","lat":"-6.13","lon":"39.31"},
                      {"cityname":"TOKYO","country":"JAPAN","totnumberofusers":"2200","lat":"35.68","lon":"139.76"},
                      {"cityname":"AUCKLAND","country":"NEW ZEALAND","totnumberofusers":"2300","lat":"-36.85","lon":"174.78"},
                      {"cityname":"BANGKOK","country":"THAILAND","totnumberofusers":"2400","lat":"13.75","lon":"100.48"},
                      {"cityname":"DELHI","country":"INDIA","totnumberofusers":"2500","lat":"29.01","lon":"77.38"}
                 ];
      }

      return res.json(data);
 }
  else
  {    
    var startDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
    startDate.setUTCSeconds(startDateEpoch);

    var endDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
    endDate.setUTCSeconds(endDateEpoch);

    var connectionCount = 0;
    var resultSet = [];

    var matchCondition = [];
    matchCriteria(startDate,endDate,matchCondition);

    console.log(startDate);
    console.log(endDate);
    //console.log(matchCondition);

    var groupQuery = {};
    groupQuery['_id'] = { 'cityname' : '$lci'
                          ,'country' : '$lcn'
                          ,'lat' : '$lla'
                          ,'lon' : '$llo'
                         };

    var sumQuery = {$sum : 1};
    groupQuery['totnumberofusers'] = sumQuery;

    db.collection('user_session_info').aggregate(
      {$match : {$or : matchCondition}}
      ,{$group : groupQuery}
            ,function (err , result) {
               if (err || !result) {
                   console.log(err);
                   db.close();
                   return;} //end of function

               db.close();
               generateResult(result,res);
        });
  }
}

