const rp = require('request-promise')

function postPromise(guess) {
	return new Promise((resolve, reject) => {
		rp.post(`http://127.0.0.1:3000/${guess}`)
			.then((res) => {
				console.log(`Guess:${guess} /:number returns ${res}`)
				if (res === 'equal') {
					console.log('Auto play completes')
					resolve(guess)
				} else reject(res)
			})
	})
}

function guessPromise(low, up) {
	return new Promise((resolve) => {
		function recur(l, u) {
			const guess = Math.round((l + u) / 2)
			postPromise(guess)
				.then((res) => {
					resolve(res)
				})
				.catch((res) => {
					if (res === 'bigger') recur(l, guess)
					else if (res === 'smaller') recur(guess, u)
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
					console.log(`Number is ${result}`)
				})
			} else console.log('/start fails')
		})
}
playByPromise()
