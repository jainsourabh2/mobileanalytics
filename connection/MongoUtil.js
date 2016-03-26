var config = require('../config/config');
var mongojs		= require('mongojs');
var mongoose   	= require('mongoose');

var _dbMongoJS;
var _dbMongoose;

module.exports = {

  connectToMongoJSServer: function( callback ) {
		var db = mongojs(config.connectionstring + config.dbname)
		_dbMongoJS = db;
        console.log(_dbMongoJS);
  },
 connectToMongooseServer: function( callback ) {
    mongoose.connect( config.connectionstring + config.dbname, function( err, db ) {
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
