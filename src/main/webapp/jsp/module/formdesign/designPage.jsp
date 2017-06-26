<%@page import="com.utils.CommonUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<base href="<%=CommonUtil.getRequestPath(request)%>">
  <link href="static/css/jquery-ui.min.css" rel="stylesheet">
<link href="static/css/bootstrap.min.css" rel="stylesheet">
<link href="static/css/font-awesome.css" rel="stylesheet">

    <link rel="stylesheet" href="jsp/module/formdesign/css/style.css" media="screen" type="text/css" />
</head>

<body>
<div class="container-fluid">
    <nav class="navbar navbar-default" role="navigation" style="margin-bottom: 10px;">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">表单设计器</a>
            </div>
            <div>
                <form class="navbar-form navbar-left" role="search">
                    <div class="form-group">
                        <input class="form-control" type="text" name="tablename" placeholder="表名称"/>
                    </div>
                </form>
                <button class="btn btn-primary" onclick="alert(editor.toHtml())">保存</button>
                <button type="button" class="btn btn-default navbar-btn" onclick="editor.clear()">清空</button>
                <button type="button" class="btn btn-default navbar-btn" onclick="editor.preview()">预览</button>
                <button id="undo" type="button" class="btn btn-default navbar-btn">撤销</button>
                <button id="redo" type="button" class="btn btn-default navbar-btn">重做</button>
            </div>
        </div>
    </nav>

    <div class="row" id="formArea">
    </div>
</div>

<div id="context-menu">
    <ul class="dropdown-menu" role="menu">
        <li><a tabindex="-1" href="javascript:void(0);" id="delEle" operator="top">删除</a></li>
    </ul>
</div>

<div style="text-align:center;clear:both">
</div>
<script src="static/js/jquery-1.11.3.min.js"></script>

  <script src="static/js/jquery-ui.min.js"></script>
  <script src="static/js/bootstrap.min.js"></script>
 <script src="static/js/common.js"></script>
 <script src="jsp/module/formdesign/js/domtrans/dom-easyui.js"></script>
<script src="jsp/module/formdesign/js/main.js"></script>
<script src="jsp/module/formdesign/js/config.js"></script>
  <!-- <script src="jsp/module/formdesign/js/drag.js"></script> -->
<div style="text-align:center;clear:both">
</div>
<script type="text/javascript">
var editor = new EformEditor("formArea");
</script>

</body>
</html>