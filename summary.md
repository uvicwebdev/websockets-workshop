Websockets and Webapps Summary
===

Webapps
---
Web apps typically consist of these major components:
- **Frontend**: App logic and assets (e.g. documents, images) served to the user's browser.
- **Backend**: Server that handles client requests and returns content.
- **Database**: *Persistent* data storage containing a large variety and amount of data (e.g. user profile info)

### Frontend
- Common JavaScript frameworks: Jquery, ReactJS, AngularJS, Backbone, Ember
- Common CSS frameworks: Bootstrap, Skeleton, Pure

### Backend
- Common frameworks: Express (NodeJS), Flask (Python), Django (Python), Ruby on Rails, Play (Java), .Net (C#)
- Common generic servers (used to just serve static pages or load balance typically): Apache, NGINX

### Database
Two main types:
- Relational: e.g. SQL family (MSSQL, MYSQL, Oracle, etc)
	- typically, these enforce a strict structure
- Non-Relational: e.g. MongoDB, CouchDB, Elasticsearch, Cassandra, Amazon S3
	- on the other hand, these are more flexible (store by key-value, documents, etc.)

### Common "Stacks"
*Stack*: the various technology choices for each component of the web app
- *MEAN* stack - Mongo, Express, AngularJS, NodeJS
- *LAMP* stack - Linux, Apache, MYSQL, PHP

Networking
---

- Most of the internet as you think of it runs of TCP/IP
- TCP is just a connection bytes go through
- HTTP and Websockets are just agreements on how to use TCP

### HTTP
- Hypertext Transfer Protocol
- How your browser accesses websites
- Allows specific things to be done in predictable ways
	- A significant portion of all web requests can be accomplished with HTTP GET and HTTP POST methods
- Opens connection, sends data, closes connection

[More Info if you really want it](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)

### Websockets
- Starts as an HTTP connection then gets upgraded
- Keeps connection open after upgrade occurs
- Allows for data transfer between client and server without having to create a new request

Our Chat App
---
### Frontend: Handling User Input, the DOM tree, & Using Cookies
We use `jQuery` (JS framework) on the frontend to manage the UI (HTML pages) by interacting with the **Document Object Model (DOM) tree**.

* the DOM tree is just a data structure (an n-ary tree) that **represents an HTML page**
* at the end of the day, regardless of what frontend framework we use, we change the structure of the document by **mutating the DOM tree**
* we typically use `jQuery` by:
	* finding one or multiple HTML elements e.g. `elem = $(elemDescriptor)`
	* reading and/or modifying their contents e.g. `elem.append(someHtmlElem)`

A **cookie** is a token that identifies a user, similar to a username except that it is *temporary*. If our server can identify a user, we can figure out *what data to load* for them.
* Cookies are managed by your browser for you.
* If you "clear the cookies" in your browser, you delete these cookies. That's way you then have to log back into Facebook, Gmail, etc.

### Backend: HTTP Server & Web Sockets
Our HTTP server simply *serves* the chat app's main page, which contains logic (JavaScript code) for *sending messages* back to the server based on the user's input. More generally, the served JavaScript code is responsible for handling direct interaction with the user.

For example:
* A user searches something by entering input into the search bar ending with the `ENTER` character
* The client code detects this and thus notifies the server about a search query.
	* i.e. the client emits a `'searchRequest'` event
* The server receives the client's message and talks to the database to find matching messages
	* Notice that the server receives the `'searchRequest'` event because it is constantly *listening* for events through the web socket!

Because of the nature of chat apps, we need to *send data constantly back and forth* between server and client, in both directions. Just think about what happens when a user sends a new message:
* First, we update the user's HTML page to show the message they just sent
	* Rememnber that this is achieved by manipulating the DOM tree!
* Then, the client code notifies the server of the new message
* The server sends the new message to *all other users* in the chat room
* Finally, the client logic on all other users' browsers receive the new message and display it on the UI
	* Once again, the UI is changed by manipulating the DOM tree.

On both the server and the client, we listen for and respond to *events* emitted by the other end of the app. Naturally, `socket.io` exposes functions for these two main operations:
* `socket.emit("something happened", eventData)`
	* `eventData` contains the data describing the specifics
* `socket.on("something happened", someEventHandler)`
	* `someEventHandler` is the name of the function responsible for handling the event `"something happened"`
	* notice that `someEventHandler` must accept the param `eventData`


### Patterns of Data Exchange
All throughout, we use JSON objects to format and package our data. JSON:
* is a standard, generic data structure
* is really flexible
	* it can contain an arbitary amount of fields of arbitrary types (e.g. string, list, int, other JSON objects)
* literally means JavaScript Object Notation

**Messages**: between senders and receivers
* e.g. HTTP Requests between client and server

**Events**: between listeners and dispatchers
* e.g. user input (keystrokes, mouse clicks) handled by app logic running on user's machine