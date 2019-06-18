var express = require('express');
var app = express();

var http = require('http');

var session = require('client-sessions')
app.use(session({
	cookieName: 'session',
	secret: 'random_string_goes_here'
}));

app.get('/start', function (req, res) {
	var rand = Math.round(Math.random() * 100)
	req.session.R = rand
	res.send('OK')
});

app.get('/:number', function(req,res) {
	var number = req.params['number']
	if (Number(number) < Number(req.session.R))
		res.send('smaller')
	else if (Number(number) > Number(req.session.R))
		res.send('bigger')
	else {
		var rand = Math.round(Math.random() * 100)
		req.session.R = rand
		res.send('equal')
	}	
});
// listen to port 3000
var server = app.listen(3000);
console.log('Server running at port 3000.')