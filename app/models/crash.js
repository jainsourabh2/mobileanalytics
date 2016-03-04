var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CrashSchema   = new Schema({
	uid	: {type: String,lowercase: true,trim: true},	//UserId if available from the device 
	dev : {type: String,lowercase: true,trim: true},	//Device Model
	mnu : {type: String,lowercase: true,trim: true},	//Manufacturer
	pf  : {type: String,lowercase: true,trim: true},	//Platform
	avn : {type: String,lowercase: true,trim: true},	//Application Version
	dt  : {type: String,lowercase: true,trim: true},	//Device Type
    	nwk : {type: String,lowercase: true,trim: true},	//Network of the Device
    	c   : {type: String,lowercase: true,trim: true},	//Carrier of the Device
    	ori : {type: String,lowercase: true,trim: true},	//Orientation of the Device in which the event was sent
    	did : {type: String,lowercase: true,trim: true},	//Device ID
    	lng : {type: String,lowercase: true,trim: true},	//Longitude of the Location
    	lat : {type: String,lowercase: true,trim: true},	//Latitude of the Location
    	osv : {type: String,lowercase: true,trim: true},	//Operating System Version
    	lv  : {type: String,lowercase: true,trim: true},	//Library version of the SDK
    	sid : {type: String,lowercase: true,trim: true},	//Session ID	
    	rtc : {type: Number,trim: true},			//Record TimeStamp in epoch format
    	res : {type: String,lowercase: true,trim: true},        //Resolution of the phone
        akey : {type: String,trim: true},        		//ApplicationKey
	stkt : {type: String,trim: true},			//Stack trace of the crash
	stkc : {type: String,trim:true},			//Stack command of the crash
	stkm : {type: String,trim:true}				//Stack message of the crash
});

module.exports = mongoose.model('Crash', CrashSchema);
