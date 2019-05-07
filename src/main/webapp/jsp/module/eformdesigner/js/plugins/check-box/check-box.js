var MyElement = {
    elecode: "check-box",
    colType:"VARCHAR2",
    dragElement: function () {
    	var dragelement = {};
    	dragelement.name = "复选";
    	dragelement.icon = "fa fa-check-square-o";
    	return dragelement;
    },
    dropElement: function () {
        return '<input type="checkbox" value=""><span class="option">复选按钮</span>';
    },

    validateForm:function(eleattr){
        if(!eleattr.selectedoption || !eleattr.selectedvalues)
        {
            layer.msg('复选控件选项属性不能为空', {icon: 7});
            return false;
        }
        return true;
    },

    initAttrForm:function(form,attrJson){

    	var ele = EformEditor.nowElement;
		var aa = new selectarea("selectarea",{
			lookup_url:"avicit/platform6/eform/formdesign/js/plugins/check-box/addLookup.jsp",
			onChange: function(obj){
			
				var eleattr = ele.find(".eleattr-span");
				ele.empty();
				if (!obj.length>0){
					ele.append('<input type="checkbox"><span class="option">复选按钮</span>');
				}
		        for (var i = 0; i < obj.length; i++) {
		            var value = obj[i].value;
		            var option = obj[i].option;
		            ele.append('<input type="checkbox"  value="' + value + '"><span class="option">' + option + '</span>');
		        }
		        ele.append(eleattr);
			}
		});
		var array=[];
		for (var o=0;o<ele.find("input").length;o++){
			if (ele.find("input").eq(o).attr("value")){
				var obj = {};
				obj.lookupCode = ele.find("input").eq(o).attr("value");
				obj.lookupName = ele.find("input").eq(o).next().text().replace(/(^\s*)|(\s*$)/g, "");
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