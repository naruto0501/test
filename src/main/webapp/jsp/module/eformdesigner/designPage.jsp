<%@page import="com.utils.CommonUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>电子表单设计</title>
    <base href="<%=CommonUtil.getRequestPath(request)%>">

    <!-- bootstrap & fontawesome -->
    <link rel="stylesheet" href="static/css/bootstrap.css"/>
    <link rel="stylesheet" href="static/css/font-awesome.css"/>

    <!-- page specific plugin styles -->
    <link rel="stylesheet" href="static/css/aceadmin/css/jquery-ui.min.css"/>
   	<!-- <link rel="stylesheet" href="static/css/platform/aceadmin/css/bootstrap-datepicker3.min.css"/> -->
	<link rel="stylesheet" href="static/css/bootstrap-datetimepicker.css"/>

    <!-- text fonts -->
    <link rel="stylesheet" href="static/css/aceadmin/css/ace-fonts.min.css"/>

    <!-- ace styles -->
    <!-- 修改部分ace样式 -->
    <link rel="stylesheet" href="static/css/aceadmin/css/ace.css" class="ace-main-stylesheet"
          id="main-ace-style"/>
    <!--[if lte IE 9]>
    <link rel="stylesheet" href="static/css/aceadmin/css/ace-part2.min.css" class="ace-main-stylesheet"/>
    <![endif]-->

    <!--[if lte IE 9]>
    <link rel="stylesheet" href="static/css/aceadmin/css/ace-ie.min.css"/>
    <![endif]-->

    <!-- inline styles related to this page -->

    <!-- ace settings handler -->
    <script src="static/js/aceadmin/ace-extra.min.js"></script>


    <link rel="stylesheet" href="jsp/module/eformdesigner/css/style.css"/>
    <%--<link rel="stylesheet" id="themeskin" type="text/css" href="static/h5/skin/default.css">--%>
    <style type="text/css">
        .navbar-form span {
            margin-left: 10px;
        }

        .icon {
            font-size: 25px;
            cursor: pointer;
        }
    </style>
    <script type="text/javascript">
        var contextPath = "<%=request.getContextPath()%>";

        var isDesign = '${isDesign}';
        var tableName = '${tableName}';
        var tableId = '${eformFormInfo.dataSourceId}';
        var columnsList = '${columnsList}';
        var eformInfoStyle = '${eformInfoStyle}';
        var formContent = '${formContent}';
        var formContentCss = '${formContentCss}';
        var formContentJs = '${formContentJs}';
        var version = '${version}';
        var eformPublishStatus = '${publishStatus}';
    </script>
</head>

<body class="formdesign">
<div id="navbar" class="navbar navbar-default ace-save-state">
    <div class="navbar-container ace-save-state" id="navbar-container">
        <div class="navbar-header pull-left">
            <h4 id="formName" style="color: white;">${formPath}</h4>
        </div>

        <div class="navbar-buttons navbar-header pull-right">
            <div class="navbar-form navbar-left" id="buttonArea">
            </div>
        </div>
    </div>
</div>

<%--设计区--%>
<div class="row col-xs-12" id="formArea">
</div>

<%--模板列表--%>
<div class="row col-xs-12">
    <div id="top-template" class="modal aside" data-fixed="true" data-placement="top" data-background="true"
         data-backdrop="invisible" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body container">
                    <%--模板列表显示位置--%>
                    <div id="templateList"></div>

                    <div class="closeButton">
                        <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal"><i
                                class="ace-icon fa fa-arrow-up bigger-110"></i>收起
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<%--样式列表--%>
<div class="row col-xs-12">
    <div id="top-style" class="modal aside" data-fixed="true" data-placement="top" data-background="true"
         data-backdrop="invisible" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body container" style="text-align: center;">
                    <%--样式列表显示位置--%>
                    <div id="styleList"></div>

                    <div class="closeButton">
                        <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal"><i
                                class="ace-icon fa fa-arrow-up bigger-110"></i>收起
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<%--保存模板页面--%>
<div id="saveTemplate" class='modal fade' role='dialog' aria-hidden='true'>
    <div class='modal-dialog' role='document'>
        <div class='modal-content'>
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">新建模板</h4>
            </div>

            <div class="modal-body">
                <form method="post" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-3 control-label no-padding-right">
                            模板名称
                        </label>

                        <div class="col-sm-9">
                            <input type="text" id="templateName" name="templateName" class="col-sm-8 required">
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-default" data-dismiss="modal"><i
                        class="ace-icon fa fa-close bigger-110"></i>取消
                </button>
                <button type="button" class="btn btn-sm btn-primary" id="saveTemplateButton"><i
                        class="ace-icon fa fa-arrow-right bigger-110"></i>提交
                </button>
            </div>
        </div>
    </div>
</div>

<%--保存电子表单页面--%>
<div id="saveEform" class='modal fade' role='dialog' aria-hidden='true'  data-backdrop="static">
    <div class='modal-dialog' role='document'>
        <div class='modal-content'>
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">保存电子表单</h4>
            </div>

            <div class="modal-body">
                <form method="post" class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-4 control-label no-padding-right">
                            数据库表名称：DYN_
                        </label>

                        <div class="col-sm-8">
                            <input type="text" id="form_tableName" name="form_tableName" class="col-sm-8 required">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-4 control-label no-padding-right">
                            中文名称：
                        </label>

                        <div class="col-sm-8">
                            <input type="text" id="form_tableLabel" name="form_tableLabel" class="col-sm-8">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-4 control-label no-padding-right">
                            存储模型分类：
                        </label>

                        <div class="col-sm-8">
                            <div class="input-group" style="padding-right: 123px;">
                                <input type="hidden" id="dbTypeId" name="dbTypeId">
                                <input title="存储模型分类" placeholder="请选择存储模型分类" class="form-control" type="text"
                                       id="dbTypeName" readonly/>
                                <span class="input-group-addon" id="dbTypeNameBtn"><i class="glyphicon glyphicon-menu-hamburger"></i></span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-primary" id="saveEformButton"><i
                        class="ace-icon fa fa-arrow-right bigger-110"></i>提交
                </button>
                  <button type="button" class="btn btn-sm btn-default" data-dismiss="modal"><i
                        class="ace-icon fa fa-close bigger-110"></i>取消
                </button>
            </div>
        </div>
    </div>
</div>

<!-- basic scripts -->
<!--[if !IE]> -->
<script src="static/js/aceadmin/jquery.min.js"></script>
<!-- <![endif]-->
<!--[if IE]>
<script src="static/js/aceadmin/jquery1x.min.js"></script>
<![endif]-->
<script type="text/javascript">
    if ('ontouchstart' in document.documentElement) document.write("<script src='static/js/aceadmin/jquery.mobile.custom.min.js'>" + "<" + "/script>");
</script>
<script src="static/js/aceadmin/bootstrap.min.js"></script>

<!-- page specific plugin scripts -->
<!--[if lte IE 8]>
<script src="static/js/aceadmin/excanvas.min.js"></script>
<![endif]-->
<script src="static/js/aceadmin/jquery-ui.min.js"></script>
<script src="static/js/aceadmin/jquery.validate.min.js"></script>
<script src="static/js/aceadmin/additional-methods.js"></script>
<!-- <script src="static/js/aceadmin/date-time/bootstrap-datepicker.min.js"></script> -->
<script src="static/js/bootstrap-datetimepicker.js"></script>
<script src="static/js/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="static/js/layer-v2.3/layer/layer.js"></script>
<script type="text/javascript" src="static/js/h5-common-befer.js"></script>


<!-- 电子表单所引js -->
<script src="static/js/tinymce/tinymce.min.js"></script>
<script src="static/js/common.js"></script>
<script src="static/js/mydialog.js"></script>
<script src="static/js/selectarea.js"></script>
<script src="jsp/module/eformdesigner/js/main.js"></script>
<script src="jsp/module/eformdesigner/js/config.js"></script>

<!-- ace scripts -->
<script src="static/js/aceadmin/ace/elements.scroller.js"></script>
<script src="static/js/aceadmin/ace/elements.typeahead.js"></script>
<script src="static/js/aceadmin/ace/elements.aside.js"></script>
<script src="static/js/aceadmin/ace/ace.js"></script>

<!-- inline scripts related to this page -->
<script type="text/javascript">

    var formEditor = new FEformEditor("formArea");
    formEditor.eformFormInfoId = "${eformFormInfo.id}";
    formEditor.isBpm = "${eformFormInfo.isBpm}";
    formEditor.isUpload = "${eformFormInfo.tableIsUpload}";
    formEditor.formCode = "${eformFormInfo.formCode}";
    formEditor.nowDbid = '${eformFormInfo.dataSourceId}';

    $(".modal.aside").ace_aside();
</script>

</body>
</html>