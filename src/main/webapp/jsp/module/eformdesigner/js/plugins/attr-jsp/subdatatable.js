var itemcount = 1;
var dataJsonList = [];
var curId = "";
var originJsonList = [];

function addDbItem(){
	var id = GenNonDuplicateID();
	var data = {
			targetcol:"",
			paratype:"1",
			paratypename:"数据源参数",
			issave:"Y"
	};
	putJsonData(id,data);
	drawListArea();
	itemcount++;
	$("#"+id).click();
}

function addUrlItem(){
	var id = GenNonDuplicateID();
	var data = {
			targetcol:"",
			paratype:"2",
			paratypename:"Url参数",
			issave:"Y"
	};
	putJsonData(id,data);
	drawListArea();
	itemcount++;
	$("#"+id).click();
}

function addSqlItem(){

}

function removeItem(obj){
	var id = $(obj).parent().attr("id");
	delJsonData(id);
	drawListArea();
	if (!isEmpty()){
		var fistId = dataJsonList[0].id;
		$("#"+fistId).click();
	}
}

function update(id){
	var json = $("#property_form").serializeObject();
	updateJsonData(id,json);
	drawListArea();
}

function itemClick(obj){
	var id = $(obj).attr("id");
	curId = id;
	$("#list_area").find(".current").removeClass("current");
	$(obj).addClass("current");
	$("#property_form").show();
	initHidden();
}

function drawListArea(){
	$("#list_area").html("");
	if (!isEmpty()){
		for (var i=0;i<dataJsonList.length;i++){
			var id = dataJsonList[i].id;
			var item = $('<li id="'+id+'" class="item-list"></li>');
			if (id == curId){
				item.addClass("current");
			}
			if (dataJsonList[i].data.hasOwnProperty("targetcol")){
				item.append('<span class="item-order" order="'+(i+1)+'">['+(i+1)+']</span>').append('<span class="item-title">'+dataJsonList[i].data.paratypename+"["+dataJsonList[i].data.targetcol+']</span>');
			}else{
				item.append('<span class="item-order" order="'+(i+1)+'">['+(i+1)+']</span>').append('<span class="item-title">'+dataJsonList[i].data.paratypename+'</span>');
			}
				var removeButton = $('<a href="javascript:void(0)" class="remove"></a>');
				removeButton.append('<i class="fa fa-times"></i>');
				item.append(removeButton);
				removeButton.click(function(){
					removeItem(this);
				});
			
			item.click(function(){
				itemClick(this);
			}).hover(function(){
				$(this).addClass("hover");
			},function(){
				$(this).removeClass("hover");
			});
			$("#list_area").append(item);
			
		}
	}
}

function isEmpty(){
	if (dataJsonList.length>0){
		$(".empty-tip").hide();
		return false;
	}else{
		$(".empty-tip").show();
		$("#property_form").hide();
		return true;
	}
}

function setProperty(id){
	var jsondata = getJsonData(id);
	$("#property_form").each( function(){
		this.reset();
		$(this).find("input[type='checkbox'],input[type='radio']").attr("checked",false);
	});
	if (jsondata){
		bindParaCol(jsondata.paradbid);
		$("#property_form").setform(jsondata);
	}
}

//初始化隐藏区域，绘制html，赋值，并将默认值更新入数组
function initHidden(){
	initHiddenAttrArea(curId);
	setProperty(curId);
	update(curId);
}

//初始化隐藏区域html及绑定事件
function initHiddenAttrArea(curId){
	var jsondata = getJsonData(curId);
	$(".property-list").hide();
	if (jsondata.paratype == "1"){
		$(".dbpara").show();
	}else if (jsondata.paratype == "2"){
		$(".urlpara").show();
	}
}

//初始化页面入口
$(document).ready(function(){
	var datatype = $("input[name='datatype']:checked", window.parent.document).val();
	if ( datatype == "1"){
		$("#dbbutton").click(function(){
			addDbItem();
		});
		$("#dbbutton").parent().show();
	}else{
		$("#dbbutton").parent().hide();
	}
	$("#urlbutton").click(function(){
		addUrlItem();
	});
	// $("#sqlbutton").click(function(){
	// 	addSqlItem();
	// });
	initTargetCol(parent.EformEditor.nowDbid);
	bindDbselect(parent.DataArea.dbarray,parent.EformEditor.nowElement);

	$("#property_form").find("select,input[type='checkbox']").on("change",function(){
		var value = this.value;
		var name = this.name;
		var oldValue = getJsonData(curId)[name];
		update(curId);
	});
	
	$("#property_form").find("input").on("keyup",function(){
		update(curId);
	});
	
	$("#list_area").sortable({
		stop: function(e,t){
			var $li = $(t.item);
			var id = $li.attr("id");
			var order = $li.prev().find(".item-order").attr("order")||"0";
			var data = getJsonData(id);
			delJsonData(id);
			putJsonData(id,data,parseInt(order));
			drawListArea();
			$("#"+curId).click();
		}
	});

	$("#property_form").hide();
	var list = $('#paralist', window.parent.document).val();
	if (list){
		var list = $.parseJSON(list);
		for (var i=0;i<list.length;i++){
			var data = list[i];
			var id = GenNonDuplicateID();
			putJsonData(id,data);
		}
		drawListArea();
		if (!isEmpty()){
			var fistId = dataJsonList[0].id;
			$("#"+fistId).click();
		}
	}
});

function putJsonData(id, json, index) {
	if (index != undefined) {
		dataJsonList.splice(index, 0, {
			id: id,
			data: json
		});
	} else {
		dataJsonList.push({
			id: id,
			data: json
		});
	}
}

function delJsonData(id){
	for (var i=0;i<dataJsonList.length;i++){
		if (dataJsonList[i].id == id){
			dataJsonList.splice(i, 1);
			break;
		}
	}
}

function updateJsonData(id,json){
	for (var j=0;j<dataJsonList.length;j++){
		if (dataJsonList[j].id == id){
			dataJsonList[j].data = json;
			break;
		}
	}
}

function getJsonData(id){
	if (id){
		for (var i=0;i<dataJsonList.length;i++){
			if (dataJsonList[i].id == id){
				return dataJsonList[i].data;
			}
		}
	}
}


/**
 * [initTargetCol 初始化目标字段选择]
 * @param  {[string]} dbid [目标存储模型id]
 * @return {[void]} 
 */
function initTargetCol(dbid) {
	if (!isEmptyObject(dbid)){
		$.ajax({
			url: 'platform/eform/eformViewInfoController/getDbCol/' + dbid,
			contentType: "application/xml; charset=utf-8",
			type: 'post',
			dataType: 'json',
			async: false,
			success: function(r) {
				if (r != null) {
					var list = $.parseJSON(r.data);
					var $colDom = $("#targetcol");
					$colDom.each(function() {
						$(this).empty();
						for (var i = 0; i < list.length; i++) {
							var $option = $('<option value="' + list[i].colName + '">' + list[i].colName + '</option>');
							$(this).append($option);
						}
					});
				}
			}
		});
	}else{
		var mainCol1 = parent.editorUtil.getMainTableDomAttr();
		$("#targetcol").empty();
		for (var index1 in mainCol1){
			if (index1!="clone"){
			var $option = $('<option value="' + mainCol1[index1].colName + '">' + mainCol1[index1].colName + '</option>');
			$("#targetcol").append($option);
			}
		}
	}
}


function bindParaCol(did){

    if (isEmptyObject(did)){
        var paradbid = $("#paradb").find("option:selected").attr("dbid");
    	did = paradbid;
	}
	if (!isEmptyObject(did)){
		$.ajax({
			url: 'platform/eform/eformViewInfoController/getDbCol/' + did,
			contentType: "application/xml; charset=utf-8",
			type: 'post',
			dataType: 'json',
			async: false,
			success: function(r) {
				if (r != null) {
					var list = $.parseJSON(r.data);
					var $colDom = $("#paracol");
					$colDom.each(function() {
						$(this).empty();
						for (var i = 0; i < list.length; i++) {
							var $option = $('<option value="' + list[i].colName + '">' + list[i].colName + '</option>');
							$(this).append($option);
						}
					});
				}
			}
		});
	}else{
		var mainCol = parent.editorUtil.getMainTableDomAttr();
		$("#paracol").empty();
        addBaseCol();
		for (var index in mainCol){
			if (index!="clone"){
			var $option = $('<option value="' + mainCol[index].colName + '">' + mainCol[index].colName + '</option>');
			$("#paracol").append($option);
			}
		}
	}
}


function addBaseCol(){
    var $option = $('<option value="ID">ID</option>');
    $("#paracol").append($option);
    $option = $('<option value="LAST_UPDATE_DATE">LAST_UPDATE_DATE</option>');
    $("#paracol").append($option);
    $option = $('<option value="LAST_UPDATED_BY">LAST_UPDATED_BY</option>');
    $("#paracol").append($option);
    $option = $('<option value="CREATION_DATE">CREATION_DATE</option>');
    $("#paracol").append($option);
    $option = $('<option value="CREATED_BY">CREATED_BY</option>');
    $("#paracol").append($option);
    $option = $('<option value="LAST_UPDATE_IP">LAST_UPDATE_IP</option>');
    $("#paracol").append($option);
    $option = $('<option value="VERSION">VERSION</option>');
    $("#paracol").append($option);
    $option = $('<option value="ORG_IDENTITY">ORG_IDENTITY</option>');
    $("#paracol").append($option);
}

/**
 * [bindDbselect 绑定来源数据模型]
 * @param  {[array]} dbtableArray [数据源数组，格式为：[{dbid:"",dbname:""}] ]
 * @return {[void]}              
 */
function bindDbselect(dbtableArray,dom) {
	dbtableArray = [];
	$("#paradb").empty();
	
	var tablesArray = parent.editorUtil.getAllTableAttr(dom.attr("id"));
	
	for (var i  in tablesArray) {
		if (i!="clone"){
			var $option = $('<option value="' + i + '" dataname="'+i+'" dbid="'+tablesArray[i].dbid +'">' + tablesArray[i].dataname + '</option>');
			$("#paradb").append($option);
		}
	}
	
	
//	for (var i = 0; i < dbtableArray.length; i++) {
//		var $option = $('<option value="' + dbtableArray[i].dbid + '">' + dbtableArray[i].dbname + '</option>');
//		$("#paradbid").append($option);
//	}

	//初始绑定数据源字段
	var did = $("#paradbid").val();
	bindParaCol(did);

	//切换时绑定事件，重新初始化字段选择
	$("#paradb").on("change",function(event) {
		var id = $(this).find("option:selected").attr("dbid");
		if (!isEmptyObject(id)){
			$.ajax({
				url: 'platform/eform/eformViewInfoController/getDbCol/' + id,
				contentType: "application/xml; charset=utf-8",
				type: 'post',
				dataType: 'json',
				async: false,
				success: function(r) {
					if (r != null) {
						var list = $.parseJSON(r.data);
						var $colDom = $("#paracol");
						$colDom.each(function() {
							$(this).empty();
							for (var i = 0; i < list.length; i++) {
								var $option = $('<option value="' + list[i].colName + '">' + list[i].colName + '</option>');
								$(this).append($option);
							}
						});
					}
				}
			});
		}else{
			var mainCol1 = parent.editorUtil.getMainTableDomAttr();
			$("#paracol").empty();
			for (var index1 in mainCol1){
				if (index1!="clone"){
				var $option = $('<option value="' + mainCol1[index1].colName + '">' + mainCol1[index1].colName + '</option>');
				$("#paracol").append($option);
				}
			}
		}
		$("#paradbid").val(id);
		update(curId);
	});

}