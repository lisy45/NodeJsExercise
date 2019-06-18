function submit() {
	var data = '{"number":-1}'
	var obj = JSON.parse(data)
	obj.number = document.getElementById("number").value
	var n = Number(obj.number)
	if (!isNaN(n)) {
		$.ajax({
			type:'post',
			url:'http://localhost:3000/guess',
			data:obj,
			async:false,
			success:function(msg) {
				document.getElementById("result").innerHTML = msg
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				alert(textStatus)
			}
		})	
	}
	else 
		alert("Please enter a number!")
}
function restart() {
	$.ajax({
		type:'post',
		url:'http://localhost:3000/start',
		async:false,
		success:function(msg) {
			alert(msg)
		}
	})
}
function empty(obj) {
	obj.value=""
}