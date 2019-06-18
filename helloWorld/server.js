var express = require('express');
var app = express();

var http = require('http');

app.get('/', function (req, res) {
	res.send("Hello world.")
});
// listen to port 3000
var server = app.listen(3000);
console.log("Server running at port 3000.")