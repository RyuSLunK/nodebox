var express = require('express')
	, $ = require('jquery')
	, $ajax = require('ajax')
	, https = require('https')
	, cors = require('cors')
	, http = require('http')
	, querystring = require('querystring')
	, fs = require('fs')
	, bodyParser = require('body-parser')
	, param = require('node-jquery-param')
	, app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
/*this is for CORS*/
app.options('*',cors());
app.get('/', function(request, response) {
  response.render('pages/index');
});
app.post('/getCityImage',cors(), function(request, response){
	var optionz = {
		hostname: 'maps.googleapis.com',
		path: '/maps/api/place/nearbysearch/json',
		method: 'GET'
	};
	paramz = {	
		radius: request.body.radius,
		location: request.body.location,
		input: request.body.keyword,
		types: request.body.type,
		key: 'AIzaSyD0vMwi4l6rl-8KK-ZtmObt_LCi_S8SzIA'
	};
	var result = {};
	console.log(JSON.stringify(paramz));
	urlz = 'https://' + optionz.hostname + optionz.path + '?' + param(paramz);
	console.log("URL IS: " + urlz);
	var response = response;
	var askGoogle = https.get(urlz, function(res) {
		console.log('statusCode: ', res.statusCode);
		console.log('headers: ', res.headers);
		result.status = res.statusCode;
		result.headers = res.headers;
		
		res.on('data', function(d){
			process.stdout.write(d);
			result.data = d;
		});
		
	}).on('error', function(e){
		
		console.error(e);
		result.error = e;
		response.send(result)
	
	}).on('end', function(s){
		
		console.log(s);
		result.end = s;
		response.send(result)
		
	});
	
	/*
	var req = https.request(optionz,function(res){
		console.log("statusCode: ", res.statusCode);
		console.log("headers: ", res.headers);
		res.on('data', function(d) {
			console.log(d);
		});
	});
	console.log("before write");
	req.write(postData);
	console.log("after write");
	req.end();
	
	req.on('error', function(e) {
		console.error(e);
		response.send({status:"failed"})
	});
	response.send({status: req.response})
	*/
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


