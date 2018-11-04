// Import dependencies
// ===================
// framework we will use for the webapp
var express = require('express');

// framework we will use to handle websockets
var socketio = require('socket.io');

// needed to server our webapp
// created separately so we can use it for both (1) HTTP server and (2) Web Sockets server
var http = require('http');

const elasticSearchClient = require('./elasticSearchClient.js')

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

// ====================
// the arg 'callback' is a function that defines what to do with the messages
function getMessages(callback) {
	// check health of DB, which involves making an HTTP request
	// upon the completion of the request, execute the given function (which
	// takes as argument a boolean indicating the health of the DB)
	elasticSearchClient.isHealthy(
		function(isHealthy) {
			if (isHealthy === false) {
				// TODO: handle this prob e.g. inform client of error
				console.log("DB is down :^(")
			}
			callback(elasticSearchClient.getMessages())
		}
	)
}

io.on('connection', function(socket) {
	console.log("Client connected!");
	// get messages; then, execute the provided function, which sends them to the client
	getMessages(function(messages) {
		msgHistory = {
			'messages': messages
		}
		socket.emit('msgHistory', msgHistory)
	})

	// when we receive a message send it to everyone else in the room
	// TODO: store it in DB for persistent storage
	socket.on('sendMessage', function(message) {
		console.log("New msg from " + message.user + ": " + message.text);
		io.emit('messageReceived', message);
	});

	// when a new user connects, we need to add them to activeUsers
	// and tell everyone to update their user view
	socket.on('newUser', function(msg) {
		console.log("New user: " + msg.user);
		var index = activeUsers.indexOf(msg.user);
		if (index == -1) {
			activeUsers.push(msg.user);

			// inform clients of new user by sending list of all active users
			io.emit('updateUsers', {
				'users': activeUsers
			});
		}
	});

	// respond to users search queries
	socket.on('searchRequest', function(search) {
		console.log("Received search request: " + search.query);

		// TODO: query DB to get actual search results
		results = {
			'results': ["I got nothing!"]
		}
		socket.emit('searchResults', results)
	});

	// have to update activeUsers and clients user lists
	socket.on('userLeaving', function(msg) {
		console.log("User leaving: " + msg.user);

		// logic for removing the user from the array of active users
		var index = activeUsers.indexOf(msg.user);
		if (index > -1) {
			activeUsers.splice(index, 1);
		}

		// inform clients of leaving user by sending list of all active users
		io.emit('updateUsers', {
			'users': activeUsers
		});
	});
});

// respond with index.html when a user performs a get request at '/'
app.get('/', function(req, res) {
	console.log("Received HTTP GET request for index resource ('http://<domain>/')")
	res.sendFile(__dirname + '/index.html');
});

// have our HTTP server listen for requests on port 8080
http_server.listen(8080, function() {
	console.log('listening on *:8080');
});
