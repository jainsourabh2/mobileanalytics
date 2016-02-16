nameApp.controller('CountryMapCtrl', ['$scope','analyticsService',function ($scope,analyticsService)
{

      $(function() {

          function cb(start, end, freq) {
              $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
              $scope.startdate=start;
              $scope.enddate=end;
              $scope.selectedfrequency=freq;

              if(!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.setDates(start,end,freq);
                    });
              }

          }
          cb(moment().subtract(29, 'days'), moment(),"Last 30 Days");

          $('#reportrange').daterangepicker({
              ranges: {
                 "Last 30 Days": [moment().subtract(29, 'days'), moment()],
                 "Last 7 Days": [moment().subtract(6, 'days'), moment()],
                 "Last 365 Days": [moment().subtract(365, 'days'), moment()],
                 "Today": [moment(), moment()],
                 "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                 "This Month": [moment().startOf('month'), moment().endOf('month')],
                 "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
              }
          }, cb);

      });

      $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                          
                          $scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);

                      });
                }
                else
                {
                  $scope.setDates($scope.startdate,$scope.enddate,$scope.selectedfrequency);
                }
       };

  $scope.alreadymaploaded=false;

  $scope.setDates = function(start,end,freq)
  {
      $scope.startdate=start;
      $scope.enddate=end;
      $scope.selectedfrequency=freq;

      data = analyticsService.getDeviceUsersbyCitiesData($scope.startdate,$scope.enddate,$scope.selectedfrequency);
      updateCountryMap("#countrymap",data);


      $scope.alreadymaploaded = true;
  }

  function updateCountryMap(div,data)
  {


    var w = 600;
    var h = 600;
    var proj = d3.geo.mercator();
    var path = d3.geo.path().projection(proj);
    var t = proj.translate(); // the projection's default translation
    var s = proj.scale() // the projection's default scale

    if($scope.alreadymaploaded==false)
    {

          var tooltip = d3.select("body")
              .append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

          tooltip.append("div")
                 .attr("class", "city-title");

          tooltip.append("div")
              .attr("class", "city-users");

          var map = d3.select(div).append("svg:svg")
              .attr("width", w)
              .attr("height", h)
             // .call(d3.behavior.zoom().on("zoom", redraw))
              .call(initialize);

          var india = map.append("svg:g")
              .attr("id", "india");

          d3.json("json/states.json", function (json) {
            india.selectAll("path")
                .data(json.features)
              .enter().append("path")
                .attr("d", path);
          });

           var g = map.append("svg:g").attr("id", "mapcircles");;

          var circles = g.selectAll(".countrymap-circle").data(data);

          circles.enter()
                  .append("svg:circle")
                  .attr("class", 'countrymap-circle');

          circles.attr("cx", function(d) {
                 
                   return proj([d.lon, d.lat])[0];
           })
           .attr("cy", function(d) {
               
                   return proj([d.lon, d.lat])[1];
           })
           .attr("r", 4)
          .on("mouseenter", function(d) {
              //d3.select(this).classed('hover', true);
              tooltip.transition()
                .duration(0)
                .style("opacity", 1);

                tooltip.select('.city-title')
                  .text(d.cityname);

                tooltip.select('.city-users')
                  .text(d.totnumberofusers);
            })
          .on("mousemove", function(d) {
              tooltip.style("left", (d3.event.pageX+5) + "px")
                .style("top", (d3.event.pageY+5) + "px");
            })
          .on("mouseleave", function(d) {
              //d3.select(this).classed('hover', false);
              tooltip.transition()
                .duration(0)
                .style("opacity", 0);
            });
           
           //.style("fill", "red")

            circles
            .exit()
            .transition()
            .attr('r', 0)
            .remove();
      }
      else
      {
          initialize();


          var g = d3.select(div).select("svg").select("#mapcircles");

          var tooltip = d3.select("body").select(".tooltip");

          var circles = g.selectAll(".countrymap-circle").data(data);

          circles.enter()
                  .append("svg:circle")
                  .attr("class", 'countrymap-circle');

          circles.attr("cx", function(d) {
                 
                   return proj([d.lon, d.lat])[0];
           })
           .attr("cy", function(d) {
               
                   return proj([d.lon, d.lat])[1];
           })
           .attr("r", 4)
          .on("mouseenter", function(d) {
              //d3.select(this).classed('hover', true);
              tooltip.transition()
                .duration(100)
                .style("opacity", 1);

                tooltip.select('.city-title')
                  .text(d.cityname);

                tooltip.select('.city-users')
                  .text(d.totnumberofusers);
            })
          .on("mousemove", function(d) {
              tooltip.style("left", (d3.event.pageX+5) + "px")
                .style("top", (d3.event.pageY+5) + "px");
            })
          .on("mouseleave", function(d) {
              //d3.select(this).classed('hover', false);
              tooltip.transition()
                .duration(100)
                .style("opacity", 0);
            });
           
           //.style("fill", "red")

            circles
            .exit()
            .transition()
            .attr('r', 0)
            .remove();

      }

        function initialize() {
          proj.scale(6700);
          proj.translate([-1240, 720]);
        }
    

  }


}]);