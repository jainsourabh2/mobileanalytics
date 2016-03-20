nameApp.controller('WorldMapCtrl', ['$scope','analyticsService',function ($scope,analyticsService)
{

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
                    $scope.setDates();
                    //$scope.updatesessionchart();
                });
              }
          }


      });

      $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                          
                          $scope.setDates();

                      });
                }
                else
                {
                  $scope.setDates();
                }
       };

  $scope.alreadymaploaded=false;

  $scope.setDates = function()
  {

    var DeviceUsersbyCitiesDataPromise  = analyticsService.getDeviceUsersbyCitiesData($scope.startdate,$scope.enddate,$scope.selectedfrequency);
    DeviceUsersbyCitiesDataPromise.then(function(response){

      var deviceusersbycitiesdata =  response.data;
      updateWorldMap("#worldMap",deviceusersbycitiesdata);

      $scope.alreadymaploaded = true;

    });


  }

  function updateWorldMap(div,data)
  {


    var width = 1025,
    height = 575,
    centered;

   var projection = d3.geo.mercator()
    .center([0, 50 ])
    .scale(150)
    .rotate([0,0]);

   var tip1 = d3.tip()
       .attr('class', 'd3-tip')
       .attr('id','tip1')
       .offset([-9, 0])
       .html(function (d) {
       return "<span style='color:orange'>" + d.cityname + ":" + d.totnumberofusers + "</span>";
   });

    if($scope.alreadymaploaded==false)
    {


          var svg = d3.select(div).append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr('viewBox', '0 0 1025 575')
              .attr('perserveAspectRatio', 'xMinYMid')
              .attr('id','world_map_svg');


          svg.call(tip1);
          var path = d3.geo.path()
              .projection(projection);

          var g = svg.append("g");

          // load and display the World
          d3.json("json/world-110m2.json", function(error, topology) {

          g.selectAll("path")
                .data(topojson.object(topology, topology.objects.countries)
                    .geometries)
              .enter()
                .append("path")
                .attr("d", path)
                .on("click", clicked); //newly added for trial

          var circles = g.selectAll(".countrymap-circle").data(data);

          circles.enter()
                  .append("svg:circle")
                  .attr("class", 'countrymap-circle');

            circles
             .attr("cx", function(d) {
                     return projection([d.lon, d.lat])[0];
             })
             .attr("cy", function(d) {
                     return projection([d.lon, d.lat])[1];
             })
             .attr("r", 3)
             .style("fill", "red")
             .style("opacity", "1")
             .on('mouseover', tip1.show)
             .on('mouseout', tip1.hide);

          circles
          .exit()
          .transition()
          .attr('r', 0)
          .remove();   


          });


      }
      else
      {

          var svg = d3.select(div).select("svg").select("g");

          svg.call(tip1);


          circles = svg.selectAll(".countrymap-circle").data(data);

          circles.enter()
                 .append("svg:circle").attr("class", 'countrymap-circle');


          circles
             .attr("cx", function(d) {
                     return projection([d.lon, d.lat])[0];
             })
             .attr("cy", function(d) {
                     return projection([d.lon, d.lat])[1];
             })
             .attr("r", 3)
             .style("fill", "red")
            .style("opacity", "1")
            .on('mouseover', tip1.show)
            .on('mouseout', tip1.hide);

          circles
          .exit()
          .transition()
          .attr('r', 0)
          .remove();

      }

        var the_chart = $("#world_map_svg"),
            aspect = the_chart.width() / the_chart.height(),
            container = the_chart.parent();

        $(window).on("resize", function() {
          console.log('resize');
          var targetWidth = container.width();
          the_chart.attr("width", targetWidth);
          the_chart.attr("height", Math.round(targetWidth / aspect));
    /*      the_chart.attr("height", container.height());*/

        }).trigger("resize");
    
      function clicked(d) {
        var x, y, k;

        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }

        g.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });

        g.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
      }
/*        function initialize() {
          proj.scale(6700);
          proj.translate([-1240, 720]);
        }*/
    

  }


}]);