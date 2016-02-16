module.exports.eventscomparisiondata = function(req,res){

 var start,end,selectedfrequency,istest
 var selectedevents=[];
 var data;
  console.log("eventscomparisiondata code is called");
  start = parseInt(req.query["param1"])/1000;
  end = parseInt(req.query["param2"])/1000;
  selectedfrequency = req.query["param3"];
  selectedevents = req.query["param4"];
  istest = req.query["param5"];
  istest = 1;
  console.log(selectedevents);
  console.log(selectedevents.length);
  //istest = req.query["param5"];
  var key = {};
  var type = {};

    if(istest == 0)
    {
   
    }
    else
    {
        if(selectedevents.length <= 1)
        {

            data = [ 
                    {event_name: "Song A Played",event_date:"20151001",Non_Unique_User_Count:"628",Unique_User_Count:"33"},
                    {event_name: "Song A Played",event_date:"20151002",Non_Unique_User_Count:"530",Unique_User_Count:"27"},
                    {event_name: "Song A Played",event_date:"20151003",Non_Unique_User_Count:"456",Unique_User_Count:"31"},
                    {event_name: "Song A Played",event_date:"20151004",Non_Unique_User_Count:"312",Unique_User_Count:"29"},
                    {event_name: "Song A Played",event_date:"20151005",Non_Unique_User_Count:"567",Unique_User_Count:"19"},
                    {event_name: "Song A Played",event_date:"20151006",Non_Unique_User_Count:"413",Unique_User_Count:"13"},
                    {event_name: "Song A Played",event_date:"20151007",Non_Unique_User_Count:"300",Unique_User_Count:"18"}                          
                   ];
        }
        else
      	{
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
          }

        return res.json(data);
    }

}

module.exports.eventssummary = function(req,res){

 var start,end,selectedfrequency,istest;
 var data;
  console.log("eventsdata code is called");
  start = parseInt(req.query["param1"])/1000;
  end = parseInt(req.query["param2"])/1000;
  selectedfrequency = req.query["param3"];
  istest = req.query["param4"];
 
    //istest = 1 when test data needs to be used
    if(istest == 0)
    {
    }
    else
    {
	   if(selectedfrequency == "Day")
	      {
	        data = [ 
	            {_id:"Song A Played",Total_Event_Count:"628"},
	            {_id:"Song B Played",Total_Event_Count:"530"},
	            {_id:"Song C Played",Total_Event_Count:"456"}

	         ];
	       }

	      if(selectedfrequency == "Month")
	      {
	        data = [ 
	            {_id:"Song A Played",Total_Event_Count:"628"},
	            {_id:"Song D Played",Total_Event_Count:"530"},
	            {_id:"Song C Played",Total_Event_Count:"456"}
	         ];
	       }

	      if(selectedfrequency == "Week")
	      {
	        data = [ 
	              {_id:"Song C Played",Total_Event_Count:"500"},
	              {_id:"Song D Played",Total_Event_Count:"530"},
	              {_id:"Song E Played",Total_Event_Count:"412"}
	           ];
	      }

	      if(selectedfrequency == "Hour")
	      {
	        data = [ 
	              {_id:"Song P Played",Total_Event_Count:"500"},
	              {_id:"Song Q Played",Total_Event_Count:"530"},
	              {_id:"Song R Played",Total_Event_Count:"456"}
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

    if(istest == 0)
    {
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