<%@page import="com.utils.CommonUtil"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="static/css/bootstrap.min.css" rel="stylesheet">
<script src="static/js/jquery-1.11.3.min.js" type="text/javascript"></script>
<script src="static/js/json2.js" type="text/javascript"></script>
<script src="static/js/bootstrap.min.js" type="text/javascript"></script>
<% 
String baseUrl = CommonUtil.getRequestPath(request);
%>
<title>Insert title here</title>
</head>
<body>
<div class="container">
   <form class="form-signin"  role="form" action="mvc/login/login.do" method="post">
   	<h4 class='form-signin-heading'>用户登录</h4>
         <input type="text" class="form-control" id="username" name="username" placeholder="请输入用户名" required>
   
      <br>
	
         <input type="password" class="form-control" id="password" name="password" placeholder="请输入密码" required>
 
      <br>
    <button type="submit" class='btn btn-lg btn-primary btn-block'>登录</button>
     
   </form>
</div>

</body>
</html>