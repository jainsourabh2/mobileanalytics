var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BeginSchema   = new Schema({
	uid: {type: String,lowercase: true,trim: true},		//UserId if available from the device 
	dev : {type: String,trim: true},	//Device Model
	mnu : {type: String,trim: true},	//Manufacturer
	pf : {type: String,trim: true},		//Platform
	avn : {type: String,trim: true},	//Application Version
	dt : {type: String,trim: true},		//Device Type
        nwk : {type: String,trim: true},	//Network of the Device
        c : {type: String,trim: true},		//Carrier of the Device
        ori : {type: String,trim: true},	//Orientation of the Device in which the event was sent
        did : {type: String,trim: true},	//Device ID
        lng : {type: String,trim: true},	//Longitude of the Location
        lat : {type: String,trim: true},	//Latitude of the Location
        osv : {type: String,trim: true},	//Operating System Version
        lv : {type: String,trim: true},		//Library version of the SDK
        sid : {type: String,lowercase: true,trim: true},	//Session ID	
        rtc : {type: Number,trim: true},			//Record TimeStamp in epoch format
        res : {type: String,trim: true},     	//resolution of the phone
        ip : {type: String,trim: true}        //IP address
});

module.exports = mongoose.model('Begin', BeginSchema);
