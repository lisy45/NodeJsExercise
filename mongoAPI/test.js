require('should')
const rp = require('request-promise')
const request = require('request')

const optionRegisterSuccess = {
	method: 'POST',
	uri: 'http://127.0.0.1:3000/register',
	form: {
		name: 'admin',
		password: 'admin',
	},
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
	},
}

const optionLoginSuccess = {
	method: 'POST',
	uri: 'http://127.0.0.1:3000/login',
	form: {
		name: 'admin',
		password: 'admin',
	},
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
	},
}

const optionLoginWrong = {
	method: 'POST',
	uri: 'http://127.0.0.1:3000/login',
	form: {
		name: 'admin',
		password: 'wrong password',
	},
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
	},
}

async function rpCheckUser() {
	const res1 = await rp.post('http://127.0.0.1:3000/checkUser/admin')
	res1.should.eql('success')
}

async function rpRegister(opt) {
	if (opt === 0) {
		const res1 = await rp(optionRegisterSuccess)
		res1.should.eql('success')
	} else if (opt === 1) {
		const res2 = await rp(optionRegisterSuccess)
		res2.should.eql('repeated username')
		const res3 = await rp.delete('http://127.0.0.1:3000/deleteuser/admin')
		res3.should.eql('The user is successfully deleted.')
	}
}

describe('API Test 1: /regster', () => {
	it('The response of /register should be success if name is not repeated', async () => {
		await rpRegister(0)
	})

	it('The response of /register should be repeated username if name is repeated', async () => {
		await rpRegister(1)
	})

	it('The test should not leave data in DB', async () => {
		await rpCheckUser()
	})
})

async function rpLogin(opt) {
	if (opt === 0) {
		const res1 = await rp(optionLoginSuccess)
		res1.should.eql('Username does not exist!')
	} else {
		const res2 = await rp(optionRegisterSuccess)
		res2.should.eql('success')
		if (opt === 1) {
			const res3 = await rp(optionLoginWrong)
			res3.should.eql('Wrong password')
		} else if (opt === 2) {
			const res3 = await rp(optionLoginSuccess)
			res3.should.eql('Hello admin')
		}
		const res4 = await rp.delete('http://127.0.0.1:3000/deleteuser/admin')
		res4.should.eql('The user is successfully deleted.')
	}
}

describe('API Test 2: /login', () => {
	it('The response of /login should be Username does not exist! if the name is not registeresd', async () => {
		await rpLogin(0)
	})

	it('The response of /login should be Wrong password if the password is wrong', async () => {
		await rpLogin(1)
	})

	it('The response of /login should be Hello admin if login successes', async () => {
		await rpLogin(2)
	})

	it('The test should not leave data in DB', async () => {
		await rpCheckUser()
	})
})

function doRequest(opt) {
	return new Promise((resolve, reject) => {
		request(opt, (err, res, body) => {
			if (!err && res.statusCode === 200) {
				const result = []
				result.push(res)
				result.push(body)
				resolve(result)
			} else reject(err)
		})
	})
}
async function rpStart() {
	const res1 = await rp(optionRegisterSuccess)
	res1.should.eql('success')
	const result = await doRequest(optionLoginSuccess)
	const res2 = result[0]
	const body = result[1]
	body.should.eql('Hello admin')
	const optionStart = {
		method: 'POST',
		uri: 'http://127.0.0.1:3000/start',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: res2.headers['set-cookie'],
		},
	}
	const res3 = await rp(optionStart)
	res3.should.eql('success')
	const res4 = await rp.delete('http://127.0.0.1:3000/deleteuser/admin')
	res4.should.eql('The user is successfully deleted.')
}

describe('API Test 3: /start', () => {
	it('The response of /start should be success', async () => {
		await rpStart()
	})

	it('The test should not leave data in DB', async () => {
		await rpCheckUser()
	})
})

async function npNumber() {
	const res1 = await rp(optionRegisterSuccess)
	res1.should.eql('success')
	const result = await doRequest(optionLoginSuccess)
	const res2 = result[0]
	const body = result[1]
	body.should.eql('Hello admin')
	const optionStart = {
		method: 'POST',
		uri: 'http://127.0.0.1:3000/start',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: res2.headers['set-cookie'],
		},
	}
	const res3 = await rp(optionStart)
	res3.should.eql('success')
	const optionNumber = {
		method: 'POST',
		uri: 'http://127.0.0.1:3000/50',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Cookie: res2.headers['set-cookie'],
		},
	}
	const res4 = await rp(optionNumber)
	const ans = ['bigger', 'smaller', 'equal']
	ans.should.containEql(res4)
	const res5 = await rp.delete('http://127.0.0.1:3000/deleteuser/admin')
	res5.should.eql('The user is successfully deleted.')
}

describe('API Test 4: /:number', () => {
	it('The response of /:number should be bigger/smaller/equal', async () => {
		await npNumber()
	})

	it('The test should not leave data in DB', async () => {
		await rpCheckUser()
	})
})

describe('API Test End: ', () => {
	it('The test should not leave data in DB', async () => {
		await rpCheckUser()
	})
})
