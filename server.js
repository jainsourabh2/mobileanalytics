// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var Hapi 	= require('hapi');
var express    	= require('express');        // call express
var app        	= express();                 
var bodyParser 	= require('body-parser');
var Begin      	= require('./app/models/begin');
var End      	= require('./app/models/end');
var mongoose   	= require('mongoose');

//Connection to MongoDB
mongoose.connect('mongodb://localhost/analytics');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9090;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Added to perform validation if any required');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Testing123' });   
});

// more routes for our API will happen here

router.route('/data/B')

    // Add Begin Record (accessed at POST http://localhost/api/postanalyticsdata)
    .post(function(req, res) {
        
        var begin 	= new Begin();      // create a new instance of the Begin model
	begin.uid 	= req.body.uid;
        begin.dev 	= req.body.dev;
        begin.mnu 	= req.body.mnu;
        begin.pf 	= req.body.pf;
        begin.avn 	= req.body.avn;
        begin.dt 	= req.body.dt;
        begin.nwk 	= req.body.nwk;
        begin.c 	= req.body.c;
        begin.ori 	= req.body.ori;
        begin.did 	= req.body.did;
        begin.lng	= req.body.lng;
        begin.lat 	= req.body.lat;
        begin.osv 	= req.body.osv;
	begin.lv 	= req.body.lv;
        begin.sid 	= req.body.sid;
        begin.stc 	= req.body.rtc;
        begin.res 	= req.body.res;

        // save the begin and check for errors
        begin.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Begin Message Added!' });
        });
        
    })

    // get all the begins (accessed at GET http://localhost/api/post/B)
    .get(function(req, res) {
        Begin.find(function(err, rows) {
            if (err)
                res.send(err);

            res.json(rows);
        });
    });


router.route('/data/E')

    // Add Begin Record (accessed at POST http://localhost/api/post/E)
    .post(function(req, res) {
        
        var end 	= new End();      // create a new instance of the Begin model
	end.uid 	= req.body.uid;
        end.dev 	= req.body.dev;
        end.mnu 	= req.body.mnu;
        end.pf 		= req.body.pf;
        end.avn 	= req.body.avn;
        end.dt 		= req.body.dt;
        end.nwk 	= req.body.nwk;
        end.c 		= req.body.c;
        end.ori 	= req.body.ori;
        end.did 	= req.body.did;
        end.lng		= req.body.lng;
        end.lat 	= req.body.lat;
        end.osv 	= req.body.osv;
	end.lv 		= req.body.lv;
        end.sid 	= req.body.sid;
        end.stc 	= req.body.rtc;
        end.res 	= req.body.res;
	end.ts		= req.body.ts;

        // save the begin and check for errors
        end.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'End Message Added!' });
        });
        
    })

    // get all the begins (accessed at GET http://localhost/api/post/E)
    .get(function(req, res) {
        End.find(function(err, rows) {
            if (err)
                res.send(err);

            res.json(rows);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
