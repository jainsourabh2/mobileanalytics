var express     = require('express');        // call express
var app         = express();
var mongojs     = require('mongojs');
var Event       = require('../models/event');
var router      = express.Router();              // get an instance of the express Router
var config      = require('../../config/config');
var mongoUtil   = require('../../connection/MongoUtil' );

var db = mongoUtil.getDbMongoJS();

var eventCollection             = db.collection(config.tbl_usereventinfo);

router.route('/data/event')

    // Add Event Record (accessed at POST http://localhost/api/post/event)
    .post(function(req, res) {

  function readResult(result) {
    var hourArray = new Array();
    var dayArray = new Array();
    var weekArray = new Array();
    var monthArray = new Array();

    function addEvent(){
      var eventRecord = {};
      eventRecord['name'] = eventName;
      eventRecord['value'] = 1;
      return eventRecord;
      } // end of function addEvent

    function buildArray(eventArray){
      var eventFound = 0;
      var newArray = new Array();

      for (var i=0; i<eventArray.length; i++) {
        var eventRecord = eventArray[i];

        if (eventRecord.name == eventName) {
          eventFound = 1;
          //console.log('Found');
          var updateRecord = {};
          updateRecord['name'] = eventRecord.name;
          updateRecord['value'] = eventRecord.value + 1;
          newArray.push(updateRecord);  }
        else newArray.push(eventRecord);
        } // end of FOR loop

      if (eventFound == 0) newArray.push(addEvent());

      return newArray;
      } // end of function buildArray

    if (result.length == 0) {
      hourArray.push(addEvent());
      dayArray.push(addEvent());
      weekArray.push(addEvent());
      monthArray.push(addEvent());
      } // end of IF condition to check if the result is empty
    else {
      if (typeof(result[0][eventHour]) == 'undefined') hourArray.push(addEvent());
      else hourArray = buildArray(result[0][eventHour]);

      if (typeof(result[0][eventDay]) == 'undefined') dayArray.push(addEvent());
      else dayArray = buildArray(result[0][eventDay]);

      if (typeof(result[0][eventWeek]) == 'undefined') weekArray.push(addEvent());
      else weekArray = buildArray(result[0][eventWeek]);

      if (typeof(result[0][eventMonth]) == 'undefined') monthArray.push(addEvent());
      else monthArray = buildArray(result[0][eventMonth]);
      } // end of ELSE condition to check if the result is empty

    updateQuery[eventHour] = hourArray;
    updateQuery[eventDay] = dayArray;
    updateQuery[eventWeek] = weekArray;
    updateQuery[eventMonth] = monthArray;

    updateQuery['lr'] = req.body.res;
    updateQuery['lo'] = req.body.ori;
    updateQuery['lm'] = req.body.mnu;
    updateQuery['lt'] = req.body.dt;
    updateQuery['ld'] = req.body.dev;
    updateQuery['lp'] = req.body.pf;
    updateQuery['lov'] = req.body.osv;
    updateQuery['lav'] = req.body.avn;
    //last city to be coded
    updateQuery['lc'] = req.body.c;

    eventCollection.update(
      {'_id' : req.body.did}
      ,{$set : updateQuery}
      ,{upsert : true}
      ); //End of eventCollection.update
   // db.close();
  } //end of function readResult

//        process.env.TZ = 'Asia/Kolkata';
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

        var evt         = new Event();      // create a new instance of the Event model
        evt.uid       = req.body.uid;
        evt.dev       = req.body.dev;
        evt.mnu       = req.body.mnu;
        evt.pf        = req.body.pf;
        evt.avn       = req.body.avn;
        evt.dt        = req.body.dt;
        evt.nwk       = req.body.nwk;
        evt.c         = req.body.c;
        evt.ori       = req.body.ori;
        evt.did       = req.body.did;
        evt.lng       = req.body.lng;
        evt.lat       = req.body.lat;
        evt.osv       = req.body.osv;
        evt.lv        = req.body.lv;
        evt.sid       = req.body.sid;
        evt.rtc       = req.body.rtc;
        evt.res       = req.body.res;
        evt.akey      = req.body.akey;
        evt.key       = req.body.key;
        evt.keypro    = req.body.keypro;

  var eventName = req.body.key;
  var eventProp = req.body.keypro;

        // save the begin and check for errors
        evt.save(function(err) {
            if (err)
                res.send(err);
            //console.log(req.header('x-forwarded-for'));
            res.json({ status:200,message: 'Event Message Added!' });
        });

  var eventHour = 'EH' + hourFormat;
  var eventDay = 'ED' + dayFormat;
  var eventWeek = 'EW' + weekFormat;
  var eventMonth = 'EM' + monthFormat;

  var updateQuery = {};

  //Form findQuery to select the Event Day, Week and Month columns only
  var findQuery = {};
  findQuery[eventHour] = 1;
  findQuery[eventDay] = 1;
  findQuery[eventWeek] = 1;
  findQuery[eventMonth] = 1;

  eventCollection.find(
    {'_id' : req.body.did}
    ,findQuery
    ,function (err , result) {
       if (err || !result) {
           console.log(err);
           db.close();
           return;}

       readResult(result);
    }); //End of eventCollection.find



    })

module.exports = router;
