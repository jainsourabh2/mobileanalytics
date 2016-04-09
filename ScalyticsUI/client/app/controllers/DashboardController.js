nameApp.controller('DashboardCtrl', ['$scope','$rootScope','$http','analyticsService',function ($scope,$rootScope,$http,analyticsService){

//Ticker code start
var appKey = $('#txtappkey').val();


$rootScope.appKey = appKey;
console.log($rootScope.appKey);

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

    $(window).off("resize");
});


    $(function() {

            $("#btncurrmonth").click(function(){
             cb(moment().startOf('month').startOf('day'), moment().endOf('day'),"Month");
            });

            $("#btnprevmonth").click(function(){
             cb(moment().subtract(1, 'month').startOf('month').startOf('day'), moment().subtract(1, 'month').endOf('month').endOf('day'),"Month");
            });

            $("#anchcurrmonth").click(function(){
             cb(moment().startOf('month').startOf('day'), moment().endOf('day'),"Month");
            });

            $("#anchprevmonth").click(function(){
             cb(moment().subtract(1, 'month').startOf('month').startOf('day'), moment().subtract(1, 'month').endOf('month').endOf('day'),"Month");
            });

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
              $('#reportrange span').html('<b>' +start.format('MMM D,YYYY') + ' - ' + end.format('MMM D,YYYY')+'</b>');
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

      var DashboardSummaryPromise  = analyticsService.getDashboardSummary($rootScope.appKey,$scope.startdate,$scope.enddate,$scope.selectedfrequency);
      DashboardSummaryPromise.then(function(response){
           $scope.dashboardsummarydata = {};
           dashboarddata =  response.data;
           console.log('anks');
           //console.log(dashboarddata);

$scope.dashboardsummarydata.Non_Unique_User_Count = (dashboarddata.Non_Unique_User_Count != undefined ? dashboarddata.Non_Unique_User_Count :0 );
$scope.dashboardsummarydata.Unique_User_Count = (dashboarddata.Unique_User_Count != undefined ? dashboarddata.Unique_User_Count :0 );
$scope.dashboardsummarydata.Total_Time_Spent = (dashboarddata.Total_Time_Spent != undefined ? dashboarddata.Total_Time_Spent :0 );
$scope.dashboardsummarydata.New_User_Count = (dashboarddata.New_User_Count != undefined ? dashboarddata.New_User_Count :0 );
$scope.dashboardsummarydata.Total_Event_Count = (dashboarddata.Total_Event_Count != undefined ? dashboarddata.Total_Event_Count :0 );
$scope.dashboardsummarydata.Total_Crash_Count = (dashboarddata.Total_Crash_Count != undefined ? dashboarddata.Total_Crash_Count :0 );


           console.log($scope.dashboardsummarydata);

      }) ;

    };

 

$scope.drawtickerchart = function()
{
var TickerDataPromise  = analyticsService.getTickerData($rootScope.appKey,$scope.tickerstartdate);
TickerDataPromise.then(function(response){

    data=response.data;
    totallength = data.length;
  var margin = {top: 10, right: 20, bottom: 20, left: 35},
    width = 1050 - margin.left - margin.right,
    height = 175 - margin.top - margin.bottom;

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
    //  {time: 1446242715000,value: 42}
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
        .ticks(5)
        .tickFormat(d3.format("d"))
        .tickSubdivide(0);

    var chart = d3.select("#tickerchart").append("svg")
        .attr("id","chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('viewBox', '0 0 1050 175')
        .attr('perserveAspectRatio', 'xMinYMid')
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

      var yAxisOrg = chart.append("g")
          .attr("class", "y axisticker")
          .call(yAxis);


       var tip1 = d3.tip()
         .attr('class', 'd3-tip')
         .offset([-10, 0])
         .html(function (d) {
         return "<span style='color:red'>" + d.count +"</span>";
     })

      chart.call(tip1);
      console.log(data);

        chart.selectAll(".tickerbar")
          .data(data)
        .enter().append("rect")
          .attr("class", "tickerbar")
          //.attr("x", function(d) { return x(d._id); })
          .attr("x", function(d,i) {return x(d._id) ; })
          .attr("width", 12)
          //.attr("y", function(d) { return y(d.vax(lu);e); })
          .attr("y", function(d) { return y(d.count) ; })
          .attr("height", function(d) { return height - y(d.count); })
          .on('mouseover', tip1.show)
          .on('mouseout', tip1.hide);

          nextnumber = (data[totallength-1]._id + 15000);
          console.log("this is next number");
               console.log(nextnumber);

    var the_chart = $("#chart"),
        aspect = the_chart.width() / the_chart.height(),
        container = the_chart.parent();

    $(window).on("resize", function() {
      console.log('resize');
      var targetWidth = container.width();
      the_chart.attr("width", targetWidth);
      the_chart.attr("height", Math.round(targetWidth / aspect));
/*      the_chart.attr("height", container.height());*/

    }).trigger("resize");

             timer = setInterval(function(){
                            console.log("ankit shah start");
                  $scope.tickerstartdate = $scope.tickerstartdate + 15000;
                  //$scope.enddate = $scope.enddate + 15000;
                  console.log(nextnumber);
              var TickerDataPromise1  = analyticsService.getTickerData($rootScope.appKey,nextnumber);
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


                  //slide the x-axis left
                  yAxisOrg.transition()
                      .duration(15000)
                      //.ease("linear")
                      .call(yAxis);

                rect
                .enter().append("rect")
                  .attr("class", "tickerbar")
                  .attr("x", function(d, i) {  console.log(d);console.log(d._id);return x(d._id + 15000);  })
                  //.attr("x", x(findlast(19)))
                  .attr("width", 12)
                  .attr("y", function(d) { return y(d.count) ; })
                  //.attr("y", function(d) { return 100; })
                  .attr("height", function(d) { return height - y(d.count); })
                  .on('mouseover', tip1.show)
                  .on('mouseout', tip1.hide)
                   .transition()
                    .duration(15000)
                    .ease("linear")
                    .attr("x", function(d, i) { return x(d._id) ; })
                    .attr("y", function(d) { return y(d.count) ; })
                    .attr("height", function(d) { return height - y(d.count); });


                  rect
                   .transition()
                   .duration(15000)
                   .ease("linear")
                   .attr("x", function(d, i) { return x(d._id) ; })
                   .attr("y", function(d) { return y(d.count) ; })
                   .attr("height", function(d) { return height - y(d.count); });


               // set_idout(function(){
                   rect.exit()
                       .transition()
                       .duration(10)
                       .ease("linear")
                       .attr("x", function(d,i) {return x(0);})
                       .attr("y", function(d) { return y(d.count) ; })
                       .attr("height", function(d) { return height - y(d.count); })
                       .remove();

                 nextnumber = nextnumber + 15000;
                  console.log("ankit shah end");
              })
                       },15010);

  })

};

}]);
