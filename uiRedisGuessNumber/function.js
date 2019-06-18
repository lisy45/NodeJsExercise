function submit() {
	var n = Number(document.getElementById("number").value)
	if (!isNaN(n)) {
		$.ajax({
			type:'post',
			url:'http://localhost:3000/' + n,
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