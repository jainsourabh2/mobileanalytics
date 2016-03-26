nameApp.controller('EventsCompareCtrl', ['$scope','$http','analyticsService',function ($scope,$http,analyticsService){

      $scope.$on("$destroy", function(){

          $(window).off("resize");

      });

    $(function() {
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
          
           function moveItems(origin, dest) {
                $(origin).find(':selected').appendTo(dest);
            }
             
            function moveAllItems(origin, dest) {
                $(origin).children().appendTo(dest);
            }
            
            $("#btnLeft").click(function () {
                moveItems('#ComparedEvents', '#EventsSelector');
            });
             
            $("#btnRight").on('click', function () {
                moveItems('#EventsSelector', '#ComparedEvents');
            });

            $("#btnCompare").on('click', function () {
            	$scope.selectedevents = [];
                

            	$('#ComparedEvents option').each(function (i, option) {
				      $scope.selectedevents[i] = $(option).text();
				});
                //console.log($scope.selectedevents);

               if(!$scope.$$phase) {
                $scope.$apply(function() {
                  
                    //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                    $scope.updateuniquecountchart();
   
                });
              }
            });

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

          cb(moment().subtract(7, 'day').startOf('day'), moment().endOf('day'),"Day");


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


              // if(!$scope.$$phase) {
              //   $scope.$apply(function() {
                  
              //       //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
              //       $scope.updateeventstable();

              //   });
              // }
          }


      });


    $scope.alreadyeventsloaded=false;
    // $scope.alreadysessionloaded=false;
    $scope.eventsdata = [];


$scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                          
                          $scope.getEventNames();

                      });
                }
                else
                {

                          $scope.getEventNames();
         

                }
};

$scope.getEventNames = function(){

     //Get the data

     var EventsDataPromise  = analyticsService.getEventNames();
     EventsDataPromise.then(function(response){

     $scope.eventsdata =  response.data;
     console.log($scope.eventsdata);

    });

};


 $scope.updateuniquecountchart = function(){

	   var EventsDataPromise  = analyticsService.getEventsComparisionData($scope.startdate,$scope.enddate,$scope.selectedfrequency,$scope.selectedevents);
	   EventsDataPromise.then(function(response){

	   var eventscomparisondata =  response.data;
     var eventscomparisondata1 =  response.data;

     // for(i=0; i<eventscomparisondata.length;i++)
     // {
     //   console.log(eventscomparisondata[i].event);
     //   console.log(eventscomparisondata[i].value);
     // }

            if(!$scope.$$phase) {

                      $scope.$apply(function() {
                          
                          //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                        $scope.drawnonuniquechart(eventscomparisondata);
                        //$scope.drawuniquechart(eventscomparisondata1);
                      });
                }
                else
                {
                          //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                    $scope.drawnonuniquechart(eventscomparisondata);
                    //$scope.drawuniquechart(eventscomparisondata1);         

                }

      $scope.alreadyeventsloaded=true;
      // drawnonuniquechart(eventscomparisondata);
      // drawuniquechart(eventscomparisondata);
       
	  });

 };

 $scope.drawnonuniquechart = function(data)
 {

  if($scope.alreadyeventsloaded==true)
  {
    d3.select("#Event_Compare_SVG_ID_1").remove();
    d3.select("#Event_Compare_SVG_ID_2").remove();
  }
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 30, bottom: 70, left: 50},
    width = 980 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
var parseDate;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y1 = d3.scale.linear().range([height, 0]);
var y2 = d3.scale.linear().range([height, 0]);

// Define the axes
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

var yAxis1 = d3.svg.axis().scale(y1)
    .orient("left").ticks(5);

var yAxis2 = d3.svg.axis().scale(y2)
    .orient("left").ticks(5);

// Define the line
var eventsline1 = d3.svg.line() 
    .x(function(d) { return x(d.event_date); })
    .y(function(d) { return y1(d.Non_Unique_Event_Count); });

var eventsline2 = d3.svg.line() 
    .x(function(d) { return x(d.event_date); })
    .y(function(d) { return y2(d.Unique_User_Count); });
    
// Adds the svg canvas
var svg1 = d3.select("#divEventNonUniqueChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","Event_Compare_SVG_ID_1")
        .attr('viewBox', '0 0 980 300')
        .attr('perserveAspectRatio', 'xMinYMid')
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Adds the svg canvas
var svg2 = d3.select("#divEventUniqueChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","Event_Compare_SVG_ID_2")
        .attr('viewBox', '0 0 980 300')
        .attr('perserveAspectRatio', 'xMinYMid')        
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
    data.forEach(function(d) {
    d.event_date = parseDate(d.event_date.toString());
    d.Non_Unique_Event_Count = +d.Non_Unique_Event_Count;
    d.Unique_User_Count = +d.Unique_User_Count;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.event_date; }));
    y1.domain([0, d3.max(data, function(d) { return d.Non_Unique_Event_Count; })]);
    y2.domain([0, d3.max(data, function(d) { return d.Unique_User_Count; })]);

    // Nest the entries by event_name
    var dataNest = d3.nest()
        .key(function(d) {return d.event_name;})
        .entries(data);

    var color = d3.scale.category10();   // set the colour scale

    legendSpace = width/dataNest.length; // spacing for the legend

  var tip1 = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function (d) {
     return "<strong>Total Number of Events:</strong> <span style='color:red'>" + d.Non_Unique_Event_Count +"</span>";
 })

  var tip2 = d3.tip()
       .attr('class', 'd3-tip')
       .offset([-10, 0])
       .html(function (d) {
       return "<strong>Unique Number of Users:</strong> <span style='color:red'>" + d.Unique_User_Count +"</span>";
   })

   svg1.call(tip1);
   svg2.call(tip2);

    // Loop through each event_name / key
    dataNest.forEach(function(d,i) { 

        console.log(d.key.replace('/', ''));

        svg1.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("id", 'tag1'+i)//d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", eventsline1(d.values));

        svg1circles = svg1.selectAll(".event-data-point1"+i).data(d.values);

        svg1circles.enter()
               .append("svg:circle")
               .attr("class", 'event-data-point1'+i)
               .style("stroke", function() { // Add the colours dynamically
                  return d.color = color(d.key); })
                .style("fill", 'white')
                .style("stroke-width", "1.5px");

        svg1circles
        .attr("cx", function (d, i) {
               return x(d.event_date);
           })
        .attr("cy", function (d, i) {
               return y1(d.Non_Unique_Event_Count);
           })
        .attr("r", 3)
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide);

        // Add the Legend
        svg1.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .on("click", function(){
                // Determine if current line is visible 
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1; 
                // Hide or show the elements based on the ID
                d3.select("#tag1"+i)//d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity",newOpacity); 

                svg1.selectAll(".event-data-point1"+i)
                    .transition().duration(100) 
                    .style("opacity",newOpacity); 
                // Update whether or not the elements are active
                d.active = active;
                })  
            .text(d.key); 


        svg2.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("id", 'tag2'+i)//d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", eventsline2(d.values));

        svg2circles = svg2.selectAll(".event-data-point2"+i).data(d.values);

        svg2circles.enter()
               .append("svg:circle")
               .attr("class", 'event-data-point2'+i)
               .style("stroke", function() { // Add the colours dynamically
                  return d.color = color(d.key); })
                .style("fill", 'white')
                .style("stroke-width", "1.5px");

        svg2circles
        .attr("cx", function (d, i) {
               return x(d.event_date);
           })
        .attr("cy", function (d, i) {
               return y2(d.Unique_User_Count);
           })
        .attr("r", 3)
        .on('mouseover', tip2.show)
        .on('mouseout', tip2.hide);
      
        // Add the Legend
        svg2.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .on("click", function(){
                // Determine if current line is visible 
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1; 
                // Hide or show the elements based on the ID
                d3.select("#tag2"+i)//d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity", newOpacity); 

                svg2.selectAll(".event-data-point2"+i)
                    .transition().duration(100) 
                    .style("opacity",newOpacity); 

                // Update whether or not the elements are active
                d.active = active;
                })  
            .text(d.key); 

    });

    // Add the X Axis
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis1);

    // Add the X Axis
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis2);

  
      var the_chart1 = $("#Event_Compare_SVG_ID_1"),
        aspect1 = the_chart1.width() / the_chart1.height(),
        container1 = the_chart1.parent();

      var the_chart2 = $("#Event_Compare_SVG_ID_2"),
        aspect2 = the_chart2.width() / the_chart2.height(),
        container2 = the_chart2.parent();

    $(window).on("resize", function() {
      console.log('resize');
      var targetWidth1 = container1.width();
      the_chart1.attr("width", targetWidth1);
      the_chart1.attr("height", Math.round(targetWidth1 / aspect1));

      var targetWidth2 = container2.width();
      the_chart2.attr("width", targetWidth2);
      the_chart2.attr("height", Math.round(targetWidth2 / aspect2));      
/*      the_chart.attr("height", container.height());*/

    }).trigger("resize");


 };


}]);
