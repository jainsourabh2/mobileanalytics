var mongojs		= require('mongojs');
var config		= require('../../config/config');
var db 			= mongojs(config.connectionstring);
var sessionCollection 		= db.collection(config.tbl_usersessioninfo);
var tickerCollection 		= db.collection(config.tbl_realtime_data);
var eventCollection 		= db.collection(config.tbl_usereventinfo);
var hourlySessionCollection = db.collection(config.tbl_userhourlysessioninfo);
var hourlyEventCollection 	= db.collection(config.tbl_userhourlyeventinfo);

module.exports.init = function(req) {
	
	function insertUser(){
    updateSessionQuery = {$inc : incrementSessionQuery
                          ,$set : {'lr' : req.body.res
                                  ,'lo' : req.body.ori
                                  ,'lm' : req.body.mnu
                                  ,'lt' : req.body.dt
                                  ,'ld' : req.body.dev
                                  ,'lp' : req.body.pf
                                  ,'lov' : req.body.osv
                                  ,'lav' : req.body.avn
                                  //,last city to be coded
                                  ,'lc' : req.body.c
                                  ,'ll' : sessionBeginTime
                                  //,'fl' : activityTime
                                  ,'flh' : hourFormat
                                  ,'fld' : dayFormat
                                  ,'flw' : weekFormat
                                  ,'flm' : monthFormat}};

    updateHourlyQuery = {$inc : incrementHourlyQuery
                        ,$set : {'lr' : req.body.res
                                ,'lo' : req.body.ori
                                ,'lm' : req.body.mnu
                                ,'lt' : req.body.dt
                                ,'ld' : req.body.dev
                                ,'lp' : req.body.pf
                                ,'lov' : req.body.osv
                                ,'lav' : req.body.avn
                                //,last city to be coded
                                ,'lc' : req.body.c
                                ,'ll' : sessionBeginTime
                                ,'flh' : hourFormat}};
    };

  function updateUser(){
    updateSessionQuery = {$inc : incrementSessionQuery
                          ,$set : {'lr' : req.body.res
                                  ,'lo' : req.body.ori
                                  ,'lm' : req.body.mnu
                                  ,'lt' : req.body.dt
                                  ,'ld' : req.body.dev
                                  ,'lp' : req.body.pf
                                  ,'lov' : req.body.osv
                                  ,'lav' : req.body.avn
                                  //,last city to be coded
                                  ,'lc' : req.body.c
                                  ,'ll' : sessionBeginTime}};

    updateHourlyQuery = {$inc : incrementHourlyQuery
                        ,$set : {'lr' : req.body.res
                                ,'lo' : req.body.ori
                                ,'lm' : req.body.mnu
                                ,'lt' : req.body.dt
                                ,'ld' : req.body.dev
                                ,'lp' : req.body.pf
                                ,'lov' : req.body.osv
                                ,'lav' : req.body.avn
                                //,last city to be coded
                                ,'lc' : req.body.c
                                ,'ll' : sessionBeginTime}};
    };
	
	
//For both Session Begin and End, derive day, week and month
	var sessionBeginTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
	sessionBeginTime.setUTCSeconds(req.body.rtc);

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
	
	//Derive Hour and Minutes
	var hh = sessionBeginTime.getHours();
	var mi = sessionBeginTime.getMinutes();
	var ss = sessionBeginTime.getSeconds();

	if (hh<10) {  hh='0'+hh};
	if (mi<10) {  mi='0'+mi};
	if (ss >=0 && ss <15) ss = '15';
	else if (ss >=15 && ss <30) ss = '30';
	else if (ss >=30 && ss <45) ss = '45';
	else {ss = '00'; mi = mi + 1;}

	var hourFormat = '' + yyyy + mm + dd + hh;
	var dayFormat = '' + yyyy + mm + dd;
	var weekFormat = '' + weekyyyy + weekmm + weekdd;
	var monthFormat = '' + yyyy + mm;
	
	var secondEpoch = (new Date(yyyy,mm-1,dd,hh,mi,ss).getTime())/1000;
	
var sessionHour = 'SH'+ hourFormat;
	var sessionDay = 'SD' + dayFormat;
	var sessionWeek = 'SW' + weekFormat;
	var sessionMonth ='SM' + monthFormat;

	var incrementSessionQuery = {};
	incrementSessionQuery[sessionDay] = 1;
	incrementSessionQuery[sessionWeek] = 1;
	incrementSessionQuery[sessionMonth] = 1;

	var incrementHourlyQuery = {};
	incrementHourlyQuery[sessionHour] = 1;

	var updateSessionQuery = {};
	var updateHourlyQuery = {};

  	var incrementQuery = {};
  	incrementQuery[sessionDay] = 1;
  	incrementQuery[sessionWeek] = 1;
  	incrementQuery[sessionMonth] = 1;

  sessionCollection.find({'_id' : req.body.did},
    function (err , result){
      // If the user doesn't exist then set first login time 'fl'
      if (result.length == 0) insertUser();
      //If the user exists then first login time is not changed
      else updateUser();

      tickerCollection.update({'_id' : secondEpoch},{$inc : {count : 1}},{upsert:true});
      sessionCollection.update({'_id' : req.body.did},updateSessionQuery,{upsert:true});
      hourlySessionCollection.update({'_id' : req.body.did},updateHourlyQuery,{upsert:true});
      //db.close();
    }); // End of sessionCollection.find	
}