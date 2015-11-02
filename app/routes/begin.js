var express             = require('express');        // call express
var app                 = express();
var Begin		= require('../models/begin');
var router = express.Router();              // get an instance of the express Router

var collections = ['user_session_info'];
var mongojs= require('mongojs');
var db = mongojs('analytics');
var sessionCollection = db.collection(collections);


router.route('/data/B')

    // Add Begin Record (accessed at POST http://localhost/api/postanalyticsdata)
    .post(function(req, res) {


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

        // save the begin and check for errors
        begin.save(function(err) {
            if (err)
                res.send(err);

            //res.json({ message: 'Begin Message Added!' });
        });

  	var sessionDay = 'SD'+dd+'-'+mm+'-'+yyyy;
 	var sessionMonth ='SM'+mm+'-'+yyyy;
  	var sessionWeek = 'SW'+weekdd+'-'+weekmm+'-'+weekyyyy;
        var durationDay = 'DD'+dd+'-'+mm+'-'+yyyy;
        var durationMonth ='DM'+mm+'-'+yyyy;
        var durationWeek = 'DW'+weekdd+'-'+weekmm+'-'+weekyyyy;

  	var incrementQuery = {};
  	incrementQuery[sessionDay] = 1;
  	incrementQuery[sessionWeek] = 1;
  	incrementQuery[sessionMonth] = 1;
        incrementQuery[durationDay] = 0;
        incrementQuery[durationWeek] = 0;
        incrementQuery[durationMonth] = 0;

  	var updatequery = {$inc : incrementQuery
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
                            	,'ll' : req.body.rtc}};

	//console.log("Reached 10");
  	sessionCollection.find({'_id' : req.body.did},function (err , result){
      	if (result.length == 0){
	sessionCollection.insert({'_id' : req.body.did,'fl' : req.body.rtc});
        sessionCollection.update({"_id" : req.body.did},updatequery);
        //db.close();
        //console.log("Reached 11");
	}
      	else {
        sessionCollection.update({"_id" : req.body.did},updatequery);
        //db.close();
	//console.log("Reached 12");
	}
    	});

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
