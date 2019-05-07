var MyElement = {
    elecode: "date-box",
    colType:"DATE",
    dragElement: function () {
    	var dragelement = {};
    	dragelement.name = "日期";
    	dragelement.icon = "fa fa-calendar";
    	return dragelement;
    },
    dropElement: function () {
        return '<input type="text" value="日期输入框">';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();
    },
    initAttrForm:function(form,attrJson){
        if(attrJson != undefined) {
            var attr = $.parseJSON(attrJson);
            if(attr.attribute03 == "1") {
            	$('#defaultValue').datetimepicker({
                	language:  'zh-CN',
                	pickerPosition : 'top-left',
                	format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    todayHighlight: true
                })
            }else {
            	$('#defaultValue').datetimepicker({
    				language:  'zh-CN',
                	pickerPosition : 'top-left',
                	minView: "month",
                	format: 'yyyy-mm-dd',
                    autoclose: true,
                    todayHighlight: true
                })
            }
        }else {
        	$('#defaultValue').datetimepicker({
            	language:  'zh-CN',
            	pickerPosition : 'top-left',
                minView: "month",
            	format: 'yyyy-mm-dd',
                autoclose: true,
                todayHighlight: true
            })
        }
    }
}