nameApp.controller('DashboardCtrl', ['$scope','$http','analyticsService',function ($scope,$http,analyticsService){

//Ticker code start

var timer;
        var line1active;
        var line2active;
var tickerstart = moment().subtract(10, 'minutes').startOf('minute');
console.log(tickerstart);
$scope.tickerstartdate = moment(tickerstart).valueOf();

//drawchart();

//window.onunload = clearTime;

$scope.$on("$destroy", function(){
	console.log("timer called");
    clearInterval(timer);
});
//$scope.startdate = (1420204173 + (86400*167))*1000;

//var startDate = 1420204150 + (86400*167);
//$scope.enddate = $scope.startdate + (300000);
// function clearTime()
// {
// 	console.log("timer called");
// 	clearInterval(timer);
// }
//Ticker code end

    $(function() {
          // $('#reportrange').daterangepicker({
          //   linkedCalendars: false,
          //   minDate: moment().subtract(365, 'days'),
          //   maxDate: moment(),
          //     // ranges: {
          //     //   "Last 365 Days": [moment().subtract(365, 'days'), moment()],
          //     //    "Last 30 Days": [moment().subtract(29, 'days'), moment()],
          //     //    "Last 7 Days": [moment().subtract(6, 'days'), moment()],                
          //     //    "Today": [moment(), moment()],
          //     //    "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          //     //    "This Month": [moment().startOf('month'), moment().endOf('month')],
          //     //    "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          //     // }
          // }, cb);
          
            // $("#btntoday").click(function(){
            //  cb(moment().startOf('day'), moment().endOf('day'),"Hour");
            // });

            // $("#btnyesterday").click(function(){
            //  cb(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'),"Hour");
            // });

            $("#btncurrmonth").click(function(){
             cb(moment().startOf('month').startOf('day'), moment().endOf('day'),"Month");
            });

            $("#btnprevmonth").click(function(){
             cb(moment().subtract(1, 'month').startOf('month').startOf('day'), moment().subtract(1, 'month').endOf('month').endOf('day'),"Month");
            });

            // $("#btn3mnths").click(function(){
            //  cb(moment().subtract(3, 'month').startOf('day'), moment().endOf('day'),"Week");
            // });
                                    
            // $("#btn6mnths").click(function(){
            //  cb(moment().subtract(6, 'month').startOf('day'), moment().endOf('day'),"Week");
            // });

            // $("#btn1year").click(function(){
            //  cb(moment().subtract(1, 'year').startOf('day'), moment().endOf('day'),"Month");
            // });

          cb(moment().startOf('month').startOf('day'), moment().endOf('day'),"Month");

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
              $('#reportrange span').html('<b>' +start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY')+'</b>');
              $scope.startdate=moment(start).valueOf();
              $scope.enddate=moment(end).valueOf();
              $scope.selectedfrequency=freq;

              line1active = true;
              line2active = true;

              if(!$scope.$$phase) {
                $scope.$apply(function() {
                  
                    //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                    //$scope.updatesessionchart();
                    $scope.updatedashboardsummary();
                });
              }
          }


      });


    $scope.alreadysessionloaded=false;


    $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                      	  $scope.drawtickerchart();
                         // $scope.updatesessionchart();
                         $scope.updatedashboardsummary();

                      });
                }
                else
                {
                          $scope.drawtickerchart();
                        //  $scope.updatesessionchart();
                        $scope.updatedashboardsummary();
                }
    };

    // $scope.setDates = function(start,end,freq){
    //         $scope.startdate=start;
    //         $scope.enddate=end;
    //         $scope.selectedfrequency=freq;
 
    // };

    $scope.updatedashboardsummary = function(){

      var DashboardSummaryPromise  = analyticsService.getDashboardSummary($scope.startdate,$scope.enddate,$scope.selectedfrequency);
      DashboardSummaryPromise.then(function(response){

           dashboarddata =  response.data;
           console.log(dashboarddata);

      }) ;

    };

    $scope.updatesessionchart = function(){

//Get the data

   var SessionCountsPromise  = analyticsService.getSessionCounts($scope.startdate,$scope.enddate,$scope.selectedfrequency);
   SessionCountsPromise.then(function(response){

   sessiondata =  response.data;
   console.log(sessiondata);
  var margin = {top: 90, right: 40, bottom: 30, left: 50},
  width = 950 - margin.left - margin.right,
  height = 330 - margin.top - margin.bottom;
  var parseDate;

  var x = d3.time.scale().range([0, width]);
  var y0 = d3.scale.linear().range([height, 0]);
  var y1 = d3.scale.linear().range([height, 0]);

  var valueline1 = d3.svg.line()
      .x(function(d) { return x(d._id); })
      .y(function(d) { return y0(d.Non_Unique_User_Count); });
      

  var valueline2 = d3.svg.line()
      .x(function(d) { return x(d._id); })
      .y(function(d) { return y1(d.Unique_User_Count); });

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
      .innerTickSize(-width)
      .outerTickSize(0);

  var yAxisRight = d3.svg.axis().scale(y1)
      .orient("right").ticks(5)
      .innerTickSize(-width)
      .outerTickSize(0); 


  sessiondata.forEach(function(d) {
      d._id = parseDate(d._id);
      d.Non_Unique_User_Count = +d.Non_Unique_User_Count;
      d.Unique_User_Count = +d.Unique_User_Count;
  });


  // Scale the range of the sessiondata
  x.domain(d3.extent(sessiondata, function(d) { return d._id; }));
  y0.domain([0, d3.max(sessiondata, function(d) { 
      return Math.max(d.Non_Unique_User_Count); })]);  
  y1.domain([0, d3.max(sessiondata, function(d) {
      return Math.max(d.Unique_User_Count); })]); 



 var svg = d3.select("#dualchartsession");

   var tip1 = d3.tip()
     .attr('class', 'd3-tip')
     .attr('id','tip1')
     .offset([-9, 0])
     .html(function (d) {
     return "<strong>Total Number of Sessions:</strong> <span style='color:red'>" + d.Non_Unique_User_Count +"</span>";
 })

  var tip2 = d3.tip()
       .attr('class', 'd3-tip')
      .attr('id','tip2')
       .offset([-10, 0])
       .html(function (d) {
       return "<strong>Unique Number of Sessions:</strong> <span style='color:red'>" + d.Unique_User_Count +"</span>";
   })


if($scope.alreadysessionloaded==false)
{
    
      svg = d3.select("#dualchartsession")
          .append("svg")
              .attr("width", width + margin.left + margin.right + 10)
              .attr("height", height + margin.top + margin.bottom + 30)
          .append("g")
              .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip1);
      svg.call(tip2);

      var xAxisOrig = svg.append("g")            // Add the X Axis
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis);

       xAxisOrig.selectAll("text")  // select all the text elements for the xaxis
          .style("text-anchor", "end")
          .style("fill", "red")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("font-family","sans-serif")
          //.attr("font-weight","bold")
          .attr("transform", function(d) {
              return "rotate(-55)";
        });

      var yAxisLeftG = svg.append("g")
          .attr("class", "y axis axisLeft")
          .style("fill", "steelblue")
          .call(yAxisLeft);   

        var yAxisLeftLabelText = "Total number of sessions";
        var yAxisLeftLabelOffset = 40;

        var yAxisLeftLabel = yAxisLeftG.append("text")
          .style("text-anchor", "middle")
          .attr("transform", "translate(-" + yAxisLeftLabelOffset + "," + (height / 2) + ") rotate(-90)")
          .attr("class", "label")
          .text(yAxisLeftLabelText);

      var yAxisRightG = svg.append("g")             
                      .attr("class", "y axis axisRight")    
                      .attr("transform", "translate(" + width + " ,0)") 
                      .style("fill", "orange")       
                      .call(yAxisRight);

        var yAxisRightLabelText = "Unique number of sessions";
        var yAxisRightLabelOffset = 40;

        var yAxisRightLabel = yAxisRightG.append("text")
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + yAxisRightLabelOffset + "," + (height/2) + ") rotate(90)")
          .attr("class", "label")
          .text(yAxisRightLabelText);

      svg.append("path")        // Add the valueline path. 
      .style("stroke", "steelblue")
      .style("fill", "none")
      .style("stroke-width", "2")
      .style("opacity", "1")
      .attr("d", valueline1(sessiondata))
      .attr("class","line1")
      .attr("id","line1");

      svg.append("path")        // Add the valueline2 path.
          .style("stroke", "orange")
          .style("fill", "none")
          .style("stroke-width", "2")
          .style("opacity", "1")
          .attr("d", valueline2(sessiondata))
          .attr("class","line2")
          .attr("id","line2");

      var bluecircles = svg.selectAll(".data-point1").data(sessiondata);

      bluecircles.enter()
             .append("svg:circle")
             .attr("class", 'data-point1');


      bluecircles
      .attr("cx", function (d, i) {
             return x(d._id);
         })
      .attr("cy", function (d, i) {
             return y0(d.Non_Unique_User_Count);
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

      var redcircles = svg.selectAll(".data-point2").data(sessiondata);

      redcircles.enter()
             .append("svg:circle")
             .attr("class", 'data-point2');


      redcircles
      .attr("cx", function (d, i) {
             return x(d._id);
         })
      .attr("cy", function (d, i) {
             return y1(d.Unique_User_Count);
         })
      .attr("r", 3)
      .style("opacity", "1")
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);

      redcircles
      .exit()
      .transition()
      .attr('r', 0)
      .remove();


       var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 100)
        .attr('transform', 'translate(-90,-225)');


        legend.append("rect")
        .attr("x", width - 75)
        .attr("y", height - 40)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "steelblue")
        .on("click", function(){
                // Determine if current line is visible 
                var active   = line1active ? false : true;
                var newOpacity = active ? 0 : 1; 
                // Hide or show the elements based on the ID
                d3.select("#line1")//d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity",newOpacity); 

                  // svg.selectAll(".data-point1")
                  //     .transition().duration(100) 
                  //     .style("opacity",newOpacity); 

                  if(newOpacity==1)
                  {
                      svg.selectAll(".data-point1")
                         // .transition().duration(100) 
                          .style("opacity",newOpacity)
                          .on('mouseover', tip1.show)
                          .on('mouseout', tip1.hide);
                  }
                  else
                  {
                       svg.selectAll(".data-point1")

                         // .transition().duration(100) 
                          .style("opacity",newOpacity)
                          .on('mouseover', tip1.hide)
                          .on('mouseout', tip1.hide);
                  }

                // Update whether or not the elements are active
                line1active = active;
                })  ;
    
        legend.append("text")
        .attr("x", width - 60)
        .attr("y", height - 30)
        .style("fill","steelblue")
        .text("Total number of sessions");        

        legend.append("rect")
        .attr("x", width - 75)
        .attr("y", height - 20)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "orange")
        .on("click", function(){
            // Determine if current line is visible 
            var active   = line2active ? false : true;
            var newOpacity = active ? 0 : 1; 
            // Hide or show the elements based on the ID
            d3.select("#line2")//d.key.replace(/\s+/g, ''))
                .transition().duration(100) 
                .style("opacity",newOpacity); 

            if(newOpacity==1)
            {
                svg.selectAll(".data-point2")
                    //.transition().duration(100) 
                    .style("opacity",newOpacity)
                    .on('mouseover', tip2.show)
                    .on('mouseout', tip2.hide);
            }
            else
            {
                 svg.selectAll(".data-point2")
                    //.transition().duration(100) 
                    .style("opacity",newOpacity)
                    .on('mouseover', tip2.hide)
                    .on('mouseout', tip2.hide);
            }
     
            // Update whether or not the elements are active
            line2active = active;
        })  ;
    
        legend.append("text")
        .attr("x", width - 60)
        .attr("y", height - 10)
        .style("fill","orange")
        .text("Unique number of sessions");

      //updatecircle(data);

      $scope.alreadysessionloaded = true;
    }
    else
    {


    // Select the section we want to apply our changes to
    var svg = d3.select("#dualchartsession").transition();

   //    var tip3 = d3.tip()
   //     .attr('class', 'd3-tip')
   //     .offset([-10, 0])
   //     .html(function (d) {
   //     return "<strong>Total Number of Sessions:</strong> <span style='color:red'>" + d.Non_Unique_User_Count +"</span>";
   // })

   //  var tip4 = d3.tip()
   //       .attr('class', 'd3-tip')
   //       .offset([-10, 0])
   //       .html(function (d) {
   //       return "<strong>Unique Number of Sessions:</strong> <span style='color:red'>" + d.Unique_User_Count +"</span>";
   //   })
    

    //svg.call(tip);
    // Make the changes
        svg.select(".line1")   // change the line
            .duration(750)
            .style("opacity", "1")
            .attr("d", valueline1(sessiondata));

        svg.select(".line2")   // change the line
            .duration(750)
            .style("opacity", "1")
            .attr("d", valueline2(sessiondata));
        var xAxisOrig = svg.select(".x.axis") // change the x axis
                        .duration(750)
                        .call(xAxis);

        xAxisOrig.selectAll("text")  // select all the text elements for the xaxis
            .style("text-anchor", "end")
            .style("fill", "red")
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
        svg.select(".y.axis.axisRight") // change the y axis
            .duration(750)
            .call(yAxisRight);

      var svg = d3.select("#dualchartsession").select("svg").select("g");

      svg.call(tip1);
      svg.call(tip2);
      // svg.call(tip);
                //Attach the data to the graph
      var bluecircles = svg.selectAll(".data-point1").data(sessiondata);

      bluecircles.enter()
             .append("svg:circle").attr("class", 'data-point1');


      bluecircles
      .attr("cx", function (d, i) {
             return x(d._id);
         })
      .attr("cy", function (d, i) {
             return y0(d.Non_Unique_User_Count);
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


      var redcircles = svg.selectAll(".data-point2").data(sessiondata);

      redcircles.enter()
             .append("svg:circle")
             .attr("class", 'data-point2');


      redcircles
      .attr("cx", function (d, i) {
             return x(d._id);
         })
      .attr("cy", function (d, i) {
             return y1(d.Unique_User_Count);
         })
      .attr("r", 3)
      .style("opacity", "1")
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);

      redcircles
      .exit()
      .transition()
      .attr('r', 0)
      .remove();

    }
  });

  };

$scope.drawtickerchart = function()
{
var TickerDataPromise  = analyticsService.getTickerData($scope.tickerstartdate);
TickerDataPromise.then(function(response){

    data=response.data;
    totallength = data.length;
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1025 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

		//var trial = new Date('10/31/2015 03:30:00');
		//console.log(trial.setSeconds(trial.getSeconds() + 15));
		    //data = d3.range(20).map(next); // starting dataset
		  i=0;
		// function next() {
		//     return {
		//          // time: t=t+1500,
		//          time : trial.setSeconds(trial.getSeconds() + 15),
		//           value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5))),
		//     };
		// }
		var i =0;
		//console.log(data);


		// data = [
  //           {time: 1446242430000,value: 69},
  //           {time: 1446242700000,value: 40},
		// 	{time: 1446242715000,value: 42}
  //              ];
		  
		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");
		    //.ticks(5);

		xAxis.ticks(d3.time.seconds, 60);

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left") 
		    .ticks(5);

		var chart = d3.select("#tickerchart").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         
		  data.forEach(function(d) {
		      d._id = +d._id;
		      d.count = +d.count;
		  });

		  //x.domain(data.map(function(d) { return d._id; }));
		  x.domain([d3.min(data, function(d) { return d._id; }), d3.max(data, function(d) { return d._id; })]);
		  y.domain([0, d3.max(data, function(d) { return d.count; })]);

		  var xAxisOrg = chart.append("g")
		                .attr("class", "x axisticker")
		                .attr("transform", "translate(0," + height + ")")
		                .call(xAxis);

		  chart.append("g")
		      .attr("class", "y axisticker")
		      .call(yAxis)
		      .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Users");


		   var tip1 = d3.tip()
		     .attr('class', 'd3-tip')
		     .offset([-10, 0])
		     .html(function (d) {
		     return "<strong>Total number of online users:</strong> <span style='color:red'>" + d.count +"</span>";
		 })

		  chart.call(tip1);
		  console.log(data);

		    chart.selectAll(".tickerbar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "tickerbar")
		      //.attr("x", function(d) { return x(d._id); })
		      .attr("x", function(d,i) {return x(d._id) ; })
		      .attr("width", 10)
		      //.attr("y", function(d) { return y(d.vax(lu);e); })
		      .attr("y", function(d) { return y(d.count) ; })
		      .attr("height", function(d) { return height - y(d.count); })
		      .on('mouseover', tip1.show)
		      .on('mouseout', tip1.hide);

		      nextnumber = (data[totallength-1]._id + 15000);
		      console.log("this is next number");
               console.log(nextnumber);


             timer = setInterval(function(){
                            console.log("ankit shah start");
					        $scope.tickerstartdate = $scope.tickerstartdate + 15000;
					        //$scope.enddate = $scope.enddate + 15000;
					        console.log(nextnumber);
							var TickerDataPromise1  = analyticsService.getTickerData(nextnumber);
							TickerDataPromise1.then(function(response1){
					           
					          console.log("before redraw");
					          data1 = response1.data;
					          console.log(data1);
					          if(data1.length == 0 )
					          {
					          	data1.push({'_id' : nextnumber, 'count' : 0});
					          }
					          //console.log(data);
					          data.shift();
					          // console.log("data1");
					          // console.log(data1);
					          //console.log(data1[17]);
					          
					          data.push(data1[0]);

							   //redraw(data);

							 console.log("redraw");
						      console.log(data);

						        data.forEach(function(d) {
				                                d._id = +d._id;
				                                d.count = +d.count;
				                              });

						      x.domain([d3.min(data, function(d) { return d._id; }), d3.max(data, function(d) { return d._id; })]);
						      y.domain([0, d3.max(data, function(d) { return d.count; })]);



						    var rect = chart.selectAll(".tickerbar")
						        .data(data, function(d) { return d._id; });

						             //slide the x-axis left
						      xAxisOrg.transition()
						          .duration(15000)
						          .ease("linear")
						          .call(xAxis);


						    rect
						    .enter().append("rect")
						      .attr("class", "tickerbar")
						      .attr("x", function(d, i) {  console.log(d);console.log(d._id);return x(d._id + 15000);  })
						      //.attr("x", x(findlast(19)))
						      .attr("width", 10)
						      .attr("y", function(d) { return y(d.count) ; })
						      //.attr("y", function(d) { return 100; })
						      .attr("height", function(d) { return height - y(d.count); })
						      .on('mouseover', tip1.show)
						      .on('mouseout', tip1.hide)
						       .transition()
						        .duration(15000)
						        .ease("linear")
						        .attr("x", function(d, i) { return x(d._id) ; });


						      rect
						       .transition()
						       .duration(15000)
						       .ease("linear")
						       .attr("x", function(d, i) { return x(d._id) ; }); 


		       	   // set_idout(function(){
							     rect.exit()
							         .transition()
							         .duration(10)
							         .ease("linear")
							         .attr("x", function(d,i) {return x(0);})
							         .remove();

							   nextnumber = nextnumber + 15000;
							    console.log("ankit shah end");
							})
                       },15010);

	})

};

}]);
