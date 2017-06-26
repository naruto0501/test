/**
 * 
 */
function startUpload(){
	var upForm = new FormData(document.getElementById('upload_form')); 
	var XHR = new XMLHttpRequest();
	XHR.addEventListener('load', uploadComplete, false);
	XHR.open('POST','jsp/module/upload/uploadAct.jsp');
	XHR.send(upForm);
}

function uploadComplete(e){
	var data = eval("("+e.target.responseText+")");
	if (data.state == "SUCCESS"){
		alert(data.url);
	}else{
		alert(data.msg);
	}
}