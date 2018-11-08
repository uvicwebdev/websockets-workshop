Websockets and Webapps Workshop
===

A chat room with message searching!

[Summary of things covered](/summary.md)

Requirements
---
#### Server
Node is a JavaScript interpreter and we need it to run our JavaScript server. Download it [here](https://nodejs.org/en/download/).

### Database
Download Elastic Search [here](https://www.elastic.co/downloads/elasticsearch).
* Download Elastic Search, unzip it, and put it somewhere easily accessible from the command line (e.g. desktop)

### Supplementary
Java Development Kit (JDK) is used by ElasticSearch, our DB technology. Download [here](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).

* *NOTE*: this is different from the JRE, which is included in the JDK.

Running the App
---
### Node App
* Before starting the server, we need to start the Elastic Search database: `/path/to/elasticsearch/bin/elasticsearch`
    * You'll see a smattering of logs
    * Leave this command prompt window/tab open
* Run `curl http://localhost:9200` to ensure its running
    * You should get a JSON object containing info about the Elastic Search version
* On your command line, change directories: `cd app/`
* Install the necessary packages: `npm install`
    * This will look inside the `package.json` file for the project's dependencies
    * This will create a `package-lock.json` file -- ignore it
* To start the web app, run: `node app.js`
