<%@page import="com.utils.CommonUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%
	String userName = (String)request.getSession().getAttribute("_USER_NAME");
%>
<base href="<%=CommonUtil.getRequestPath(request)%>">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<title>首页</title>
<link href="static/css/bootstrap.min.css" rel="stylesheet">
<script src="static/js/jquery-1.11.3.min.js"></script>
<script src="static/js/bootstrap.min.js"></script>
<script src="static/js/menubar.js"></script>
</head>
<body style="overflow-x:hidden;overflow-y:hidden">
	<div class="container">
		<div class="row">
			<nav class="navbar navbar-inverse" id="sysMenu" style="margin-bottom:5px;">
				<div id="navbar" class="navbar-collapse">
					<ul class="nav navbar-nav navbar-left">
						<li class="active"><a href="#">首页</a></li>
						<li><a id="aaa">新闻</a></li>
						<li class="dropdown"><a href="#" class="dropdown-toggle"
							data-toggle="dropdown" role="button" aria-expanded="false">管理
								<span class="caret"></span>
						</a>
							<ul class="dropdown-menu" role="menu">
								<li><a id="bbb">用户管理</a></li>
								<li><a id="upload">上传demo</a></li>
								<li class="divider"></li>
								<li class="dropdown-header">Nav header</li>
								<li><a id="formdesign">表单设计</a></li>
							</ul></li>
					</ul>
					<div class=" navbar-right">
				    <p class="navbar-text">欢迎您！ 
				    	<a href="#" class="navbar-link"><%=userName%></a>
				    	&nbsp;|
				    	<a href="mvc/logout/logout.do" class="navbar-link">登出</a>
				    	&nbsp;
				    </p>
   				</div>
				</div>
				
			</nav>
		</div>
		
		<div class="row">
			<ul id="myTab" class="nav nav-tabs">
			</ul>
			<div id="myTabContent" class="tab-content">
			</div>
		</div>
	</div>
</body>
<script type="text/javascript">
$(function (){
	$("#aaa").bind("click",function(){
		addTabs({id: $(this).attr("id"),close:true, title: $(this).html(), url: "jsp/module/sort/sort.jsp"});
	});
	$("#bbb").bind("click",function(){
		addTabs({id: $(this).attr("id"), close:true,title: $(this).html(), url: "jsp/module/sysuser/sys_user.jsp"});
	});
	$("#upload").bind("click",function(){
		addTabs({id: $(this).attr("id"), close:true,title: $(this).html(), url: "jsp/module/upload/h5upload.jsp"});
	});
	$("#formdesign").bind("click",function(){
		addTabs({id: $(this).attr("id"), close:true,title: $(this).html(), url: "jsp/module/formdesign/designPage.jsp"});
	});
	
});
</script>
</html>