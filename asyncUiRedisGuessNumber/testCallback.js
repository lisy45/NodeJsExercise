const rp = require('request-promise')

function guessCallback(low, up, callback) {
	const guess = Math.round((low + up) / 2)
	rp.post(`http://127.0.0.1:3000/${guess}`)
		.then((res) => {
			console.log(`Guess:${guess} /:number returns ${res}`)
			if (res === 'smaller') return guessCallback(guess, up, callback)
			if (res === 'bigger') return guessCallback(low, guess, callback)
			console.log('Auto play completes')
			return callback(null, guess)
		})
		.catch(err => callback(err, null))
}

function playByCallback() {
	console.log('Play by Callback')
	rp.post('http://127.0.0.1:3000/start')
		.then((res) => {
			if (res === 'OK') {
				console.log('/start returns OK')
				guessCallback(0, 1000000, (err, result) => {
					if (err) console.log(err)
					else console.log(`Number is ${result}`)
				})
			} else console.log('/start fails')
		})
}
playByCallback()
