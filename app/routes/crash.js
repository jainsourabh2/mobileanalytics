var express             = require('express');        // call express
var app                 = express();
var Crash               = require('../models/crash');
var router = express.Router();              // get an instance of the express Router

router.route('/data/C')

    // Add Crash Record (accessed at POST http://localhost/api/post/C)
    .post(function(req, res) {

        var crash       = new Crash();      // create a new instance of the Begin model
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
        crash.st        = req.body.st;

        // save the begin and check for errors
        crash.save(function(err) {
            if (err)
                res.send(err);
            //console.log(req.header('x-forwarded-for'));
            res.json({ status:200,message: 'Crash Message Added!' });
        });

    })

    // get all the begins (accessed at GET http://localhost/api/post/C)
    .get(function(req, res) {
        Crash.find(function(err, rows) {
            if (err)
                res.send(err);

            res.json(rows);
        });
    });
module.exports = router;
