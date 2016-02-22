nameApp.controller('UserRetentionChartCtrl', ['$scope','analyticsService',function ($scope,analyticsService)
{
    
    //$scope.currentpopoverstatus ='hide';
      $scope.UserType = 'New';

      $(document).on('click', '#anchornew', function() {

          console.log("this is new trial");
          $scope.currentpopoverstatus='hide';
          $('#anchorpop').text("New");
          $('#privacy-menu').addClass('cssnew');
          $('#privacy-menu').removeClass('cssreturning');
          $('a[rel=popover]').popover($scope.currentpopoverstatus);
          $scope.UserType = 'New';

            if(!$scope.$$phase) {
                  $scope.$apply(function () {
                      $scope.UpdateRetention();
                  });
            }
            
         });

      $(document).on('click', '#anchorret', function() {

          console.log("this is ret trial");
          $scope.currentpopoverstatus='hide';
          $('#anchorpop').text("Returning");
          $('#privacy-menu').removeClass('cssnew');
          $('#privacy-menu').addClass('cssreturning');
          $('a[rel=popover]').popover($scope.currentpopoverstatus);
          $scope.UserType = 'Returning';

            if(!$scope.$$phase) {
                  $scope.$apply(function () {
                      $scope.UpdateRetention();
                  });
            }
         });

      $(function() {

              $('a[rel=popover]').popover().click(function(e) {
                                                  $(this).popover('toggle');
                                                  e.stopPropagation();

                                                    if($('#anchorpop').text()=='New') 
                                                     {
                                                       $('#privacy-menu').addClass('cssnew');
                                                       $('#privacy-menu').removeClass('cssreturning');
                                                     } 
                                                     else 
                                                     {
                                                       $('#privacy-menu').addClass('cssreturning');
                                                       $('#privacy-menu').removeClass('cssnew');
                                                     }
                                                  
                                              });



              // $(document).on('click', 'a[rel=popover]', function() {
                  
              //     $('a[rel=popover]').popover('show');
              //     console.log("user clicked");
              //     // console.log($scope.currentpopoverstatus);
              //     // if($scope.currentpopoverstatus=='hide')
              //     // {
              //     //   $scope.currentpopoverstatus='show';
              //     //   //$('a[rel=popover]').popover('show');
                    
              //     // }
              //     // else
              //     // {
              //     //   $scope.currentpopoverstatus='hide';
              //     //   //$('a[rel=popover]').popover('hide');
                    
              //     // }
                  

              //     });

          $('#reportrange').daterangepicker({
          	    linkedCalendars: false,
          	    minDate: moment().subtract(365, 'days'),
                maxDate: moment(),
              // ranges: {
                 // "Last 30 Days": [moment().subtract(29, 'days'), moment()],
                 // "Last 7 Days": [moment().subtract(6, 'days'), moment()],
                 // "Last 365 Days": [moment().subtract(365, 'days'), moment()],
                 // "Today": [moment(), moment()],
                 // "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                 // "This Month": [moment().startOf('month'), moment().endOf('month')],
                 // "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
              // }
          }, cb);

            // $("#btntoday").click(function(){
            //  cb(moment().startOf('day'), moment().endOf('day'),"Hour");
            // });

            // $("#btnyesterday").click(function(){
            //  cb(moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day'),"Hour");
            // });

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
              // var scope = angular.element(
              //       document.
              //       getElementById("devicepiecharts")).
              //       scope();
              if(!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.UpdateRetention();
                    });
              }
              //$scope.setDates(start,end,freq);
          }
          

      });

      $scope.init = function(){
                  if(!$scope.$$phase) {
                      $scope.$apply(function() {
                          
                          $scope.UpdateRetention();

                      });
                }
                else
                {
                  $scope.UpdateRetention();
                }
    };


  $scope.UpdateRetention = function()
  {
      // $scope.startdate=start;
      // $scope.enddate=end;
      // $scope.selectedfrequency=freq;

   var UserRetentionPromise  = analyticsService.getUserRetentionData($scope.startdate,$scope.enddate,$scope.selectedfrequency,$scope.UserType);
   UserRetentionPromise.then(function(response){

      data1 = response.data;
      //console.log(data1);
  
      updateuserretentionchart("userRetentionChart",data1);
   })

	   // var NewUserRetentionPromise  = analyticsService.getNewUserRetentionData($scope.startdate,$scope.enddate,$scope.selectedfrequency);
	   // NewUserRetentionPromise.then(function(response1){

	   //    data2 = response1.data;
	   //    //console.log(data2);
	        
	   //    updateuserretentionchart("newUserRetentionChart",data2);	     

    //  })


  }

	function updateuserretentionchart(tableId,data)
	{
		// console.log(data[0]["_id"]["key"]);
		// console.log(data[0]._id.key);
		// console.log(data[0].value);
		// console.log(data[0].value[0]);
		// console.log(data[1].value[0]);
		// console.log(data[2].value[0]);
		// console.log(data[3].value[0]);
		// console.log(data[4].value[0]);
		// console.log(data[5].value[0]);


	   var table = document.getElementById(tableId);
	   var rowCount = table.rows.length;
	   //console.log(rowCount);
	   if(rowCount>0)
	   {
         //console.log("if function called");
         $("table").children().remove();
	   }

       var i=0;
       var row,newcell;
       console.log(data.length);
	   if(data.length > 0)
	   { 
	      //console.log(mainkey);
	      
	      row = table.insertRow(0);
	      newcell=row.insertCell(i);
	      newcell.rowSpan = 2;
	      newcell.innerHTML ='<h4>Range</h4>';
	      newcell.className = 'headercolumn';

	      newcell=row.insertCell(i+1);
	      newcell.colSpan = data.length;
	      newcell.innerHTML ='<h4>&nbsp;'+ $scope.selectedfrequency +'&nbsp;</h4>';
	      newcell
	      newcell.className = 'headercolumn';

	      row = table.insertRow(1);

	      for(var key in data[0].value)
	      {
	      	//console.log(data[0].value)
	      	newcell = row.insertCell(i);
	      	newcell.innerHTML ='<h5> '+(i)+'</h5>';

              newcell.className = 'headercolumn';

	      	  i++;
	      }

	      var j;

		  for(i=0;i<data.length;i++)
		  {
		   	
		   	row = table.insertRow(i+2);
	   	    j=0;
	   	    newcell = row.insertCell(j);
	   	    //moment(data[i]._id.key, 'yyyymmdd').format('ddmmyyyy')
	   	    if($scope.selectedfrequency=="Month")
	   	    {
               newcell.innerHTML ='<h5>'+moment(data[i]._id.key, 'YYYYMM').format('MMM YYYY')+'</h5>';
	   	    }
    			else
    			{
    				newcell.innerHTML ='<h5>'+moment(data[i]._id.key, 'YYYYMMDD').format('DD MMM YYYY')+'</h5>';
    			}
            
            newcell.className = 'cellstarter';
            mainkey=data[i]._id.key;
            j++;
            //console.log("this is main key:" + mainkey);

		   	 for(var key in data[i].value)
		   	 { 
              var finalvalue;
		   	 	    newcell = row.insertCell(j);

		            //newcell.innerHTML ='<h6> &nbsp;'+data[i].value[key]+'&nbsp;</h6>';
                if(data[i].value[mainkey] == 0)
                {
                  finalvalue=0;
                }
                else
                {
                 finalvalue = parseInt(parseInt(data[i].value[key])/parseInt(data[i].value[mainkey])*100);
                }
                newcell.innerHTML ='<h6>'+finalvalue+'</h6>';

		            if(finalvalue>70)
		            {
		            	newcell.className = 'category71to100';
		            }
		            else if(finalvalue>40)
		            {
		            	newcell.className = 'category41to70';
		            }
		            else if(finalvalue>-1)
		            {
		            	newcell.className = 'category0to40';
		            }
		            else
		            {
		            	newcell.className = 'categorynone';
		            }	            

                newcell.title = data[i].value[key] + " users";
		            j++;

		   	 }
		   }

	   }


	}
 

}]);