// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var Hapi 	= require('hapi');
var express    	= require('express');        // call express
var app        	= express();                 
var bodyParser 	= require('body-parser');
var Begin      	= require('./app/models/begin');
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

router.route('/postanalyticsdata')

    // Add Begin Record (accessed at POST http://localhost/api/postanalyticsdata)
    .post(function(req, res) {
        
        var begin = new Begin();      // create a new instance of the Begin model
        begin.name = req.body.name;  // set the name (comes from the request)
	begin.uid = req.body.uid;
	begin.pf = req.body.pf;
        begin.dt = req.body.dt;
        begin.mnu = req.body.mnu;
        begin.avn = req.body.avn;

        // save the bear and check for errors
        begin.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Begin Message Added!' });
        });
        
    })

    // get all the begins (accessed at GET http://localhost/api/postanalyticsdata)
    .get(function(req, res) {
        Begin.find(function(err, rows) {
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
