// Import dependencies
// ===================
// framework we will use for the webapp
var express = require('express');

// framework we will use to handle websockets
var socketio = require('socket.io');

// needed to server our webapp
// created separately so we can use it for both (1) HTTP server and (2) Web Sockets server
var http = require('http');

// library that makes it easier to send HTTP requests and receive responses
var request = require('request');

// ===================

// initialize express
var app = express();

// make files in /public available
app.use(express.static('public'));

var http_server = http.Server(app);

// create new instance of socketio using the http server
var io = socketio(http_server);

// Track users currently on the site
// (In real-world apps, we would NOT use a variable on the server like this.)
// (We would use a DB or cache to maintain state e.g. active users.)
var activeUsers = [];

var elasticSearch = 'http://localhost:9200'

io.on('connection', function(socket) {
	var msgDumpQuery = elasticSearch + '/talkytalk/messages/_search?q=*&sort=timestamp:desc&size=100';
	request(msgDumpQuery, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var respJson = JSON.parse(body);
			var requestResults = respJson.hits.hits;
			var msgHistory = [];
			for (var i = 0; i < requestResults.length; i++) {
				msgHistory.push(requestResults[i]._source);
			}
			socket.emit('msgHistory', {
				'messages': msgHistory
			});
		} else {
			console.log(error, response);
		}
	});

	// when we receive a message send it to everyone else in the room
	// and index into Elasticsearch
	socket.on('sendMessage', function(message) {
		io.emit('messageReceived', message);
		indexMessage(message);
	});

	// when a new user connects, we need to add them to activeUsers
	// and tell everyone to update their user view
	socket.on('newUser', function(msg) {
		var index = activeUsers.indexOf(msg.user);
		if (index == -1) {
			activeUsers.push(msg.user);
			io.emit('updateUsers', {
				'users': activeUsers
			});
		}
	});

	// respond to users search queries
	socket.on('searchRequest', function(search) {
		var query = elasticSearch + '/talkytalk/messages/_search?q=' + search.q + '&size=10';
		request(query, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var respJson = JSON.parse(body);
				var requestResults = respJson.hits.hits;
				var searchResults = [];
				for (var i = 0; i < requestResults.length; i++)
					searchResults.push(requestResults[i]._source);
				socket.emit('searchResults', {
					'results': searchResults
				});
			}
		});
	});

	// have to update activeUsers and clients user lists
	socket.on('userLeaving', function(msg) {
		// logic for removing the user from the array of active users
		var index = activeUsers.indexOf(msg.user);
		if (index > -1)
			activeUsers.splice(index, 1);
		// emit the new list of users to all
		io.emit('updateUsers', {
			'users': activeUsers
		});
	});
}); // end of socketio

// helper function for indexing messages into elasticSearch
function indexMessage(message) {
	request({
		url: elasticSearch + '/talkytalk/messages/',
		qs: {
			from: 'chat client',
			time: new Date()
		}, //Query string data
		method: 'POST',
		//Lets post the following key/values as form
		json: message
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		}
		console.log(response.statusCode, body);
	});
}

// respond with index.html when a user performs a get request at '/'
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// have our HTTP server listen for requests on port 8080
http_server.listen(8080, function() {
	console.log('listening on *:8080');
});
