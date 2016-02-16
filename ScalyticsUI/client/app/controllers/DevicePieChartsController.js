nameApp.controller('DevicePieChartCtrl', ['$scope','$route','$rootScope','analyticsService',function ($scope,$route,$rootScope,analyticsService)
{

    $scope.devicesubtype = $route.current.devicesubtype;
    $scope.myValue = true;
    //console.log(devicesubtype);


     if($scope.devicesubtype =='deviceManufacturer'){$scope.showdeviceManufacturer=true;}
     if($scope.devicesubtype == 'deviceModel'){$scope.showdeviceModel=true;}
     if($scope.devicesubtype =='deviceType'){$scope.showdeviceType=true;}
     if($scope.devicesubtype == 'devicePlatform'){$scope.showdevicePlatform=true;}
     if($scope.devicesubtype == 'deviceOSVersion'){$scope.showdeviceOSVersion=true;}
     if($scope.devicesubtype =='deviceAppVersion'){$scope.showdeviceAppVersion=true;}
     if($scope.devicesubtype == 'deviceCarrier'){$scope.showdeviceCarrier=true;}
     if($scope.devicesubtype =='deviceResolution'){$scope.showdeviceResolution=true;}




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
              $('#reportrange span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
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

// console.log(devicedata);
// console.log(deviceManufacturerdata);
// console.log(deviceTypedata);
// console.log(platformdata);
// console.log(operatingSystemVersiondata);
// console.log(appVersiondata);
// console.log(carrierdata);
// console.log(resolutiondata);

updatedevicepiechart("#divsubdeviceModel",$scope.deviceModeldata);
updatedevicepiechart("#divsubdeviceManufacturer",$scope.deviceManufacturerdata);
updatedevicepiechart("#divsubdeviceType",$scope.deviceTypedata);
updatedevicepiechart("#divsubplatform",$scope.platformdata);
updatedevicepiechart("#divsuboperatingSystemVersion",$scope.operatingSystemVersiondata);
updatedevicepiechart("#divsubappVersion",$scope.appVersiondata);
updatedevicepiechart("#divsubcarrier",$scope.carrierdata);
updatedevicepiechart("#divsubresolution",$scope.resolutiondata);


      // data1 = analyticsService.getDeviceUsersbyCompanyData($scope.startdate,$scope.enddate,$scope.selectedfrequency);
      // updatedevicepiechart("#deviceCompanyPieChart",data1);
      // data2 = analyticsService.getDeviceUsersbyCarriersData($scope.startdate,$scope.enddate,$scope.selectedfrequency);
      // updatedevicepiechart("#deviceCarriersPieChart",data2)
      // data3 = analyticsService.getDeviceUsersbyOSVersions($scope.startdate,$scope.enddate,$scope.selectedfrequency);
      // updatedevicepiechart("#deviceOSVersionsPieChart",data3)

      $scope.alreadypiechartloaded = true;

     })
  }

  function updatedevicepiechart(div,data)
  {


    var width = 1000,
        height = 300,
        //radius = Math.min(width, height) / 2;
        radius = 125;

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
        var svg = d3.select(div)
           .append("svg")
            .attr("class","p")
            .attr("width", width)
            .attr("height", height);
          // .append("g")
          //   .attr("class","g1")
          //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var arcs1 = svg.selectAll("g.arc1")
            .data(pie1(data))
            .enter()
            .append("g")
            .attr("class", "arc1")
            //.attr("fill","steelblue")
            .attr("transform", "translate(" + 170  + "," + ((height / 2))   + ")");


        var arcs2 = svg.selectAll("g.arc2")
            .data(pie2(data))
            .enter()
            .append("g")
            .attr("class", "arc2")
            //.attr("fill","steelblue")
            .attr("transform", "translate(" + 800  + "," + ((height / 2))   + ")");

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


arcs1.append("text")
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cx = Math.cos(a) * (radius - 40);
        return d.x = Math.cos(a) * (radius + 15);
    })
    .attr("y", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cy = Math.sin(a) * (radius - 40);
        return d.y = Math.sin(a) * (radius + 15);
    })
    .text(function(d) { return parseFloat((parseInt(d.value)/total1 * 100.00)).toFixed(2) +"%";  })
    .each(function(d) {
        var bbox = this.getBBox();
        d.sx = d.x - bbox.width/2 - 7;
        d.ox = d.x + bbox.width/2 + 2;
        d.sy = d.oy = d.y+2;
    });

arcs2.append("text")
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cx = Math.cos(a) * (radius - 40);
        return d.x = Math.cos(a) * (radius + 15);
    })
    .attr("y", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cy = Math.sin(a) * (radius - 40);
        return d.y = Math.sin(a) * (radius + 15);
    })
    .text(function(d) { return parseFloat((parseInt(d.value)/total2 * 100.00)).toFixed(2) +"%";  })
    .each(function(d) {
        var bbox = this.getBBox();
        d.sx = d.x - bbox.width/2 - 7;
        d.ox = d.x + bbox.width/2 + 2;
        d.sy = d.oy = d.y+2;
    });

svg.append("defs").append("marker")
    .attr("id", "circ")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("refX", 3)
    .attr("refY", 3)
    .append("circle")
    .attr("cx", 3)
    .attr("cy", 3)
    .attr("r", 3);

arcs1.append("path")
    .attr("class", "pointer")
    .style("fill", "none")
    .style("stroke", "black")
    .attr("marker-end", "url(#circ)")
    .attr("d", function(d) {
        if(d.cx > d.ox) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
        } else {
            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
        }
    });

arcs2.append("path")
    .attr("class", "pointer")
    .style("fill", "none")
    .style("stroke", "black")
    .attr("marker-end", "url(#circ)")
    .attr("d", function(d) {
        if(d.cx > d.ox) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
        } else {
            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
        }
    });
        var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 150)
        .attr('transform', 'translate(-40,60)');
    
        legend.selectAll('rect')
        .data(data)
        .enter()
        .append("rect")
        .attr("x", width - 525)
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
        .attr("x", width - 502)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                return d._id; 
            });


    }
     else
     {

      d3.select(div).select("svg").selectAll("g.arc1").remove();
      d3.select(div).select("svg").selectAll("g.arc2").remove();
      d3.select(div).select("svg").selectAll("rect").remove();
      d3.select(div).select("svg").selectAll("text").remove();

      var paths1 = d3.select(div).select("svg").selectAll("g.arc1").data(pie1(data));
      var paths2 = d3.select(div).select("svg").selectAll("g.arc2").data(pie2(data));


      var pathsEnter1 = paths1
        .enter()
      .append("g")
        .attr("class", "arc1")
        //.attr("transform", "translate(" + radius + "," + radius + ")");
        .attr("transform", "translate(" + 170  + "," + ((height / 2))   + ")");

      var pathsEnter2 = paths2
        .enter()
      .append("g")
        .attr("class", "arc2")
        //.attr("transform", "translate(" + radius + "," + radius + ")");
        .attr("transform", "translate(" + 800  + "," + ((height / 2))   + ")");
    
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

        var svg = d3.select(div).select("svg");

  pathsEnter1.append("text")
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cx = Math.cos(a) * (radius - 40);
        return d.x = Math.cos(a) * (radius + 15);
    })
    .attr("y", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cy = Math.sin(a) * (radius - 40);
        return d.y = Math.sin(a) * (radius + 15);
    })
    .text(function(d) { return parseFloat((parseInt(d.value)/total1 * 100.00)).toFixed(2) +"%";  })
    .each(function(d) {
        var bbox = this.getBBox();
        d.sx = d.x - bbox.width/2 - 7;
        d.ox = d.x + bbox.width/2 + 2;
        d.sy = d.oy = d.y+2;
    });

  pathsEnter2.append("text")
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cx = Math.cos(a) * (radius - 40);
        return d.x = Math.cos(a) * (radius + 15);
    })
    .attr("y", function(d) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
        d.cy = Math.sin(a) * (radius - 40);
        return d.y = Math.sin(a) * (radius + 15);
    })
    .text(function(d) { return parseFloat((parseInt(d.value)/total2 * 100.00)).toFixed(2) +"%";  })
    .each(function(d) {
        var bbox = this.getBBox();
        d.sx = d.x - bbox.width/2 - 7;
        d.ox = d.x + bbox.width/2 + 2;
        d.sy = d.oy = d.y+2;
    });

svg.append("defs").append("marker")
    .attr("id", "circ")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("refX", 3)
    .attr("refY", 3)
    .append("circle")
    .attr("cx", 3)
    .attr("cy", 3)
    .attr("r", 3);

pathsEnter1.append("path")
    .attr("class", "pointer")
    .style("fill", "none")
    .style("stroke", "black")
    .attr("marker-end", "url(#circ)")
    .attr("d", function(d) {
        if(d.cx > d.ox) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
        } else {
            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
        }
    });

pathsEnter2.append("path")
    .attr("class", "pointer")
    .style("fill", "none")
    .style("stroke", "black")
    .attr("marker-end", "url(#circ)")
    .attr("d", function(d) {
        if(d.cx > d.ox) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
        } else {
            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
        }
    });
        var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 100)
        .attr('transform', 'translate(-40,60)');
    
        legend.selectAll('rect')
        .data(data)
        .enter()
        .append("rect")
        .attr("x", width - 525)
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
        .attr("x", width - 502)
        .attr("y", function (d, i) {
                return i * 20 + 9;
            })
        .text(function (d, i) {
                //return t[i];
                return d._id;  
            });


     }


   

    }

}]);