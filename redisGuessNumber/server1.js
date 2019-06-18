var express = require('express');
var app = express();

var http = require('http');

var redis = require('redis')
var client = redis.createClient(6379,'127.0.0.1');

app.get('/start', function (req, res) {
	client.get('R',function(err, R) {
		if (!R) {
			var rand = Math.round(Math.random() * 100)
			client.set('R',rand)
			res.send('OK')
		}
	})
});

app.get('/:number', function(req,res) {
	var number = req.params['number']
	client.get('R',function(err, R) {
		console.log(R)
		if (err)
			res.send(err)
		else if (Number(number) < Number(R))
			res.send('smaller')
		else if (Number(number) > Number(R))
			res.send('bigger')
		else {
			var rand = Math.round(Math.random() * 100)
			client.set('R',rand)
			res.send('equal')
		}
	})		
});
// listen to port 3000
var server = app.listen(4000);
console.log('Server running at port 4000.')