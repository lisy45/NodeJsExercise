function register() {
	const name = document.getElementById('name').value
	if (name == '') { alert('Name cannot be empty') } else {
		const password = document.getElementById('password').value
		const data = '{"name":-1, "password":-1}'
		const obj = JSON.parse(data)
		obj.name = name
		obj.password = password
		$.ajax({
			type: 'post',
			url: 'http://localhost:3000/register',
			data: obj,
			async: false,
			success(msg) {
				document.getElementById('result').innerHTML = msg
			},
			error(XMLHttpRequest, textStatus, errorThrown) {
				alert(textStatus)
			},
		})
	}
}
function login() {
	const name = document.getElementById('name').value
	const password = document.getElementById('password').value
	const data = '{"name":-1, "password":-1}'
	const obj = JSON.parse(data)
	obj.name = name
	obj.password = password
	$.ajax({
		type: 'post',
		url: 'http://localhost:3000/login',
		data: obj,
		async: false,
		success(msg) {
			document.getElementById('result').innerHTML = msg
		},
		error(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus)
		},
	})
}
function start() {
	$.ajax({
		type: 'post',
		url: 'http://localhost:3000/start',
		async: false,
		success(msg) {
			alert(msg)
		},
	})
}
function submit() {
	const n = Number(document.getElementById('number').value)
	if (!isNaN(n)) {
		$.ajax({
			type: 'post',
			url: `http://localhost:3000/` + n,
			async: false,
			success(msg) {
				document.getElementById('result2').innerHTML = msg
			},
		})
	} else { alert('Please enter a number!') }
}
function empty(obj) {
	if (obj.value == 'Name' || obj.value == 'Password' || obj.value == 'Guess A Number') { obj.value = '' }
}
