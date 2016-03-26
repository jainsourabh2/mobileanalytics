var express     = require('express');        // call express
var app         = express();
var mongojs     = require('mongojs');
var Begin       = require('../models/begin');
var router      = express.Router();              // get an instance of the express Router
var config      = require('../../config/config');
var init        = require('../common/init');
var mongoUtil   = require('../../connection/MongoUtil' );
var geoip = require('geoip-lite');

//var db = mongoUtil.getDbMongoJS();

//var sessionCollection           = db.collection(config.tbl_usersessioninfo);
//var tickerCollection            = db.collection(config.tbl_realtime_data);
//var hourlySessionCollection     = db.collection(config.tbl_userhourlysessioninfo);

var geo;
var city;
var country;
var latitude;
var longitude;


router.route('/data/B')

    // Add Begin Record (accessed at POST http://localhost:8080/api/data/B)
    .post(function(req, res) {

  //req.body.rtc = parseInt(req.body.rtc) + 19800;
		
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
                                  ,'lci' : city
                                  ,'lcn' : country
                                  ,'lla' : latitude
                                  ,'llo' : longitude
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
                                ,'lci' : city
                                ,'lcn' : country
                                ,'lla' : latitude
                                ,'llo' : longitude
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
                                  ,'lci' : city
                                  ,'lcn' : country
                                  ,'lla' : latitude
                                  ,'llo' : longitude
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
                                ,'lci' : city
                                ,'lcn' : country
                                ,'lla' : latitude
                                ,'llo' : longitude
                                ,'lc' : req.body.c
                                ,'ll' : sessionBeginTime}};
    };

	
	//For both Session Begin and End, derive day, week and month
	var sessionBeginTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
	sessionBeginTime.setUTCSeconds(req.body.rtc);
//        sessionBeginTime.setTimezone("Asia/Kolkata");

        console.log(req.body.rtc);
        console.log(sessionBeginTime);

        var db = mongojs(config.connectionstring + req.body.akey);
        console.log('db value:' + db);

        var sessionCollection           = db.collection(config.tbl_usersessioninfo);
        var tickerCollection            = db.collection(config.tbl_realtime_data);
        var hourlySessionCollection     = db.collection(config.tbl_userhourlysessioninfo);

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

        console.log(secondEpoch);
	
	var begin       = new Begin();      // create a new instance of the Begin model
	begin.uid       = req.body.uid;
	begin.dev       = req.body.dev;
	begin.mnu       = req.body.mnu;
	begin.pf        = req.body.pf;
	begin.avn       = req.body.avn;
	begin.dt        = req.body.dt;
	begin.nwk       = req.body.nwk;
	begin.c         = req.body.c;
	begin.ori       = req.body.ori;
	begin.did       = req.body.did;
	begin.lng       = req.body.lng;
	begin.lat       = req.body.lat;
	begin.osv       = req.body.osv;
	begin.lv        = req.body.lv;
	begin.sid       = req.body.sid;
	begin.rtc       = req.body.rtc;
	begin.res       = req.body.res;
        begin.ip        = req.headers['x-forwarded-for']||req.connection.remoteAddress;
        begin.akey      = req.body.akey;

        var IPAddress = req.headers['x-forwarded-for']||req.connection.remoteAddress;
        geo = geoip.lookup(IPAddress);
        if (geo.city == '') city = 'Unknown'; else city = geo.city;
        if (geo.country == 'IN') country = 'India'; else country = geo.country;
        latitude = geo.ll[0];
        longitude = geo.ll[1];

	// save the begin and check for errors
	begin.save(function(err) {
		if (err)
			res.send(err);

		//res.json({ message: 'Begin Message Added!' });
	});

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

	res.json({ message: 'Begin Message Added!' });	
    })

    // get all the begins (accessed at GET http://localhost/api/post/B)
    .get(function(req, res) {
        Begin.find(function(err, rows) {
            if (err)
                res.send(err);

            res.json(rows);
        });
     });
module.exports = router;
