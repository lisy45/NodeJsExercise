const express = require('express')
const redis = require('redis')

const app = express()
const client = redis.createClient(6379, '127.0.0.1')

app.use(express.static('./'))

app.post('/start', (req, res) => {
	const rand = Math.round(Math.random() * 100)
	client.set('R', rand)
	res.send('OK')
})

app.post('/:number', (req, res) => {
	const { number } = req.params
	client.get('R', (err, R) => {
		console.log(R)
		if (err) res.send(err)
		else if (Number(number) < Number(R)) res.send('smaller')
		else if (Number(number) > Number(R)) res.send('bigger')
		else { res.send('equal') }
	})
})
// listen to port 3000
app.listen(3000)
console.log('Server running at port 3000.')
