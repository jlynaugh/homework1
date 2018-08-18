// Primary file for the homework1 assignment API

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to any requests to the /hello route
// with a JSON object containing a greeting
const server = http.createServer(function(req, res) {

  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true);

  // Get the path from the url
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the headers as an object
  const headers = req.headers;

  // get the HTTP method
  const method = req.method.toLowerCase();
  // Get the payload if there is any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data',function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // choose the handler this request should go to, if one is not found use notfound handlers
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;

    // construct the data object to send to the handler
    const data = {
        'trimmedPath': trimmedPath,
        'queryStringObject': queryStringObject,
        'method': method,
        'headers': headers,
        'payload': buffer
    };

    // route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
      // Use statusCode called back by handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Use payload called back by handler or default to []
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Returning status code, JSON response: ', statusCode, payloadString);
    });
  });
});

// Start the server and have it listen on port 3000
server.listen(3000, function(){
  console.log("The server is listening on port 3000 ...");
});

// define handlers
const handlers = {};

// welcome handler
handlers.hello = function(data, callback) {
  // callback a http status code and a payload object
  callback(200, { 'message': 'Hello, this is homework assignment #1' });
};

// not found handler
handlers.notfound = function(data, callback) {
  callback(404);
};

// Define a request router
const router = {
  'hello': handlers.hello
}
