## Setup
### Prerequisites
#### Java Development Kit (JDK)
*NOTE*: this is different from the JRE, which is included in the JDK

#### Node
Node is a JavaScript interpreter and we need it to run our JavaScript server.

### Elastic Search
* Download Elastic Search, unzip it, and put it somewhere easily accessible from the command line (e.g. desktop)
* Start the Elastic Search database: `/path/to/elasticsearch/bin/elasticsearch`
    * You'll see a smattering of logs
    * Leave this command prompt window/tab open
* Run `curl http://localhost:9200` to ensure its running
    * You should get a JSON object containing info about the Elastic Search version

### Node App
* Before starting the server, make sure your DB is running
* On your command line, change directories: `cd app/`
* Install the necessary packages: `npm install`
    * This will look inside the `package.json` file for the project's dependencies
    * This will create a `package-lock.json` file -- ignore it
* To start the web app, run: `node app.js`
