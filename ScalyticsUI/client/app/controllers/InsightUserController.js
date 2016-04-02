nameApp.controller('InsightUserCtrl', ['$scope','$http','analyticsService',function ($scope,$http,analyticsService){

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
                    $scope.updateuserchart();
                    //$scope.updatesessionchart();
                });
              }
          }


      });


    $scope.alreadyuserloaded=false;


    $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                        $scope.updateuserchart();
                         // $scope.updatesessionchart();

                      });
                }
                else
                {

                        $scope.updateuserchart();
                       //  $scope.updatesessionchart();
                }
    };


    $scope.updateuserchart = function(){

//Get the data

       var UserDetailsPromise  = analyticsService.getInsightUserDetails($scope.startdate,$scope.enddate,$scope.selectedfrequency);
       UserDetailsPromise.then(function(response){

       var userdata =  response.data;
       console.log(userdata);
       var usercountdata=[];
       var userdurationdata=[];
       var newusercountdata=[];
       var retusercountdata=[];
       for(var key in userdata)
       {
          console.log(key);
          usercountdata.push({'_id' : userdata[key]._id, 'TotalCount' : userdata[key].Unique_User_Count});
          userdurationdata.push({'_id' : userdata[key]._id, 'TotalCount' : userdata[key].Total_Time_Spent});
          newusercountdata.push({'_id' : userdata[key]._id, 'TotalCount' : userdata[key].New_User_Count});
          retusercountdata.push({'_id' : userdata[key]._id, 'TotalCount' : (userdata[key].Unique_User_Count - userdata[key].New_User_Count)});
       }

       //console.log(sessioncountdata);
       //var userdata1 = JSON.parse(JSON.stringify(userdata));

       $scope.updateuserdetailslinechart('#chartusercount','chartusercountsvg',usercountdata);
       $scope.updateuserdetailslinechart('#chartuserduration','chartuserdurationsvg',userdurationdata);
        $scope.updateuserdetailsbarchart('#chartnewuser','chartnewusersvg',newusercountdata);
       $scope.updateuserdetailsbarchart('#chartreturninguser','chartreturningusersvg',retusercountdata);

        var the_chart1 = $("#chartusercount"),
            aspect1 = the_chart1.width() / the_chart1.height(),
            container1 = the_chart1.parent();

        var the_chart2 = $("#chartuserduration"),
            aspect2 = the_chart2.width() / the_chart2.height(),
            container2 = the_chart2.parent();

        var the_chart3 = $("#chartnewuser"),
            aspect3 = the_chart3.width() / the_chart3.height(),
            container3 = the_chart3.parent();

        var the_chart4 = $("#chartreturninguser"),
            aspect4 = the_chart4.width() / the_chart4.height(),
            container4 = the_chart4.parent();
                                    
        $(window).on("resize", function() {
          console.log('resize');
          var targetWidth1 = container1.width();
          the_chart1.attr("width", targetWidth1);
          the_chart1.attr("height", Math.round(targetWidth1 / aspect1));

          var targetWidth2 = container2.width();
          the_chart2.attr("width", targetWidth2);
          the_chart2.attr("height", Math.round(targetWidth2 / aspect2));

          var targetWidth3 = container3.width();
          the_chart3.attr("width", targetWidth3);
          the_chart3.attr("height", Math.round(targetWidth3 / aspect3));

          var targetWidth4 = container4.width();
          the_chart4.attr("width", targetWidth4);
          the_chart4.attr("height", Math.round(targetWidth4 / aspect4));                              
    /*      the_chart.attr("height", container.height());*/

        }).trigger("resize");

       $scope.alreadyuserloaded = true;

     })

 };

 $scope.updateuserdetailslinechart = function(div,divid,userdata){

  var margin = {top: 20, right: 20, bottom: 55, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 220 - margin.top - margin.bottom;
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
      .orient("left")
      .ticks(5)
      .tickFormat(d3.format("d"))
      .tickSubdivide(0)
      .innerTickSize(-width)
      .outerTickSize(0);


  userdata.forEach(function(d) {
      d._id = parseDate(d._id);
      d.TotalCount = +d.TotalCount;
  });


  // Scale the range of the userdata
  x.domain(d3.extent(userdata, function(d) { return d._id; }));
  y0.domain([0, d3.max(userdata, function(d) { 
      return Math.max(d.TotalCount); })]);  


 var svg = d3.select(div);

   var tip1 = d3.tip()
     .attr('class', 'd3-tip')
     .attr('id','tip1')
     .offset([-9, 0])
     .html(function (d) {
     return "<span style='color:red'>" + d.TotalCount +"</span>";
 })



if($scope.alreadyuserloaded==false)
{
    
      svg = d3.select(div)
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("id",divid)
              .attr('viewBox', '0 0 1000 220')
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
      .attr("d", valueline1(userdata))
      .attr("class","line1")
      .attr("id","line1");


      var bluecircles = svg.selectAll(".data-point1").data(userdata);

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
            .attr("d", valueline1(userdata));


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
      var bluecircles = svg.selectAll(".data-point1").data(userdata);

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

  };


$scope.updateuserdetailsbarchart = function(div,divid,userdata)
   {


  var margin = {top: 20, right: 20, bottom: 55, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 220 - margin.top - margin.bottom;

  var parseDate;

  var x = d3.time.scale().range([0, width]);
  //var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
  var y0 = d3.scale.linear().range([height, 0]);



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

//drawline(data);

  userdata.forEach(function(d) {
      d._id = parseDate(d._id);
      d.TotalCount = +d.TotalCount;
      });


  // Scale the range of the data
  x.domain(d3.extent(userdata, function(d) { return d._id; }));
  y0.domain([0, d3.max(userdata, function(d) { 
      return Math.max(d.TotalCount); })]);  



//var svg = d3.select("#dualchartuser");

   var tip1 = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function (d) {
     return "<span style='color:red'>" + d.TotalCount +"</span>";
 })



if($scope.alreadyuserloaded==false)
{

      svg = d3.select(div)
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("id",divid)
              .attr('viewBox', '0 0 1000 220')
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
          .attr("transform", "translate(-10," + 0 + ")")
          .style("fill", "grey")
          .call(yAxisLeft);   

        // var yAxisLeftLabelText = "Total number of new users";
        // var yAxisLeftLabelOffset = 35;

        // var yAxisLeftLabel = yAxisLeftG.append("text")
        //   .style("text-anchor", "middle")
        //   .attr("transform", "translate(-" + yAxisLeftLabelOffset + "," + (height / 2) + ") rotate(-90)")
        //   .attr("class", "label")
        //   .text(yAxisLeftLabelText);


      bars1 = svg.selectAll(".bar1").data(userdata);

      bars1.enter().append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) { return x(d._id) - 5; })
            .attr("width", 10)
            .attr("y", function(d) { return y0(d.TotalCount); })
            .attr("height", function(d,i,j) { return height - y0(d.TotalCount); })
            .on('mouseover', tip1.show)
            .on('mouseout', tip1.hide);

    }
    else
    {

   var tip1 = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function (d) {
     return "<span style='color:red'>" + d.TotalCount +"</span>";
 })


  // Scale the range of the data
  x.domain(d3.extent(userdata, function(d) { return d._id; }));
  y0.domain([0, d3.max(userdata, function(d) { 
      return Math.max(d.TotalCount); })]);  


       var svg = d3.select(div).transition();



        var xAxisOrig = svg.select(".x.axis") // change the x axis
                        .duration(750)
                        .call(xAxis);

        xAxisOrig.selectAll("text")  // select all the text elements for the xaxis
            .style("text-anchor", "end")
            .style("fill", "grey")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-family","sans-serif")
            .attr("transform", function(d) {
                return "rotate(-55)";
          });


        svg.select(".y.axis.axisLeft") // change the y axis
            .duration(750)
            .call(yAxisLeft);

       var svg = d3.select(div).select("svg").select("g");

       svg.call(tip1);

       svg.selectAll(".bar1").remove();

        bars1 = svg.selectAll(".bar1").data(userdata);

        bars1.enter().append("rect")
              .attr("class", "bar1")
              .attr("x", function(d) { return x(d._id) - 5; })
              .attr("width", 10)
              .attr("y", function(d) { return y0(d.TotalCount); })
              .attr("height", function(d,i,j) { return height - y0(d.TotalCount); })
              .on('mouseover', tip1.show)
              .on('mouseout', tip1.hide);

    }


  };



}]);
