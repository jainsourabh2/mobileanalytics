//Set the connection details
//var databaseurl = '169.254.41.202:27017/test';
var databaseurl ='test'
//var databaseurl = 'test';
var mongojs= require('mongojs');
//var db = mongojs(databaseurl);

module.exports.eventscomparisiondata = function(req,res){

 var start,end,selectedfrequency,istest;
 var data;
  console.log("eventscomparisiondata code is called");
  start = parseInt(req.query["param1"])/1000;
  end = parseInt(req.query["param2"])/1000;
  selectedfrequency = req.query["param3"];
  istest = req.query["param4"];
  //istest = req.query["param5"];
  var key = {};
  var type = {};

  if(istest == 0)
  {
 
  }
    else
    {
    	
        // if(selectedfrequency == "Day")
        // {
        //   data = [ 
        //       {_id:"20151001",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
        //       {_id:"20151002",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
        //       {_id:"20151003",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
        //       {_id:"20151004",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
        //       {_id:"20151005",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
        //       {_id:"20151006",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
        //       {_id:"20151007",Non_Unique_User_Count:"300",Unique_User_Count:"18"}
        //    ];
        //  }

        // if(selectedfrequency == "Month")
        // {
        //   data = [ 
        //       {_id:"201410",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
        //       {_id:"201412",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
        //       {_id:"201502",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
        //       {_id:"201504",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
        //       {_id:"201508",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
        //       {_id:"201509",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
        //       {_id:"201510",Non_Unique_User_Count:"300",Unique_User_Count:"18"}
        //    ];
        //  }

        // if(selectedfrequency == "Week")
        // {
        //   data = [ 
        //         {_id:"20150906",Non_Unique_User_Count:"500",Unique_User_Count:"24"},
        //         {_id:"20150913",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
        //         {_id:"20150920",Non_Unique_User_Count:"412",Unique_User_Count:"27"},
        //         {_id:"20150927",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
        //         {_id:"20151004",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
        //         {_id:"20151011",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
        //         {_id:"20151018",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
        //         {_id:"20151025",Non_Unique_User_Count:"300",Unique_User_Count:"10"},
        //         {_id:"20151101",Non_Unique_User_Count:"413",Unique_User_Count:"13"}
        //      ];
        // }

        // if(selectedfrequency == "Hour")
        // {
        //   data = [ 
        //         {_id:"2015100700",Non_Unique_User_Count:"500",Unique_User_Count:"24"},
        //         {_id:"2015100701",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
        //         {_id:"2015100703",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
        //         {_id:"2015100704",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
        //         {_id:"2015100707",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
        //         {_id:"2015100708",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
        //         {_id:"2015100709",Non_Unique_User_Count:"300",Unique_User_Count:"10"},
        //         {_id:"2015100712",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
        //         {_id:"2015100718",Non_Unique_User_Count:"300",Unique_User_Count:"18"},
        //         {_id:"2015100719",Non_Unique_User_Count:"234",Unique_User_Count:"45"}
        //      ];
        // }
          data = [ 

                    {event_name: "Song A Played",event_date:"20151001",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
                    {event_name: "Song A Played",event_date:"20151002",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
                    {event_name: "Song A Played",event_date:"20151003",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
                    {event_name: "Song A Played",event_date:"20151004",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
                    {event_name: "Song A Played",event_date:"20151005",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
                    {event_name: "Song A Played",event_date:"20151006",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
                    {event_name: "Song A Played",event_date:"20151007",Non_Unique_User_Count:"300",Unique_User_Count:"18"},
                    {event_name: "Song B Played",event_date:"20151001",Non_Unique_User_Count:"234",Unique_User_Count:"12"},
                    {event_name: "Song B Played",event_date:"20151002",Non_Unique_User_Count:"439",Unique_User_Count:"34"},
                    {event_name: "Song B Played",event_date:"20151003",Non_Unique_User_Count:"412",Unique_User_Count:"56"},
                    {event_name: "Song B Played",event_date:"20151004",Non_Unique_User_Count:"212",Unique_User_Count:"65"},
                    {event_name: "Song B Played",event_date:"20151005",Non_Unique_User_Count:"467",Unique_User_Count:"12"},
                    {event_name: "Song B Played",event_date:"20151006",Non_Unique_User_Count:"113",Unique_User_Count:"34"},
                    {event_name: "Song B Played",event_date:"20151007",Non_Unique_User_Count:"400",Unique_User_Count:"56"},
                    {event_name: "Song C Played",event_date:"20151001",Non_Unique_User_Count:"123",Unique_User_Count:"9"},
                    {event_name: "Song C Played",event_date:"20151002",Non_Unique_User_Count:"456",Unique_User_Count:"36"},
                    {event_name: "Song C Played",event_date:"20151003",Non_Unique_User_Count:"239",Unique_User_Count:"78"},
                    {event_name: "Song C Played",event_date:"20151004",Non_Unique_User_Count:"112",Unique_User_Count:"09"},
                    {event_name: "Song C Played",event_date:"20151005",Non_Unique_User_Count:"432",Unique_User_Count:"65"},
                    {event_name: "Song C Played",event_date:"20151006",Non_Unique_User_Count:"324",Unique_User_Count:"36"},
                    {event_name: "Song C Played",event_date:"20151007",Non_Unique_User_Count:"600",Unique_User_Count:"10"}
                          
                ];

        return res.json(data);
    }

}

module.exports.eventsdata = function(req,res){

 var start,end,selectedfrequency,istest;
 var data;
  console.log("eventsdata code is called");
  start = parseInt(req.query["param1"])/1000;
  end = parseInt(req.query["param2"])/1000;
  selectedfrequency = req.query["param3"];
  istest = req.query["param4"];
  // var key = {};
  // var type = {};

  if(istest == 0)
  {
  //   db1 = mongojs(databaseurl);
  // //  start = 1420204195 + (86400*150);
	 // // end = start + (86400*30);
	 // // selectedfrequency = 'Day';

	 //  matchCriteria(start,end,selectedfrequency,key,type);

	 //  db1.collection('agg_session_data').aggregate(
	 //     {$match : {$and : [key,type]}}
	 //     ,{$unwind : '$value'}
	 //     ,{$group : {'_id' : '$value._id.key'
	 //                 ,'New_User_Count' : {$sum : '$value.New_User_Count'}
	 //                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
	                 
	 //                }}
	 //    ,{$sort : {'_id' : 1}}
	 //           ,function (err , result) {
	 //              if (err || !result) {
	 //                  console.log(err);
	 //                  db1.close();
	 //                  return;} //end of function
  //                 data = result;
	 //              console.log(result);
	 //              db1.close();
	 //              return res.json(result);
	 //          });

	  // console.log("database is called");
	  // console.log(data);
    }
    else
    {
	   if(selectedfrequency == "Day")
	      {
	        data = [ 
	            {_id:"Song A Played",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
	            {_id:"Song B Played",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
	            {_id:"Song C Played",Non_Unique_User_Count:"456",Unique_User_Count:"31"}

	         ];
	       }

	      if(selectedfrequency == "Month")
	      {
	        data = [ 
	            {_id:"Song A Played",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
	            {_id:"Song D Played",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
	            {_id:"Song C Played",Non_Unique_User_Count:"456",Unique_User_Count:"31"}
	         ];
	       }

	      if(selectedfrequency == "Week")
	      {
	        data = [ 
	              {_id:"Song C Played",Non_Unique_User_Count:"500",Unique_User_Count:"24"},
	              {_id:"Song D Played",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
	              {_id:"Song E Played",Non_Unique_User_Count:"412",Unique_User_Count:"27"}
	           ];
	      }

	      if(selectedfrequency == "Hour")
	      {
	        data = [ 
	              {_id:"Song P Played",Non_Unique_User_Count:"500",Unique_User_Count:"24"},
	              {_id:"Song Q Played",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
	              {_id:"Song R Played",Non_Unique_User_Count:"456",Unique_User_Count:"31"}
	           ];
	      }
	      return res.json(data);
	  }

}

module.exports.events = function(req,res){

 var istest;
 var data;
  console.log("events code is called");

  istest = req.query["param4"];
  // var key = {};
  // var type = {};

  if(istest == 0)
  {
  //   db1 = mongojs(databaseurl);
  // //  start = 1420204195 + (86400*150);
	 // // end = start + (86400*30);
	 // // selectedfrequency = 'Day';

	 //  matchCriteria(start,end,selectedfrequency,key,type);

	 //  db1.collection('agg_session_data').aggregate(
	 //     {$match : {$and : [key,type]}}
	 //     ,{$unwind : '$value'}
	 //     ,{$group : {'_id' : '$value._id.key'
	 //                 ,'New_User_Count' : {$sum : '$value.New_User_Count'}
	 //                 ,'Unique_User_Count' : {$sum : '$value.Unique_User_Count'}
	                 
	 //                }}
	 //    ,{$sort : {'_id' : 1}}
	 //           ,function (err , result) {
	 //              if (err || !result) {
	 //                  console.log(err);
	 //                  db1.close();
	 //                  return;} //end of function
  //                 data = result;
	 //              console.log(result);
	 //              db1.close();
	 //              return res.json(result);
	 //          });

	  // console.log("database is called");
	  // console.log(data);
    }
    else
    {

	        data = [ 
	            "Song A Played",
	            "Song B Played",
	            "Song C Played",
	            "Song D Played",
	            "Song E Played",
	            "Song F Played",
	            "Song G Played",
	            "Song H Played",
	            "Song I Played",
	            "Song J Played"

	         ];

	      return res.json(data);
	  }

}