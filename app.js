
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var enquete = require('./routes/enquete');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', enquete.enquete_list);
app.get('/users', user.list);
app.get('/enquete:id', enquete.enquete_page);
app.get('/end_enquete:id', enquete.ended_enquete_page);
app.post('/enquete_vote', enquete.enquete_vote);
app.post('/end_enquete_vote', enquete.end_enquete_vote);
app.post('/add_choices', enquete.add_choices);

app.post('/create_enquete', enquete.create_enquete);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
