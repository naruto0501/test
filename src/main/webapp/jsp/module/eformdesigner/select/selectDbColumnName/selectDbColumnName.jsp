<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="avicit.platform6.commons.utils.ViewUtil" %>
<%
    String importlibs = "common,form,table";
%>

<html>
<head>
    <base href="<%=ViewUtil.getRequestPath(request)%>">
    <title>选择主表列</title>

    <jsp:include page="/avicit/platform6/h5component/common/h5uiinclude-css.jsp">
        <jsp:param value="<%=importlibs%>" name="importlibs"/>
    </jsp:include>
</head>

<body>
<div class="easyui-layout" fit=true>
    <div class="row">
        <table id='dbColumnTable'></table>
        <div id="jqGridPagerIndex"></div>
    </div>
    <input type="hidden" id="selectedData">
</div>

<jsp:include page="/avicit/platform6/h5component/common/h5uiinclude-js.jsp">
    <jsp:param value="<%=importlibs%>" name="importlibs"/>
</jsp:include>

<script type="text/javascript">


$(dbColumnTable).jqGrid({
	url : "platform6/db/dbtablecol/dbTableColController/operation/getDbTableColsByPage.json",
	mtype : 'POST',
	datatype : "json",
	colModel : [ {
        name : 'id',
        key : true,
        hidden : true
    }, {
        label : '列名',
        name : 'colName',
        align : 'center'
    }, {
        label : '备注',
        name : 'colComments',
        align : 'center'
    },{
        label : '字段长度',
        name : 'colLength',
        align : 'center',
        hidden : true
    }],
	postData : {tableId:"${param.tableId}"},
	toolbar : [ true, 'top' ],//启用toolbar
	height : 300,//初始化表格高度
	width:250,
	scrollOffset : 20, //设置垂直滚动条宽度
	rowNum : 10000,//每页条数
	rowList : [ 200, 100, 50, 30, 20, 10 ],//每页条数可选列表
	altRows : true,//斑马线
	pagerpos : 'left',//分页栏位置
	styleUI : 'Bootstrap', //Bootstrap风格
	viewrecords : true, //是否要显示总记录数
	autowidth : true,//列宽度自适应
	multiboxonly:true,
	hasTabExport:false,
    hasColSet:false,
	pager : "#jqGridPager",
	onCellSelect : function(rowid, iCol, cellcontent, e) {
        var data = $("#dbColumnTable").jqGrid('getRowData',rowid);
        $("#selectedData").data("data", data);
    }
});


    function getSelectedData() {
        return $("#selectedData").data("data");
    }
</script>
</body>
</html>