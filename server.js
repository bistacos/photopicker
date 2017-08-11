// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var port = process.env.PORT || 8080; 				// set the port

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var routes = require('./app/routes.js');

// configuration ===============================================================
app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// connect to Mongo ============================================================
// Connection URL
var url = 'mongodb://localhost:27017/puppies';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  app.db = db;

  routes(app); // pass db connection to our routes
  console.log("Connected successfully to server");
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
