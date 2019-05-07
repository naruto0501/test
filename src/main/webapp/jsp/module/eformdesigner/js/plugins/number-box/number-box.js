var MyElement = {
    elecode: "number-box",
    colType:"NUMBER",
    dragElement: function () {
    	var dragelement = {};
    	dragelement.name = "数字";
    	dragelement.icon = "fa fa-sort-numeric-asc";
    	return dragelement;
    },
    dropElement: function () {
        return '<input type="text" value="数字输入框">';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();
    },
    validateForm:function(eleattr){
        var colLength = parseInt(eleattr.colLength);
        var decimal = parseInt(eleattr.attribute02);
        if ((colLength-decimal)<2){
            layer.msg('小数位数最多为'+(colLength-2)+"位", {icon: 7});
            return false;
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