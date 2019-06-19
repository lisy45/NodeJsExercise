const express = require('express')
const redis = require('redis')

const app = express()
const client = redis.createClient(6379, '127.0.0.1')

app.use(express.static('./'))

app.post('/start', (req, res) => {
	const rand = Math.round(Math.random() * 1000000)
	client.set('R', rand)
	res.send('OK')
})

function auto1(low, up, msg, callback) {
	const guess = Math.round((low + up) / 2)
	client.get('R', (err, R) => {
		let newMsg = msg
		if (Number(guess) < Number(R)) {
			newMsg += `Guess: ${guess} smaller<br>`
			return auto1(guess, up, newMsg, callback)
		}
		if (Number(guess) > Number(R)) {
			newMsg += `Guess: ${guess} bigger<br>`
			return auto1(low, guess, newMsg, callback)
		}
		newMsg += `Find R:${guess}`
		return callback(newMsg)
	})
}

function auto2base(low, up, msg) {
	return new Promise(((resolve, reject) => {
		const guess = Math.round((low + up) / 2)
		client.get('R', (err, R) => {
			let newMsg = msg
			if (Number(guess) < Number(R)) {
				newMsg += `Guess: ${guess} smaller<br>`
				const rej = []
				rej.push(guess)
				rej.push(up)
				rej.push(newMsg)
				reject(rej)
			}
			if (Number(guess) > Number(R)) {
				newMsg += `Guess: ${guess} bigger<br>`
				const rej = []
				rej.push(low)
				rej.push(guess)
				rej.push(newMsg)
				reject(rej)
			} else {
				newMsg += `Find R:${guess}`
				resolve(newMsg)
			}
		})
	}))
}

function auto2(low, up, msg) {
	return new Promise(((resolve) => {
		function recur(l, u, m) {
			auto2base(l, u, m)
				.then((finMsg) => {
					resolve(finMsg)
				})
				.catch(rej => recur(rej[0], rej[1], rej[2]))
		}
		recur(low, up, msg)
	}))
}

function auto3(low, up, msg, R) {
	const guess = Math.round((low + up) / 2)
	let newMsg = msg
	if (Number(guess) < Number(R)) {
		newMsg += `Guess: ${guess} smaller<br>`
		return auto3(guess, up, newMsg, R)
	}
	if (Number(guess) > Number(R)) {
		newMsg += `Guess: ${guess} bigger<br>`
		return auto3(low, guess, newMsg, R)
	}
	newMsg += `Find R:${guess}`
	return newMsg
}

async function auto3async(res) {
	client.get('R', async (err, R) => {
		const finMsg = await auto3(0, 1000000, '', R)
		res.send(finMsg)
	})
}

app.post('/auto/:choice', (req, res) => {
	const { choice } = req.params
	if (Number(choice) === 1) {
		auto1(0, 1000000, '', (finMsg) => {
			res.send(finMsg)
		})
	} else if (Number(choice) === 2) {
		auto2(0, 1000000, '').then((finMsg) => {
			res.send(finMsg)
		})
	} else if (Number(choice) === 3) {
		auto3async(res)
	}
})

app.post('/:number', (req, res) => {
	const { number } = req.params
	client.get('R', (err, R) => {
		console.log(R)
		if (err) res.send(err)
		else if (Number(number) < Number(R)) res.send('smaller')
		else if (Number(number) > Number(R)) res.send('bigger')
		else res.send('equal')
	})
})

// listen to port 3000
app.listen(3000)
console.log('Server running at port 3000.')
