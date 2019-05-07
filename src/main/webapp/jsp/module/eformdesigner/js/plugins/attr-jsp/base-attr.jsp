<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
		String except  = request.getParameter("except")!=null ? request.getParameter("except"): "" ;
%>

<%if (!except.contains("column")) {%>
<table id ="total" style="width:100%">
 <tr><td>
	<div class="form-group" style="width:98%">
	    <label class="control-label">表名称：</label>
	    <div class="input-group">
	        <input class="form-control" type="text" id="tableName" name="tableName" readonly="true"/>
	    </div>
	</div>
  </td></tr>
  <tr><td>
	<div class="form-group" style="width:98%">
	    <label class="control-label">字段名称(英文)：</label>
	    <div class="input-group">
	        <input class="form-control" type="text" id="colName" name="colName"/>
	        <span class="input-group-addon" id="colNameBtn"><i class="glyphicon glyphicon-menu-hamburger"></i></span>
	    </div>
	</div>
  </td></tr>
  <tr><td>
	<div class="form-group" style="width:99%">
	    <label class="control-label">字段描述(备注)：</label>
	    <input type="text" name="colLabel" id="colLabel" class="input-medium" style="width:99%" value="">
	</div>
  </td></tr>
  <tr><td>
	<div class="form-group" style="width:99%">
	    <label class="control-label">页面元素ID：</label>
	    <input type="text" name="domId" id="domId" class="input-medium" style="width:99%" value="">
	</div>
  </td></tr>
  <tr><td>
	<div class="form-group" style="display:none;">
	    <label class="control-label">数据源ID</label>
	    <input type="text" name="domdataid" id="domdataid" class="input-medium" style="width:99%" value="" readonly>
	</div>
	</td></tr>
<% }%>


<!-- <div class="form-group" style="display:none;">
    <label class="control-label">元素title</label>
    <input type="text" name="title" id="title" class="input-medium" value="">
</div> -->

<%if (!except.contains("required")) {%>
<tr><td>
	<div class="form-group">
	<table><tr>
	<td><label class="control-label">必填：</label></td>
	<td><label>
        <input name="colIsMust" type="radio" class="ace" value="Y">
        <span class="lbl">是</span>
    </label></td>
    <td><label style="padding-left: 10px;">
        <input name="colIsMust" type="radio" class="ace" value="N" checked>
        <span class="lbl">否</span>
    </label></td>
    </tr></table>
</div>
</td></tr>
<% }%>
<%if (!except.contains("readonly")) {%>
<tr><td>
<div class="form-group">
	<table><tr>
    <td><label class="control-label">只读：</label></td>
    <td><label>
        <input name="colDropdownType" type="radio" class="ace" value="Y">
        <span class="lbl">是</span>
    </label></td>
    <td><label style="padding-left: 10px;">
        <input name="colDropdownType" type="radio" class="ace" value="N" checked>
        <span class="lbl">否</span>
    </label></td>
    </tr></table>
</div>
</td></tr>
<% }%>
<%if (!except.contains("visible")) {%>
<tr><td>
<div class="form-group">
<table><tr>
    <td><label class="control-label">显示：</label></td>
    <td><label>
        <input name="colIsVisible" type="radio" class="ace" value="Y" checked>
        <span class="lbl">是</span>
    </label></td>
    <td><label style="padding-left: 10px;">
        <input name="colIsVisible" type="radio" class="ace" value="N">
        <span class="lbl">否</span>
    </label></td>
</tr></table>
</div>
</td></tr>
<% }%>
<%if (!except.contains("unique")) {%>
<tr><td>
	<div class="form-group">
	<table><tr>
	    <td><label class="control-label">唯一：</label></td>
	    <td><label>
	        <input name="colIsUnique" type="radio" class="ace" value="Y">
	        <span class="lbl">是</span>
	    </label></td>
	    <td style="padding-left: 10px;"><label>
	        <input name="colIsUnique" type="radio" class="ace" value="N" checked>
	        <span class="lbl">否</span>
	    </label></td>
	    </tr></table>
	</div>
</td></tr>
<% }%>
<%if (!except.contains("bpm")) {%>
<tr><td>
<div class="form-group" id="isbpmvar" style="display:none;">
    <label>
        <input name="bpmVar" type="checkbox" class="ace" value="Y">
        <span class="lbl">&nbsp;流程变量</span>
    </label>
</div>
</td></tr>
</table>
<div id="base_exttable">
</div>
<%--联动隐藏属性，用于存储当前控件所需控制的联动控件属性--%>
<div class="form-group" style="display:none;">
    <input type="text" name="linkageEle_ctrl">
    <input type="text" name="linkageColumnid_ctrl">
    <input type="text" name="linkageImpl_ctrl">
    <input type="text" name="linkageResultType_ctrl">
</div>

<script>
if (formEditor.isBpm == "Y"){
	$("#isbpmvar").css("display","block");
	$("input[name='bpmVar']").off("click");  
    $("input[name='bpmVar']").on('click',function(){
        var flag = $(this).is(':checked');
        if(flag){
        	$("input[name='colIsMust'][value='Y']").prop("checked",true);
        	$("input[name='colIsMust'][value='N']").prop('disabled',true);
        }else{
        	$("input[name='colIsMust'][value='N']").prop('disabled',false);
        }
    });
}
</script>
<% }%>
<script>
var labels=EformEditor.nowElement.parents().find("body")[0].getElementsByTagName("label");//页面所有标签
var allEle=editorUtil.getAllDomAttr();
var nowElement=EformEditor.nowElement["0"].firstChild;//当前元素dom
var $currentColName="";

if(EformEditor.nowElement.children('.eleattr-span').length!=0)
{
    var curAttr = $.parseJSON(EformEditor.nowElement.children('.eleattr-span').html());
    if (curAttr.hasOwnProperty("domId") && curAttr.domId !=""){
        $currentColName=curAttr.domId;//获取当前对象的domId值
    }else{
        $currentColName=curAttr.colName;//获取当前对象的colName值
    }

}
$('input[name=colIsMust]').click(function(event){
	for(var i=0;i<labels.length;i++)
	{
	    if(labels[i].getAttribute("for")==$currentColName&&$currentColName!="")
	    {
	    	var $bindLabel=$(labels[i]);
            var labelJson = $.parseJSON($bindLabel.siblings(".eleattr-span").html());
	    	if($(this).val()=='Y')
	    	{
	    	   if($bindLabel.find(".required").length == 0)//防止多填
	    	   {
		    		$bindLabel.prepend("<i class='required' style='color:red;'>*</i>");
                   labelJson.colIsMust = "Y";
		       }
	    	}else
	    	{
	    		if($bindLabel.find(".required").length > 0)
    			{
                    $bindLabel.find(".required").remove();
                    labelJson.colIsMust = "N";
    			}
	    	}
            $bindLabel.parent().find(".eleattr-span").remove();
            $bindLabel.parent().append($("<span class='eleattr-span' style='display: none;'>" + JSON.stringify(labelJson) + "</span>"));
	    }
	}
});

$('input[name=colIsVisible]').click(function(event){
	for(var j=0;j<labels.length;j++)
	{
	    if(labels[j].getAttribute("for")==$currentColName&&$currentColName!="")
	    {
	    	var $bindLabel=$(labels[j]);
	    	var bindLabelAttr={};//存放label的所有属性，json
	    	if($bindLabel.next().length!=0)
	    	{
	    		bindLabelAttr=$.parseJSON($bindLabel.next().html());
	    	}
	    	bindLabelAttr.colIsVisible=$(this).val();
	    	$bindLabel.next().html(JSON.stringify(bindLabelAttr));
	    }
	}
});


if (EformConfig.globalPropExt){
    var table;
    $.ajax({
        url: EformConfig.globalPropExt,
        async: false,
        success: function (data) {
            table = $(data);
        }
    });
    $("#base_exttable").append(table);
}
</script>