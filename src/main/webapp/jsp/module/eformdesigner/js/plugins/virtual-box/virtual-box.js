var MyElement = {
    elecode: "virtual-box",
    colType:"NOT_DB_COL_ELE",
    dragElement: function () {
    	var dragelement = {};
    	dragelement.name = "虚拟字段";
    	dragelement.icon = "fa fa-sun-o";
    	return dragelement;
    },
    dropElement: function () {
        return '<input type="text" value="虚拟字段">';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();
    },

    validateForm:function(eleattr){
        var regExp = /[\S+]/i;
        if((!eleattr.domId)||(eleattr.domId!=null && !regExp.test(eleattr.domId)))
        {
            layer.msg('虚拟字段控件页面元素ID属性不能为空', {icon: 7});
            return false;
        }else{
            var value=eleattr.domId,
                regEn = /[`~!@#$%^&*()+<>?:{},.\/;'[\]]/im,
                regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
                regCh = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
            if(regEn.test(value) || regCn.test(value) ||regCh.test(value)) {
                layer.msg('虚拟字段控件页面元素ID属性不能含有特殊字符或中文', {icon: 7});
                return false;
            }
        }
        return true;
    },

    initAttrForm: function (form, attrJson) {
        var _this = this;
        if (attrJson) {
            var json = $.parseJSON(attrJson);
        }


        $("#propertyBtn").click(function () {

            linkagedialog = top.layer.open({
                type: 2,
                title: '计算属性维护',
                skin: 'bs-modal',
                area: ['1100px', '570px'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/attr-jsp/calculate-property.jsp",
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
                }
            });
        });
    }
};