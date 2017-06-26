<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<form class="form">
    <div class="form-group">
        <label class="control-label">中文名称：</label>
        <input class="input-large" type="text" name="colLabel" id="colLabel" onblur="getPinyin();">
    </div>

    <div class="form-group">
        <label class="control-label">英文名称：</label>
        <input type="text" name="colName" id="colName">
    </div>

    <div class="form-group">
        <label class="control-label">字段长度：</label>
        <input type="text" name="colLength" id="colLength" value="50">
    </div>
    <div class="form-group">
    	<label class="control-label">选项：<a id="relation_lookup" title="关联通用代码"><i class="fa fa-fw fa-lg fa-comments-o"></i></a>  <a id="select_del"   title="删除"><i class="fa fa-fw fa-lg fa-comments-o"></i></a> <a title="上移" id="select_up"><i class="fa fa-fw fa-lg fa-comments-o"></i></a> <a title="下移" id="select_down"><i class="fa fa-fw fa-lg fa-comments-o"></i></a></label>
		<div class="row" id="selector">
			<div class="col-sm-6">
				<input type="text" name="selectoption" id="selectoption"
					style="width:80px;margin-bottom:5px;" placeholder="options...">
				<input type="hidden" name="selectedoption" id="selectedoption">
				<ul id="selectoptions">
</ul>
			</div>
			<div class="col-sm-6">
				<input type="text" name="selectvalue" id="selectvalue"
					style="width:80px;margin-bottom:5px;" placeholder="values...">
					<input type="hidden" name="selectedvalues" id="selectedvalues">
				<ul id="selectvalues">
</ul>
			</div>
		</div>
	</div>
</form>
<style>
  #selectoptions, #selectvalues {
    border: 1px solid #0000ff;
    width: 80px;
    min-height: 20px;
    list-style-type: none;
    margin: 0;
    padding: 5px 0 0 0;
    float: left;
    margin-right: 10px;
  }
  #selectoptions li, #selectvalues li {
    margin: 0 5px 5px 5px;
    padding: 5px;
    width: 70px;
  }
  </style>
<script type="text/javascript">

$(document).ready(function(){
	initSelect();
	$("#selectvalue").val("");
	$("#selectoption").val("");
});

function initSelect(){
	var ele = EformEditor.nowElement;
	var array=[];
	for (var o=0;o<ele.find("option").length;o++){
		if (ele.find("option").eq(o).attr("value")){
			var obj = {};
			obj.lookupCode = ele.find("option").eq(o).attr("value");
			obj.lookupName = ele.find("option").eq(o).text();
			array.push(obj);
		}
	}
	setSelect(array);
}

	$('#selectoption').on('keyup',function(e) {
		if (!window.optionCount) {
			window.optionCount = 0;
		}
		if (e.keyCode == 13) {
			if (!$("#selectvalue").val()) {
				alert("请先填写选项value值");
				return false;
			}
			var li = $('<li class="ui-state-default" num="' + window.optionCount+'">'+ $(this).val() + '</li>');
			$(li).click(function() {
				   var num =  $(this).attr("num");
					$("#selectvalues li").removeClass("ui-state-highlight");
					$("#selectoptions li").removeClass("ui-state-highlight");
					$(this).addClass("ui-state-highlight");
					$("#selectvalues li[num='" + num + "']").addClass("ui-state-highlight");
			});
			$("#selectoptions").append(li);
			var li2 =$('<li class="ui-state-default" num="' + window.optionCount+'">'+ $("#selectvalue").val() + '</li>');
			$(li2).click(function() {
				var num =  $(this).attr("num");
				$("#selectvalues li").removeClass("ui-state-highlight");
				$("#selectoptions li").removeClass("ui-state-highlight");
				$(this).addClass("ui-state-highlight");
				$("#selectoptions li[num='" + num + "']").addClass("ui-state-highlight");
			});
			$("#selectvalues").append(li2);
			window.optionCount++;
		}
		
			});

	$('#selectvalue').on(
			'keyup',
			function(e) {
				if (!window.optionCount) {
					window.optionCount = 0;
				}
				if (e.keyCode == 13) {
					if (!$("#selectoption").val()) {
						alert("请先填写选项option值");
						return false;
					}
					var li = $('<li class="ui-state-default" num="' + window.optionCount+'">'+ $("#selectoption").val() + '</li>');
					$(li).click(function() {
						   var num =  $(this).attr("num");
							$("#selectvalues li").removeClass("ui-state-highlight");
							$("#selectoptions li").removeClass("ui-state-highlight");
							$(this).addClass("ui-state-highlight");
							$("#selectvalues li[num='" + num + "']").addClass("ui-state-highlight");
					});
					$("#selectoptions").append(li);
					var li2 =$('<li class="ui-state-default" num="' + window.optionCount+'">'+  $(this).val() + '</li>');
					$(li2).click(function() {
						var num =  $(this).attr("num");
						$("#selectvalues li").removeClass("ui-state-highlight");
						$("#selectoptions li").removeClass("ui-state-highlight");
						$(this).addClass("ui-state-highlight");
						$("#selectoptions li[num='" + num + "']").addClass("ui-state-highlight");
					});
					$("#selectvalues").append(li2);
					window.optionCount++;
				}
			});
	
	$("#select_del").click(function(){
		$("#selectvalues").find(".ui-state-highlight").remove();
		$("#selectoptions").find(".ui-state-highlight").remove();
	});
	
	$("#select_up").click(function(){
		var onthis = $("#selectvalues").find(".ui-state-highlight");
		var getup = $("#selectvalues").find(".ui-state-highlight").prev();
		$(getup).before(onthis);
		
		var onthis1 = $("#selectoptions").find(".ui-state-highlight");
		var getup1 = $("#selectoptions").find(".ui-state-highlight").prev();
		$(getup1).before(onthis1);
	});
	
	$("#select_down").click(function(){
		var onthis = $("#selectvalues").find(".ui-state-highlight");
		var getdown = $("#selectvalues").find(".ui-state-highlight").next();
		$(getdown).after(onthis);
		var onthis1 = $("#selectoptions").find(".ui-state-highlight");
		var getdown1 = $("#selectoptions").find(".ui-state-highlight").next();
		$(getdown1).after(onthis1);
	});
	
	$("#relation_lookup").click(function(){
		 var dialog = new CommonJQueryUIDialog("syslookup","700","600", "avicit/platform6/eform/formdesign/js/plugins/select-box/addLookup.jsp","选择通用代码", null, true, false, false);
		 dialog.show();
	});
	
	function closeDialog(id){
		$( "#"+id ).dialog( "close" ); 
	}
	
	function setSelect(obj){
		$("#selectoptions").empty();
		$("#selectvalues").empty();
		window.optionCount = 0;
		for (var i=0 ;i<obj.length;i++){
			var li = $('<li class="ui-state-default" num="' + window.optionCount+'">'+ obj[i].lookupName + '</li>');
			$(li).click(function() {
				   var num =  $(this).attr("num");
					$("#selectvalues li").removeClass("ui-state-highlight");
					$("#selectoptions li").removeClass("ui-state-highlight");
					$(this).addClass("ui-state-highlight");
					$("#selectvalues li[num='" + num + "']").addClass("ui-state-highlight");
			});
			$("#selectoptions").append(li);
			var li2 =$('<li class="ui-state-default" num="' + window.optionCount+'">'+ obj[i].lookupCode + '</li>');
			$(li2).click(function() {
				var num =  $(this).attr("num");
				$("#selectvalues li").removeClass("ui-state-highlight");
				$("#selectoptions li").removeClass("ui-state-highlight");
				$(this).addClass("ui-state-highlight");
				$("#selectoptions li[num='" + num + "']").addClass("ui-state-highlight");
			});
			$("#selectvalues").append(li2);
			window.optionCount++;
		}
	}
</script>