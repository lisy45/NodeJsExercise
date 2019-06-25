const rp = require('request-promise')

function guessPromise(low, up) {
	return new Promise((resolve) => {
		function recur(l, u) {
			const guess = Math.round((l + u) / 2)
			rp.post(`http://127.0.0.1:3000/${guess}`)
				.then((res) => {
					console.log(`Guess:${guess} /:number returns ${res}`)
					if (res === 'bigger') recur(l, guess)
					else if (res === 'smaller') recur(guess, u)
					else resolve(guess)
				})
		}
		recur(low, up)
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
