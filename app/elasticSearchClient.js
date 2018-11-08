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

exports.saveMessage = function(msg, success) {
    let url = elasticSearch + "/messages/_doc"
    request({
            url: url,
            method: 'POST',
            json: msg
        }, function(err, resp, body) {
        if (err) {
            console.log("ERR: Failed index message " + msg + " with error: " + err)
            success(false)
            return
        }

        console.log("Tried index a message, got resp code: " + resp.statusCode)
        console.log("resp: " + resp.body)
        if (resp.statusCode == 200) {
            success(true)
        }
    })
}

// the provided callback should be called with the fetched list of messages
exports.getMessages = function(callback) {
    let url = elasticSearch + "/messages/_search?q=*&sort=timestamp:desc"
    request(url, function(err, resp, body) {
        if (err || resp.statusCode != 200) {
            console.log("ERR: Could not get messages: " + err)
            // could not find messages, so invoke callback with an empty list
            callback([])
        }

        console.log("Got messages: \n" + body)
        var respJson = JSON.parse(body);

        let messages = []
        for (let i = 0; i < respJson.hits.hits.length; i++) {
            messages.push(respJson.hits.hits[i]._source)
        }

        // provide messages to callback
        callback(messages)
    })
}

exports.searchMessages = function(query, processResults) {
    var url = elasticSearch + '/messages/_search?q=' + query + '&size=10'
    request(url, function(error, response, body) {
        if (error) {
            console.log("ERR: Failed to search for '" + query + "'. -- " + error)
            processResults([])
        }
        console.log("Searching for '" + query + "', got resp code: " + response.statusCode)
        if (!error && response.statusCode == 200) {
            console.log("Results: " + body)
            var respJson = JSON.parse(body);
            var requestResults = respJson.hits.hits;
            var searchResults = [];
            for (var i = 0; i < requestResults.length; i++) {
                searchResults.push(requestResults[i]._source);
            }
            processResults(searchResults)
        }
    })
}

exports.createMessagesIndex = function(success) {
    let url = elasticSearch + "/messages?pretty"
    request(
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