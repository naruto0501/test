<%@page import="com.utils.CommonUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<base href="<%=CommonUtil.getRequestPath(request)%>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>排位</title>
<link href="static/css/bootstrap.min.css" rel="stylesheet">
<link href="static/css/bootstrap-table.min.css" rel="stylesheet">
<link href="static/css/jquery.gritter.css" rel="stylesheet">
<script src="static/js/jquery-1.11.3.min.js"></script>
<script src="static/js/bootstrap.min.js"></script>
<script src="static/js/bootstrap-table/bootstrap-table.js"></script>
<script src="static/js/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="static/js/jquery.gritter.min.js"></script>
<script src="static/js/common.js"></script>
<script src="static/js/mydialog.js"></script>

<script src="jsp/module/sysuser/js/sys_user.js"></script>
</head>
<body>
	<div id="custom-toolbar" class="btn-group">
		<button class="btn btn-default" href="jsp/module/sysuser/sys_user_add.jsp" data-toggle="modal" data-target="#myModal">添加</button>
		 <button id="edit_user" onclick="editUser();" class="btn btn-default" data-target="#editBox" data-toggle="modal">编辑</button>
		<button type="button" class="btn btn-default">按钮 2</button>
		<button type="button" class="btn btn-default">按钮 3</button>
	</div>
	<table id="userTable"
			data-toggle="table"
           data-toolbar="#custom-toolbar"
           data-search="true"
           data-show-refresh="true"
           data-show-toggle="true"
           data-show-columns="true"
           data-show-export="true"
           data-minimum-count-columns="2"
           data-show-pagination-switch="true"
           data-pagination="true"
           data-id-field="id"
           data-page-list="[10, 25, 50, 100, ALL]"
           data-show-footer="false"
           data-side-pagination="server"
           data-url="mvc/user/getUser.do">
           <thead>
           		<tr>
           			<th data-field="check" data-checkbox="true">ID</th>
           			<th data-field="id">id</th>
           			<th data-field="username">username</th>
           			<th data-field="nickname" data-width="10">nickname</th>
           			<th data-field="state" data-width="50">state</th>
           		</tr>
           </thead>
    </table>

	<!-- 模态框（Modal） -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" 
   aria-labelledby="myModalLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
               aria-hidden="true">×
            </button>
            <h4 class="modal-title" id="myModalLabel">
               模态框（Modal）标题
            </h4>
         </div>
         <div class="modal-body">
            点击关闭按钮检查事件功能。
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-default" 
               data-dismiss="modal">
               关闭
            </button>
            <button type="button" class="btn btn-primary">
               提交更改
            </button>
         </div>
      </div><!-- /.modal-content -->
   </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
</body>
<script type="text/javascript">
$(function(){ 
	
});
</script>
</html>