var express             = require('express');        // call express
var app                 = express();
var End               = require('../models/end');
var router = express.Router();              // get an instance of the express Router

var collections = ['user_session_info'];
var mongojs= require('mongojs');
var db = mongojs('analytics');
var sessionCollection = db.collection(collections);


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


	//For both Session Begin and End, derive day, week and month
	var sessionEndTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
	sessionEndTime.setUTCSeconds(req.body.rtc);
	//Derive Day and Month
	var dd = sessionEndTime.getDate();
	var mm = sessionEndTime.getMonth()+1; //January is 0!
	var yyyy = sessionEndTime.getFullYear();
	if(dd<10) {   dd='0'+dd};
	if(mm<10) {   mm='0'+mm};


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

	//var timespent = req.body.ts;
  	//Derive fields to be updated
  	var durationDay = 'DD'+dd+'-'+mm+'-'+yyyy;
  	var durationMonth ='DM'+mm+'-'+yyyy;
  	var durationWeek = 'DW'+weekdd+'-'+weekmm+'-'+weekyyyy;

  	//increment the fields with time spent during the session
  	var incrementQuery = {};
  	incrementQuery[durationDay] = parseInt(req.body.ts);
  	incrementQuery[durationWeek] = parseInt(req.body.ts);
  	incrementQuery[durationMonth] = parseInt(req.body.ts);

  	//update the time spent during the session
  	sessionCollection.update({"_id" : req.body.did }, {$inc : incrementQuery});
  	//db.close();

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
