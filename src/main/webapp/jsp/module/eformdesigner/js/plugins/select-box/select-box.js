var MyElement = {
    elecode: "select-box",
    colType:"VARCHAR2",
    dragElement: function () {
    	var dragelement = {};
    	dragelement.name = "下拉框";
    	dragelement.icon = "fa fa-caret-square-o-down";
    	return dragelement;
    },
    dropElement: function () {
        return '<select onChange="this.blur();"><option>下拉选择框</option></select>';
    },
    validateForm:function(eleattr){
        if(!eleattr.selectedoption || !eleattr.selectedvalues)
		{
            layer.msg('下拉框控件选项属性不能为空', {icon: 7});
            return false;
		}
        return true;
    },
    initAttrForm:function(form,attrJson){
    	
    	var ele = EformEditor.nowElement;
		var aa = new selectarea("selectarea",{
			lookup_url:"avicit/platform6/eform/formdesign/js/plugins/select-box/addLookup.jsp",
			onChange: function(obj){
				var select = ele.find("select");
				select.empty();
				if (!obj.length>0){
					select.append('<option>下拉选择框</option>');
				}
		        for (var i = 0; i < obj.length; i++) {
		            var value = obj[i].value;
		            var option = obj[i].option;
		            select.append('<option value="' + value + '">' + option + '</option>');
		        }
			}
		});
		var array=[];
		for (var o=0;o<ele.find("option").length;o++){
			if (ele.find("option").eq(o).attr("value")){
				var obj = {};
				obj.lookupCode = ele.find("option").eq(o).attr("value");
				obj.lookupName = ele.find("option").eq(o).text();
				array.push(obj);
			}
		}
		//增加通用代码显示通用代码类型及名称功能
        var attrJsonObj = attrJson!=undefined?JSON.parse(attrJson):new Object;
		if(attrJsonObj.hasOwnProperty("showLookupType")){
			var ob = new Object();
            ob.rows = array;
            ob.lookupType = attrJsonObj.showLookupType;
            ob.lookupTypeName = attrJsonObj.showLookupTypeName;
            aa.setSelect(ob);
		}else{
            aa.setSelect(array);
		}

    }
};