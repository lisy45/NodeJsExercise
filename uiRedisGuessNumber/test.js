require('should')
const rp = require('request-promise')

describe('API Tests', () => {
	it('The response of /start should be OK', (done) => {
		rp.post('http://127.0.0.1:3000/start')
			.then((res) => {
				res.should.eql('OK')
				done()
			})
	})

	it('The response of /:number should be smaller/bigger/equal', (done) => {
		const rand = Math.round(Math.random() * 100)
		rp.post(`http://127.0.0.1:3000/${rand}`)
			.then((res) => {
				['bigger', 'smaller', 'equal'].should.containEql(res)
				done()
			})
	})
})

function postGuess(guess) {
	return new Promise((resolve, reject) => {
		rp.post(`http://127.0.0.1:3000/${guess}`)
			.then((res) => {
				if (res === 'equal') resolve(res)
				else reject(res)
			})
	})
}

function autoGuess(low, up) {
	return new Promise((resolve) => {
		function recur(l, u) {
			const guess = Math.round((l + u) / 2)
			postGuess(guess)
				.then(resolve(1))
				.catch((res) => {
					if (res === 'bigger') recur(l, guess)
					else if (res === 'smaller') recur(guess, u)
				})
		}
		recur(low, up)
	})
}

describe('Complete Unit Test', () => {
	it('The test should automatically run and complete when guess is equal', (done) => {
		rp.post('http://127.0.0.1:3000/start')
			.then((res) => {
				res.should.eql('OK')
				autoGuess(0, 100).then((result) => {
					result.should.eql(1)
					done()
				})
			})
	})
})
