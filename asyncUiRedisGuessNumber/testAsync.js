const rp = require('request-promise')

function postAsync(guess) {
	return new Promise((resolve, reject) => {
		rp.post(`http://127.0.0.1:3000/${guess}`)
			.then((res) => {
				console.log(`Guess:${guess} /:number returns ${res}`)
				if (res === 'equal') resolve('Auto play completes')
				else reject(res)
			})
	})
}

async function guessAsync(low, up) {
	function recur(l, u) {
		const guess = Math.round((l + u) / 2)
		postAsync(guess)
			.then((res) => {
				console.log(res)
			})
			.catch((res) => {
				if (res === 'bigger') recur(l, guess)
				else if (res === 'smaller') recur(guess, u)
			})
	}
	await recur(low, up)
}

function playByAsync() {
	console.log('Play by Async')
	rp.post('http://127.0.0.1:3000/start')
		.then((res) => {
			if (res === 'OK') {
				console.log('/start returns OK')
				guessAsync(0, 1000000)
			} else console.log('/start fails')
		})
}
playByAsync()
