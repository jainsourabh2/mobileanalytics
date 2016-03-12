//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');


module.exports.deviceusersbycities = function(req,res){

  var startDate,endDate,frequency,istest;;
  var data;
  console.log("deviceusersbycities code is called");
  startDate = parseInt(req.query["param1"])/1000;
  endDate = parseInt(req.query["param2"])/1000;
  frequency = req.query["param3"];
  istest = req.query["param4"];

  //Temporarily hard coded as 1. This can be controlled from client side until code is stable
  istest = 1;

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
                      {"cityname":"DELHI","country":"INDIA","totnumberofusers":"2500","lat":"29.01","lon":"77.38"},
                 ];
      }

  }
  else
  {
    //Kunal write your code over here. Also make istest variable as zero so that your code is called.
  }

  return res.json(data);
} //end of function sessioncounts

