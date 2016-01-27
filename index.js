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
var Flickr = require("flickrapi"),
	flickrOptions = {
		api_key: "55e57731da1d654b70f11a2b12ba3ba9",
		secret: "f6daac98bf41bb52"
	};
	
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.set('port', (process.env.PORT || 5000));
//app.set('port', (process.env.PORT || 443));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
/*this is for CORS*/
app.options('*',cors());
app.get('/', function(request, response) {
  response.render('pages/index');
});
app.post('/flickr',cors(), function(request, response){
	Flickr.tokenOnly(flickrOptions, function(error, flickr){
		search = {
			api_key: flickrOptions.api_key,
			tags: request.body.city + "," + request.body.state + ",landscape",
			tag_mode: 'all',
			privacy_filters: 1,
			media: 'photos',
			geo_context: 2,
			lat: request.body.latitude,
			lon: request.body.longitude,
			radius: 5,
			radius_units: "mi"
		};
		flickr.photos.search(search, function(err, result){
			console.log(result);
			response.send(result)
		});
	});
});
app.post('/getCityImage',cors(), function(request, response){
	function callbacker(resty,data){
		resty.send(data);
		
		
	}
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
	var response2 = response;
	var askGoogle = https.request(urlz, function(res) {
		result.statusz = res.statusCode;
		result.headersz = res.headers;
		var response3 = response2;
		result.data = "";
		res.on('data', function(d){
			
			//process.stdout.write(d);
			result.data += d.toString();
			console.log("DATA WRITE");
			//console.log(JSON.stringify(result.data));
			res.resume();
			//callbacker(response,result);
		});
	   res.on('end',function(end){
		   console.log("RESPONSE ENDED");
		   console.log(result.data);
		   result.json = JSON.parse(result.data);
		  // response.send(result)
		  secondAsk(result.json);
	   });
	}).on('error', function(e){
		
		console.error(e);
		result.error = e;
		
		response.send(result)
	
	});
	console.log("AFTER REQUEST");
	askGoogle.end(function(){
		console.log("INSIDE AFTER");
		console.log(result);
		//response.send(result)
		
	});
	function secondAsk(json){
		var place_id = json.results[1].place_id;
		var reference = json.results[1].place_id;
		
		
	}
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


