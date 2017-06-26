<%@page import="com.utils.CommonUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<base href="<%=CommonUtil.getRequestPath(request)%>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>上传</title>
<link href="static/css/bootstrap.min.css" rel="stylesheet">
<script src="static/js/jquery-1.11.3.min.js"></script>
<script src="static/js/bootstrap.min.js"></script>
<script src="static/js/common.js"></script>

<script src="jsp/module/upload/js/h5_upload.js"></script>

</head>
<body>
	<div class="container">
		<div class="row">
			<div class="col-sm-12 col-md-6">
				<form id="upload_form" enctype="multipart/form-data" method="post" action="jsp/module/upload/uploadAct.jsp" >
					<fieldset>
						<div class="form-group">
							<label class="control-label" for="username">用户名</label>
							<input type="file" id="upload_input" name="upload_input" multiple="true">
						</div>
					</fieldset>
					<fieldset>
						<div class="form-group" id="preview_area">
							<button type="button" class="btn btn-primary" onclick="startUpload()">上传</button>
						</div>
					</fieldset>
				</form>
			</div>
			<div class="col-sm-12 col-md-6">
				<div id="rs_area"></div>
			</div>
		</div>
	</div>
</body>
<script type="text/javascript">
$(function(){ 
	
});
</script>
</html>