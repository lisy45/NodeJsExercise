const express = require('express')
const mongoose = require('mongoose')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const session = require('client-sessions')

const app = express()

mongoose.connect('mongodb://admin:admin@localhost/mydb')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => { console.log('Connection is open...') })

const UserSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	salt: { type: String, required: true },
	password: { type: String, required: true },
})
const User = mongoose.model('User', UserSchema)

const NumberSchema = mongoose.Schema({
	userid: { type: String, required: true, unique: true },
	num: { type: Number, required: false },
})
const number = mongoose.model('Number', NumberSchema)

app.use(express.static('./'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
	cookieName: 'session',
	secret: 'random_string_g oes_here',
	duration: 30 * 60 * 1000,
}))

async function checkUser(req, res) {
	const count = await User.countDocuments({}).exec()
	if (count === 0) res.send('success')
	else res.send('fail')
}

app.post('/checkUser', (req, res) => {
	checkUser(req, res)
})

async function checkNumber(req, res) {
	const count = await number.countDocuments({}).exec()
	if (count === 0) res.send('success')
	else res.send('fail')
}

app.post('/checkNumber', (req, res) => {
	checkNumber(req, res)
})

async function register(req, res) {
	const { name } = req.body
	const { password } = req.body
	const existed = await User.findOne({ name }).exec()
	if (existed)	res.send('repeated username')
	else {
		const salt = Math.random().toString().slice(2, 5)
		const saltpwd = name.toString() + salt.toString() + password.toString()
		const md5 = crypto.createHash('md5')
		const cryptpwd = md5.update(saltpwd).digest('hex')
		const newUser = new User({
			name,
			salt,
			password: cryptpwd,
		})
		await newUser.save()
		res.send('success')
	}
}

app.post('/register', (req, res) => {
	register(req, res)
})

async function deleteUser(req, res) {
	const name = req.params.username
	const removed = await User.findOne({ name }).exec()
	if (removed != null) {
		await number.findOneAndDelete({ userid: removed._id }).exec()
		await User.deleteOne({ name }).exec()
		res.send('The user is successfully deleted.')
	} else res.send('Username does not exist!')
}

app.delete('/deleteuser/:username', (req, res) => {
	deleteUser(req, res)
})

async function login(req, res) {
	const { name } = req.body
	const { password } = req.body
	const existed = await User.findOne({ name }).exec()
	if (!existed)	res.send('Username does not exist!')
	else {
		const { salt } = existed
		const saltpwd = name.toString() + salt.toString() + password.toString()
		const md5 = crypto.createHash('md5')
		const cryptpwd = md5.update(saltpwd).digest('hex')
		if (cryptpwd !== existed.password) res.send('Wrong password')
		else {
			const num = await number.findOne({ userid: existed._id }).exec()
			if (!num) {
				const newNumber = new number({
					userid: existed._id,
				})
				await newNumber.save()
			}
			req.session.userid = existed._id
			res.send(`Hello ${name}`)
		}
	}
}

app.post('/login', (req, res) => {
	login(req, res)
})

async function start(req, res) {
	const sessUserid = req.session.userid
	if (!sessUserid) res.send('Please login')
	else {
		const randnum = Math.round(Math.random() * 100)
		const existed = await number.findOne({ userid: sessUserid }).exec()
		existed.num = randnum
		await existed.save()
		res.send('success')
	}
}

app.post('/start', (req, res) => {
	start(req, res)
})

async function check(req, res) {
	const sessUserid = req.session.userid
	if (!sessUserid) res.send('Please login')
	else {
		const guess = req.params.number
		const existed = await number.findOne({ userid: sessUserid }).exec()
		const answer = existed.num
		if (Number(guess) < Number(answer)) res.send('smaller')
		else if (Number(guess) > Number(answer)) res.send('bigger')
		else res.send('equal')
	}
}
app.post('/:number', (req, res) => {
	check(req, res)
})

// listen to port 3000
app.listen(3000)
console.log('Server running at port 3000.')
