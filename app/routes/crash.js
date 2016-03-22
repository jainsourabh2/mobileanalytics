var express     = require('express');        // call express
var app         = express();
var mongojs		= require('mongojs');
var Crash               = require('../models/crash');
var router 		= express.Router();              // get an instance of the express Router
var config		= require('../../config/config');
var mongoUtil 	= require('../../connection/MongoUtil' );

var db = mongoUtil.getDbMongoJS();

var crashCollection 		= db.collection(config.tbl_crash_data);

router.route('/data/C')

    // Add Crash Record (accessed at POST http://localhost/api/post/C)
    .post(function(req, res) {

		var insertQuery = {};	
		
		var activityTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
		activityTime.setUTCSeconds(req.body.rtc);

		//Derive Day and Month
		var dd = activityTime.getDate();
		var mm = activityTime.getMonth()+1; //January is 0!
		var yyyy = activityTime.getFullYear();
		if(dd<10) {   dd='0'+dd};
		if(mm<10) {   mm='0'+mm};

		//Derive Week
		var weekDate = new Date(activityTime);
		var weekBegin = activityTime.getDate() - activityTime.getDay();
		var weekEnd = weekBegin + 6; // last day is the first day + 6
		var weekDay = new Date(weekDate.setDate(weekEnd));

		var weekdd = weekDay.getDate();
		var weekmm = weekDay.getMonth()+1; //January is 0!
		var weekyyyy = weekDay.getFullYear();
		if(weekdd<10) {   weekdd='0'+weekdd};
		if(weekmm<10) {   weekmm='0'+weekmm};

		//Derive Hour and Minutes
		var hh = activityTime.getHours();
		if (hh<10) {  hh='0'+hh};
		var mi = activityTime.getMinutes();
		if (mi<10) {  mi='0'+mi};
		var ss = activityTime.getSeconds();

		if (ss >=0 && ss <15) ss = '15';
		else if (ss >=15 && ss <30) ss = '30';
		else if (ss >=30 && ss <45) ss = '45';
		else {ss = '00'; mi = mi + 1;}

		var hourFormat = '' + yyyy + mm + dd + hh;
		var dayFormat = '' + yyyy + mm + dd;
		var weekFormat = '' + weekyyyy + weekmm + weekdd;
		var monthFormat = '' + yyyy + mm;		
		
		insertQuery = {'actT' : req.body.rtc
			 ,'did' 	: req.body.did
			 ,'res' 	: req.body.res
			 ,'ori' 	: req.body.ori
			 ,'mnu'		: req.body.mnu
			 ,'dt' 		: req.body.dt
			 ,'dev' 	: req.body.dev
			 ,'pf' 		: req.body.pf
			 ,'osv' 	: req.body.osv
			 ,'avn'		: req.body.avn
			 ,'ip' 		: req.body.ip
			 ,'c' 		: req.body.c
			 ,'nwk' 	: req.body.nwk
			 ,'logno' 	: req.body.logno
			 ,'akey' 	: req.body.akey
			 ,'stkt' 	: req.body.stkt
			 ,'stkc' 	: req.body.stkc
			 ,'stkm' 	: req.body.stkm
		   };
		   
	  insertQuery['CH'] = hourFormat;
	  insertQuery['CD'] = dayFormat;
	  insertQuery['CW'] = weekFormat;
	  insertQuery['CM'] = monthFormat;

	  crashCollection.insert(insertQuery);			   

        var crash       = new Crash();      // create a new instance of the Crash model
        crash.uid       = req.body.uid;
        crash.dev       = req.body.dev;
        crash.mnu       = req.body.mnu;
        crash.pf        = req.body.pf;
        crash.avn       = req.body.avn;
        crash.dt        = req.body.dt;
        crash.nwk       = req.body.nwk;
        crash.c         = req.body.c;
        crash.ori       = req.body.ori;
        crash.did       = req.body.did;
        crash.lng       = req.body.lng;
        crash.lat       = req.body.lat;
        crash.osv       = req.body.osv;
        crash.lv        = req.body.lv;
        crash.sid       = req.body.sid;
        crash.rtc       = req.body.rtc;
        crash.res       = req.body.res;
        crash.stkt      = req.body.stkt;
        crash.stkc      = req.body.stkc;
        crash.stkm      = req.body.stkm;
	crash.akey	= req.body.akey;
		
        // save the begin and check for errors
        crash.save(function(err) {
            if (err)
                res.send(err);
            //console.log(req.header('x-forwarded-for'));
            res.json({ status:200,message: 'Crash Message Added!' });
        });
		
		

    })

/*     // get all the begins (accessed at GET http://localhost/api/post/C)
    .get(function(req, res) {
        Crash.find(function(err, rows) {
            if (err)
                res.send(err);

            res.json(rows);
        });
    }); */
module.exports = router;
