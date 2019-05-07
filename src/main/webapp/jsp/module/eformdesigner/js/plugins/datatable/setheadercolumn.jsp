<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="avicit.platform6.api.session.SessionHelper"%>
<%@page import="avicit.platform6.commons.utils.ViewUtil"%>
<%
	String importlibs = "common,table,form";
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>设置多级标题</title>
<base href="<%=ViewUtil.getRequestPath(request)%>">



<link rel="stylesheet" href="avicit/platform6/eform/formdesign/css/subtable.css"/>
<link rel="stylesheet" href="static/css/platform/eform/jquery-ui.min.css"/>


<!-- basic scripts -->
<!--[if !IE]> -->
<script src="static/js/platform/aceadmin/jquery.min.js"></script>
<!-- <![endif]-->
<!--[if IE]>
<script src="static/js/platform/aceadmin/jquery1x.min.js"></script>
<![endif]-->
<script src="static/js/platform/eform/jquery-ui.min.js"></script>
<script type="text/javascript" src="static/h5/layer-v2.3/layer/layer.js"></script>



	<jsp:include page="/avicit/platform6/h5component/common/h5uiinclude-css.jsp">
		<jsp:param value="<%=importlibs%>" name="importlibs"/>
	</jsp:include>
	<script type="text/javascript" src="static/h5/jqGrid-5.2.0/js/i18n/grid.locale-cn.js"></script>
	<script type="text/javascript" src="static/h5/jqGrid-5.2.0/js/jquery.jqGrid.custom.js"></script>
	<script type="text/javascript" src="static/js/platform/eform/jqgridValidate.js"></script>
	<script src="static/js/platform/eform/common.js"></script>
	<script src="avicit/platform6/eform/formdesign/js/plugins/datatable/setheadercolumn.js"></script>

	<style type="text/css">

html,body{
    height: 100%;
    width: 100%;
}
</style>
</head>
<body>


<div class="item-list-wrap">
					<div class="title">层级<span id="item_add" style="float:right;color:rgb(90, 172, 35);"><i class="fa fa-fw fa-lg fa-plus"></i></span></div>
					<ul id="list_area" class="content-wrap" style="visibility: visible; outline: none;"></ul>
					<div class="empty-tip">
						点击添加新项按钮添加新的层级项
					</div>
				</div>
<form id='form'>
				<div class="property-list-wrap">
					<div class="title">列明细</div>
					<table  style="table-layout: fixed;margin: 0;width: 100%; height: 100px;">
						<tr id="tabletr">
							<td style="width:85%;" colspan="4">
								<table style="table-layout: fixed;margin: 0;width: 100%;">
									<tbody>
									<tr>
										<td>
											<div id="tableToolbar" class="tollbar">
												<div>
													<a id="jslist_insert" href="javascript:void(0)"
													   class="btn btn-primary form-tool-btn btn-sm" role="button"
													   title="添加"><i class="fa fa-plus"></i> 添加</a>
													<a id="jslist_del" href="javascript:void(0)"
													   class="btn btn-primary form-tool-btn btn-sm" role="button"
													   title="删除"><i class="fa fa-trash-o"></i> 删除</a>
												</div>
											</div>
											<table id="propertytable"></table>
										</td>
									</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</table>
					<div class="empty-tip">
						请选择左边的层级信息
					</div>

				</div>
</form>

</body>
</html>