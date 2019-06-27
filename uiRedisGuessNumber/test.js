require('should')
const rp = require('request-promise')

describe('API Tests', () => {
	it('The response of /start should be OK', async () => {
		const res = await rp.post('http://127.0.0.1:3000/start')
		res.should.eql('OK')
	})

	it('The response of /:number should be smaller/bigger/equal', async () => {
		const rand = Math.round(Math.random() * 100)
		const res = await rp.post(`http://127.0.0.1:3000/${rand}`)
		const ans = ['bigger', 'smaller', 'equal']
		ans.should.containEql(res)
	})
})

async function autoGuess(low, up) {
	const guess = Math.round((low + up) / 2)
	const res = await rp.post(`http://127.0.0.1:3000/${guess}`)
	if (res === 'bigger') return autoGuess(low, guess)
	if (res === 'smaller') return autoGuess(guess, up)
	return guess
}

describe('Complete Unit Test', () => {
	it('The test should automatically run and complete when guess is equal', async () => {
		const res = await rp.post('http://127.0.0.1:3000/start')
		res.should.eql('OK')
		const result = await autoGuess(0, 100)
		console.log(`Find answer ${result}`)
	})
})
