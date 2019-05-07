<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="avicit.platform6.api.session.SessionHelper"%>
<%@page import="avicit.platform6.commons.utils.ViewUtil"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>单位列表</title>
<base href="<%=ViewUtil.getRequestPath(request)%>">
<!-- bootstrap & fontawesome -->
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="static/css/platform/aceadmin/css/font-awesome.min.css"/>

    <link rel="stylesheet" href="static/css/platform/eform/jquery-ui.min.css"/>


<link rel="stylesheet" href="avicit/platform6/eform/formdesign/css/subtable.css"/>


<!-- basic scripts -->
<!--[if !IE]> -->
<script src="static/js/platform/aceadmin/jquery.min.js"></script>
<!-- <![endif]-->
<!--[if IE]>
<script src="static/js/platform/aceadmin/jquery1x.min.js"></script>
<![endif]-->
<script src="static/js/platform/aceadmin/bootstrap.min.js"></script>
<script src="static/js/platform/eform/jquery-ui.min.js"></script>
<script type="text/javascript" src="static/h5/layer-v2.3/layer/layer.js"></script>
<script src="static/js/platform/eform/common.js"></script>
<script src="static/js/platform/eform/mydialog.js"></script>
<script src="avicit/platform6/db/dbselect/selectCreatedDbTable/selectCreatedDbTable.js"></script>
<script src="avicit/platform6/eform/formdesign/js/plugins/attr-jsp/subdatatable.js"></script>
<style type="text/css">
	.add-button-group{
		float: right;
    	padding: 1px;
	}
	.add-button{
		padding-top: 2px;
    	padding-bottom: 2px;
	}
    html,body{
        height: 100%;
        width: 100%;
    }
</style>
</head>
<body>
    <div class="item-list-wrap">
        <div class="title">参数类型
            <div class="btn-group add-button-group">
                <button type="button" class="btn btn-primary add-button dropdown-toggle" data-toggle="dropdown">添加
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu">
                    <li>
                        <a href="javascript:void(0);" id="dbbutton">数据源参数</a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" id="urlbutton">页面参数</a>
                    </li>
                   <!--  <li>
                        <a href="javascript:void(0);" id="sqlbutton">SQL参数</a>
                    </li> -->
                </ul>
            </div>
        </div>
        <ul id="list_area" class="content-wrap" style="visibility: visible; outline: none;"></ul>
        <div class="empty-tip">
            点击添加新项按钮添加新的明细项
        </div>
    </div>
    <div class="property-list-wrap">
        <div class="title">属性</div>
        <ul class="content-wrap" style="visibility: visible;">
            <form id="property_form">
                <input type="hidden" name="paratype">
                <input type="hidden" name="paratypename">
                <li class="property-list dbpara urlpara">
                    <span class="property-title">目标字段</span>
                    <select name="targetcol" id="targetcol">
                    </select>
                </li>
                <li class="property-list  urlpara dbpara">
								<span class="property-title">是否入库</span>
								<input type="checkbox" name="issave" value="Y" class="item-width" checked>
							</li>
                <li class="property-list urlpara dbpara">
					<span class="property-title">参数类型</span>
					<select type="text" name="paracoltype">
							<option value="VARCHAR" selected>字符型</option>
							<option value="DECIMAL">数字型</option>
							<option value="DATE">日期型</option>
							<option value="BOOLEAN">布尔型</option>
					</select>
				</li>
                <li class="property-list dbpara">
                    <span class="property-title">参数来源</span>
                    <select name="paradb" id="paradb">
                    </select>
                    <input type="hidden" name="paradbid" id="paradbid"/>
                </li>
                <li class="property-list dbpara">
                    <span class="property-title">参数字段</span>
                    <select name="paracol" id="paracol">
                    </select>
                </li>

                <li class="property-list urlpara">
					<span class="property-title">参数值</span>
					<input type="text" name="urlparavalue" class="item-width">
				</li>
          
            </form>
        </ul>
        <div class="empty-tip">
            请先添加参数 
        </div>
    </div>
</body>
</html>