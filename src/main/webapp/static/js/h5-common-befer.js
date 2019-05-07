var rCRLF = /\r?\n/g,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;
jQuery.fn.extend({
	serializeArrayCustom: function(escape,filtertype) {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
            var type = this.type;
            filtertype = filtertype||"escape";
            // unUse .is(":disabled")
            var flag = true;
            if (escape){
                if (filtertype == "escape") {
                    if (jQuery(this).parents(escape) && jQuery(this).parents(escape).length > 0) {
                        flag = false;
                    }
                }else if (filtertype == "accept"){
                    if (jQuery(this).parents(escape).length == 0) {
                        flag = false;
                    }
				}
        	}
			return this.name &&flag&&
				rsubmittable.test( this.nodeName )
				&& !rsubmitterTypes.test( type )
				&& ( this.checked || !manipulation_rcheckableType.test( type ) || (this.getAttribute('avicrequired') && (!this.checked || !manipulation_rcheckableType.test( type ))));
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();
			if(jQuery(this).parent(".spinner").length > 0){
				val = delcommafy(jQuery( this ).val(),true);
			}
			if(this.getAttribute('avicrequired') && manipulation_rcheckableType.test( this.type ) && !this.checked){
				val = "";
			}
			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});
/**
 * 数字格式转换成千分位
 *@param{Object}num
 */
function commafy(num, is) {
	if(is && is+"" == "true"){
		if ($.trim(num + "") == "") {
			return "";
		}
		if (isNaN(num)) {
			return "";
		}
		num = num + "";
		if (/^.*\..*$/.test(num)) {
			var pointIndex = num.lastIndexOf(".");
			var intPart = num.substring(0, pointIndex);
			var pointPart = num.substring(pointIndex + 1, num.length);
			intPart = intPart + "";
			var re = /(-?\d+)(\d{3})/;
			while (re.test(intPart)) {
				intPart = intPart.replace(re, "$1,$2")
			}
			num = intPart + "." + pointPart;
		} else {
			num = num + "";
			var re = /(-?\d+)(\d{3})/;
			while (re.test(num)) {
				num = num.replace(re, "$1,$2")
			}
		}
		return num;
	}
	return num;
}
/**
 * 去除千分位
 *@param{Object}num
 */
function delcommafy(num,is) {
	if(is && is+"" == "true"){
		if ($.trim(num + "") == "") {
			return "";
		}
		num = num.replace(/,/gi, '');
	}
	return num;
}

/**
 * 表单序列化
 * 例 ：JSON.stringify(serializeObject($('#form'))) 格式化为 JSON字符串
 * 
 * @param b 
 * @param a
 * @param escape 逃逸选择器
 * @param filtertype 过滤类型 作用于escape参数 ‘escape’逃逸类型 ‘accept’接受类型
 * @returns JSON对象
 */
function serializeObject(b, a,escape,filtertype) {
		var c = {};
		$.each(b.serializeArrayCustom(escape,filtertype), function(d) {
			if (typeof (a) == "undefined" || (a != null && a == false)) {
				if (c[this["name"]]) {
					c[this["name"]] = c[this["name"]] + "," + $.trim(this["value"]);
				} else {
					c[this["name"]] = $.trim(this["value"]);
				}
			} else {
				if ($.trim(this["value"]) != null && $.trim(this["value"]) != "") {
					if (c[this["name"]]) {
						c[this["name"]] = c[this["name"]] + "," + $.trim(this["value"]);
					} else {
						c[this["name"]] = $.trim(this["value"]);
					}
				}
			}
		});
		return c;
}
/**
 * 表单数据回填
 */
function  setJsonToFormCtrl (formObj, jsonValue) {
    var obj = formObj;
    $.each(jsonValue, function (name, ival) {
        var oinput = obj.find("input[name=" + name + "]");
        if (oinput.attr("type") == "checkbox") {
            if (ival !== null) {
                var checkboxObj = $("[name=" + name + "]");
                var checkArray = ival.length > 0 ?ival.split(",") : ival;
                for (var i = 0; i < checkboxObj.length; i++) {
             	   checkboxObj[i].checked = false;
                    for (var j = 0; j < checkArray.length; j++) {
                        if (checkboxObj[i].value == checkArray[j]) {
                     	   checkboxObj[i].checked=true;
                        }
                    }
                } 
            }
        }else if (oinput.attr("type") == "radio") {
            oinput.each(function () {
                var radioObj = $("[name=" + name + "]");
                for (var i = 0; i < radioObj.length; i++) {
                    if (radioObj[i].value == ival) {
                 	   radioObj[i].checked=true;
                    }
                }
            });
        }else if (oinput.attr("type") == "textarea") {
            obj.find("[name=" + name + "]").html(ival);
        }else if ($(oinput).attr('class') == "form-control date-picker hasDatepicker"){
     	   obj.find("[name=" + name + "]").datepicker("setDate", new Date(ival));
     	   
        }else if ($(oinput).attr('class') == "form-control time-picker hasDatepicker"){
     	   obj.find("[name=" + name + "]").val(ival);
        }else {
            obj.find("[name=" + name + "]").val(ival);
        }
    })
}
/**
 * 日期格式化
 * 例 ：{ label: '申请日期', name: 'applyDate', width: 150,formatter:format}
 * 
 * @param time
 * @returns 日期字符串
 */
function format(time){
	if(time){
        if (typeof(time)=="string") {
            time = time.replace(/\-/g, "\/");
        }
		var datetime = new Date(time);  
	    var year = datetime.getFullYear();  
	    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;  
	    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();  
	    return year + "-" + month + "-" + date;
	}
	return '';
}
/**
 * 时间格式化
 * 例 ：{ label: '开始时间', name: 'receptionStime', width: 150,formatter:formatDateTime}
 * 
 * @param time
 * @returns 时间字符串
 */

String.prototype.replaceAll = function(FindText, RepText) {
	regExp = new RegExp(FindText, "g");
	return this.replace(regExp, RepText);
};
/**
 * 数字的格式化，模仿PHP的number_format函数
 * formatNum(1234353.827,2) ans: 1,234,353.83
 * @param number 待格式化的数字
 * @param decimals 精度，保留小数点后几位，默认为不保留
 * @param dec_point 整数与小数分隔符，默认为 '.'
 * @param thousands_sep 会计分段符，默认为 ','
 * @returns
 */
function formatNum(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
function formatNumberSep(value){
	// 分段符，不保留小数
	return formatNum(value,0);
}
function formatNumberDec2(value){
	// 分段符，保留2位小数
	return formatNum(value,2);
}
function formatNumberDec4(value){
	// 分段符，保留4位小数
	return formatNum(value,4);
}
function formatNumber(value){
	return value;
}
function formatDateTime(time){
	if(time){
        if (typeof(time)=="string") {
            time = time.replace(/\-/g, "\/");
        }
		var datetime = new Date(time);  
	    var year = datetime.getFullYear();  
	    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;  
	    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();  
	    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();  
	    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();  
	    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();  
	    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second; 
	}
	return '';
}
function formatDateTimeNoSecond(time){
	if(time){
	    if (typeof(time)=="string") {
            time = time.replace(/\-/g, "\/");
        }
		var datetime = new Date(time);  
	    var year = datetime.getFullYear();  
	    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;  
	    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();  
	    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();  
	    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();  
	    return year + "-" + month + "-" + date+" "+hour+":"+minute; 
	}
	return '';
}

/**
 * 用于公共的jqgrid中unformat属性
 * @param cellvalue
 * @param options
 * @returns {*}
 */
function jqgridUnformat(cellvalue, options){
    if(cellvalue){
    	return cellvalue;
    }else{
    	return '';
    }
}
/**
 * 禁止时间控件手输
 * @param e 键盘事件
 */
function  nullInput(e){
	if(e.keyCode != 8){
	   e.returnValue = false;
	   return false;
	}

}
/**
 * 清空高级查询中的表单
 * 
 * @param formId
 */
function clearFormData(formId){
	$(formId).find('input[type=text]').val('');
	$(formId).find('select').val('');
	$(formId).find('input[type=hidden][name !=bpmState]').val('');// 不能清除name = bpmState 的流程条件
	$(formId).find('textarea').val('');//对 textarea中内容进行清除
	$(formId).find("input[type=checkbox]").attr("checked",false);//对 checkbox中内容进行清除
	$(formId).find("input[type=radio]").attr("checked",false);//对 radio中内容进行清除
	//解决IE下清空选人、选部门placeholder
	$.each($(formId).find('input[type=text][name$=Alias]'),function(i,item){
		$(item).val($(item).attr('placeholder'));
	});
}
/**
 * 详细页面表单元素禁用
 * 
 * @param formId
 */
function setFormDisabled(){
	   //radio的禁用
	   var input = $("input:radio");
	   input.attr("disabled","disabled");
	   //checkbox的禁用 
	   var checkbox = $("input:checkbox");
	   checkbox.attr("disabled","disabled");
	  //select的禁用方法
	  $("select").attr("disabled","disabled");
	  //input的禁用方法
	  $('input').attr("disabled","disabled");
	  //图标小手禁用
	  $('.input-group-addon').css('cursor',"not-allowed");
	  $('.spin-up').css('cursor',"not-allowed");
	  $('.spin-down').css('cursor',"not-allowed");
}
/**
 * 单表单元格编辑下拉框控件扩展
 * @param value
 * @param options
 */
function selectElem(value, options) {
	var rowId = options.rowId;
	var datas = options.value;
	var forId = options.forId;
	var require = options.require;
	var rowData = $(this).jqGrid('getRowData', rowId);
	var gid = $(this).jqGrid("getGridParam","id");
	var elemHtml = [];
	elemHtml.push('<select onchange="$(\'#'+gid+'\').jqGrid(\'endEditCell\')" class="form-control">');
	if (!require) {
        elemHtml.push('<option value="">请选择</option>');
    }
	for ( var code in datas) {
		if(options.dataModel && options.dataModel.model=="array_object"){
			elemHtml.push('<option value="'+ datas [code][options.dataModel.key] +'">' + datas[code] [options.dataModel.value] + '</option>');
		}else{
			elemHtml.push('<option value="'+ code +'">' + datas[code] + '</option>');
		}
	}
	elemHtml.push('</select>');

	var elem = $(elemHtml.join(''));
	elem.val(rowData[forId]);
	elem.attr('data-rowid', rowId);
	elem.attr('data-forid', forId);
	return elem[0];
}
function selectValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).attr('data-rowid');
		var forId = $(elem).attr('data-forid');
		var selectText = $(elem).find('option:selected').text();
		var rowData = {};
		rowData[forId] = $(elem).val();
		$(this).jqGrid('setRowData', rowId, rowData);
		if( selectText != "请选择"){
			return selectText;
		}else{
			return "";
		}
	} else if (operation === 'set') {
		$(elem).find('option[text="' + value + '"]').attr("selected", true);
	}
}



/**
 * 单表单元格编辑下拉框控件扩展
 * @param value
 * @param options
 */
function selectElemLinkage(value, options) {

	var rowId = options.rowId;
	var datas = options.value;
	var forId = options.forId;
	var rowData = $(this).jqGrid('getRowData', rowId);
	var gid = $(this).jqGrid("getGridParam","id");
	var elementType = options.elementType;

	if(elementType){
   	 var linkageColumnid = options.linkageColumnid;
   	 var linkageImpl = options.linkageImpl;
   	 var linkageResultType = options.linkageResultType;
   	 var linkagePara = options.linkagePara;
   	 var linkageParaObj = JSON.parse(linkagePara);
   	 var linkageColumnidValue = eval("rowData." + linkageColumnid);
   	 if(linkageColumnidValue){

   	 	if(linkageImpl){
   	 		var result = setSubLinkageImplPara(linkageColumnidValue,linkageColumnid, linkageImpl, linkageResultType);
   	 		if(linkageResultType == "2"){
   	 			 var row1 ={};
   	 			 row1[result+""]= result+"";
   	 			 datas = row1;

   	 		}else if(linkageResultType == "1"){
   	 			datas = result;
   	 		}
   	 	}else{
	   	 	if(linkageResultType == "2"){
			    for(var i = 0; i<linkageParaObj.length;i++){
			    	para = linkageParaObj[i];
			        if (linkageColumnidValue == para.targetValue){
   	 			 		var row1 ={};
   	 			 		row1[para.linkageResult+""]= para.linkageResult+"";
   	 			 		datas = row1;

			        }
				}
		   	 }else if(linkageResultType == "1"){
		   		for(var i = 0; i<linkageParaObj.length;i++){
		   			para = linkageParaObj[i];
				    if (linkageColumnidValue == para.targetValue){
				        var linkageResult = para.linkageResult;
				        var result = setSubLinkagePara(linkageColumnidValue,JSON.stringify(pageParams),linkageResult);
						datas = result;
				    }

				}
		   	 }
   	 	}


   	 }

    }

	var elemHtml = [];
	elemHtml.push('<select onchange="$(\'#'+gid+'\').jqGrid(\'endEditCell\')" class="form-control">');
	elemHtml.push('<option value="">请选择</option>');
	for ( var code in datas) {
		if(options.dataModel && options.dataModel.model=="array_object"){
			elemHtml.push('<option value="'+ datas [code][options.dataModel.key] +'">' + datas[code] [options.dataModel.value] + '</option>');
		}else{
			elemHtml.push('<option value="'+ code +'">' + datas[code] + '</option>');
		}
	}
	elemHtml.push('</select>');

	var elem = $(elemHtml.join(''));
	elem.val(rowData[forId]);
	elem.attr('data-rowid', rowId);
	elem.attr('data-forid', forId);
	return elem[0];
}


function selectValueLinkage(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).attr('data-rowid');
		var forId = $(elem).attr('data-forid');
		var rowData = {};
		rowData[forId] = $(elem).val();
		$(this).jqGrid('setRowData', rowId, rowData);

		if($(elem).find('option:selected').text() != "请选择"){
			return $(elem).find('option:selected').text();
		}else{
			return "";
		}
	} else if (operation === 'set') {
		$(elem).find('option[text="' + value + '"]').attr("selected", true);
	}
}
//feng start
/**
 * 单表单元格编辑下拉框控件扩展(div模拟),支持值发生改变后触发函数changeFunc:changeFunc
 * @param value
 * @param options
 */
function selectElem1(value, options) {
    var rowId = options.rowId;
    var datas = options.value;
    var forId = options.forId;
    //start ws  支持值发生改变执行事件
     var changeFunc = options.changeFunc;
    //end ws
    var maxHeight = options.maxHeight;
    var rowData = $(this).jqGrid('getRowData', rowId);


    var selectName = "selectName" + rowId;

    if (isNaN(maxHeight)) {
        maxHeight = 200;
    }

    var elem = $('<div class="cell-edit-cell"></div>');
    elem.attr('data-rowid', rowId);
    elem.attr('data-forid', forId);

    elem.append(
        '<div class="input-group input-group-sm">'
        + '<input class="form-control" type="text" readOnly="readOnly"/>'
        + '<span class="input-group-btn">'
        + '<button class="btn btn-default cell-edit-button" type="button">'
        + '<span class="glyphicon glyphicon-chevron-down"></span>'
        + '</button>' + '</span>' + '</div>');

    if(value){
        elem.find('input.form-control').val(value);
        if (rowData[forId]) {
            elem.attr('data-value', rowData[forId]);
        }else{
            elem.attr('data-value', value);
        }
	}

    setTimeout(
        function() {
            var elem = $('#' + options.id);

            var elemHtml = [];

            elemHtml.push('<div class="cell-edit-contend" style="max-height:' + maxHeight+'px">');
            elemHtml.push('<ul style="padding-left:0px;z-index:99999999;">');
            for ( var code in datas) {
                var selectNameId = selectName + code;
				var oneElemHtml = '<li id="' + selectNameId + '" data-value="' + code + '" style="display: block;padding-left:10px;text-align: left;background:#fff;height: 30px; line-height: 30px;list-style: none;z-index:99999999;"';
				if(value == datas[code]){
                    oneElemHtml += ' class="selected"';
				}
                oneElemHtml += '>' + datas[code] + '</li>';
                elemHtml.push(oneElemHtml);

            }
            elemHtml.push('</ul>');
            elemHtml.push('</div>');

            var contend = $(elemHtml.join('')).appendTo(elem);

            //判断详细信息框是否超出最下面。如果超过向上显示
            var outHeight = $(window).height();
            if (elem.parents('.ui-jqgrid-bdiv').length > 0) {
                var bdiv = elem.parents('.ui-jqgrid-bdiv');
                outHeight = bdiv.offset().top + bdiv.outerHeight();
            }

            if ((elem.offset().top + elem.outerHeight() + contend
                    .outerHeight(true)) > outHeight) {
                contend.addClass('cell-edit-contend-up');
            }

            elem.find('li.selected').css({'background-color':'#e1efeb'});

            elem.find('input.form-control').on('click',function (e) {
                contend.show();
            });

            elem.find('button.cell-edit-button').on('click', function(e) {
                contend.toggle();
            });

            elem.find("ul").on('click', function(e){
                if(!$(e.target).is('.selected')){
                    var $preSelected = $(e.target).closest('ul').find('li.selected');
                    $preSelected.removeClass('selected');
                    $preSelected.css({'background-color': '#fff'});
                    $(e.target).addClass('selected');
                    $(e.target).css({'background-color':'#e1efeb'});
                    $(e.target).closest('div.cell-edit-cell').find('input.form-control').val($(e.target).text());
                    $(e.target).closest('div.cell-edit-cell').attr('data-value', $(e.target).attr('data-value'));
                    //用户可能自定义改变事件
                    if(changeFunc != null && changeFunc != "" && typeof(changeFunc)=='function'){
                         changeFunc($(e.target).attr('data-value'), options);  //执行客户选中事件 param("选中的value","单元格属性")
                    }
				}
				$(e.target).closest('div.cell-edit-cell').find('input.form-control').focus();
                contend.toggle();
			});

            elem.find("ul").on('mouseover', function(e){
                if(!$(e.target).is('.selected')) {
                    $(e.target).css({'background-color': '#F5F5F5'});
                }

			});

            elem.find("ul").on('mouseout', function(e){
                if(!$(e.target).is('.selected')) {
                    $(e.target).css({'background-color': '#fff'});
                }
            });

            $(document).unbind('.cellbox').bind('mousedown.cellbox',
                function(e) {
                    if (e.target !== elem.find('input.form-control')[0] && $(e.target).closest('.cell-edit-button').length == 0
                        && $(e.target).closest('.cell-edit-contend').length == 0) {
                        contend.hide();
                    }
                });

        }, 100);
    
    return elem[0];
}
function selectValue1(elem, operation, value) {
    if (operation === 'get') {
        var rowId = $(elem).attr('data-rowid');
        var forId = $(elem).attr('data-forid');
        if(forId) {
            var newValue = $(elem).attr('data-value');
            var rowData = {};
            rowData[forId] = newValue;
            $(this).jqGrid('setRowData', rowId, rowData);
        }
        return $('input', elem).val();
    } else if (operation === 'set') {
        $('input', elem).val(value);
    }
}
//feng end

/**
 * jqGrid单表单元格编辑checkbox控件组扩展,支持值发生改变后触发函数changeFunc:changeFunc
 * 
 * @param value
 * @param options
 */
function boxElem(value, options) {
	var rowId = options.rowId;
	var datas = options.value;
	var forId = options.forId;
	// start ws 支持值发生改变执行事件
	var changeFunc = options.changeFunc;
	// end ws
	var maxHeight = options.maxHeight;
	var rowData = $(this).jqGrid('getRowData', rowId);
	var forValue = [];
	if (rowData[forId]) {
		forValue = rowData[forId].split(',');
	}
	var checkboxName = "checkboxName" + rowId;

	if (isNaN(maxHeight)) {
		maxHeight = 200;
	}

	var elem = $('<div class="cell-edit-cell"></div>');
	elem.attr('data-rowid', rowId);
	elem.attr('data-forid', forId);

	var _div = $(
			'<div class="input-group input-group-sm">'
					+ '<input class="form-control" type="text" readOnly="readOnly"/>'
					+ '<span class="input-group-btn">'
					+ '<button class="btn btn-default cell-edit-button" type="button">'
					+ '<span class="glyphicon glyphicon-chevron-down"></span>'
					+ '</button>' + '</span>' + '</div>').appendTo(elem);
	var _input = _div.find('.form-control');
	_input.val(value);

	var _button = _div.find('.cell-edit-button');

	setTimeout(function() {
		var elem = $('#' + options.id);

		var elemHtml = [];

		elemHtml.push('<div class="cell-edit-contend" style="max-height:'
				+ maxHeight + 'px">');
		for ( var code in datas) {
			var checkboxId = checkboxName + code;
			elemHtml.push('<div><input type="checkbox" id="' + checkboxId
					+ '" name="' + checkboxName + '" value="' + code + '"');
			if (isChecked(forValue, code)) {
				elemHtml.push(' checked');
			}
			elemHtml.push(' data-text="' + datas[code] + '">');
			elemHtml.push('<label title="' + datas[code] + '" for="'
					+ checkboxId + '">' + datas[code] + '</label></div>');
		}
		elemHtml.push('</div>');

		elemHtmlDiv = $(elemHtml.join(''));

		/*
		 * var contend = elemHtmlDiv.appendTo(elem); var outHeight =
		 * $(window).height(); if (elem.parents('.ui-jqgrid-bdiv').length > 0) {
		 * var bdiv = elem.parents('.ui-jqgrid-bdiv'); outHeight =
		 * bdiv.offset().top + bdiv.outerHeight(); }
		 * 
		 * if ((elem.offset().top + elem.outerHeight() + contend
		 * .outerHeight(true)) > outHeight) {
		 * contend.addClass('cell-edit-contend-up'); }
		 */

		function isChecked(forValue, code) {
			for (var i = 0; i < forValue.length; i++) {
				if (forValue[i] == code) {
					return true;
				}
			}
			return false;
		}

		_input.bind('focus', function(e) {

			var offset = _input.offset(), mainwin = _input
					.parents(".panel-main"), layertop;
			try{
			if (offset.top + 200 > mainwin.offset().top + mainwin.height()) {
				layertop = offset.top - 200;
			} else {
				layertop = offset.top + _input.outerHeight();
			}}catch(e){
				layertop = offset.top + _input.outerHeight();
			}
			var layerwidth = (_input.outerWidth() > 100) ? _input.outerWidth()
					: 100;
			// contend.show();
			layer.open({
				type : 1,
				title : false // 不显示标题栏
				,
				closeBtn : false,
				offset : [ layertop, offset.left ],
				area : [ layerwidth + 'px', '200px' ],
				shade : 0.0001,
				shadeClose : true,
				id : 'LAY_layuipro' // 设定一个id，防止重复弹出
				,
				content : elemHtmlDiv.html(),
				success : function(layero) {
					var _checkbox = $("#LAY_layuipro").find(
							'input[name="' + checkboxName + '"]');
					_checkbox.bind('click', function() {
						var newValue = "";
						var newText = "";
						$.each($("#LAY_layuipro").find(
								'input[name="' + checkboxName + '"]:checked'),
								function(index, element) {
									newValue += $(this).val() + ",";
									newText += $(this).attr('data-text') + ",";
								});
						if (newValue !== '') {
							newValue = newValue.substring(0,
									newValue.length - 1);
						}
						if (newText !== '') {
							newText = newText.substring(0, newText.length - 1);
						}
						// 2018.7.5 ws用户自定义函数，当值发生改变的时候执行改变事件
						if (_input.val() != newText) {
							if (changeFunc != null && changeFunc != ""
									&& typeof (changeFunc) == 'function') {
								changeFunc(newValue, options); // 执行客户选中事件
																// param("选中的value","单元格属性")
							}
						}
						// 2018.7.5 ws

						_input.val(newText);
						elem.attr('data-value', newValue);
						// feng start
						_input.focus();
						// feng end
					});
				}
			});
		});

		_button.bind('click', function(e) {
			// contend.toggle();
			var offset = _input.offset(), mainwin = _input
					.parents(".panel-main"), layertop;
			//console.log(mainwin.offset());
			try{
			if (offset.top + 200 > mainwin.offset().top + mainwin.height()) {
				layertop = offset.top - 200;
			} else {
				layertop = offset.top + _input.outerHeight();
			}}catch(e){
				layertop = offset.top + _input.outerHeight();
			}
			var layerwidth = (_input.outerWidth() > 100) ? _input.outerWidth()
					: 100;
			// contend.show();
			layer.open({
				type : 1,
				title : false // 不显示标题栏
				,
				closeBtn : false,
				offset : [ layertop, offset.left ],
				area : [ layerwidth + 'px', '200px' ],
				shade : 0.0001,
				shadeClose : true,
				id : 'LAY_layuipro' // 设定一个id，防止重复弹出
				,
				content : elemHtmlDiv.html(),
				success : function(layero) {
					var _checkbox = $("#LAY_layuipro").find(
							'input[name="' + checkboxName + '"]');
					_checkbox.bind('click', function() {
						var newValue = "";
						var newText = "";
						$.each($("#LAY_layuipro").find(
								'input[name="' + checkboxName + '"]:checked'),
								function(index, element) {
									newValue += $(this).val() + ",";
									newText += $(this).attr('data-text') + ",";
								});
						if (newValue !== '') {
							newValue = newValue.substring(0,
									newValue.length - 1);
						}
						if (newText !== '') {
							newText = newText.substring(0, newText.length - 1);
						}
						// 2018.7.5 ws用户自定义函数，当值发生改变的时候执行改变事件
						if (_input.val() != newText) {
							if (changeFunc != null && changeFunc != ""
									&& typeof (changeFunc) == 'function') {
								changeFunc(newValue, options); // 执行客户选中事件
																// param("选中的value","单元格属性")
							}
						}
						// 2018.7.5 ws

						_input.val(newText);
						elem.attr('data-value', newValue);
						// feng start
						_input.focus();
						// feng end
					});
				}
			});
		});
	}, 100);

	return elem[0];
}
function boxValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).attr('data-rowid');
		var forId = $(elem).attr('data-forid');
		var newValue = $(elem).attr('data-value');
		var rowData = {};
		rowData[forId] = newValue;
		$(this).jqGrid('setRowData', rowId, rowData);
		return $('input', elem).val();
	} else if (operation === 'set') {
		$('input', elem).val(value);
	}
}
/**
 * jqGrid单表单元格编辑日期控件扩展
 * @param value
 * @param options
 */
function dateElem(value, options) {
    //feng start
    $jqGrid = $(this);
    //feng end
	var elem = $('<div class="input-group input-group-sm">'
			//feng start
			//+ '<input class="form-control date-picker" type="text" data-status=""/>'
			+ '<div tabIndex="-1"><input class="form-control date-picker" type="text" data-status=""/></div>'
			//feng end
			+ '<span class="input-group-btn ui-datepicker-trigger">'
			+ '<button class="btn btn-default cell-edit-button" type="button">'
			+ '<span class="glyphicon glyphicon-calendar"></span>'
			+ '</button>' + '</span>' + '</div>');
	$('input.date-picker', elem).val(value);
	setTimeout(function() {
		$('input.date-picker', elem).datepicker({
			onClose: function (dateText,$input) {
				$('input.date-picker', elem).datepicker('hide');
            }
		});
		$('input.date-picker', elem).datepicker('show');
		$('.ui-datepicker-trigger', elem).bind('click', function(e) {
			if ($('#ui-datepicker-div').is(':visible')) {
				$('input.date-picker', elem).datepicker('hide');
			} else {
				$('input.date-picker', elem).datepicker('show');
			}
		});
		$('input.date-picker').on('keydown',nullInput);

		//feng start
		var td = elem.closest("tr.jqgrow>td");
		var iCol = parseInt($.jgrid.getCellIndex(td));
		var iRow = parseInt(options.rowId);

		elem.find('input.date-picker').on('change',function(e){
			setTimeout(function () {
		        $(e.target).unbind('focus').focus();
				$(e.target).attr("tabindex",-1);
				$('input.date-picker', elem).datepicker('hide');
			}, 100);
		});
		
		elem.on("keydown", function(event){
			$jqGrid.jqGrid("setGridParam",{editCellEvent:event});
			if (event.keyCode === 9 || event.keyCode === 13)  {
				if (event.shiftKey) {
					$jqGrid.jqGrid("prevCell",iRow,iCol);
				}else {
					$jqGrid.jqGrid("nextCell",iRow,iCol);
				}
			}
            event.stopPropagation();
		});
        //feng end
    }, 100);

	return elem[0];
}
function dateValue(elem, operation, value) {
	if (operation === 'get') {
		return $('input.date-picker', elem).val();
	} else if (operation === 'set') {
		$('input.date-picker', elem).val(value);
	}
}
/**
 * jqGrid单表单元格编辑时间控件扩展
 * @param value
 * @param options
 */
function timeElem(value, options) {
    //feng start
    $jqGrid = $(this);
    //feng end
	var elem = $('<div class="input-group input-group-sm">'
			//feng start
			//+ '<input class="form-control time-picker" type="text" />'
			+ '<div tabIndex="-1"><input class="form-control time-picker" type="text" /></div>'
        	//feng end
			+ '<span class="input-group-btn ui-datepicker-trigger">'
			+ '<button class="btn btn-default cell-edit-button" type="button">'
			+ '<span class="glyphicon glyphicon-time"></span>'
			+ '</button>' + '</span>' + '</div>');
	$('input.time-picker', elem).val(value);
	setTimeout(function() {
		$('input.time-picker', elem).datetimepicker({
			oneLine : true,//单行显示时分秒
			showButtonPanel : true,//是否展示功能按钮面板
			closeText : '确定',
			showSecond : false,//是否可以选择秒，默认否
			beforeShow : function(selectedDate) {
				if ($('#' + selectedDate.id).val() == "") {
					$(this).datetimepicker("setDate", new Date());
					$('#' + selectedDate.id).val('');
				}
			},
			onClose: function (e) {
			    //$(this).focus();
                $('input.time-picker', elem).datetimepicker('hide');
            }
		});
		$('input.time-picker', elem).datetimepicker('show');
		$('.ui-datepicker-trigger', elem).bind('click', function(e) {
			if ($('#ui-datepicker-div').is(':visible')) {
				$('input.time-picker', elem).datetimepicker('hide');
			} else {
				$('input.time-picker', elem).datetimepicker('show');
			}
		});
		$('input.time-picker').on('keydown',nullInput);

    	//feng start
        var td = elem.closest("tr.jqgrow>td");
        var iCol = parseInt($.jgrid.getCellIndex(td));
        var iRow = parseInt(options.rowId);

        elem.find('input.time-picker').on('change',function(e){
            setTimeout(function () {
                //$(e.target).focus();
            	//$(e.target).unbind('focus').focus();
                $(e.target).attr("tabindex",-1);
                //$('input.time-picker', elem).datetimepicker('hide');
            }, 100);
        });

        elem.on("keydown", function(event){
            $jqGrid.jqGrid("setGridParam",{editCellEvent:event});
            if (event.keyCode === 9 || event.keyCode === 13)  {
                if (event.shiftKey) {
                    $jqGrid.jqGrid("prevCell",iRow,iCol);
                }else {
                    $jqGrid.jqGrid("nextCell",iRow,iCol);
                }
            }
            event.stopPropagation();
        });
        //feng end
    }, 100);

	return elem[0];
}
function timeValue(elem, operation, value) {
	if (operation === 'get') {
		return $('input.time-picker', elem).val();
	} else if (operation === 'set') {
		$('input.time-picker', elem).val(value);
	}
}
/**
 * jqGrid单表单元格编辑数值控件扩展
 * @param value
 * @param options
 */
function spinnerElem(value, options) {
	var elem = $('<div class="input-group input-group-sm spinner" data-trigger="spinner">'
			+ '<input type="text" class="form-control" value="'+ value +'" data-min="'+ options.min +'" ' +
	       'data-max="'+ options.max +'" data-step="'+ options.step +'" data-precision="'+ options.precision  +'" data-hascommafy="'+ options.hascommafy +'">'
			+ '<span class="input-group-addon">'
			+ '<a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a>'
			+ '<a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a>'
			+ '</span>' + '</div>');

	setTimeout(function() {
        //feng start
		//elem.spinner();
        elem.spinner('changed',function(e){
            $(e.target).focus();
        });
        //feng end
	}, 100);

	return elem[0];
}
function spinnerValue(elem, operation, value) {
	if (operation === 'get') {
		if($('input.form-control', elem).val()===undefined){
			return "";
		}else{		
			return $('input.form-control', elem).val();
		}
	} else if (operation === 'set') {
		$('input.form-control', elem).val(value);
	}
}
/**
 * jqGrid单表单元格编辑选人控件扩展
 * @param value
 * @param options
 */
function userElem(value, options) {
	var rowId = options.rowId;
	var forId = options.forId;
	//start ws
	var v_callback = options.callBack;
	var v_beferClose = options.beferClose;
	//end ws
	var rowData = $(this).jqGrid('getRowData', rowId);

	var elem = $('<div class="input-group input-group-sm">'
			+ '<input type="hidden" id="cellRowId" value="'+ rowId +'">'
			+ '<input type="hidden" id="cellForId" value="'+ forId +'">'
			+ '<input type="hidden" id="cellUserid" value="'+ rowData[forId] +'">'
			+ '<input class="form-control" placeholder="请选择用户" type="text" readOnly="readOnly" id="cellUseridAlias" value="'+ value +'">'
			+ '<span class="input-group-addon">'
			+ '<i class="glyphicon glyphicon-user"></i>' + '</span>'
			+ '</div>');

	//start ws
	var inputFocusFunctionForCallBack = function(user){
	   if(v_callback != null && typeof(v_callback) != "undefined" && v_callback != ""){
	     var func = eval(v_callback);
	     new func(user);
	   }
	   $('#cellUseridAlias').focus();
    };
    var inputFocusFunctionForBeferClose = function(){
	   if(v_beferClose != null && typeof(v_beferClose) != "undefined" && v_beferClose != ""){
	     var func = eval(v_beferClose);
	     new func();
	   }
	   $('#cellUseridAlias').focus();
    };
    //start ws
    var h5SelectCommOption = {type : 'userSelect',idFiled : 'cellUserid',textFiled : 'cellUseridAlias'};
    var h5SelectCommMethod = {callBack: inputFocusFunctionForCallBack,beferClose: inputFocusFunctionForBeferClose};
    var newh5SelectCommOption = $.extend({},options,h5SelectCommOption,h5SelectCommMethod);
	elem.find('#cellUseridAlias, .input-group-addon').on('click',function() {
		new H5CommonSelect(newh5SelectCommOption);	
	});
	new H5CommonSelect(newh5SelectCommOption);
	//end ws
	return elem[0];
}
function userValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).find('#cellRowId').val();
		var forId = $(elem).find('#cellForId').val();
		var userId = $(elem).find('#cellUserid').val();
		var rowData = {};
		rowData[forId] = userId;
		$(this).jqGrid('setRowData', rowId, rowData);
		//return $(elem).find('#cellUseridAlias').val();
		if($(elem).find('#cellUseridAlias').val()===undefined){
			return "";
		}else{		
			return $(elem).find('#cellUseridAlias').val();
		}
	} else if (operation === 'set') {
		$(elem).find('#cellUseridAlias').val(value);
	}
}
/**
 * jqGrid单表单元格编辑选组织控件扩展
 * @param value
 * @param options
 */
function orgElem(value, options) {
	var rowId = options.rowId;
	var forId = options.forId;
	var v_callback = options.callBack;
	var v_beferClose = options.beferClose;
	var rowData = $(this).jqGrid('getRowData', rowId);

	var elem = $('<div class="input-group input-group-sm">'
			+ '<input type="hidden" id="cellRowId" value="'+ rowId +'">'
			+ '<input type="hidden" id="cellForId" value="'+ forId +'">'
			+ '<input type="hidden" id="cellOrgid" value="'+ rowData[forId] +'">'
			+ '<input class="form-control" placeholder="请选择组织" type="text" readOnly="readOnly" id="cellOrgidAlias" value="'+ value +'">'
			+ '<span class="input-group-addon">'
			+ '<i class="glyphicon glyphicon-equalizer"></i>' + '</span>'
			+ '</div>');

	var inputFocusFunctionForCallBack = function(){
	   if(v_callback != null && typeof(v_callback) != "undefined" && v_callback != ""){
	     var func = eval(v_callback);
	     new func();
	   }
	   $('#cellOrgidAlias').focus();
    };
    var inputFocusFunctionForBeferClose = function(){
	   if(v_beferClose != null && typeof(v_beferClose) != "undefined" && v_beferClose != ""){
	     var func = eval(v_beferClose);
	     new func();
	   }
	   $('#cellOrgidAlias').focus();
    };
    var h5SelectCommOption = {type : 'orgSelect',idFiled : 'cellOrgid',textFiled : 'cellOrgidAlias'};
    var h5SelectCommMethod = {callBack: inputFocusFunctionForCallBack,beferClose: inputFocusFunctionForBeferClose};
    var newh5SelectCommOption = $.extend({},options,h5SelectCommOption,h5SelectCommMethod);
	elem.find('#cellOrgidAlias, .input-group-addon').on('click',function() {
		new H5CommonSelect(newh5SelectCommOption);	
	});
	new H5CommonSelect(newh5SelectCommOption);	
	return elem[0];
}
function orgValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).find('#cellRowId').val();
		var forId = $(elem).find('#cellForId').val();
		var orgId = $(elem).find('#cellOrgid').val();
		var rowData = {};
		rowData[forId] = orgId;

		$(this).jqGrid('setRowData', rowId, rowData);
		if($(elem).find('.form-control').val()===undefined){
			return "";
		}else{		
			return $(elem).find('.form-control').val();
		}
	} else if (operation === 'set') {
		$(elem).find('.form-control').val(value);
	}
}
/**
 * jqGrid单表单元格编辑选部门控件扩展
 * @param value
 * @param options
 */
function deptElem(value, options) {
	var rowId = options.rowId;
	var forId = options.forId;
	//start ws
	var v_callback = options.callBack;
	var v_beferClose = options.beferClose;
	//end ws
	var rowData = $(this).jqGrid('getRowData', rowId);

	var elem = $('<div class="input-group input-group-sm">'
			+ '<input type="hidden" id="cellRowId" value="'+ rowId +'">'
			+ '<input type="hidden" id="cellForId" value="'+ forId +'">'
			+ '<input type="hidden" id="cellDeptid" value="'+ rowData[forId] +'">'
			+ '<input class="form-control" placeholder="请选择部门" type="text" readOnly="readOnly" id="cellDeptidAlias" value="'+ value +'">'
			+ '<span class="input-group-addon">'
			+ '<i class="glyphicon glyphicon-equalizer"></i>' + '</span>'
			+ '</div>');

    //start ws
	var inputFocusFunctionForCallBack = function(dept){
	   if(v_callback != null && typeof(v_callback) != "undefined" && v_callback != ""){
	     var func = eval(v_callback);
	     new func(dept);
	   }
	   $('#cellDeptidAlias').focus();
    };
    var inputFocusFunctionForBeferClose = function(){
	   if(v_beferClose != null && typeof(v_beferClose) != "undefined" && v_beferClose != ""){
	     var func = eval(v_beferClose);
	     new func();
	   }
	   $('#cellDeptidAlias').focus();
    };
    var h5SelectCommOption = {type : 'deptSelect',idFiled : 'cellDeptid',textFiled : 'cellDeptidAlias'};
    var h5SelectCommMethod = {callBack: inputFocusFunctionForCallBack,beferClose: inputFocusFunctionForBeferClose};
    var newh5SelectCommOption = $.extend({},options,h5SelectCommOption,h5SelectCommMethod);
	elem.find('#cellDeptidAlias, .input-group-addon').on('click',function() {
		new H5CommonSelect(newh5SelectCommOption);	
	});
	new H5CommonSelect(newh5SelectCommOption);	
	//end ws
	return elem[0];
}
function deptValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).find('#cellRowId').val();
		var forId = $(elem).find('#cellForId').val();
		var deptId = $(elem).find('#cellDeptid').val();
		var rowData = {};
		rowData[forId] = deptId;

		$(this).jqGrid('setRowData', rowId, rowData);
		if($(elem).find('.form-control').val()===undefined){
			return "";
		}else{		
			return $(elem).find('.form-control').val();
		}
	} else if (operation === 'set') {
		$(elem).find('.form-control').val(value);
	}
}
/**
 * jqGrid单表单元格编辑选角色控件扩展
 * @param value
 * @param options
 */
function roleElem(value, options) {
	var rowId = options.rowId;
	var forId = options.forId;
	//start ws
	var v_callback = options.callBack;
	var v_beferClose = options.beferClose;
	//end ws
	var rowData = $(this).jqGrid('getRowData', rowId);

	var elem = $('<div class="input-group input-group-sm">'
			+ '<input type="hidden" id="cellRowId" value="'+ rowId +'">'
			+ '<input type="hidden" id="cellForId" value="'+ forId +'">'
			+ '<input type="hidden" id="cellRoleid" value="'+ rowData[forId] +'">'
			+ '<input class="form-control" placeholder="请选择角色" type="text" readOnly="readOnly" id="cellRoleidAlias" value="'+ value +'">'
			+ '<span class="input-group-addon">'
			+ '<i class="glyphicon glyphicon-equalizer"></i>' + '</span>'
			+ '</div>');

    //start ws
	var inputFocusFunctionForCallBack = function(role){
	   if(v_callback != null && typeof(v_callback) != "undefined" && v_callback != ""){
	     var func = eval(v_callback);
	     new func(role);
	   }
	   $('#cellRoleidAlias').focus();
    };
    var inputFocusFunctionForBeferClose = function(){
	   if(v_beferClose != null && typeof(v_beferClose) != "undefined" && v_beferClose != ""){
	     var func = eval(v_beferClose);
	     new func();
	   }
	   $('#cellRoleidAlias').focus();
    };
    var h5SelectCommOption = {type : 'roleSelect',idFiled : 'cellRoleid',textFiled : 'cellRoleidAlias'};
    var h5SelectCommMethod = {callBack: inputFocusFunctionForCallBack,beferClose: inputFocusFunctionForBeferClose};
    var newh5SelectCommOption = $.extend({},options,h5SelectCommOption,h5SelectCommMethod);

	elem.find('#cellRoleidAlias, .input-group-addon').on('click',function() {
		new H5CommonSelect(newh5SelectCommOption);			
	});
	new H5CommonSelect(newh5SelectCommOption);	
	//end ws
	return elem[0];
}
function roleValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).find('#cellRowId').val();
		var forId = $(elem).find('#cellForId').val();
		var roleId = $(elem).find('#cellRoleid').val();
		var rowData = {};
		rowData[forId] = roleId;

		$(this).jqGrid('setRowData', rowId, rowData);
		if($(elem).find('.form-control').val()===undefined){
			return "";
		}else{		
			return $(elem).find('.form-control').val();
		}
	} else if (operation === 'set') {
		$(elem).find('.form-control').val(value);
	}
}
/**
 * jqGrid单表单元格编辑选岗位控件扩展
 * @param value
 * @param options
 */
function positionElem(value, options) {
	var rowId = options.rowId;
	var forId = options.forId;
	//start ws
	var v_callback = options.callBack;
	var v_beferClose = options.beferClose;
	//end ws
	var rowData = $(this).jqGrid('getRowData', rowId);

	var elem = $('<div class="input-group input-group-sm">'
			+ '<input type="hidden" id="cellRowId" value="'+ rowId +'">'
			+ '<input type="hidden" id="cellForId" value="'+ forId +'">'
			+ '<input type="hidden" id="cellPositionid" value="'+ rowData[forId] +'">'
			+ '<input class="form-control" placeholder="请选择岗位" type="text" readOnly="readOnly" id="cellPositionidAlias" value="'+ value +'">'
			+ '<span class="input-group-addon">'
			+ '<i class="glyphicon glyphicon-equalizer"></i>' + '</span>'
			+ '</div>');
    //start ws
	var inputFocusFunctionForCallBack = function(position){
	   if(v_callback != null && typeof(v_callback) != "undefined" && v_callback != ""){
	     var func = eval(v_callback);
	     new func(position);
	   }
	   $('#cellPositionidAlias').focus();
    };
    var inputFocusFunctionForBeferClose = function(){
	   if(v_beferClose != null && typeof(v_beferClose) != "undefined" && v_beferClose != ""){
	     var func = eval(v_beferClose);
	     new func();
	   }
	   $('#cellPositionidAlias').focus();
    };
    var h5SelectCommOption = {type : 'positionSelect',idFiled : 'cellPositionid',textFiled : 'cellPositionidAlias'};
    var h5SelectCommMethod = {callBack: inputFocusFunctionForCallBack,beferClose: inputFocusFunctionForBeferClose};
    var newh5SelectCommOption = $.extend({},options,h5SelectCommOption,h5SelectCommMethod);

	elem.find('#cellPositionidAlias, .input-group-addon').on('click',function() {
		new H5CommonSelect(newh5SelectCommOption);		
	});
	new H5CommonSelect(newh5SelectCommOption);
	//end ws
	return elem[0];
}
function positionValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).find('#cellRowId').val();
		var forId = $(elem).find('#cellForId').val();
		var positionId = $(elem).find('#cellPositionid').val();
		var rowData = {};
		rowData[forId] = positionId;

		$(this).jqGrid('setRowData', rowId, rowData);
		if($(elem).find('.form-control').val()===undefined){
			return "";
		}else{		
			return $(elem).find('.form-control').val();
		}
	} else if (operation === 'set') {
		$(elem).find('.form-control').val(value);
	}
}
/**
 * jqGrid单表单元格编辑选群组控件扩展
 * @param value
 * @param options
 */
function groupElem(value, options) {
	var rowId = options.rowId;
	var forId = options.forId;
	//start ws
	var v_callback = options.callBack;
	var v_beferClose = options.beferClose;
	//end ws
	var rowData = $(this).jqGrid('getRowData', rowId);

	var elem = $('<div class="input-group input-group-sm">'
			+ '<input type="hidden" id="cellRowId" value="'+ rowId +'">'
			+ '<input type="hidden" id="cellForId" value="'+ forId +'">'
			+ '<input type="hidden" id="cellGroupid" value="'+ rowData[forId] +'">'
			+ '<input class="form-control" placeholder="请选择群组" type="text" readOnly="readOnly" id="cellGroupidAlias" value="'+ value +'">'
			+ '<span class="input-group-addon">'
			+ '<i class="glyphicon glyphicon-equalizer"></i>' + '</span>'
			+ '</div>');

    //start ws
	var inputFocusFunctionForCallBack = function(group){
	   if(v_callback != null && typeof(v_callback) != "undefined" && v_callback != ""){
	     var func = eval(v_callback);
	     new func(group);
	   }
	   $('#cellGroupidAlias').focus();
    };
    var inputFocusFunctionForBeferClose = function(){
	   if(v_beferClose != null && typeof(v_beferClose) != "undefined" && v_beferClose != ""){
	     var func = eval(v_beferClose);
	     new func();
	   }
	   $('#cellGroupidAlias').focus();
    };
    var h5SelectCommOption = {type : 'groupSelect',idFiled : 'cellGroupid',textFiled : 'cellGroupidAlias'};
    var h5SelectCommMethod = {callBack: inputFocusFunctionForCallBack,beferClose: inputFocusFunctionForBeferClose};
    var newh5SelectCommOption = $.extend({},options,h5SelectCommOption,h5SelectCommMethod);
	elem.find('#cellGroupidAlias, .input-group-addon').on('click',function() {
		new H5CommonSelect(newh5SelectCommOption);		
	});
	new H5CommonSelect(newh5SelectCommOption);
	//end ws
	return elem[0];
}
function groupValue(elem, operation, value) {
	if (operation === 'get') {
		var rowId = $(elem).find('#cellRowId').val();
		var forId = $(elem).find('#cellForId').val();
		var groupId = $(elem).find('#cellGroupid').val();
		var rowData = {};
		rowData[forId] = groupId;

		$(this).jqGrid('setRowData', rowId, rowData);
		if($(elem).find('.form-control').val()===undefined){
			return "";
		}else{		
			return $(elem).find('.form-control').val();
		}
	} else if (operation === 'set') {
		$(elem).find('.form-control').val(value);
	}
}
//群组成员
function dictinaryElem(value, options){
  var rowId = options.rowId;
  var rowData = $(this).jqGrid('getRowData', rowId);
  var jqObject = $(this);
  var $elem = $('<div class="input-group input-group-sm" style="margin:2px">'+
      '<input type="hidden" id="cellRowId" value="'+ rowId +'">'+
      '<input class="form-control" placeholder="请选择" type="text" id="'+options.name+'" name="'+options.name+'" readonly value="'+ value +'">'+
      '<span class="input-group-addon">'+
      '<i class="fa fa-search-plus"></i>'+
      '</span>'+
      '</div>');
	
  $elem.find('#'+options.name+', .input-group-addon').on('click',function() {

      top.layer.open({
          type:  2,
          area: ['800px', '500px'],
          title: '请选择数据',
          skin: 'bs-modal', // bootstrap 风格皮肤 需加载skin
          shade:   0.3,
          maxmin: false, //开启最大化最小化按钮
          content: 'avicit/platform6/eform/formdesign/js/plugins/dictionary-box/dictionarySelect.jsp',
          btn: ['确定', '关闭'],
          yes: function(index, layero){
        	  var selectRows = new Array();
              var iframeWin = layero.find('iframe')[0].contentWindow;//子页面的窗口对象
              var $jqGridTable = iframeWin.$("#dictionaryjqGrid");
              //从子页面向主页面传递参数
              var id = $jqGridTable.jqGrid('getGridParam','selrow');
              if(id){
                  var data = $jqGridTable.jqGrid("getRowData", id);

                  selectRows.push(data);
                  var dataRow = {};
                  for(var j=0; j< iframeWin.mapping.length; j++){
					   var mapVer = iframeWin.mapping[j];

					   if(mapVer.targetName == options.name){
						   $("#"+options.name).val(data[mapVer.name]);
						   $elem.find('input.form-control').val(data[mapVer.name]);
					   }else{
						   dataRow[mapVer.targetName] = data[mapVer.name];
					   }
					}
                  jqObject.jqGrid('setRowData', rowId, dataRow);
              }
              eval(options.jsAfter);
              top.layer.close(index);
          },
          btn2: function(index, layero){
              top.layer.close(index);
          },
          success: function(layero, index){
              var iframeWin = layero.find('iframe')[0].contentWindow;//子页面的窗口对象
              this.setSubRow = function(mapping,rowData){
                  /*var dataRow = {};
                  for(var j=0; j< mapping.length; j++){
                      var mapVer = mapping[j];
                      dataRow[mapVer.targetName] = eval("rowData."+ mapVer.name);
                  }
                  jqObject.jqGrid('endEditCell');
                  var newRowId = jqObject.jqGrid("getGridParam", "selrow");
                  dataRow["id"] =  newRowId;
                  jqObject.jqGrid('setRowData', newRowId,dataRow);
                  $("#"+newRowId).addClass("edited");*/
                  
                 /* var data = $jqGridTable.jqGrid("getRowData", id);

                  selectRows.push(data);*/
                  var dataRow = {};
                  var newRowId = jqObject.jqGrid("getGridParam", "selrow");
                  for(var j=0; j< mapping.length; j++){
					   var mapVer = mapping[j];

					   if(mapVer.targetName == options.name){
						   $("#"+options.name).val(rowData[mapVer.name]);
						   $elem.find('input.form-control').val(rowData[mapVer.name]);
					   }else{
						   dataRow[mapVer.targetName] = rowData[mapVer.name];
					   }
					}
                  jqObject.jqGrid('setRowData', newRowId, dataRow);
                  
                  top.layer.close(index);
              }

              this.getParamsValue = function(targetName){
					return $("#"+targetName).val();
			  }

              //监听键盘事件
              iframeWin.$('body').on('keydown', function(event){
                  if(event.keyCode === 13){
                      return false; //阻止系统默认回车事件
                  }
              });
              var iframeWin = layero.find('iframe')[0].contentWindow;
              iframeWin.initGrid("2", options.rowCount,options.queryStatement,options.dataGridColModel,options.mapping,options.dataCombox,options.dataComboxType,this.setSubRow,this.getParamsValue);

              eval(options.jsBefore);
          }
      });
  });

  return $elem;
}

//群组成员
function dictinaryValue(elem, operation, value) {
	 var rowId = $(elem).find('#cellRowId').val();
	if (operation === 'get') {
      return $(elem).find('input.form-control').val();
  } else if (operation === 'set') {
      $(elem).find('input.form-control').val(value);
  }
}
//导入页面
function excelImport(templateCode,moreData, afertClose){
	//获取接口
	var userExtdata = JSON.stringify(moreData);
	self.userExtdata = userExtdata;
	//打开导入页面
	this.impIndex = layer.open({
	    type: 2,
	    area: ['500px', '200px'],
	    title: '导入',
	    skin: 'bs-modal', // bootstrap 风格皮肤 需加载skin
        maxmin: false, //开启最大化最小化按钮
        content: "avicit/platform6/console/imp/common/commonImport.jsp?templateCode="+templateCode,
        end:function(){
        	if(typeof(afertClose) == 'function'){
        		afertClose();
   		 	}
        }
	});
}


jQuery.fn.extend({
    serializeArrayCustomForEform: function(escape,filtertype) {
        return this.map(function(){
            // Can add propHook for "elements" to filter or add form elements
            var elements = jQuery.prop( this, "elements" );
            return elements ? jQuery.makeArray( elements ) : this;
        })
            .filter(function() {
                var type = this.type;
                filtertype = filtertype||"escape";
                // unUse .is(":disabled")
                var flag = true;
                if (escape){
                    if (filtertype == "escape") {
                        if (jQuery(this).parents(escape) && jQuery(this).parents(escape).length > 0) {
                            flag = false;
                        }
                    }else if (filtertype == "accept"){
                        if (jQuery(this).parents(escape).length == 0) {
                            flag = false;
                        }
                    }
                }
                return this.name &&flag&&
                    rsubmittable.test( this.nodeName )
                    && !rsubmitterTypes.test( type );
            })
            .map(function( i, elem ){
                var val = jQuery( this ).val();
                if(jQuery(this).parent(".spinner").length > 0){
                    val = delcommafy(jQuery( this ).val(),true);
                }
                if(manipulation_rcheckableType.test( this.type ) && !this.checked){
                    val = "";
                }
                return val == null ?
                    null :
                    jQuery.isArray( val ) ?
                        jQuery.map( val, function( val ){
                            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                        }) :
                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
            }).get();
    }
});


function serializeObjectForEform(b, a,escape,filtertype) {
    var c = {};
    $.each(b.serializeArrayCustomForEform(escape,filtertype), function(d) {
        var value = $.trim(this["value"]) || "";
        if (typeof (a) == "undefined" || (a != null && a == false)) {
            if (c[this["name"]]) {
                c[this["name"]] = c[this["name"]] + "," + $.trim(this["value"]);
            } else {
                c[this["name"]] = $.trim(this["value"]);
            }
        } else {
            if ($.trim(this["value"]) != null ) {
                if (c[this["name"]]) {
                	if (value != "" && value!=null && value!=undefined) {
                        c[this["name"]] = c[this["name"]] + "," + value;
                    }else{
                        c[this["name"]] = c[this["name"]];
					}
                } else {
                    c[this["name"]] = value;
                }
            }
        }
    });
    return c;
}

$(function(){
	//扩展验证,含有js全标签验证
	jQuery.validator.addMethod("jsValidate", function(value, element) { 
	    return this.optional(element) || !(/<script.*?>.*?<\/script>/ig).test(value);
	}, "非法含有JS脚本完整标签");
});