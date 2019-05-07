<%@ page import="avicit.platform6.commons.utils.ViewUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>电子表单设计</title>
    <base href="<%=ViewUtil.getRequestPath(request)%>">

    <!-- bootstrap & fontawesome -->
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/font-awesome.min.css"/>

    <!-- page specific plugin styles -->
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/jquery-ui.min.css"/>
   	<!-- <link rel="stylesheet" href="static/css/platform/aceadmin/css/bootstrap-datepicker3.min.css"/> -->
	<link rel="stylesheet" href="static/h5/datepicker/css/bootstrap-datetimepicker.css"/>
    <link rel="stylesheet" href="static/h5/jquery-ztree/3.5.12/css/zTreeStyle/zTreeStyle.min.css" type="text/css">

    <!-- text fonts -->
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/ace-fonts.min.css"/>

    <!-- ace styles -->
    <!-- 修改部分ace样式 -->
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/ace.css" class="ace-main-stylesheet"
          id="main-ace-style"/>
    <!--[if lte IE 9]>
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/ace-part2.min.css" class="ace-main-stylesheet"/>
    <![endif]-->

    <!--[if lte IE 9]>
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/ace-ie.min.css"/>
    <![endif]-->

    <!-- inline styles related to this page -->

    <!-- ace settings handler -->
    <script src="static/js/platform/aceadmin/ace-extra.min.js"></script>

    <!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->
    <!--[if lte IE 8]>
    <script src="static/js/platform/aceadmin/html5shiv.min.js"></script>
    <script src="static/js/platform/aceadmin/respond.min.js"></script>
    <![endif]-->

    <link rel="stylesheet" href="avicit/platform6/eform/formdesign/css/style.css"/>
    <link rel="stylesheet" id="themeskin" type="text/css" href="static/h5/skin/default.css">
    <link rel="stylesheet" href="static/h5/skin/iconfont/iconfont.css">
    <link rel="stylesheet" href="static/css/platform/eform/jquery.multiselect.css">
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
                <%--<span style="color: #2fae95;">
                    <i class="icon iconfont icon-Preservation" title="保存表单" onclick="formEditor.save()"></i>
                </span>
                <span style="color: #2fae95;">
                    <i class="icon iconfont icon-baocunfabu" title="保存并发布表单" onclick="formEditor.saveAndPublish()"></i>
                </span>
                <span style="border-left: 1px solid #B5B5B5;padding-bottom: 0px;padding-top: 7px;">
                </span>
                <span style="color: #B5B5B5;">
                    <i class="icon iconfont icon-open" title="打开模板" onclick="formEditor.openTemplate()"></i>
                </span>
                <span style="color: #B5B5B5;">
                    <i class="icon iconfont icon-style" title="应用样式" onclick="formEditor.applyStyle()"></i>
                </span>
                <span style="color:#B5B5B5;">
                	<i class="icon iconfont icon-js" title="JS文件扩展" onclick="formEditor.applyJs()"></i>
                </span>
                <span style="color: #B5B5B5;">
                    <i class="icon iconfont icon-preview" title="预览表单" onclick="formEditor.preview('${eformInfoStyle}')"></i>
                </span>
                <span style="color: #B5B5B5;">
                    <i class="icon iconfont icon-Save" title="保存模板" onclick="formEditor.saveAsTemplate()"></i>
                </span>
                <span style="color: #B5B5B5;">
                    <i class="icon iconfont icon-setting" title="自定义按钮" onclick="formEditor.customButton()"></i>
                </span>
                <span style="color: #B5B5B5;">
                    <i class="icon iconfont icon-file" title="帮助" onclick="formEditor.helpDoc()"></i>
                </span>--%>
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
<script src="static/js/platform/aceadmin/jquery.min.js"></script>
<!-- <![endif]-->
<!--[if IE]>
<script src="static/js/platform/aceadmin/jquery1x.min.js"></script>
<![endif]-->
<script type="text/javascript">
    if ('ontouchstart' in document.documentElement) document.write("<script src='static/js/platform/aceadmin/jquery.mobile.custom.min.js'>" + "<" + "/script>");
</script>
<script src="static/js/platform/aceadmin/bootstrap.min.js"></script>

<!-- page specific plugin scripts -->
<!--[if lte IE 8]>
<script src="static/js/platform/aceadmin/excanvas.min.js"></script>
<![endif]-->
<script src="static/js/platform/aceadmin/jquery-ui.min.js"></script>
<script src="static/js/platform/aceadmin/jquery.validate.min.js"></script>
<script src="static/js/platform/aceadmin/additional-methods.js"></script>
<!-- <script src="static/js/platform/aceadmin/date-time/bootstrap-datepicker.min.js"></script> -->
<script src="static/h5/datepicker/js/bootstrap-datetimepicker.js"></script>
<script src="static/h5/datepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="static/js/platform/public/jqValidate_messages_cn.js"></script>
<script src="static/h5/jquery-ztree/3.5.12/js/jquery.ztree.core-3.5.min.js"></script>
<script src="static/h5/layer-v2.3/layer/layer.js"></script>
<script type="text/javascript" src="static/h5/common-ext/avic.ajax.js"></script>
<script type="text/javascript" src="static/h5/common-ext/h5-common-befer.js"></script>


<!-- 电子表单所引js -->
<script src="static/js/platform/eform/tinymce/tinymce.min.js"></script>
<script src="static/js/platform/eform/common.js"></script>
<script src="static/js/platform/eform/mydialog.js"></script>
<script src="static/js/platform/eform/selectarea.js"></script>
<script src="avicit/platform6/eform/formdesign/js/main.js"></script>
<script src="avicit/platform6/eform/formdesign/js/config.js"></script>
<script src="avicit/platform6/db/dbselect/selectCreatedDbTable/selectCreatedDbTable.js"></script>
<script src="avicit/platform6/db/dbselect/selectDbType/selectDbType.js"></script>
<script src="avicit/platform6/eform/formdesign/select/selectDbColumnName/selectDbColumnName.js"></script>
<script src="static/js/platform/eform/jquery.multiselect.js"></script>
<script type="text/javascript" src="static/h5/common-ext/CommonSelect.js"></script>
<%--选通用代码--%>
<script src="static/h5/common-ext/window-ext.js"></script>
<script src="static/h5/avicSelectBar/compent/lookupTypeSelect/lookupTypeSelect.js"></script>

<!-- ace scripts -->
<script src="static/js/platform/aceadmin/ace/elements.scroller.js"></script>
<script src="static/js/platform/aceadmin/ace/elements.typeahead.js"></script>
<script src="static/js/platform/aceadmin/ace/elements.aside.js"></script>
<script src="static/js/platform/aceadmin/ace/ace.js"></script>

<!-- inline scripts related to this page -->
<script type="text/javascript">

    loadExtraJs();
    var formEditor = new FEformEditor("formArea");
    formEditor.eformFormInfoId = "${eformFormInfo.id}";
    formEditor.isBpm = "${eformFormInfo.isBpm}";
    formEditor.isUpload = "${eformFormInfo.tableIsUpload}";
    formEditor.formCode = "${eformFormInfo.formCode}";
    formEditor.nowDbid = '${eformFormInfo.dataSourceId}';
    //集成模型系统start
    var funinfochar = '${funinfo}';
   // var funinfochar = '[{"key":"add()","value":"aaa.jsp"},{"key":"adsssd()","value":"abca.jsp"}]';
  //集成模型系统end

    $(".modal.aside").ace_aside();
    var selectDbType = new SelectDbType("dbTypeId", "dbTypeName", "dbTypeNameBtn");
    selectDbType.init();
</script>

</body>
</html>