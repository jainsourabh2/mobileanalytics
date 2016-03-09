nameApp.controller('CrashCtrl', ['$scope','$http','analyticsService',function ($scope,$http,analyticsService){

/*        var line1active;
        var line2active;


      $scope.SelectionType = 'Event';

      $(document).on('click', '#anchorevent', function() {

          console.log("this is event trial");
          $scope.currentpopoverstatus='hide';
          $('#anchorpop').text("Event");
          $('#privacy-menu').addClass('cssevent');
          $('#privacy-menu').removeClass('cssuser');
          $('a[rel=popover]').popover($scope.currentpopoverstatus);
          $scope.SelectionType = 'Event';

            if(!$scope.$$phase) {
                  $scope.$apply(function () {
                      $scope.updateEventsMainChart();
                  });
            }
            
         });

      $(document).on('click', '#anchoruser', function() {

          console.log("this is user trial");
          $scope.currentpopoverstatus='hide';
          $('#anchorpop').text("User");
          $('#privacy-menu').removeClass('cssevent');
          $('#privacy-menu').addClass('cssuser');
          $('a[rel=popover]').popover($scope.currentpopoverstatus);
          $scope.SelectionType = 'User';

            if(!$scope.$$phase) {
                  $scope.$apply(function () {
                      $scope.updateEventsMainChart();
                  });
            }

         });*/

    $(function() {


/*
              $('a[rel=popover]').popover().click(function(e) {
                                                  $(this).popover('toggle');
                                                  e.stopPropagation();

                                                    if($('#anchorpop').text()=='Event') 
                                                     {
                                                       $('#privacy-menu').addClass('cssevent');
                                                       $('#privacy-menu').removeClass('cssuser');
                                                     } 
                                                     else 
                                                     {
                                                       $('#privacy-menu').addClass('cssuser');
                                                       $('#privacy-menu').removeClass('cssevent');
                                                     }
                                                  
                                              });*/

          $('#reportrange').daterangepicker({
            linkedCalendars: false,
            minDate: moment().subtract(365, 'days'),
            maxDate: moment(),
              // ranges: {
              //   "Last 365 Days": [moment().subtract(365, 'days'), moment()],
              //    "Last 30 Days": [moment().subtract(29, 'days'), moment()],
              //    "Last 7 Days": [moment().subtract(6, 'days'), moment()],                
              //    "Today": [moment(), moment()],
              //    "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
              //    "This Month": [moment().startOf('month'), moment().endOf('month')],
              //    "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
              // }
          }, cb);
          

            $("#btntoday").click(function(){
             cb(moment().startOf('day'), moment().endOf('day'),"Hour");
            });

            $("#btnyesterday").click(function(){
             cb(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'),"Hour");
            });

            $("#btncurrmonth").click(function(){
             cb(moment().startOf('month').startOf('day'), moment().endOf('day'),"Day");
            });

            $("#btnprevmonth").click(function(){
             cb(moment().subtract(1, 'month').startOf('month').startOf('day'), moment().subtract(1, 'month').endOf('month').endOf('day'),"Day");
            });

            $("#btn3mnths").click(function(){
             cb(moment().subtract(3, 'month').startOf('day'), moment().endOf('day'),"Week");
            });
                                    
            $("#btn6mnths").click(function(){
             cb(moment().subtract(6, 'month').startOf('day'), moment().endOf('day'),"Week");
            });

            $("#btn1year").click(function(){
             cb(moment().subtract(1, 'year').startOf('day'), moment().endOf('day'),"Month");
            });

          cb(moment().subtract(3, 'month').startOf('day'), moment().endOf('day'),"Week");


          function cb(start, end, freq) {

            if(freq==undefined)
            {
               var diff = end.diff(start,'days');
               if(diff<=2)
               {
                 freq = "Hour";
               }
               else if(diff<=31)
               {
                freq = "Day";
               }
               else if(diff<=180)
               {
                freq = "Week";
               }
               else
               {
                freq = "Month";
               }

            }
              $('#reportrange span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
              $scope.startdate=moment(start).valueOf();
              $scope.enddate=moment(end).valueOf();
              $scope.selectedfrequency=freq;

              line1active = true;
              line2active = true;

              if(!$scope.$$phase) {
                $scope.$apply(function() {
                  
                    //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                    $scope.updatecrashtable();

                });
              }
          }


      });


    $scope.alreadyeventsloaded=false;
    $scope.alreadysessionloaded=false;
    $scope.eventsdata = [];


    $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                          
                          $scope.updatecrashtable();

                      });
                }
                else
                {

                          $scope.updatecrashtable();
         

                }
    };

     $scope.openModel = function(crashdetails){

        console.log(crashdetails);
      	$('#myLargeModalLabel').text("Crash Detail");
      	$('#myModal').modal('show');
      	console.log($scope.startdate,$scope.enddate,$scope.selectedfrequency);

     var CrashDetailsPromise  = analyticsService.getCrashReportDetail($scope.startdate,$scope.enddate,$scope.selectedfrequency,crashdetails);
     CrashDetailsPromise.then(function(response){

     crashdetails =  response.data;
     console.log(crashdetails);

     $scope.crashdetaildata = [];
     for(i=0; i<crashdetails.length; i++)
     {
       console.log(crashdetails[i]);

       currentrow = crashdetails[i];

       var errormessage = ""
       for (var key in currentrow)
       {
         console.log(key);
         console.log(crashdetails[i][key]);
         errormessage = errormessage + key + ":" + crashdetails[i][key] + '\n'
       }

       $scope.crashdetaildata.push({ErrorNumber:(i+1),ErrorMessage:errormessage});
     }
    //console.log($scope.crashsummarydata);
    console.log($scope.crashdetaildata)
    });

   };


     $scope.updatecrashtable = function(){

	   //Get the data

	   var CrashDataPromise  = analyticsService.getCrashReportSummary($scope.startdate,$scope.enddate,$scope.selectedfrequency);
	   CrashDataPromise.then(function(response){

	   $scope.crashsummarydata =  response.data;
	   console.log($scope.crashsummarydata);

     for(i=0; i<$scope.crashsummarydata.length; i++)
     {
        if($scope.selectedfrequency == 'Hour')
        {
           $scope.crashsummarydata[i]._id.ConvertedTime = moment($scope.crashsummarydata[i]._id.Time, 'YYYYMMDDHH').format('HH:00')
        }
        else if($scope.selectedfrequency == 'Day')
        {
           $scope.crashsummarydata[i]._id.ConvertedTime = moment($scope.crashsummarydata[i]._id.Time, 'YYYYMMDD').format('DD MMM YYYY')
        }
        else if($scope.selectedfrequency == 'Week') 
        {
           $scope.crashsummarydata[i]._id.ConvertedTime = moment($scope.crashsummarydata[i]._id.Time, 'YYYYMMDD').format('DD MMM YYYY')
        }
        else if($scope.selectedfrequency == 'Month')
        {
           $scope.crashsummarydata[i]._id.ConvertedTime = moment($scope.crashsummarydata[i]._id.Time, 'YYYYMM').format('MMM YYYY')
        }
     }
    console.log($scope.crashsummarydata);
	  });

   };

 


}]);
