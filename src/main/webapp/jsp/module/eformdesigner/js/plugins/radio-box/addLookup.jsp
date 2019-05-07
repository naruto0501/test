<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="avicit.platform6.commons.utils.ViewUtil"%>
<%@page import="avicit.platform6.api.session.SessionHelper"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>单位列表</title>
<base href="<%=ViewUtil.getRequestPath(request)%>">
<jsp:include page="/avicit/platform6/component/common/EasyUIJsInclude.jsp"></jsp:include>
<jsp:include page="/avicit/platform6/modules/system/commonpopup/commonSelectionHead.jsp"></jsp:include>
<script src="static/js/platform/component/common/exteasyui.js" type="text/javascript"></script>

</head>
<%
	long timestamp = System.currentTimeMillis();
	String language =SessionHelper.getCurrentUserLanguageCode(request);
	String appId = SessionHelper.getApplicationId();
	String tableId = request.getParameter("tableId");
%>
<body>
<body class="easyui-layout"  fit="true">
<div data-options="region:'north',split:false,title:''" style="height: 70px; padding:0px;">	
			
			<div style="TEXT-ALIGN: center; ">
				<form id="searchLookupForm">
		    		<table style=" MARGIN-RIGHT: auto; MARGIN-LEFT: auto;">
		    			<tr>
		    				
		    				<td>系统代码类型:</td><td><input class="easyui-validatebox"  name="filter-LIKE-LOOKUP_TYPE" id="filter_LIKE_loginName" /></td>
		    				<td>系统代码类型名称:</td><td><input class="easyui-validatebox"  name="filter-LIKE-LOOKUP_TYPE_NAME" id="filter_LIKE_name" /></td>
		    				<td>有效标识:</td><td><input id="filter-EQ-VALID_FLAG" class="easyui-combobox" name="filter-EQ-VALID_FLAG" 
	    						 data-options="panelHeight:'auto', editable:false,valueField:'lookupCode',textField:'lookupName', data: [{lookupCode:'1', lookupName: '有效'},{lookupCode:'0', lookupName: '无效'}]" /> </td>
		    			</tr>
		    			
		    		</table>
		    	</form>
		    </div>	
		    
		    <div style="TEXT-ALIGN: center; ">
		    
		    	<div  id="searchBtns" style=" MARGIN-RIGHT: auto; MARGIN-LEFT: auto;">
		    		<a class="easyui-linkbutton" iconCls="icon-search" plain="true" onclick="searchData();" href="javascript:void(0);">查询</a>
		    		<a class="easyui-linkbutton" iconCls="icon-cancel" plain="true" onclick="clearData();" href="javascript:void(0);">清空</a>
		    		
		    	</div>
	    	</div>
	    </div>
<div data-options="region:'center',split:true,border:false" style="overflow:hidden;">	
		<input  id="columnId"  value="${columnId}"   type="hidden"  />
		<input  id="tableId"  value="${tableId}"   type="hidden"  />
		<table id="tablelookup" class="easyui-datagrid"  fit="true"  pagination="true" rownumbers="true" fitColumns="true" singleSelect="true" autoRowHeight="false" striped="true" url="platform/eform/tabledefine/<%=timestamp%>/<%=appId%>/<%=language%>/allSysLookupType.json"      data-options="onLoadSuccess:cellTip"> 
								<thead>
										<tr> 
								        	<th data-options="field:'id', halign:'center',checkbox:true" width="220">id</th>
								        	<th data-options="field:'sid', halign:'center',hidden:true" width="220">sid</th>
								    		<th data-options="field:'lookupType',align:'center'">系统代码类型</th>
								        	<th data-options="field:'lookupTypeName',align:'center'"  width="320">系统代码类型名称</th>
								        	<th data-options="field:'usageModifier',align:'center',align:'center',formatter:formatModifier"  width="120">使用级别</th>
											<th data-options="field:'validFlag',align:'center',formatter:formatValidFlag" 	 width="220">有效标识</th>
											<th data-options="field:'description',align:'center'"  width="220">描述</th>
								        </tr>
									</thead>
		</table>
		
</div>


<!-- button js event -->
	<script type="text/javascript">
		var baseurl = '<%=request.getContextPath()%>';
		var url;
		 var ele = parent.EformEditor.getElement("radio-box");
		function cellTip(data){
			
			$('#tablelookup').datagrid('doCellTip',   
			{   
				onlyShowInterrupt:true,   
				position:'bottom',
				tipStyler:{'backgroundColor':'#FFFFFF',boxShadow:'1px 1px 3px #292929'}
			}); 
			
		};
		
		
		function searchData(){
			$("#tablelookup").datagrid('uncheckAll').datagrid('unselectAll').datagrid('clearSelections');
			$("#tablelookup").datagrid('load',{ param : JSON.stringify(serializeObject($("#searchLookupForm")))});
		}
		
		function clearData(){
			$("#searchLookupForm").find('input').val('');
			$("#tablelookup").datagrid('reload',{});
		};
		
		$(document).ready(function(){ 
			$('#searchLookup').find('input').on('keyup',function(e){
				if(e.keyCode == 13){
					searchData();
				}
			});
		});
		
		function formatValidFlag(value){
			if (value == "1"){
				return "有效";
			}else{
				return "无效";
			}
		}
		
		function formatModifier(value){
			if (value == "1"){
				return "私有使用";
			}else{
				return "公共使用";
			}
		}
		
		function commitData() {
			var array = [];
			var row=$('#tablelookup').datagrid('getSelected');
			if(row){
				var lookupType=row.lookupType;
				$.ajax({
					url: 'platform/syslookuptype/getLookUpCode/'+lookupType+'.json',
					type :'get',
					async:false,
					dataType :'json',
					success : function(r){
						if (r)
							r.lookupType = lookupType;
						array = r;
					}
				});
			}else{
				alert('请选择通用代码!');
			}
			return array;
		}
		
	</script>
</body>
</html>