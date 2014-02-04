// mostly here for easy heroku deploy, you could customize this as needed
var express = require('express');
var port = process.env.PORT || 5000;
var app = express();
 
console.log("Listening on port " + port);

app.get('/', function(request, response) {
    response.sendfile(__dirname + '/app/index.html');
}).configure(function() {
    app.use('/', express.static(__dirname + '/app/'));
}).listen(port);