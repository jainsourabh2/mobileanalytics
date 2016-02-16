var config = require('../config/config');
var mongojs		= require('mongojs');
var mongoose   	= require('mongoose');

var _dbMongoJS;
var _dbMongoose;

module.exports = {

  connectToMongoJSServer: function( callback ) {
		var db = mongojs(config.connectionstring)
		_dbMongoJS = db;
  },
 connectToMongooseServer: function( callback ) {
    mongoose.connect( config.connectionstring, function( err, db ) {
      _dbMongoose = db;
      return callback( err );
    } );
  },
  getDbMongoJS: function() {
    return _dbMongoJS;
  },
  getDbMongoose: function() {
    return _dbMongoose;
  }
};