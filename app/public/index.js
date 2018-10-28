// io is imported in index.html
var socket = io.connect(window.location.href);

// handle username
var username = getCookie("username");
if (!username) {
	var tempUsername = "anonymous" + Math.floor((Math.random() * 1000) + 1);
	username = prompt("Please enter a user name!", tempUsername);
	setCookie('username', username, 7);
	socket.emit('newUser', {
		'user': username
	});
}
if (username) {
	socket.emit('newUser', {
		'user': username
	});
}

// Handles receiving a history of the conversation
socket.on('msgHistory', function(data) {
	var messages = data.messages;
	for (var i = messages.length - 1; i >= 0; i--) {
		console.log(messages[i]);
		displayMessage(messages[i]);
	}
});

// Handle receiving messages
socket.on('messageReceived', function(message) {
	displayMessage(message);
});

// Handle sending messages
$('#messageForm').keypress(function() {
	// this piece allows us to submit when a user hit enter
	var keyCode = (event.keyCode ? event.keyCode : event.which);
	if ((event.keyCode || event.which) == 13) {
		sendMessage();
	}
});

// Send search queries
$('#searchBar').keypress(function() {
	//this piece allows us to submit when a user hit enter
	if ((event.keyCode || event.which) == 13) {
		sendSearch();
	}
});

// Handle search results
socket.on('searchResults', function(resp) {
	displaySearchResults(resp.results);
});

// Update the list of users when a new user enters the room
socket.on('updateUsers', function(activeUsers) {
	displayUsers(activeUsers.users);
});

// want to tell the server we are leaving before we leave
$(window).bind('beforeunload', function() {
	socket.emit('userLeaving', {
		'user': username
	});
});


/******************Welcome to the land of helper functions*********************/

// Helper function that updates the active users panel with a new list of users
function displayUsers(users) {
	$('#users').empty();
	for (var i = 0; i < users.length; i++) {
		$('#users').append('<p>' + users[i] + '</p>');
	}
}

// Helper function for displaying message
function displayMessage(message) {
	// find element with ID "messages" (which we know is a <ul> elem) and append to it a <li> elem
	$('#messages').append(
		'<li>' + message.user + ': ' + message.text + '</li>'
	);
    var elem = document.getElementById('messages');
	elem.scrollTop = elem.scrollHeight;
}

// Helper function for displaying search results
function displaySearchResults(results) {
	$('#searchResults').empty();
	for (var i = 0; i < results.length; i++)
		$('#searchResults').append(
			'<p>' + results[i].user + ': ' + results[i].text + '</p>'
		);
}

// Helper function to help us send messages
// not essential but nice since we have multiple triggers to send messages
function sendMessage() {
	var message = {
		'timestamp': Date.now(),
		'text': $('#messageForm').val(),
		'user': username
	};
	socket.emit('sendMessage', message);
	$('#inputForm').trigger("reset");
}

// get the search request and send to server
function sendSearch() {
	var search = {
		'q': $('#searchBar').val()
	};
	socket.emit('searchRequest', search);
}

// Helper function to set cookies. Shoutout to W3
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

// Helper function to get cookies. Shoutout to W3
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
	}
	return null;
}
