const express = require('express');
const app = express();
const url = require('url');
const http = require('http');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var db = require('./db');
var RateLimit = require('ratelimit.js').RateLimit;
var ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;
var redis = require('redis');
const expressValidator = require('express-validator');

var Limiter = require('express-rate-limiter');
var MemoryStore = require('express-rate-limiter/lib/memoryStore');
var limiter = new Limiter({ db : new MemoryStore(), outerLimit: 5, outerTimeLimit: 3600000 });
//var limiter = new Limiter({ db : new MemoryStore()});

passport.use(new Strategy(
  function(token, cb) {
    db.users.findByToken(token, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }));

function requestHandler(request, response) {
	var parsed = url.parse(request.url);
	var auth = request.headers['authorization'];

	// If the given input is invalid
	if ((parsed.query == null) || (parsed.query == ''))  {
		data = "City and Countryname are empty. Please provide appropriate inputs. Example http://localhost:3000/weather?q=Chennai,India?access_token=202ce19a-ebf8-4a44-ad64-9ffd41a6aec0"
		response.writeHead(412, {
		'Content-Type': 'text/plain',
		'Content-Length': data.length});
		response.end(data);
	}
	// URL is good to go !
	else {
		// Parse the url values
		resarray = parsed.query.split("=")
		city = resarray[1].split(",")[0]
		countryname = resarray[1].split(",")[1]
		countryname = countryname.split("&")[0]
		if(typeof resarray[2] != 'undefined'){
			access_token = resarray[2]
		}
		// Validate the input correctness
		if ((!city instanceof String) || (!countryname instanceof String)|| (!access_token instanceof String)) {
			data = "City and Countryname has to be string inputs. Example http://localhost:3000/weather?q=Chennai,India?access_token=202ce19a-ebf8-4a44-ad64-9ffd41a6aec0"
			response.writeHead(412, {
			'Content-Type': 'text/plain',
			'Content-Length': data.length});
			response.end(data);
		}
		else if ((city.indexOf(",") > -1) || (countryname.indexOf(",") > -1) || (access_token.indexOf(",") > -1)) {
			data = "City and Countryname has to be string inputs with only one comma "," in between. Example http://localhost:3000/weather?q=Chennai,India?access_token=202ce19a-ebf8-4a44-ad64-9ffd41a6aec0"
			response.writeHead(412, {
			'Content-Type': 'text/plain',
			'Content-Length': data.length});
			response.end(data);	
		}
		else {
			console.log(" All validations success")
			// Logic to call OpenWeatherApp Service with the given parameters in URL.
			var client = redis.createClient(); //creates a new client
			client.on('connect', function() {
				console.log('connected');
				client.exists(access_token, function(err, reply) {
				if (reply === 1) {
						// Logic to add counters to database against each Key, 
						// if count(key) entries in db % 5 == 0
						//  then we can pass error messages
						data = "API Key has been successfully authenticated with rate limitations"
						response.writeHead(412, {'Content-Type': 'text/plain','Content-Length': data.length});
						response.end(data);	
				} else {
							data = "Invalid API Key"
							response.writeHead(412, {'Content-Type': 'text/plain','Content-Length': data.length});
    }
});

			});
		}
	}

}

app.get('/', passport.authenticate('bearer', { session: false }), limiter.middleware({headers: true}), function(request, response) { 
 requestHandler(request, response)

});

app.get('/weather', passport.authenticate('bearer', { session: false }), limiter.middleware({headers: true}), function(request, response) {  
 //r = checkApiKey()
 requestHandler(request, response)

});

app.listen(3000, ()=> console.log('listening on port 3000'));

