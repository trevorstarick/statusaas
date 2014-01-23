var express = require('express');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('sloths'));
app.use(express.session());
app.use(app.router);
app.use(stylus.middleware({
	src: __dirname + '/public',
	compile: function (str, path) {
		return stylus(str)
			.set('filename', path)
			//.set('compress', false) // Enable in DEV (non-min)
			.set('compress','true') // Enable in PROD (min)
			.use(nib());
	}
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req,res){
	res.send(200);
});
app.get('/code/200', function (req,res) {
	res.render('code',{
		statusGroup: 'success', 
		statusCode: 200, 
		statusName: 'Success', 
		statusMessage: 'Wow such files'
	});
});
app.get('/code/404', function (req,res) {
	res.render('code',{
		statusGroup: 'client', 
		statusCode: 404, 
		statusName: 'File not found', 
		statusMessage: 'You messed up somewhere'
	});
});
app.get('/code/418', function (req,res) {
	res.send('<iframe width="100vh" height="100vh%" src="//www.youtube.com/embed/e69-GO4bYLM?autoplay=1" frameborder="0" allowfullscreen></iframe>');
});
app.get('/code/503', function (req,res) {
	res.render('code',{
		statusGroup: 'server', 
		statusCode: 503, 
		statusName: 'Internal server error', 
		statusMessage: 'I messed up all over the where'
	});
});
app.get('/code/:code', function(req,res) {
	var statusGroups = ['info','success','redirect','client','server'];
	var statusCode = req.params.code;
	var statusGroup = statusGroups[Math.floor(statusCode/100)-1];
	res.render('code',{
		statusGroup: statusGroup, 
		statusCode: statusCode, 
		statusName: statusGroup, 
		statusMessage: statusGroup
	});
});
app.get('/status/maintenance/', function (req,res) {
	var site = req.params.site ? req.params.site : 'The site';
	res.render('status',{
		statusGroup: 'maintenance', 
		statusCode: 'Maintenance', 
		statusMessage: site+' is currently undergoing maintenace.',
		twitter: req.query.twitter
	});
});
app.get('/status/maintenance/:site', function (req,res) {
	var site = req.params.site ? req.params.site : 'The site';
	res.render('status',{
		statusGroup: 'maintenance', 
		statusCode: 'Maintenance', 
		statusMessage: site+' is currently undergoing maintenace.',
		twitter: req.query.twitter
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
