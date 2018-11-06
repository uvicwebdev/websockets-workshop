/*
- https://nodejs.org/api/modules.html#modules_modules
- https://stackoverflow.com/questions/9901082/what-is-this-javascript-require
- https://developers.google.com/web/fundamentals/primers/modules
- https://www.elastic.co/guide/en/elasticsearch/reference/current/_cluster_health.html
- https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call
*/
const request = require('request')

let elasticSearch = "http://localhost:9200"

exports.isHealthy = function(callback) {
    // TODO handle response from DB
    let url = elasticSearch + "/_cat/health?v"
    request(url, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            console.log("Got HTTP 200!")
            callback(true)
            return

        } else if (err) {
            console.log("ERR: " + err)
        }
        callback(false)
    });
}

exports.getMessages = function() {
    return [
        {
            "user": "Bob",
            "text": "That's great"
        },
        {
            "user": "Alice",
            "text": "Yeah wow"
        },
        {
            "user": "Charlie",
            "text": "Also I am impressed"
        }
    ]
}

exports.createMessagesIndex = function(success) {
    let url = elasticSearch + "/messages?pretty"
    request.put(
        {
            method: "PUT",
            uri: url
        },
        function(err, resp, body) {
        if (err) {
            console.log("ERR: Failed to create '/messages' index: " + err)
            success(false)
            return
        }

        console.log("Tried to create '/messages' index, got resp code: " + resp.statusCode)
        if (resp.statusCode == 200) {
            success(true)
        }
    })
}

/*exports.getMessages = function() {
    // retrieve 100 most recent messages
	var msgDumpQuery = elasticSearch + '/talkytalk/messages/_search?q=*&sort=timestamp:desc&size=100';
	request(msgDumpQuery, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var respJson = JSON.parse(body);
			var requestResults = respJson.hits.hits;
			var msgHistory = [];
			for (var i = 0; i < requestResults.length; i++) {
				msgHistory.push(requestResults[i]._source);
            }

            // TODO remove this in favour of a callback
			socket.emit('msgHistory', {
				'messages': msgHistory
			});
		} else {
			console.log(error, response);
		}
	});
}
*/
