nameApp.controller('EventsCtrl', ['$scope','$rootScope','$http','analyticsService',function ($scope,$rootScope,$http,analyticsService){

        var line1active;
        var line2active;

      $scope.$on("$destroy", function(){

          $(window).off("resize");

      });

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

         });

    $(function() {



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
                                                  
                                              });

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

            $("#anchtoday").click(function(){
             cb(moment().startOf('day'), moment().endOf('day'),"Hour");
            });

            $("#anchyesterday").click(function(){
             cb(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'),"Hour");
            });

            $("#anchcurrmonth").click(function(){
             cb(moment().startOf('month').startOf('day'), moment().endOf('day'),"Day");
            });

            $("#anchprevmonth").click(function(){
             cb(moment().subtract(1, 'month').startOf('month').startOf('day'), moment().subtract(1, 'month').endOf('month').endOf('day'),"Day");
            });

            $("#anch3mnths").click(function(){
             cb(moment().subtract(3, 'month').startOf('day'), moment().endOf('day'),"Week");
            });
                                    
            $("#anch6mnths").click(function(){
             cb(moment().subtract(6, 'month').startOf('day'), moment().endOf('day'),"Week");
            });

            $("#anch1year").click(function(){
             cb(moment().subtract(1, 'year').startOf('day'), moment().endOf('day'),"Month");
            });                  

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
              $('#reportrange span').html(start.format('MMM D,YYYY') + ' - ' + end.format('MMM D,YYYY'));
              $scope.startdate=moment(start).valueOf();
              $scope.enddate=moment(end).valueOf();
              $scope.selectedfrequency=freq;

              line1active = true;
              line2active = true;

              if(!$scope.$$phase) {
                $scope.$apply(function() {
                  
                    //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                    $scope.updateeventstable();

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
                          
                          $scope.updateeventstable();

                      });
                }
                else
                {

                          $scope.updateeventstable();
         

                }
    };

     $scope.openModel = function(eventname){

      var selectedevents = [];
      selectedevents[0] = eventname;
      	console.log(eventname);
      	$('#myLargeModalLabel').text(eventname);
      	$('#myModal').modal('show');
      	console.log($scope.startdate,$scope.enddate,$scope.selectedfrequency);
     var EventsDataPromise  = analyticsService.getEventsComparisionData($rootScope.appKey,$scope.startdate,$scope.enddate,$scope.selectedfrequency,selectedevents);
     EventsDataPromise.then(function(response){

     $scope.eventsmaindata =  response.data;

       $scope.eventcountdata=[];
       $scope.usercountdata=[];
       for(var key in $scope.eventsmaindata)
       {
          $scope.eventcountdata.push({'event_date' : $scope.eventsmaindata[key].event_date, 'TotalCount' : $scope.eventsmaindata[key].Non_Unique_Event_Count});
          $scope.usercountdata.push({'event_date' : $scope.eventsmaindata[key].event_date, 'TotalCount' : $scope.eventsmaindata[key].Unique_User_Count});
       }

     $scope.updateEventsChart($scope.eventcountdata)


     });

   };

   $scope.updateEventsMainChart = function() {

      $scope.eventcountdata=[];
      $scope.usercountdata=[];
       for(var key in $scope.eventsmaindata)
       {
          $scope.eventcountdata.push({'event_date' : $scope.eventsmaindata[key].event_date, 'TotalCount' : $scope.eventsmaindata[key].Non_Unique_Event_Count});
          $scope.usercountdata.push({'event_date' : $scope.eventsmaindata[key].event_date, 'TotalCount' : $scope.eventsmaindata[key].Unique_User_Count});
       }

       if($scope.SelectionType == "Event")
       {

         $scope.updateEventsChart($scope.eventcountdata)

       }
       else
       {

        $scope.updateEventsChart($scope.usercountdata)
       }

   }

     $scope.updateEventsChart = function(data) {
   
   console.log(data);
  var margin = {top: 10, right: 50, bottom: 50, left: 50},
  width = 950 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
  var parseDate;

  var x = d3.time.scale().range([0, width]);
  var y0 = d3.scale.linear().range([height, 0]);

  var valueline1 = d3.svg.line()
      .x(function(d) { return x(d.event_date); })
      .y(function(d) { return y0(d.TotalCount); });
      


  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom");

  if($scope.selectedfrequency == "Day")
  {
        xAxis.ticks(d3.time.days, 1)
        .tickFormat(d3.time.format("%d %b"));

        parseDate = d3.time.format("%Y%m%d").parse;
  }
  if($scope.selectedfrequency == "Week")
  {
        xAxis.ticks(d3.time.weeks, 1)
        .tickFormat(d3.time.format("%d %b"));

        parseDate = d3.time.format("%Y%m%d").parse;
  }
  if(($scope.selectedfrequency=="Hour"))
  {
        xAxis.ticks(d3.time.hours, 1)
        .tickFormat(d3.time.format("%H:%M"));

        parseDate = d3.time.format("%Y%m%d%H").parse;
  }
  if($scope.selectedfrequency=="Month")
  {
        xAxis.ticks(d3.time.months, 1)
        .tickFormat(d3.time.format("%b %y"));

        parseDate = d3.time.format("%Y%m").parse;
  }

  var yAxisLeft = d3.svg.axis().scale(y0)
      .orient("left").ticks(5)
      .tickFormat(d3.format("d"))
      .tickSubdivide(0)
      .innerTickSize(-width)
      .outerTickSize(0);



  data.forEach(function(d) {
      d.event_date = parseDate(d.event_date);
      d.TotalCount = +d.TotalCount;
  });


  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.event_date; }));
  y0.domain([0, d3.max(data, function(d) { 
      return Math.max(d.TotalCount); })]);  

  var area = d3.svg.area()
      .x(function(d) { return x(d.event_date); })
      .y0(height)
      .y1(function(d) { return y0(d.TotalCount); });


 var svg = d3.select("#dualeventdetailchart");

   var tip1 = d3.tip()
     .attr('class', 'd3-modaltip')
     .offset([-5, 0])
     .html(function (d) {
     return "<span style='color:red'>" + d.TotalCount +"</span>";
 })


if($scope.alreadysessionloaded==false)
{
    
      svg = d3.select("#dualeventdetailchart")
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("id","svgdualeventdetailchart")
              .attr('viewBox', '0 0 950 300')
              .attr('perserveAspectRatio', 'xMinYMid')
          .append("g")
              .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip1);

      var xAxisOrig = svg.append("g")            // Add the X Axis
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis);


       xAxisOrig.selectAll("text")  // select all the text elements for the xaxis
          .style("text-anchor", "end")
          //.style("fill", "red")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("font-family","sans-serif")
          //.attr("font-weight","bold")          
          .attr("transform", function(d) {
              return "rotate(-55)";
        });

      var yAxisLeftG = svg.append("g")
          .attr("class", "y axis axisLeft")
          .style("fill", "black")
          .call(yAxisLeft);   


      svg.append("path")        // Add the valueline path. 
      .style("stroke", "steelblue")
      .style("fill", "none")
      .style("stroke-width", "2")
      .style("opacity", "1")
          .attr("d", valueline1(data))
          .attr("class","line1")
          .attr("id","line1");

     svg.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area);

      var bluecircles = svg.selectAll(".event-summary-data-point1").data(data);

      bluecircles.enter()
             .append("svg:circle")
             .attr("class", 'event-summary-data-point1');


      bluecircles
      .attr("cx", function (d, i) {
             return x(d.event_date);
         })
      .attr("cy", function (d, i) {
             return y0(d.TotalCount);
         })
      .attr("r", 3)
      .style("opacity", "1")
      .on('mouseover', tip1.show)
      .on('mouseout', tip1.hide);

      bluecircles
      .exit()
      .transition()
      .attr('r', 0)
      .remove();


      $scope.alreadysessionloaded = true;
    }
    else
    {


    // Select the section we want to apply our changes to
    var svg = d3.select("#dualeventdetailchart").transition();


    //svg.call(tip);
    // Make the changes
        svg.select(".line1")   // change the line
            .duration(750)
            .style("opacity", "1")
            .attr("d", valueline1(data));


        var xAxisOrig = svg.select(".x.axis") // change the x axis
                        .duration(750)
                        .call(xAxis);

        xAxisOrig.selectAll("text")  // select all the text elements for the xaxis
            .style("text-anchor", "end")
            //.style("fill", "red")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-family","sans-serif")
             //.attr("font-weight","bold")            
            .attr("transform", function(d) {
                return "rotate(-55)";
          });


        svg.select(".y.axis.axisLeft") // change the y axis
            .duration(750)
            .call(yAxisLeft);

      var svg = d3.select("#dualeventdetailchart").select("svg").select("g");
      
      svg.select(".area").remove();

     svg.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area);
          
      var svg = d3.select("#dualeventdetailchart").select("svg").select("g");
      
     //  svg.select(".area").remove();

     // svg.append("path")
     //      .datum(data)
     //      .attr("class", "area")
     //      .attr("d", area);

      svg.call(tip1);

      // svg.call(tip);
                //Attach the data to the graph
      var bluecircles = svg.selectAll(".event-summary-data-point1").data(data);

      bluecircles.enter()
             .append("svg:circle").attr("class", 'event-summary-data-point1');


      bluecircles
      .attr("cx", function (d, i) {
             return x(d.event_date);
         })
      .attr("cy", function (d, i) {
             return y0(d.TotalCount);
         })
      .attr("r", 3)
      .style("opacity", "1")
      .on('mouseover', tip1.show)
      .on('mouseout', tip1.hide);

      bluecircles
      .exit()
      .transition()
      .attr('r', 0)
      .remove();


    }

        var the_chart = $("#svgdualeventdetailchart"),
        aspect = the_chart.width() / the_chart.height(),
        container = the_chart.parent();

        $(window).on("resize", function() {
          console.log('resize');
          var targetWidth = container.width();
          the_chart.attr("width", targetWidth);
          //the_chart.attr("height", Math.round(targetWidth / aspect));
            the_chart.attr("height", container.height());

    }).trigger("resize");
    
    };

     $scope.updateeventstable = function(){

	   //Get the data

	   var EventsDataPromise  = analyticsService.getEventsSummary($rootScope.appKey,$scope.startdate,$scope.enddate,$scope.selectedfrequency);
	   EventsDataPromise.then(function(response){

	   $scope.eventsdata =  response.data;
	   console.log($scope.eventsdata);

	  });

   };

 


}]);
