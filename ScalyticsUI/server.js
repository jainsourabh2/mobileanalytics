var express = require('express');
var app = express();
var databasecontroller = require('./server/Controllers/session_controller');
var devicepiechartcontroller = require('./server/Controllers/pie_controller');
var eventscontroller = require('./server/Controllers/event_controller');
var retentioncontroller = require('./server/Controllers/retention_controller');
var tickercontroller = require('./server/Controllers/ticker_controller');
var summarycontroller = require('./server/Controllers/summary_controller');

app.get('/', function (req, res) {
  // res.send('Hello World!');
  res.sendFile(__dirname + '/home.html');
});

app.get('/analytics', function (req, res) {
  // res.send('Hello World!');
  res.sendFile(__dirname + '/mainpage.html');
});

app.get('/database/summarydata', summarycontroller.summarydata);

//app.get('/database/usersplit', databasecontroller.usersplit);

// app.get('/database/sessioncounts', databasecontroller.sessioncounts);

//app.get('/database/sessionduration', databasecontroller.sessionduration);

app.get('/database/insightsession', databasecontroller.insightsession);

app.get('/database/insightuser', databasecontroller.insightuser);

app.get('/database/devicepiecharts', devicepiechartcontroller.devicepiecharts);

app.get('/database/userretention', retentioncontroller.userretention);

app.get('/database/ticker', tickercontroller.ticker);

app.get('/database/eventssummary', eventscontroller.eventSummary);

app.get('/database/events', eventscontroller.eventNames);

app.get('/database/eventscomparisiondata', eventscontroller.eventCounts);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname));
