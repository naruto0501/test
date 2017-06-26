<%@page import="com.utils.CommonUtil"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<base href="<%=CommonUtil.getRequestPath(request)%>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="static/css/bootstrap.min.css" rel="stylesheet">
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
   <br>
   <div class="alert alert-danger alert-dismissable">  
      <strong>注意!</strong> 密码错误或用户不存在,请从新输入
  </div> 
</div>
</body>
<script src="static/js/jquery-1.11.3.min.js" type="text/javascript"></script>
<script src="static/js/json2.js" type="text/javascript"></script>
<script src="static/js/bootstrap.min.js" type="text/javascript"></script>

</html>