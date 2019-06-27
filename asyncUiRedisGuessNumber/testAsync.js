const rp = require('request-promise')

async function guessAsync(low, up) {
	const guess = Math.round((low + up) / 2)
	const res = await rp.post(`http://127.0.0.1:3000/${guess}`)
	console.log(`Guess:${guess} /:number returns ${res}`)
	if (res === 'bigger') return guessAsync(low, guess)
	if (res === 'smaller') return guessAsync(guess, up)
	return guess
}

async function playByAsync() {
	console.log('Play by Async')
	const res = await rp.post('http://127.0.0.1:3000/start')
	if (res === 'OK') {
		console.log('/start returns OK')
		const result = await guessAsync(0, 1000000)
		console.log(`Find answer ${result}`)
	} else console.log('/start fails')
}
playByAsync()
