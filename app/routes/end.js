var express		= require('express');        // call express
var app     	= express();
var End     	= require('../models/end');
var router 		= express.Router();              // get an instance of the express Router
var config		= require('../../config/config');
var mongojs		= require('mongojs');

var db = mongojs(config.connectionstring);
var sessionCollection 		= db.collection(config.tbl_usersessioninfo);
var tickerCollection 		= db.collection(config.tbl_realtime_data);
var eventCollection 		= db.collection(config.tbl_usereventinfo);
var hourlySessionCollection = db.collection(config.tbl_userhourlysessioninfo);
var hourlyEventCollection 	= db.collection(config.tbl_userhourlyeventinfo);

router.route('/data/E')

    // Add Begin Record (accessed at POST http://localhost/api/post/E)
    .post(function(req, res) {

	var end         = new End();      // create a new instance of the Begin model
	end.uid         = req.body.uid;
	end.dev         = req.body.dev;
	end.mnu         = req.body.mnu;
	end.pf          = req.body.pf;
	end.avn         = req.body.avn;
	end.dt          = req.body.dt;
	end.nwk         = req.body.nwk;
	end.c           = req.body.c;
	end.ori         = req.body.ori;
	end.did         = req.body.did;
	end.lng         = req.body.lng;
	end.lat         = req.body.lat;
	end.osv         = req.body.osv;
	end.lv          = req.body.lv;
	end.sid         = req.body.sid;
	end.rtc         = req.body.rtc;
	end.res         = req.body.res;
	end.ts          = req.body.ts;

	// save the begin and check for errors
	end.save(function(err) {
		if (err)
			res.send(err);

//            res.json({ message: 'End Message Added!' });
	});

	var sessionEndTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
	sessionEndTime.setUTCSeconds(req.body.rtc);	

	//Derive Week
	var weekDate = new Date(sessionEndTime);
	var weekBegin = sessionEndTime.getDate() - sessionEndTime.getDay();
	var weekEnd = weekBegin + 6; // last day is the first day + 6
	var weekDay = new Date(weekDate.setDate(weekEnd));

	var weekdd = weekDay.getDate();
	var weekmm = weekDay.getMonth()+1; //January is 0!
	var weekyyyy = weekDay.getFullYear();
	if(weekdd<10) {   weekdd='0'+weekdd};
	if(weekmm<10) {   weekmm='0'+weekmm};
	
	//Derive Day and Month
	var dd = sessionEndTime.getDate();
	var mm = sessionEndTime.getMonth()+1; //January is 0!
	var yyyy = sessionEndTime.getFullYear();
	if(dd<10) {   dd='0'+dd};
	if(mm<10) {   mm='0'+mm};

	//Derive Hour and Minutes
	var hh = sessionEndTime.getHours();
	if (hh<10) {  hh='0'+hh};
	var mi = sessionEndTime.getMinutes();
	if (mi<10) {  mi='0'+mi};
	var ss = sessionEndTime.getSeconds();
	//console.log(ss);
	if (ss >=0 && ss <15) ss = '15';
	else if (ss >=15 && ss <30) ss = '30';
	else if (ss >=30 && ss <45) ss = '45';
	else {ss = '00'; mi = mi + 1;}

	var hourFormat = '' + yyyy + mm + dd + hh;
	var dayFormat = '' + yyyy + mm + dd;
	var weekFormat = '' + weekyyyy + weekmm + weekdd;
	var monthFormat = '' + yyyy + mm;
	
	var timeSpent = req.body.ts;
	var secondEpoch = (new Date(yyyy,mm-1,dd,hh,mi,ss).getTime())/1000;

	var tickerEndEpoch = 0;
	if (timeSpent%15 == 0) tickerEndEpoch = timeSpent;
	else tickerEndEpoch = (timeSpent + 15) - (timeSpent%15);

	//Derive fields to be updated
	var durationHour = 'DH'+ hourFormat;
	var durationDay = 'DD' + dayFormat;
	var durationWeek = 'DW' + weekFormat;
	var durationMonth ='DM' + monthFormat;

	//increment the fields with time spent during the session
	var incrementSessionQuery = {};
	incrementSessionQuery[durationDay] = timeSpent;
	incrementSessionQuery[durationWeek] = timeSpent;
	incrementSessionQuery[durationMonth] = timeSpent;

	var incrementHourlyQuery = {};
	incrementHourlyQuery[durationHour] = timeSpent;

	//update the time spent during the session
	tickerCollection.update({'_id' : secondEpoch + tickerEndEpoch},{$inc : {count : -1}},{upsert:true});
	sessionCollection.update({'_id' : req.body.did }, {$inc : incrementSessionQuery});
	hourlySessionCollection.update({'_id' : req.body.did }, {$inc : incrementHourlyQuery});
//  db.close();

        res.json({ message: 'End Message Added!' });

    })

    // get all the begins (accessed at GET http://localhost/api/post/E)
    .get(function(req, res) {
        End.find(function(err, rows) {
            if (err)
                res.send(err);

            res.json(rows);
        });
    });
module.exports=router 
