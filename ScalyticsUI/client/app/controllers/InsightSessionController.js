nameApp.controller('InsightSessionCtrl', ['$scope','$http','analyticsService',function ($scope,$http,analyticsService){

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
              $('#reportrange span').html('<b>' +start.format('MMM D,YYYY') + ' - ' + end.format('MMM D,YYYY')+'</b>');
              $scope.startdate=moment(start).valueOf();
              $scope.enddate=moment(end).valueOf();
              $scope.selectedfrequency=freq;


              if(!$scope.$$phase) {
                $scope.$apply(function() {
                  
                    //$scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                    $scope.updatesessionchart();
                    //$scope.updatesessionchart();
                });
              }
          }


      });


    $scope.alreadysessionloaded=false;


    $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                        $scope.updatesessionchart();
                         // $scope.updatesessionchart();

                      });
                }
                else
                {

                        $scope.updatesessionchart();
                       //  $scope.updatesessionchart();
                }
    };


    $scope.updatesessionchart = function(){

//Get the data

       var SessionDetailsPromise  = analyticsService.getInsightSessionDetails($scope.startdate,$scope.enddate,$scope.selectedfrequency);
       SessionDetailsPromise.then(function(response){

       var sessiondata =  response.data;
       console.log(sessiondata);
       var sessioncountdata=[];
       var sessiondurationdata=[];
       for(var key in sessiondata)
       {
          console.log(key);
          sessioncountdata.push({'_id' : sessiondata[key]._id, 'TotalCount' : sessiondata[key].Non_Unique_User_Count});
          sessiondurationdata.push({'_id' : sessiondata[key]._id, 'TotalCount' : sessiondata[key].Total_Time_Spent});
       }

       console.log(sessioncountdata);
       var sessiondata1 = JSON.parse(JSON.stringify(sessiondata));

       $scope.updatesessiondetailschart('#chartsessioncount','divchartsessioncountsvg',sessioncountdata);
       $scope.updatesessiondetailschart('#chartsessionduration','divchartsessiondurationsvg',sessiondurationdata);

       $scope.alreadysessionloaded = true;

     })

 };

 $scope.updatesessiondetailschart = function(div,divid,sessiondata){

  var margin = {top: 20, right: 20, bottom: 55,left: 40},
  width = 1000 - margin.left - margin.right,
  height = 214 - margin.top - margin.bottom;
  var parseDate;

  var x = d3.time.scale().range([0, width]);
  var y0 = d3.scale.linear().range([height, 0]);

  var valueline1 = d3.svg.line()
      .x(function(d) { return x(d._id); })
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
      .innerTickSize(-width)
      .outerTickSize(0);


  sessiondata.forEach(function(d) {
      d._id = parseDate(d._id);
      d.TotalCount = +d.TotalCount;
  });


  // Scale the range of the sessiondata
  x.domain(d3.extent(sessiondata, function(d) { return d._id; }));
  y0.domain([0, d3.max(sessiondata, function(d) { 
      return Math.max(d.TotalCount); })]);  


 var svg = d3.select(div);

   var tip1 = d3.tip()
     .attr('class', 'd3-tip')
     .attr('id','tip1')
     .offset([-9, 0])
     .html(function (d) {
     return "<span style='color:red'>" + d.TotalCount +"</span>";
 })



if($scope.alreadysessionloaded==false)
{
    
      svg = d3.select(div)
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("id",divid)
              .attr('viewBox', '0 0 1000 214')
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
          .style("fill", "grey")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("font-family","sans-serif")
          //.attr("font-weight","bold")
          .attr("transform", function(d) {
              return "rotate(-55)";
        });

      var yAxisLeftG = svg.append("g")
          .attr("class", "y axis axisLeft")
          .style("fill", "grey")
          .call(yAxisLeft);   

        // var yAxisLeftLabelText = "Total number of sessions";
        // var yAxisLeftLabelOffset = 40;

        // var yAxisLeftLabel = yAxisLeftG.append("text")
        //   .style("text-anchor", "middle")
        //   .attr("transform", "translate(-" + yAxisLeftLabelOffset + "," + (height / 2) + ") rotate(-90)")
        //   .attr("class", "label")
        //   .text(yAxisLeftLabelText);


      svg.append("path")        // Add the valueline path. 
      .style("stroke", "orange")
      .style("fill", "none")
      .style("stroke-width", "2")
      .style("opacity", "1")
      .attr("d", valueline1(sessiondata))
      .attr("class","line1")
      .attr("id","line1");


      var bluecircles = svg.selectAll(".data-point1").data(sessiondata);

      bluecircles.enter()
             .append("svg:circle")
             .attr("class", 'data-point1');


      bluecircles
      .attr("cx", function (d, i) {
             return x(d._id);
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

      //updatecircle(data);

    }
    else
    {


    // Select the section we want to apply our changes to
    var svg = d3.select(div).transition();


    //svg.call(tip);
    // Make the changes
        svg.select(".line1")   // change the line
            .duration(750)
            .style("opacity", "1")
            .attr("d", valueline1(sessiondata));


        var xAxisOrig = svg.select(".x.axis") // change the x axis
                        .duration(750)
                        .call(xAxis);

        xAxisOrig.selectAll("text")  // select all the text elements for the xaxis
            .style("text-anchor", "end")
            .style("fill", "grey")
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


      var svg = d3.select(div).select("svg").select("g");

      svg.call(tip1);
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

    var the_chart1 = $("#divchartsessioncountsvg"),
    aspect1 = the_chart1.width() / the_chart1.height(),
    container1 = the_chart1.parent();

    var the_chart2 = $("#divchartsessiondurationsvg"),
    aspect2 = the_chart2.width() / the_chart2.height(),
    container2 = the_chart2.parent();

    $(window).on("resize", function() {
      console.log('resize insight session');
      var targetWidth1 = container1.width();
      the_chart1.attr("width", targetWidth1);
      the_chart1.attr("height", Math.round(targetWidth1 / aspect1));

      var targetWidth2 = container2.width();
      the_chart2.attr("width", targetWidth2);
      the_chart2.attr("height", Math.round(targetWidth2 / aspect2));      

    }).trigger("resize");

  };


}]);
