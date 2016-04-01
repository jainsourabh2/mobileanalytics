nameApp.controller('DevicePieChartCtrl', ['$scope','$route','$rootScope','analyticsService',function ($scope,$route,$rootScope,analyticsService)
{

    $scope.$on("$destroy", function(){

        $(window).off("resize");
    });

    $scope.devicesubtype = $route.current.devicesubtype;
    $scope.myValue = true;
    //console.log(devicesubtype);

   var the_chart1,the_chart2,the_chart3,aspect1,aspect2,aspect3,container1,container2,container3;


     if($scope.devicesubtype =='deviceManufacturer')
      {
        $scope.showdeviceManufacturer=true;
        the_chart1 = $("#divsubdeviceManufacturersvg1");
        the_chart2 = $("#divsubdeviceManufacturersvg2");
      }
     if($scope.devicesubtype == 'deviceModel')
      {
        $scope.showdeviceModel=true;
        the_chart1 = $("#divsubdeviceModelsvg1");
        the_chart2 = $("#divsubdeviceModelsvg2");
        the_chart3 = $("#divsubdeviceModelsvg3");        
      }
     if($scope.devicesubtype =='deviceType')
      {
        $scope.showdeviceType=true;
        the_chart1 = $("#divsubdeviceTypesvg1");
        the_chart2 = $("#divsubdeviceTypesvg2");
        the_chart3 = $("#divsubdeviceTypesvg3");        
      }
     if($scope.devicesubtype == 'devicePlatform')
     {
       $scope.showdevicePlatform=true;
        the_chart1 = $("#divsubplatformsvg1");
        the_chart2 = $("#divsubplatformsvg2");
        the_chart3 = $("#divsubplatformsvg3");       
     }
     if($scope.devicesubtype == 'deviceOSVersion')
      {
        $scope.showdeviceOSVersion=true;
        the_chart1 = $("#divsuboperatingSystemVersionsvg1");
        the_chart2 = $("#divsuboperatingSystemVersionsvg2");
        the_chart3 = $("#divsuboperatingSystemVersionsvg3");        
      }
     if($scope.devicesubtype =='deviceAppVersion')
      {
        $scope.showdeviceAppVersion=true;
        the_chart1 = $("#divsubappVersionsvg1");
        the_chart2 = $("#divsubappVersionsvg2");
        the_chart3 = $("#divsubappVersionsvg3");        
      }
     if($scope.devicesubtype == 'deviceCarrier')
      {
        $scope.showdeviceCarrier=true;
        the_chart1 = $("#divsubcarriersvg1");
        the_chart2 = $("#divsubcarriersvg2");
        the_chart3 = $("#divsubcarriersvg3");        
      }
     if($scope.devicesubtype =='deviceResolution')
      {
        $scope.showdeviceResolution=true;
        the_chart1 = $("#divsubresolutionsvg1");
        the_chart2 = $("#divsubresolutionsvg2");
        the_chart3 = $("#divsubresolutionsvg3");        
      }

        aspect1 = the_chart1.width() / the_chart1.height();
        container1 = the_chart1.parent();

        aspect2 = the_chart2.width() / the_chart2.height(),
        container2 = the_chart2.parent();



      $(function() {
          console.log("ankit shah");
          $('#reportrange').daterangepicker({
              linkedCalendars: false,
              minDate: moment().subtract(365, 'days'),
              maxDate: moment(),
              // ranges: {
              //    "Last 30 Days": [moment().subtract(29, 'days'), moment()],
              //    "Last 7 Days": [moment().subtract(6, 'days'), moment()],
              //    "Last 365 Days": [moment().subtract(365, 'days'), moment()],
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
          
          // if($rootScope.alreadyloaded == 'false')
          // {
             cb(moment().subtract(12, 'month').startOf('day'), moment().endOf('day'),"Week");
          //    $rootScope.alreadyloaded = 'true;'
          // }

          function cb(start, end, freq) {
            if(freq==undefined)
            {
               var diff = end.diff(start,'days');
               if(diff<=31)
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

              if(!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.UpdatePiecharts();
                    });
              }
              //$scope.setDates(start,end,freq);
          }

      });

      $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                          
                          $scope.UpdatePiecharts();

                      });
                }
                else
                {
                  $scope.UpdatePiecharts();
                }
    };

  $scope.alreadypiechartloaded=false;

  $scope.UpdatePiecharts = function()
  {

      console.log($rootScope.currentpage);
      $rootScope.currentpage = 'devicerootscope';

      console.log($scope.currentpage1);
      $scope.currentpage1 = 'devicescope';

      var DevicePieChartsPromise  = analyticsService.getDevicePieCharts($scope.startdate,$scope.enddate,$scope.selectedfrequency);
      DevicePieChartsPromise.then(function(response){

      devicepiechartdata = response.data;
      //console.log(devicepiechartdata);

      for(i=0;i<devicepiechartdata.length;i++)
      {
        if(devicepiechartdata[i]._id=="device")
        {
          $scope.deviceModeldata = devicepiechartdata[i].value;
        }
        else if(devicepiechartdata[i]._id=="deviceManufacturer")
        {
          $scope.deviceManufacturerdata = devicepiechartdata[i].value; 
        }
        else if(devicepiechartdata[i]._id=="deviceType")
        {
          $scope.deviceTypedata = devicepiechartdata[i].value; 
        }
        else if(devicepiechartdata[i]._id=="platform")
        {
          $scope.platformdata = devicepiechartdata[i].value; 
        }
        else if(devicepiechartdata[i]._id=="operatingSystemVersion")
        {
          $scope.operatingSystemVersiondata = devicepiechartdata[i].value; 
        }
        else if(devicepiechartdata[i]._id=="appVersion")
        {
          $scope.appVersiondata = devicepiechartdata[i].value; 
        }
        else if(devicepiechartdata[i]._id=="carrier")
        {
          $scope.carrierdata = devicepiechartdata[i].value; 
        }
        else if(devicepiechartdata[i]._id=="resolution")
        {
          $scope.resolutiondata = devicepiechartdata[i].value; 
        }                                        
      }

     if($scope.devicesubtype =='deviceManufacturer')
      {
        updatedevicepiechart("#divsubdeviceManufacturer","divsubdeviceManufacturer",$scope.deviceManufacturerdata);
      }
     if($scope.devicesubtype == 'deviceModel')
      {
       updatedevicepiechart("#divsubdeviceModel","divsubdeviceModel",$scope.deviceModeldata);       
      }
     if($scope.devicesubtype =='deviceType')
      {
       updatedevicepiechart("#divsubdeviceType","divsubdeviceType",$scope.deviceTypedata);     
      }
     if($scope.devicesubtype == 'devicePlatform')
     {
       updatedevicepiechart("#divsubplatform","divsubplatform",$scope.platformdata);      
     }
     if($scope.devicesubtype == 'deviceOSVersion')
      {
        updatedevicepiechart("#divsuboperatingSystemVersion","divsuboperatingSystemVersion",$scope.operatingSystemVersiondata);       
      }
     if($scope.devicesubtype =='deviceAppVersion')
      {
        updatedevicepiechart("#divsubappVersion","divsubappVersion",$scope.appVersiondata);      
      }
     if($scope.devicesubtype == 'deviceCarrier')
      {
        updatedevicepiechart("#divsubcarrier","divsubcarrier",$scope.carrierdata);       
      }
     if($scope.devicesubtype =='deviceResolution')
      {
        updatedevicepiechart("#divsubresolution","divsubresolution",$scope.resolutiondata);      
      }


    $(window).on("resize", function() {

      console.log('resize');
      var targetWidth1 = container1.width();
      the_chart1.attr("width", targetWidth1);
      the_chart1.attr("height", Math.round(targetWidth1 / aspect1));
/*      the_chart1.attr("height", container1.height());*/

      var targetWidth2 = container2.width();
      the_chart2.attr("width", targetWidth2);
      the_chart2.attr("height", Math.round(targetWidth2 / aspect2));
/*     the_chart2.attr("height", container2.height());*/

/*      var targetWidth3 = container3.width();
      the_chart3.attr("width", targetWidth3);
      the_chart3.attr("height", Math.round(targetWidth3 / aspect3));    */    
/*    the_chart3.attr("height", container3.height());    
*/
    }).trigger("resize");

      $scope.alreadypiechartloaded = true;

     })
  }

  function updatedevicepiechart(div,divclass,data)
  {

/*    if(data.length == 0)
    {
      $(div + ' span').html("No Data Found");
    }
    else
    {
      $(div + ' span').html("");
    }*/

    var width1 = 500,
        height = 300;

    var  width2 = width1,
        radius = 125;

    var width3= width1/2;

    // var color = d3.scale.ordinal()
    //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

    var color = d3.scale.category20();
    //var color = d3.scale.category20c();

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(70);

    var pie1 = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.Unique_User_Count; });

    var pie2 = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Total_Time_Spent; });

    data.forEach(function(d) {
      d.Unique_User_Count = +d.Unique_User_Count;
      d.Total_Time_Spent = +d.Total_Time_Spent;
    });
     
     var total1=0;
     var total2=0;
     for(var i = 0;i<data.length;i++)
     {
       total1 = total1 + data[i].Unique_User_Count;
       total2 = total2 + data[i].Total_Time_Spent;
     }

    if($scope.alreadypiechartloaded == false)
    {
        var svg1 = d3.select(div+"div1")
           .append("svg")
            .attr("id",divclass+"svg1")
            .attr("class","divpiechartssvg1")
            .attr("width", width1)
            .attr("height", height)
            .attr('viewBox', '0 0 500 300')
            .attr('perserveAspectRatio', 'xMinYMid');

        var svg2 = d3.select(div+"div2")
           .append("svg")
            .attr("id",divclass+"svg2")
            .attr("class","divpiechartssvg2")
            .attr("width", width2)
            .attr("height", height)
            .attr('viewBox', '0 0 500 300')
            .attr('perserveAspectRatio', 'xMinYMid');            
          // .append("g")
          //   .attr("class","g1")
          //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var arcs1 = svg1.selectAll("g.arc1")
            .data(pie1(data))
            .enter()
            .append("g")
            .attr("class", "arc1")
            //.attr("fill","steelblue")
            .attr("transform", "translate(" + ((width1/4))  + "," + ((height / 2))   + ")");


        var arcs2 = svg2.selectAll("g.arc2")
            .data(pie2(data))
            .enter()
            .append("g")
            .attr("class", "arc2")
            //.attr("fill","steelblue")
            .attr("transform", "translate(" + ((width2/4))  + "," + ((height / 2))   + ")");

        var paths1 = arcs1.append("path")
            .attr("fill", function (d, i) {
                    return color(i);
                })
            .attr("d", arc);

        var paths2 = arcs2.append("path")
            .attr("fill", function (d, i) {
                    return color(i);
                })
            .attr("d", arc);

        var circle1 = arcs1.append("circle")
                    .attr({
                      cx: function(d,i){
                        return 0;
                      },
                      cy: function(d,i){
                        return 0;
                      },
                      r: 70,
                      fill: "#000",
                      //stroke: "#2F3550",
                      //"stroke-width": 2.4192
                    });

        var circle2 = arcs2.append("circle")
                    .attr({
                      cx: function(d,i){
                        return 0;
                      },
                      cy: function(d,i){
                        return 0;
                      },
                      r: 70,
                      fill: "#000",
                      //stroke: "#2F3550",
                      //"stroke-width": 2.4192
                    });

        arcs1.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'FontAwesome')
            .attr('fill', '#fff')
            .attr('font-size', '80px' )
            //.text("ankit shah");
            .text(function(d) {  return '\uf0c0' }); 

        arcs2.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'FontAwesome')
            .attr('fill', '#fff')
            .attr('font-size', '80px' )
            //.text("ankit shah");
            .text(function(d) {  return '\uf017' }); 
        // arcs.append("text")d9d9d9
        // .attr("transform", function (d) {
        //     d.innerRadius = radius;
        //         return "translate(" + arc.centroid(d) + ")";
        //     })
        // .attr("text-anchor", "middle")
        //     .text(function (d) {
        //         return  parseFloat((parseInt(d.value)/total * 100.00)).toFixed(2) +"%";
        //     })
        // .style("fill", "#fff");
    

        var legend = svg1.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(220,60)');
    
        var legend1 = svg1.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(270,60)');

        legend.selectAll('rect')
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 50)
        .attr("y", function (d, i) {
                return i * 20;
            })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
                return color(i);
            });
console.log("trial");
console.log(data);

    legend.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 70)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                console.log(d);
                return (d._id); 
            });


    legend1.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 170)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                console.log(d);
                return (parseFloat((parseInt(d.Unique_User_Count)/total1 * 100.00)).toFixed(2) +"%"); 
            });

        var legend = svg2.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(220,60)');

        var legend1 = svg2.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(270,60)');

        legend.selectAll('rect')
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 50)
        .attr("y", function (d, i) {
                return i * 20;
            })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
                return color(i);
            });
    
    legend.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 70)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                return d._id; 
            });

    legend1.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 170)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                console.log(d);
                return (parseFloat((parseInt(d.Total_Time_Spent)/total2 * 100.00)).toFixed(2) +"%"); 
            });

    }
     else
     {

      d3.select(div+"div1").select("svg").selectAll("g.arc1").remove();
      d3.select(div+"div2").select("svg").selectAll("g.arc2").remove();
      d3.select(div+"div1").select("svg").selectAll("text").remove();
      d3.select(div+"div2").select("svg").selectAll("text").remove();
      d3.select(div+"div1").select("svg").selectAll("rect").remove();
      d3.select(div+"div2").select("svg").selectAll("rect").remove();

      var paths1 = d3.select(div+"div1").select("svg").selectAll("g.arc1").data(pie1(data));
      var paths2 = d3.select(div+"div2").select("svg").selectAll("g.arc2").data(pie2(data));


      var pathsEnter1 = paths1
        .enter()
      .append("g")
        .attr("class", "arc1")
        //.attr("transform", "translate(" + radius + "," + radius + ")");
        .attr("transform", "translate(" + ((width1 / 4))  + "," + ((height / 2))   + ")");

      var pathsEnter2 = paths2
        .enter()
      .append("g")
        .attr("class", "arc2")
        //.attr("transform", "translate(" + radius + "," + radius + ")");
        .attr("transform", "translate(" + ((width2 / 4))  + "," + ((height / 2))   + ")");
    
    pathsEnter1
      .append("path")
        .attr("fill", function (d, i) {
                return color(i);
            })
        .attr("d", arc);

    pathsEnter2
      .append("path")
        .attr("fill", function (d, i) {
                return color(i);
            })
        .attr("d", arc);


            var circle1 = pathsEnter1.append("circle")
                    .attr({
                      cx: function(d,i){
                        return 0;
                      },
                      cy: function(d,i){
                        return 0;
                      },
                      r: 70,
                      fill: "#000",
                      //stroke: "#2F3550",
                      //"stroke-width": 2.4192
                    });

        var circle2 = pathsEnter2.append("circle")
                    .attr({
                      cx: function(d,i){
                        return 0;
                      },
                      cy: function(d,i){
                        return 0;
                      },
                      r: 70,
                      fill: "#000",
                      //stroke: "#2F3550",
                      //"stroke-width": 2.4192
                    });

        pathsEnter1.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'FontAwesome')
            .attr('fill', '#fff')
            .attr('font-size', '80px' )
            //.text("ankit shah");
            .text(function(d) {  return '\uf0c0' }); 

        pathsEnter2.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'FontAwesome')
            .attr('fill', '#fff')
            .attr('font-size', '80px' )
            //.text("ankit shah");
            .text(function(d) {  return '\uf017' }); 
        // pathsEnter.append("text")
        // .attr("transform", function (d) {
        //     d.innerRadius = radius;
        //         return "translate(" + arc.centroid(d) + ")";
        //     })
        // .attr("text-anchor", "middle")
        //     .text(function (d) {
        //         return  parseFloat((parseInt(d.value)/total * 100.00)).toFixed(2) +"%";
        //     })
        // .style("fill", "#fff");

        var svg1 = d3.select(div+"div1").select("svg");
        var svg2 = d3.select(div+"div2").select("svg");


        var legend = svg1.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(220,60)');
    
        var legend1 = svg1.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(270,60)');

        legend.selectAll('rect')
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 50)
        .attr("y", function (d, i) {
                return i * 20;
            })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
                return color(i);
            });
console.log("trial");
console.log(data);

    legend.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 70)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                console.log(d);
                return (d._id); 
            });


    legend1.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 170)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                console.log(d);
                return (parseFloat((parseInt(d.Unique_User_Count)/total1 * 100.00)).toFixed(2) +"%"); 
            });

        var legend = svg2.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(220,60)');

        var legend1 = svg2.append("g")
        .attr("class", "legend")
        .attr("height", height)
        .attr("width", width3)
        .attr('transform', 'translate(270,60)');

        legend.selectAll('rect')
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 50)
        .attr("y", function (d, i) {
                return i * 20;
            })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
                return color(i);
            });
    
    legend.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 70)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                return d._id; 
            });

    legend1.selectAll('text')
        .data(data)
        .enter()
        .append("text")
        .attr("x", 170)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                console.log(d);
                return (parseFloat((parseInt(d.Total_Time_Spent)/total2 * 100.00)).toFixed(2) +"%"); 
            });

        

     }

    }

}]);