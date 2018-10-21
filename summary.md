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
- Most common functions: GET, POST
- Opens connection, sends data, closes connection

[More Info if you really want it](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)

### Websockets
- Starts as an HTTP connection then gets upgraded
- Keeps connection open after upgrade occurs
- Allows for data transfer between client and server without having to create a new request

Our Chat App
---
### Frontend: Handling User Input, the DOM tree, & Using Cookies
We use `jQuery` (JS framework) on the frontend to access the Document Object Model (DOM) tree.

* the DOM tree is just a data structure (an n-ary tree) that **represents an HTML page**
* at the end of the day, regardless of what frontend framework we use, we change the structure of the document by **mutating the DOM tree**
* the typical `jQuery` pattern consists of:
	* finding one or multiple HTML elements: `$(elemDescriptor)`
	* reading and/or modifying their contents: `$(elemDescriptor).append(someHtmlElem)`

A **cookie** is a token that identifies a user, similar to a username except that it is *temporary*. If a server can identify a user, it knows *what data to load* for them.
* Cookies are managed by your browser for you.
* If you "clear the cookies" in your browser, you delete these cookies. That's way you then have to log back into Facebook, Gmail, etc.

### Backend: HTTP Server & Web Sockets
Our HTTP server simply *serves* the chat app's main page, which contains logic (JavaScript code) for *sending messages* back to the server based on the user's input. More generally, the served JavaScript code is responsible for handling direct interaction with the user.

For example:
* A user enters text into the search bar that ends with the `ENTER` character
* The client code detects this and thus notifies the server about a search query.
	* i.e. the client emits a `'searchRequest'` event
* The server receives
	* Notice that the server notices the `'searchRequest'` event because it is constantly *listening* for events

On the server-side, we listen for and respond to *events* emitted by the frontend of the app. Naturally, `socket.io` exposes functions for these two main operations:
* `socket.emit("something happened", eventData)`
	* `eventData` contains the data describing the specifics
* `socket.on("something happened", someEventHandler)`
	* `someEventHandler` is the name of the function responsible for handling the event `"something happened"`
	* notice that `someEventHandler` must accept the param `eventData`

In fact, events can be emitted by the server, too; in that case, the client is responsible for handling it.

### Patterns of Data Exchange
**Messages**: between senders and receivers
* e.g. HTTP Requests between client and server

**Events**: between listeners and dispatchers
* e.g. user input (keystrokes, mouse clicks) handled by app logic running on user's machine