function submit() {
	const n = Number(document.getElementById('number').value)
	if (!isNaN(n)) {
		$.ajax({
			type: 'post',
			url: 'http://localhost:3000/${n}',
			async: false,
			success(msg) {
				document.getElementById('result').innerHTML = msg
			},
		})
	} else { alert('Please enter a number!') }
}
function restart() {
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
