const rp = require('request-promise')

async function postAsync(guess) {
	const res = await rp.post(`http://127.0.0.1:3000/${guess}`)
	console.log(`Guess:${guess} /:number returns ${res}`)
	if (res === 'equal') return ('Auto play completes')
	return res
}

async function guessAsync(low, up) {
	const guess = Math.round((low + up) / 2)
	const res = await postAsync(guess)
	if (res === 'bigger') guessAsync(low, guess)
	else if (res === 'smaller') guessAsync(guess, up)
	else console.log(res)
}

async function playByAsync() {
	console.log('Play by Async')
	const res = await rp.post('http://127.0.0.1:3000/start')
	if (res === 'OK') {
		console.log('/start returns OK')
		guessAsync(0, 1000000)
	} else console.log('/start fails')
}
playByAsync()
