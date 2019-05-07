var MyElement = {
    elecode: "textarea-box",
    colType:"VARCHAR2",
    dragElement: function () {
    	var dragelement = {};
    	dragelement.name = "多行";
    	dragelement.icon = "fa fa-sort-alpha-asc";
    	return dragelement;
    },
    dropElement: function () {
        return '<textarea>多行文本框</textarea>';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();

        var objTextarea = $(ui).find("textarea");
        objTextarea.attr("rows", attrJson.rows);
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