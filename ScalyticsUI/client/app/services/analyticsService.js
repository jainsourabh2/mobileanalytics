//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
nameApp.service('analyticsService', ['$http', function ($http,$rootScope) {
  
    // this.getCurrentOnlineUsers = function() {
    //     return parseInt(Math.random() * 1000)
    //  };

    this.getDashboardSummary = function(start,end,selectedfrequency) {
 
      console.log("Aalytic service called for dashboard summary");
      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/summarydata",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":0}})
        .success(function(response){
              console.log("I got the data for summarydata");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

};

     this.getInsightSessionDetails = function(start,end,selectedfrequency) {
 
 
      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/insightsession",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":0}})
        .success(function(response){
              console.log("I got the data for insightsession");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

};

     this.getInsightUserDetails = function(start,end,selectedfrequency) {
 
 
      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/insightuser",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":0}})
        .success(function(response){
              console.log("I got the data for insightuser");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

};


     this.getEventsComparisionData = function(start,end,selectedfrequency,selectedevents) {

      console.log(start,end,selectedfrequency,selectedevents);
       //var data;
       return $http.get("/database/eventscomparisiondata",{params:{"param1" : '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5[]":selectedevents,"param6":0}})
        .success(function(response){
              console.log("I got the data for geteventscomparisiondata");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

};



     this.getDevicePieCharts = function(start,end,selectedfrequency) {

      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/devicepiecharts",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":0}})
        .success(function(response){
              console.log("I got the data for devicepiecharts");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

};


     this.getDeviceUsersbyCitiesData = function(start,end,selectedfrequency) {

      console.log(selectedfrequency);

      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/deviceusersbycities",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":0}})
        .success(function(response){
              console.log("I got the data for deviceusersbycities");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

     };

    this.getTickerData = function(start) {

      console.log(start);
       //var data;
       return $http.get("/database/ticker",{params:{"param1": '109158001', "param2": start}})
        .success(function(response){
              console.log("I got the data for ticker");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

    };

    this.getUserRetentionData = function(start,end,selectedfrequency,usertype) {

      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/userretention",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":usertype}})
        .success(function(response){
              console.log("I got the data for user retention");
              //console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

     };

     this.getEventsSummary = function(start,end,selectedfrequency) {
      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/eventssummary",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":1}})
        .success(function(response){
              console.log("I got the data for eventssummary");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

    };

    this.getCrashReportSummary = function(start,end,selectedfrequency) {

      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/crashreportsummary",{params:{"param1": '109158001', "param2": start, "param3": end,"param4": selectedfrequency,"param5":1}})
        .success(function(response){
              console.log("I got the data for getCrashReportSummary");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

    };

    this.getCrashReportDetail= function(start,end,selectedfrequency,selectedcrash) {

      console.log(start,end,selectedfrequency);
       //var data;
       return $http.get("/database/crashreportdetail",{params:{"param1": '109158001',
                                                               "param2": start, 
                                                               "param3": end,
                                                               "param4": selectedfrequency,
                                                               "param5": selectedcrash.Time,
                                                               "param6": selectedcrash.Platform,
                                                               "param7": selectedcrash.OSVersion,
                                                               "param8": selectedcrash.AppVersion
                                                               }})
        .success(function(response){
              console.log("I got the data for getCrashReportSummary");
              console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ; 
      });

    };

  this.getEventNames = function() {

      console.log();
       //var data;
       return $http.get("/database/events",{params:{"param1": '109158001', "param5":1}})
        .success(function(response){
              console.log("I got the data for events");
              //console.log(response);
              return response;
             // return response;
        }).error(function(){
         alert("error");
         return null ;
      });

    };

    }]);
