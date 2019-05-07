var itemcount = 1;
var dataJsonList = [];
var curId = "";
var originJsonList = [];
var subTableType = $('input[name="subTableType"]:checked', window.parent.document).val();
// 统计：维护select与value关系
var selectedOpts = {};
// 统计：保存主表可用的字段，分为number和currency
var mainFields = {
    'number':[],
    'currency':[],
    'calculate':[]
};

function addItem(){
	var lastNum = dataJsonList.length+1;
	var id = GenNonDuplicateID();
	var data = {
			colName:"DATA_"+itemcount,
			colLabel:"子表字段"+itemcount,
			elementType:"text",
			colLength:"50",
			colType:"VARCHAR2",
        	colIsVisible:"Y"
	};
	putJsonData(id,data);
	drawListArea();
	itemcount++;
	$("#"+id).click();
}

function removeItem(obj){
	var id = $(obj).parent().attr("id");
	delJsonData(id);
	drawListArea();
	if (!isEmpty(dataJsonList)){
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
    var fkColName = "";
    if (subTableType == "1") {
        fkColName = $('#fkColName', window.parent.document).val();
    }else{
        fkColName = "FK_SUB_COL_ID";
    }
	if (!isEmpty(dataJsonList)){
		for (var i=0;i<dataJsonList.length;i++){
			var id = dataJsonList[i].id;
			var colName = dataJsonList[i].data.colName;
			if(colName&&fkColName&&colName==fkColName){
                continue;
            }
			var item = $('<li id="'+id+'" class="item-list"></li>');
			if (id == curId){
				item.addClass("current");
			}
			item.append('<span class="item-order" order="'+(i+1)+'">['+(i+1)+']</span>').append('<span class="item-title">'+dataJsonList[i].data.colLabel+'</span>');
			if (subTableType == "0"){
				var removeButton = $('<a href="javascript:void(0)" class="remove"></a>');
				removeButton.append('<i class="fa fa-times"></i>');
				item.append(removeButton);
				removeButton.click(function(){
					removeItem(this);
				});
			}
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

function isEmpty(dataJsonList){
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
		$("#property_form").setform(jsondata,false);
		$("#xml").val(jsondata.xml).trigger("change");
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
	$("#hidden_attr_area").html("");
    $("#hidden_attr_sata").html('');
    $("#hidden_attr_sata").hide();
	var jsondata = getJsonData(curId);
	if (parent.EformEditor.isBpm=="Y"){
        $("#bpmVar").show();
	}else{
        $("#bpmVar").hide();
	}
	if (jsondata.elementType == "select"){
		$("#colLength").show();
		var div= $("<div id='selectarea' style='margin:10px;'></div>");

		$("#hidden_attr_area").append(div);
		$("#hidden_attr_area").attr("style","");
        $("#hiddem_attr_mult").html('');
        $("#hiddem_attr_mult").attr("style","display:none");
		$("#hidden_attr_area").removeClass("property-list");
		var aa = new selectarea("selectarea",{
			lookup_url:"avicit/platform6/eform/formdesign/js/plugins/check-box/addLookup.jsp",
			onInit : function(selectarea){
				if (jsondata.selectedvalues){
					var values = [],options = [],array=[];
					values = jsondata.selectedvalues.split(",");
					options = jsondata.selectedoption.split(",");
					for (var o=0;o<values.length-1;o++){
						var obj = {};
						obj.lookupCode = values[o];
						obj.lookupName = options[o].replace(/(^\s*)|(\s*$)/g, "");
						array.push(obj);
					}
                    //增加通用代码显示通用代码类型及名称功能
                    if(jsondata.hasOwnProperty("showLookupType")){
                        var ob = new Object();
                        ob.rows = array;
                        ob.lookupType = jsondata.showLookupType;
                        ob.lookupTypeName = jsondata.showLookupTypeName;
                        selectarea.setSelect(ob);
                    }else{
                        selectarea.setSelect(array);
                    }

				}
				selectarea.selectedvalues.on("keyup",function(){
					update(curId);
				});
			}
		});
	}else if(jsondata.elementType == "date"){
		$("#colLength").hide();
		$("#hidden_attr_area").addClass("property-list");
		$("#hidden_attr_area").attr("style","");
        $("#hiddem_attr_mult").html('');
        $("#hiddem_attr_mult").attr("style","display:none");
		$("#hidden_attr_area").html('<span class="property-title">日期格式：</span><select name="attribute03" id="attribute03"><option value="1">Y-m-d H:i</option><option value="2">Y-m-d</option></select>');
		$("#attribute03").on("change",function(){
			update(curId);
		});
	}else if(jsondata.elementType == "number"){
        $("#hidden_attr_area").addClass("property-list");
        $("#hidden_attr_area").attr("style","");
        $("#hidden_attr_area").html('<span class="property-title">计算属性：</span><a title="计算属性" id="propertyBtn"><i class="fa fa-fw fa-lg fa-pencil-square-o"></i></a>' +
            '<input type="hidden" name="colList" id="colList" class="input-medium">' +
            '	<ul id="colArea" class="item-list">' +
            '</ul>');
        
        $("#hiddem_attr_mult").attr("style","");
        $("#hiddem_attr_mult").html('<li class="property-list"><span class="property-title">小数位数：</span><input type="text" name="attribute02" id="attribute02" value="0" class="input-medium"></li>'
            +'<li class="property-list"><span class="property-title">最小值：</span> <input type="text" name="minValue" id="minValue" class="input-medium"></li>'
            +'<li class="property-list"><span class="property-title">最大值：</span><input type="text" name="maxValue" id="maxValue" class="input-medium"></li>');
        $("#hiddem_attr_mult").find("input").on("keyup", function () {
            update(curId);
        });
        subSataPanel(curId,'number',jsondata);

        $("#propertyBtn").click(function () {

            linkagedialog = top.layer.open({
                type: 2,
                title: '计算属性维护',
                skin: 'bs-modal',
                area: ['1100px', '570px'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/calculate-box/calculate-property.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var reData = frm.commitForm();
                    if (!reData){
                        return false;
                    }

                    $("#calculateValue").val(reData.calculateValue);
                    $("#calculateCol").val(reData.calculateCol);
                    $("#calculateText").val(reData.calculateText).trigger("keyup");

                    top.layer.close(index);

                },
                no: function(index, layero){
                    layero.close(index);
                },
                success: function(layero,index){
                    var frm = layero.find('iframe')[0].contentWindow;
                    if(frm != null){
                        var calculateValue = $("#calculateValue").val();
                        var calculateCol = $("#calculateCol").val();
                        var calculateText = $("#calculateText").val();

                        frm.setCalculator(calculateValue,calculateCol,calculateText,jsondata.colName,dataJsonList);
                    }
                }
            });
        });

    }else if(jsondata.elementType == "currency"){
        $("#hidden_attr_area").addClass("property-list");
        $("#hidden_attr_area").attr("style","");
        $("#hidden_attr_area").html('<span class="property-title">计算属性：</span><a title="计算属性" id="propertyBtn"><i class="fa fa-fw fa-lg fa-pencil-square-o"></i></a>' +
            '<input type="hidden" name="colList" id="colList" class="input-medium">' +
            '	<ul id="colArea" class="item-list">' +
            '</ul>');
        $("#hiddem_attr_mult").attr("style","");
        $("#hiddem_attr_mult").html('<li class="property-list"><span class="property-title">小数位数：</span><input type="text" name="attribute02" id="attribute02" value="2" class="input-medium"></li>'
            +'<li class="property-list"><span class="property-title">最小值：</span> <input type="text" name="minValue" id="minValue" value="0" class="input-medium"></li>'
            +'<li class="property-list"><span class="property-title">最大值：</span><input type="text" name="maxValue" id="maxValue" class="input-medium"></li>'
          //  +'<li class="property-list"><span class="property-title">默认值：</span><input type="text" name="defaultValue" id="defaultValue" class="input-medium"></li>'
            +'<li class="property-list"><span class="property-title">币种：</span><select id="selectCurrency" name="selectCurrency"  placeholder="请选择币种" class="SlectBox 4col active"  required="required">'
            +'<option value="￥">￥-人民币</option>'
            +'<option value="$">$-美元</option>'
            +'<option value="€">€-欧元</option>'
            +'<option value="￡">￡-英镑</option>'
            +'</select></li>');
        $("#hiddem_attr_mult").find("input").on("keyup", function () {
            update(curId);
        });

        subSataPanel(curId,'currency',jsondata);
        $("#selectCurrency").on("change", function () {
            update(curId);
        });
        $("#propertyBtn").click(function () {

            linkagedialog = top.layer.open({
                type: 2,
                title: '计算属性维护',
                skin: 'bs-modal',
                area: ['1100px', '570px'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/calculate-box/calculate-property.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var reData = frm.commitForm();
                    if (!reData){
                        return false;
                    }

                    $("#calculateValue").val(reData.calculateValue);
                    $("#calculateCol").val(reData.calculateCol);
                    $("#calculateText").val(reData.calculateText).trigger("keyup");

                    top.layer.close(index);

                },
                no: function(index, layero){
                    layero.close(index);
                },
                success: function(layero,index){
                    var frm = layero.find('iframe')[0].contentWindow;
                    if(frm != null){
                        var calculateValue = $("#calculateValue").val();
                        var calculateCol = $("#calculateCol").val();
                        var calculateText = $("#calculateText").val();

                        frm.setCalculator(calculateValue,calculateCol,calculateText,jsondata.colName,dataJsonList);
                    }
                }
            });
        });
    }else if(jsondata.elementType == "dictionary"){
		$("#colLength").show();
		$("#hidden_attr_area").addClass("property-list");
		$("#hidden_attr_area").attr("style","");
        $("#hiddem_attr_mult").html('');
        $("#hiddem_attr_mult").attr("style","display:none");
		//$("#hidden_attr_area").html('<span class="property-title">引用XML</span><select  name="xml" id="xml"><option></option></select>');
		$("#hidden_attr_area").html('<span class="property-title">数据字典配置</span><a title="数据字典配置" id="propertyBtn"><i class="fa fa-fw fa-lg fa-pencil-square-o"></i></a>' +
				'<input type="hidden" name="dictionaryList" id="dictionaryList" class="input-medium">' +
    			'	<ul id="dictionaryArea" class="item-list">' +
				'</ul>');



		$("#propertyBtn").click(function () {

            linkagedialog = top.layer.open({
                type: 2,
                title: '数据字典配置维护',
                skin: 'bs-modal',
                area: ['45%', '85%'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/dictionary-box/dictionary-property.jsp?isMain=0",
                btn: ['确定', '取消'],
                success: function (layero, index) {
                    //传入参数，并赋值给iframe的元素
                    var iframeWin = layero.find('iframe')[0].contentWindow;
                    var dictionaryPara = $('#dictionaryPara').val();
                    var rowCount = $('#rowCount').val();
                    var queryStatement = $('#queryStatement').val();

                    var jsBefore = $('#jsBefore').val();
                    var jsAfter = $('#jsAfter').val();
                    var dataCombox = $('#dataCombox').val();
                    var dataComboxType = $('#dataComboxType').val();
                    var dataComboxText = $('#dataComboxText').val();
                    iframeWin.initForm(rowCount,queryStatement,dictionaryPara,jsBefore,jsAfter,dataCombox,dataComboxType,dataComboxText);
                    iframeWin.changeTargetNameFunc(dataJsonList);
                },
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var reData = frm.commitForm();
                    if (reData == false){
                    	return false;
                    }
                    //$("#dictionaryName").val(reData.dictionaryName);
                    $("#rowCount").val(reData.rowCount);
                    $("#queryStatement").val(reData.queryStatement);
                    $("#jsBefore").val(reData.jsBefore);
                    $("#jsAfter").val(reData.jsAfter);
                    
                     $("#dataCombox").val(reData.dataCombox);
                    $("#dataComboxType").val(reData.dataComboxType);
                    $("#dataComboxText").val(reData.dataComboxText);
                    
                    $("#dictionaryPara").val(JSON.stringify(reData.datagridData)).trigger("keyup");

                    top.layer.close(index);

                },
                no: function(index, layero){
                    layero.close(index);
                }
            });
        });
	}else if(jsondata.elementType == "linkage"){
		$("#colLength").show();
		$("#hidden_attr_area").addClass("property-list");
		$("#hidden_attr_area").attr("style","");
        $("#hiddem_attr_mult").html('');
        $("#hiddem_attr_mult").attr("style","display:none");
		$("#hidden_attr_area").html('<span class="property-title">联动属性：</span><a title="联动属性" id="propertyBtn"><i class="fa fa-fw fa-lg fa-pencil-square-o"></i></a>' +
					'<input type="hidden" name="colList" id="colList" class="input-medium">' +
        			'	<ul id="colArea" class="item-list">' +
					'</ul>');



		$("#propertyBtn").click(function () {

            linkagedialog = top.layer.open({
                type: 2,
                title: '联动属性维护',
                skin: 'bs-modal',
                area: ['45%', '85%'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/linkage-box/linkage-property.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var reData = frm.commitForm();
                    if (reData == false){
                    	return false;
                    }
                    $("#linkageColumnid").val(reData.linkageColumnid);
                    $("#linkageResultType").val(reData.linkageResultType);
                    $("#linkageImpl").val(reData.linkageImpl);
                    $("#linkagePara").val(JSON.stringify(reData.datagridData)).trigger("keyup");

                    top.layer.close(index);

                },
                no: function(index, layero){
                    layero.close(index);
                },
                success: function(layero,index){
                	 var frm = layero.find('iframe')[0].contentWindow;
                     if(frm != null){
                    	 //frm.setChildTableLinkageData(dataJsonList);
                    	 var linkageColumnid = $("#linkageColumnid").val();
                    	 var linkageResultType = $("#linkageResultType").val();
                    	 var linkageImpl = $("#linkageImpl").val();
                    	 var linkagePara = $("#linkagePara").val();

                    	 frm.initFormByParam(linkageColumnid,linkageResultType,linkageImpl,linkagePara,dataJsonList);
                     }
                }
            });
        });
	}else if (jsondata.elementType == "calculate"){
        $("#colLength").show();
        $("#hidden_attr_area").addClass("property-list");
        $("#hidden_attr_area").attr("style","");
        $("#hiddem_attr_mult").html('');
        $("#hiddem_attr_mult").attr("style","display:none");
        $("#hidden_attr_area").html('<span class="property-title">计算属性：</span><a title="计算属性" id="propertyBtn"><i class="fa fa-fw fa-lg fa-pencil-square-o"></i></a>' +
            '<input type="hidden" name="colList" id="colList" class="input-medium">' +
            '	<ul id="colArea" class="item-list">' +
            '</ul>');
        $("#hiddem_attr_mult").attr("style","");
        $("#hiddem_attr_mult").html('<li class="property-list"><span class="property-title">小数位数：</span><input type="text" name="attribute02" id="attribute02" value="0" class="input-medium"></li>'
            +'<li class="property-list"><span class="property-title">最小值：</span> <input type="text" name="minValue" id="minValue" class="input-medium"></li>'
            +'<li class="property-list"><span class="property-title">最大值：</span><input type="text" name="maxValue" id="maxValue" class="input-medium"></li>');
        $("#hiddem_attr_mult").find("input").on("keyup", function () {
            update(curId);
        });

        subSataPanel(curId,'calculate',jsondata);

        $("#propertyBtn").click(function () {

            linkagedialog = top.layer.open({
                type: 2,
                title: '计算属性维护',
                skin: 'bs-modal',
                area: ['1100px', '570px'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/calculate-box/calculate-property.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var reData = frm.commitForm();
                    if (!reData){
                        return false;
                    }

                    $("#calculateValue").val(reData.calculateValue);
                    $("#calculateCol").val(reData.calculateCol);
                    $("#calculateText").val(reData.calculateText).trigger("keyup");

                    top.layer.close(index);

                },
                no: function(index, layero){
                    layero.close(index);
                },
                success: function(layero,index){
                    var frm = layero.find('iframe')[0].contentWindow;
                    if(frm != null){
                        var calculateValue = $("#calculateValue").val();
                        var calculateCol = $("#calculateCol").val();
                        var calculateText = $("#calculateText").val();

                        frm.setCalculator(calculateValue,calculateCol,calculateText,jsondata.colName,dataJsonList);
                    }
                }
            });
        });
    }else if (jsondata.elementType == "text"){
		$("#colLength").show();
		//$("#hidden_attr_area").attr("style","display:none");
        $("#hiddem_attr_mult").html('');
        $("#hidden_attr_area").attr("style","");
        $("#hidden_attr_area").html('<span class="property-title">计算属性：</span><a title="计算属性" id="propertyBtn"><i class="fa fa-fw fa-lg fa-pencil-square-o"></i></a>' +
            '<input type="hidden" name="colList" id="colList" class="input-medium">' +
            '	<ul id="colArea" class="item-list">' +
            '</ul>');
        $("#hiddem_attr_mult").attr("style","display:none");
        $("#propertyBtn").click(function () {

            linkagedialog = top.layer.open({
                type: 2,
                title: '计算属性维护',
                skin: 'bs-modal',
                area: ['1100px', '570px'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/calculate-box/calculate-property.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var reData = frm.commitForm();
                    if (!reData){
                        return false;
                    }

                    $("#calculateValue").val(reData.calculateValue);
                    $("#calculateCol").val(reData.calculateCol);
                    $("#calculateText").val(reData.calculateText).trigger("keyup");

                    top.layer.close(index);

                },
                no: function(index, layero){
                    layero.close(index);
                },
                success: function(layero,index){
                    var frm = layero.find('iframe')[0].contentWindow;
                    if(frm != null){
                        var calculateValue = $("#calculateValue").val();
                        var calculateCol = $("#calculateCol").val();
                        var calculateText = $("#calculateText").val();

                        frm.setCalculator(calculateValue,calculateCol,calculateText,jsondata.colName,dataJsonList);
                    }
                }
            });
        });
    }else{
        $("#colLength").show();
        //$("#hidden_attr_area").attr("style","display:none");
        $("#hiddem_attr_mult").html('');
        $("#hidden_attr_area").attr("style","");
    }
	
	setCallB(jsondata.elementType);
}

$(document).ready(function () {
    $("#property_form").hide();
    var list = $('#colList', window.parent.document).val();
    var fkColName = $('#fkColName', window.parent.document).val();
    var subTableName = $('#subTableName', window.parent.document).val();

    if (list) {
        var rs = [];
        if (subTableType == "1") {
            $.ajax({
                url: 'platform/eform/bpmsManageController/getColumnsBytableName',
                type: 'POST',
                data: {
                    tableName: subTableName
                },
                dataType: 'json',
                async: false,
                success: function (backData, status) {
                    var columnsList = backData;
                    for (var i = 0; i < columnsList.length; i++) {

                        var column = columnsList[i];
                        //列属性
                        var colName = column.colName;
                        var colType = column.colType;
                        var colTypeName = column.colTypeName;
                        var colLength = column.colLength;
                        var colNullable = column.colNullable;
                        var colDefault = column.colDefault;
                        var colComments = column.colComments;
                        var colIsPk = column.colIsPk;
                        var colIsUnique = column.colIsUnique;

                        /*                        if (colIsPk == "Y"
                                                    || colName == fkColName) {
                                                    continue;
                                                }*/

                        //添加设计器属性
                        var theColumn = {};
                        theColumn.colName = colName;
                        theColumn.attribute01 = "";
                        theColumn.colType = colType;
                        theColumn.colLabel = colComments;
                        if (colType == "DATE") {
                            theColumn.elementType = "date";
                            theColumn.attribute03 = "1";
                        } else if (colType == "NUMBER") {
                            theColumn.elementType = "number";
                        } else {
                            theColumn.elementType = "text";
                        }
                        theColumn.colLength = colLength;
                        theColumn.width = "20";
                        theColumn.colIsMust = "";
                        theColumn.colIsVisible = "N";
                        rs.push(theColumn);
                    }

                }
            });
        }
        var list = $.parseJSON(list);
        for (var i=0;i<list.length;i++){
            var data = list[i];
            /*if (data.colName == fkColName){
                continue;
            }*/
            var id = GenNonDuplicateID();
            putJsonData(id,data);

            var colName = data.colName.toUpperCase();
            var regex = /DATA_\d+$/;
            if(regex.test(colName)) {
                var number = parseInt(colName.substring(5));
                if(number >= itemcount) {
                    itemcount = number + 1;
                }
            }
        }


		if (rs.length>0) {
            for (var i = 0; i < rs.length; i++) {
                var data = rs[i];
                /*if (data.colName == fkColName) {
                    continue;
                }*/
                var id = GenNonDuplicateID();
                var flag = false;
                for (var j = 0; j < list.length; j++) {
                    if (data.colName == list[j].colName) {

                        flag = true;
                        break;
                    }
                }

                if (!flag) {
                    putJsonData(id, data);
                }
            }
        }
        updateSelectedOpts();

        drawListArea();
        if (!isEmpty(dataJsonList)) {
            var fistId = dataJsonList[0].id;
            $("#" + fistId).click();
        }
    }

    if (subTableType == "0") {
        $("#item_add").click(function () {
            addItem();
        });
    }
    else {
        $("#item_add").remove();
    }

    $("#property_form").find("select,input[type='checkbox']").on("change", function () {
        var value = this.value;
        var name = this.name;
        var oldValue = getJsonData(curId)[name];
        if (name == "elementType") {
            if (subTableType == "1") {
                if (value == "date" && value != oldValue) {
                    layer.msg('字段已创建，无法更改类型！', {icon: 7});
                    return false;
                } else if (oldValue == "date" && value != oldValue) {
                    layer.msg('字段已创建，无法更改类型！', {icon: 7});
                    return false;
                } else if (value == "number" && (oldValue != "number" || oldValue != "currency" || oldValue != "calculate")){
                    layer.msg('字段已创建，无法更改类型！', {icon: 7});
                    return false;
                } else if (oldValue == "number" && (value != "number" || value != "currency" || value != "calculate")){
                    layer.msg('字段已创建，无法更改类型！', {icon: 7});
                    return false;
                } else if (oldValue == "currency" && (value != "number" || value != "currency" || value != "calculate")){
                    layer.msg('字段已创建，无法更改类型！', {icon: 7});
                    return false;
                }else if (value == "currency" && (oldValue != "number" || oldValue != "currency" || oldValue != "calculate")){
                    layer.msg('字段已创建，无法更改类型！', {icon: 7});
                    return false;
                }
            }
            if (value == "date") {
                $("#colType").val("DATE");
            } else if (value == "number" || value == "currency" || value=="calculate"){
                $("#colType").val("NUMBER");
            } else if (value == "user" || value == "dept" || value == "role" || value == "group" || value == "position"){
                $("#colType").val("CLOB");
            } else {
                $("#colType").val("VARCHAR2");
            }
        }
        update(curId);
    });

    $("#elementType").on("change", function () {
        initHidden();
        var eleType = $("#elementType").val();
        if(eleType=="number"||eleType=="currency"||eleType=="calculate"){
            $("input[name='colLength']").val("");
            update(curId);
        }else{
            $("input[name='colLength']").val("50");
            update(curId);
        }
    });

    $("#colLength").find("input").on("change", function () {
        if (subTableType == "1") {
            var value = this.value;
            var name = this.name;
            var oldValue = getJsonData(curId)[name];
            if (parseInt(oldValue) < parseInt(value)) {
                alert()
            }
        }
    });

    $("#property_form").find("input").on("keyup", function () {
        update(curId);
    });

    $("#list_area").sortable({
        stop: function (e, t) {
            var $li = $(t.item);
            var id = $li.attr("id");
            var order = $li.prev().find(".item-order").attr("order") || "0";
            var data = getJsonData(id);
            delJsonData(id);
            putJsonData(id, data, parseInt(order));
            drawListArea();
            $("#" + curId).click();
        }
    });
    updateMainFileds();
    // updateSelectedOpts();

});

function putJsonData (id,json,index){
		if (index != undefined){
			dataJsonList.splice(index, 0, {id:id,data:json}); 
		}else{
			dataJsonList.push({
				id:id,
				data:json
			});
		}
}

function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
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
 * 为子表列属性添加统计回填设置页面
 * @param curId 子表列ID
 * @param elementType 子类列类型
 * @param jsondata 保存子表列属性
 */
function subSataPanel(curId,elementType,jsondata) {
    var html ='';
    // 最大值和最小值
    var checkMaxMin =
        '<li class="property-list">'
        + '<span class="property-title">统计列最大值：</span>'
        + '<input type="checkbox" name="colMax" id="colMax" value="Y" class="item-width"/>'
        + '<span style="margin-left:30px;">统计列最小值：</span>'
        + '<input type="checkbox" name="colMin" id="colMin" value="Y" style="margin-left:30px;"/>'
        +'</li>';
    html += checkMaxMin;
    var groupMax = '<span class="property-title">最大值回填到：</span>' +
        '<select name="mainMaxCell" id="mainMaxCell" class="input-medium">' +
        '<option disabled selected>请选择主表字段</option></select></li>';
    var groupMaxShow = '<li class="property-list" id="groupMax" style="display: block">' + groupMax;
    var groupMaxHide = '<li class="property-list" id="groupMax" style="display: none">' + groupMax;
    if(jsondata.colMax == 'Y'){
        html += groupMaxShow;
    }else{
        html += groupMaxHide;
    }
    var groupMin = '<span class="property-title">最小值回填到：</span>' +
        '<select name="mainMinCell" id="mainMinCell" class="input-medium">' +
        '<option disabled selected>请选择主表字段</option></select></li>';
    var groupMinShow = '<li class="property-list" id="groupMin" style="display: block">' + groupMin;
    var groupMinHide = '<li class="property-list" id="groupMin" style="display: none">' + groupMin;
    if(jsondata.colMin == 'Y'){
        html += groupMinShow;
    }else {
        html += groupMinHide;
    }
    var checkSum =
        '<li class="property-list">'
        + '<span class="property-title">统计列值总和：</span>'
        + '<input name="colSum" id="colSum" type="checkbox" class="item-width" value="Y" >'
        +'</li>';
    html += checkSum;
    var groupSum = '<span class="property-title">列值和回填到：</span>' +
        '<select name="mainSumCell" id="mainSumCell" class="input-medium">' +
        '<option disabled selected>请选择主表字段</option></select></li>';
    var groupSumShow = '<li class="property-list" id="groupSum" style="display: block">' + groupSum;
    var groupSumHide = '<li class="property-list" id="groupSum" style="display: none">' + groupSum;
    if(jsondata.colSum == 'Y'){
        html += groupSumShow;
    }else{
        html += groupSumHide;
    }
    $("#hidden_attr_sata").html(html);
    $("#hidden_attr_sata").show();
    // 检查是否选中
    getMainAttr(curId,elementType,'colMax', 'mainMaxCell','groupMax');
    getMainAttr(curId,elementType,'colMin', 'mainMinCell','groupMin');
    getMainAttr(curId,elementType,'colSum', 'mainSumCell','groupSum');
}
/**
 * 添加统计结果可以回填的主表控件选项
 * @param curId 当前列ID
 * @param checkid 统计项复选框id
 * @param selectid 可选主表下拉框
 * @param selectgroupid 包含有主表下拉框，用于显隐控制
 * @param elementType 当前列类型
 */
function getMainAttr(curId, elementType, checkid, selectid, selectgroupid) {

    var checkObj = $('#'+checkid);
    var selectObj = $('#'+selectid);
    var selectGroupObj = $('#'+selectgroupid);

    if(mainFields[elementType].length == 0){
        updateMainFileds();
    }
    var options = mainFields[elementType];
    var opt,type;
    for (type in mainFields) {
        if (type == "clone"){
            continue;
        }
        options = mainFields[type];
        for (opt in options) {
            var tex = options[opt].text;
            var val = options[opt].value;
            if (tex) {
                selectObj.append($('<option>', {value: val, text: tex}));
            }
        }
    }

    selectObj.change(function () {
        selectedOpts[curId+selectObj.prop('id')] = selectObj.val();
        update(curId);
    });
    /*selectObj.focus(function () {
        var options = mainFields[elementType];
        var opt;
        for(opt in options){
            selectObj.find('option[value='+options[opt].value+']').removeAttr('disabled');
        }
        var att;
        for(att in selectedOpts){
            if(att != curId+selectObj.prop('id')){
                var otherSelected = selectedOpts[att];
                selectObj.find('option[value='+otherSelected+']').attr('disabled','disabled');
            }
        }

    });*/

    checkObj.change(function () {
        if(checkObj.prop('checked')){
            selectGroupObj.show();
        }
        else{
            selectGroupObj.hide();
            delete selectedOpts[curId+selectObj.prop('id')];
            selectObj.get(0).selectedIndex = 0;
        }
        if(selectObj[0].length < 2){
            layer.msg('主表没有合适控件');
            checkObj.prop('checked',false);
            selectGroupObj.hide();
        }

        update(curId);
    });

}
// 写入可用的主表字段  mainFields，加载时调用
function updateMainFileds() {
    mainFields['number'] = [];
    mainFields['currency'] = [];
    mainFields['calculate'] = [];

    var fields = parent.editorUtil.getTableDbDomAttr();
    for(att in fields){
        var mainDomType = fields[att].domType;
        if(mainDomType == 'number-box'){
            var tex = fields[att].colLabel;
            var val = fields[att].domId||fields[att].colName;
            if(tex){
                mainFields['number'].push({text:tex, value:val});
            }
        }else if(mainDomType =='currency-box' ){
            var tex = fields[att].colLabel;
            var val = fields[att].domId||fields[att].colName;
            if(tex){
                mainFields['currency'].push({text:tex, value:val});
            }
        }else if(mainDomType =='calculate-box'){
            var tex = fields[att].colLabel;
            var val = fields[att].domId||fields[att].colName;
            if(tex){
                mainFields['calculate'].push({text:tex, value:val});
            }
        }
    }
}
// 更新已被使用的主表字段selectedOpts，加载时已有定义的item调用
function updateSelectedOpts() {
    var hasSata = false;
    var sataIndics = ['mainMaxCell', 'mainMinCell','mainSumCell'];
    for(var i = 0; i < dataJsonList.length; i++){
        var itemAttr = dataJsonList[i].data;
        for(var j=0; j < sataIndics.length ; j++){
            if(sataIndics[j] in itemAttr){
                var itemid = dataJsonList[i].id;
                selectedOpts[itemid+sataIndics[j]]=itemAttr[sataIndics[j]];
            }
        }
    }
}