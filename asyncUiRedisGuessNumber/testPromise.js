const rp = require('request-promise')

function guessPromise(low, up) {
	const guess = Math.round((low + up) / 2)
	return rp.post(`http://127.0.0.1:3000/${guess}`)
		.then((res) => {
			console.log(`Guess:${guess} /:number returns ${res}`)
			if (res === 'bigger') return guessPromise(low, guess)
			if (res === 'smaller') return guessPromise(guess, up)
			return guess
		})
}

function playByPromise() {
	console.log('Play by Promise')
	rp.post('http://127.0.0.1:3000/start')
		.then((res) => {
			if (res === 'OK') {
				console.log('/start returns OK')
				guessPromise(0, 1000000).then((result) => {
					console.log(`Answer is ${result}`)
				})
			} else console.log('/start fails')
		})
}
playByPromise()
