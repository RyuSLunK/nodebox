var express = require('express')
	, cors = require('cors')
	, curl = require('curlrequest')
	, $ = require('jquery')
	, $ajax = require('ajax')
	, https = require('https')
	, http = require('http')
	, querystring = require('querystring')
	, zendesk = require('node-zendesk')
	, fs = require('fs')
	, bodyParser = require('body-parser')
	, app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});
app.post('/getCityImage', function(request, response){
	var optionz = {
		hostname: 'maps.googleapis.com',
		path: '/maps/api/place/nearbysearch/json',
		method: 'GET'
	};
	paramz = {
		key: 'AIzaSyD0vMwi4l6rl-8KK-ZtmObt_LCi_S8SzIA',
		location: request.body.location,
		keyword: request.body.keyword,
		type: request.body.type
	};
	var result = {};
	var askGoogle = https.get(optionz, (res) => {
		console.log('statusCode: ', res.statusCode);
		console.log('headers: ', res.headers);
		result.status = res.statusCode;
		result.headers = res.headers;
		
		res.on('data', (d) => {
			process.stdout.write(d);
			result.data = d;
		});
		
	}).on('error', (e) => {
		
		console.error(e);
		result.error = e;
	
	}).on('end', (s) => {
		
		console.log(s);
		result.end = s;
		
	});
	response.send()
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


