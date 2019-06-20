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
	secret: 'random_string_goes_here',
}))

app.post('/register', (req, res) => {
	const { name } = req.body
	const { password } = req.body
	User.findOne({ name })
		.exec((err, existed) => {
			if (err)	res.send(err)
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
				newUser.save((err1) => {
					if (err1) res.send(err1)
					else res.send('success')
				})
			}
		})
})

app.delete('/deleteuser/:username', (req, res) => {
	const name = req.params.username
	User.findOne({ name }, (err, removed) => {
		if (err) res.send(err)
		else if (removed != null) {
			User.deleteOne({ name }, (err1) => {
				if (err1) res.send(err1)
				else { res.send('The user is successfully deleted.') }
			})
		} else res.send('Username does not exist!')
	})
})

app.post('/login', (req, res) => {
	const { name } = req.body
	const { password } = req.body
	User.findOne({ name })
		.exec((err, existed) => {
			if (err)	res.send(err)
			if (!existed)	res.send('Username does not exist!')
			else {
				const { salt } = existed
				const saltpwd = name.toString() + salt.toString() + password.toString()
				const md5 = crypto.createHash('md5')
				const cryptpwd = md5.update(saltpwd).digest('hex')
				if (cryptpwd != existed.password) res.send('Wrong password')
				else {
					number.findOne({ userid: existed._id })
						.exec((err1, num) => {
							if (err1)	res.send(err1)
							else if (!num) {
								const newNumber = new number({
									userid: existed._id,
								})
								newNumber.save()
							}
							req.session.userid = existed._id
							res.send(`Hello ${name}`)
						})
				}
			}
		})
})

app.post('/start', (req, res) => {
	const sessUserid = req.session.userid
	if (!sessUserid) res.send('Please login')
	else {
		const randnum = Math.round(Math.random() * 100)
		number.findOne({ userid: sessUserid })
			.exec((err, existed) => {
				if (err)	res.send(err)
				else {
					existed.num = randnum
					existed.save()
					res.send('success')
				}
			})
	}
})

app.post('/:number', (req, res) => {
	const sessUserid = req.session.userid
	if (!sessUserid) res.send('Please login')
	else {
		const guess = req.params.number
		number.findOne({ userid: sessUserid })
			.exec((err, existed) => {
				if (err)	res.send(err)
				else {
					const answer = existed.num
					if (Number(guess) < Number(answer)) res.send('smaller')
					else if (Number(guess) > Number(answer)) res.send('bigger')
					else res.send('equal')
				}
			})
	}
})

// listen to port 3000
app.listen(3000)
console.log('Server running at port 3000.')
