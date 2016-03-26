//Set the connection details
var mongojs		= require('mongojs');
var config		= require('../../../config/config');



module.exports.ticker = function(req,res){

 var data;
  console.log("ticker is called");
  var dbname = req.query["param1"];
  var startDateEpoch = parseInt(req.query["param2"])/1000;
  var currentTime = new Date();
  var currentTimeEpoch = Math.round(currentTime.getTime()/1000);

  var resultSet = [];


  db = mongojs(config.connectionstring + dbname);

  db.collection('real_time_data').find
  ().sort({ '_id' : 1}
   ,function (err , result) {
     if (err || !result) {
              console.log(err);
              db.close();
              return;
          }

     db.close();
     //returnresult(result);
     var arrayItem = {};
     //var resultSet = {};
     //console.log("ticker controller result anks code called");
     console.log(result);

     if(result.length <= 0)
     {
     	console.log("ticker controller anks code called");
     	result.push({'_id' : startDateEpoch, 'count' : 0});
     }

      for (var i=0; i<result.length; i++)
      {
        if (i !=0) result[i].count = result[i-1].count + result[i].count;
        arrayItem[result[i]._id] = result[i].count;
      }

      //console.log(arrayItem);

      for (var i=result[0]._id; i<=currentTimeEpoch; i = i+15)
      {
         if (i == result[0]._id) 
         {
           if ((arrayItem[i] % 1) != 0) 
           	    arrayItem[i] = 0;
         }
         else 
         {
           if ((arrayItem[i] % 1) != 0) 
                arrayItem[i] = arrayItem[i-15];
         }
        
        if (i>= startDateEpoch)
        {
        resultSet.push({'_id' : i*1000, 'count' : arrayItem[i]});
        }
      }
       console.log(resultSet);
       console.log('ticker call is complete');
       return res.json(resultSet);

  });



}
