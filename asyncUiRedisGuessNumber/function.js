function auto(choice) {
	$.ajax({
		type: 'post',
		url: `http://localhost:3000/auto/` + choice,
		async: false,
		success(msg) {
			document.getElementById('result').innerHTML = msg
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
				document.getElementById('result').innerHTML = msg
			},
		})
	} else { alert('Please enter a number!') }
}

function restart() {
	document.getElementById('result').innerHTML = ''
	$.ajax({
		type: 'post',
		url: 'http://localhost:3000/start',
		async: false,
		success(msg) {
			alert(msg)
		},
	})
}

function empty(obj) {
	obj.value = ''
}
