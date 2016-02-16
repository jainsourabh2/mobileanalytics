// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    	= require('express');        // call express
var app        	= express();                 
var bodyParser 	= require('body-parser');
var mongoose   	= require('mongoose');
var config		= require('./config/config');
var mongoUtil 	= require( './connection/MongoUtil' );

//Connection to Mongoose
mongoose.connect(config.connectionstring);

//Connection to MongoDB
mongoUtil.connectToMongoJSServer(function( err ){
	console.log("MongoJS Errors "+ err);
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || config.port;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Added to perform validation if any required');
    next(); // make sure we go to the next routes and don't stop here
});

// Integrating our application APIs
app.use('/api',require('./app/routes/begin'));
app.use('/api',require('./app/routes/end'));
app.use('/api',require('./app/routes/crash'));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);
