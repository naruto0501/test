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
<%
	String baseUrl = CommonUtil.getRequestPath(request);

	//response.sendRedirect(baseUrl+"mvc/home/toHome.do");
    //request.getRequestDispatcher("../my_home_page.jsp").forward(request,response);
%>
</head>
<body onload="showTime()">
	<div class="alert alert-success alert-dismissable center-block" id="time">
  </div>
</body>
<script type="text/javascript">  
//设定倒数秒数  
var t = 3;  
//显示倒数秒数  
function showTime(){  
    t -= 1;  
    document.getElementById('time').innerHTML= "登录成功，还有"+t+"秒后跳转页面…";  
    if(t==0){  
    	location.href = "<%=baseUrl%>mvc/home/toHome.do";
    }  
    //每秒执行一次,showTime()  
    setTimeout("showTime()",1000);  
}  
  
</script> 