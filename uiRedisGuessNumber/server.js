var express = require('express');
var app = express();

var redis = require('redis')
var client = redis.createClient(6379,'127.0.0.1');

var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

app.get('/function.js', function (req, res) {
 fs.readFile('function.js', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

app.get('/guessNumber.html', function (req, res) {
 fs.readFile('guessNumber.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

app.post('/start', function (req, res) {
	var rand = Math.round(Math.random() * 100)
	client.set('R',rand)
	res.send('OK')
});

app.post('/guess', function(req,res) {
	var number = req.body['number']
	client.get('R',function(err, R) {
		console.log(R)
		if (err)
			res.send(err)
		else if (Number(number) < Number(R))
			res.send('smaller')
		else if (Number(number) > Number(R))
			res.send('bigger')
		else
			res.send('equal')
	})		
});
// listen to port 3000
app.listen(3000);
console.log('Server running at port 3000.')