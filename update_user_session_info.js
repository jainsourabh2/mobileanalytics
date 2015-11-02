
//Set the connection details
var databaseurl = 'analytics';
var collections = ['user_session_info'];
var mongojs= require('mongojs');
var db = mongojs(databaseurl);
var sessionCollection = db.collection(collections);

//var sessionBegin = randomDate(new Date(2015, 0, 1), new Date());
BeginEpoch = 1420204195 + (86400*182);

var recordType = 'End';
var sessionBeginEpoch = BeginEpoch;
var resolution = '800*1200';
var deviceID = '1';
var orientation = 'potrait';
var deviceManufacturer = 'Samsung';
var deviceType = 'Mobile';
var device = 'gt-2550';
var platform = 'Android';
var operatingSystemVersion = '4.0';
var appVersion = '1.0';
var IPAddress = '172.0.0.1';   //City to be calculated later
var carrier = 'Vodafone';
//var network = 'wifi';

//For both Session Begin and End, derive day, week and month
var sessionBeginTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
sessionBeginTime.setUTCSeconds(sessionBeginEpoch);

//Derive Day and Month
var dd = sessionBeginTime.getDate();
var mm = sessionBeginTime.getMonth()+1; //January is 0!
var yyyy = sessionBeginTime.getFullYear();
if(dd<10) {   dd='0'+dd};
if(mm<10) {   mm='0'+mm};

//Derive Week
var weekDate = new Date(sessionBeginTime);
var weekBegin = sessionBeginTime.getDate() - sessionBeginTime.getDay();
var weekEnd = weekBegin + 6; // last day is the first day + 6
var weekDay = new Date(weekDate.setDate(weekEnd));

var weekdd = weekDay.getDate();
var weekmm = weekDay.getMonth()+1; //January is 0!
var weekyyyy = weekDay.getFullYear();
if(weekdd<10) {   weekdd='0'+weekdd};
if(weekmm<10) {   weekmm='0'+weekmm};

//For Session Begin, check if the document exists
//If does not exist then insert id and first lastLogin, and then update
//Else update
if (recordType == 'Begin')
{
  var sessionDay = 'SD'+dd+'-'+mm+'-'+yyyy;
  var sessionMonth ='SM'+mm+'-'+yyyy;
  var sessionWeek = 'SW'+weekdd+'-'+weekmm+'-'+weekyyyy;

  var incrementQuery = {};
  incrementQuery[sessionDay] = 1;
  incrementQuery[sessionWeek] = 1;
  incrementQuery[sessionMonth] = 1;

  var updatequery = {$inc : incrementQuery
                    ,$set : {'lr' : resolution
                            ,'lo' : orientation
                            ,'lm' : deviceManufacturer
                            ,'lt' : deviceType
                            ,'ld' : device
                            ,'lp' : platform
                            ,'lov' : operatingSystemVersion
                            ,'lav' : appVersion
                            //,last city to be coded
                            ,'lc' : carrier
                            ,'ll' : sessionBeginTime}};

  function insertNewUser(){
    //Insert New user in user_session_info
    sessionCollection.insert({'_id' : deviceID,'fl' : sessionBeginTime});
    //db.close();
    };

  function updateBeginUser(){
    //Update the last login values and increment session count by 1
    sessionCollection.update({"_id" : deviceID},updatequery);
    db.close();
  };

  sessionCollection.find({'_id' : deviceID},
    function (err , result){
      if (result.length == 0){
        insertNewUser();
        updateBeginUser();}
      else {updateBeginUser(); }
    });
}; //End of 'Begin' condition check

if (recordType == 'End')
{
//  var sessionEndEpoch = 1438799650;
//  var sessionEndTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
//  sessionEndTime.setUTCSeconds(sessionEndEpoch);
  var timeSpent = 100;

  //Derive fields to be updated
  var durationDay = 'DD'+dd+'-'+mm+'-'+yyyy;
  var durationMonth ='DM'+mm+'-'+yyyy;
  var durationWeek = 'DW'+weekdd+'-'+weekmm+'-'+weekyyyy;

  //increment the fields with time spent during the session
  var incrementQuery = {};
  incrementQuery[durationDay] = timeSpent;
  incrementQuery[durationWeek] = timeSpent;
  incrementQuery[durationMonth] = timeSpent;

  //update the time spent during the session
  sessionCollection.update({'_id' : deviceID }, {$inc : incrementQuery});
  db.close();
  }

