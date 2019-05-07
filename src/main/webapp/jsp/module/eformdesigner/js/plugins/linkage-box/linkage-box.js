var MyElement = {
    elecode: "linkage-box",
    colType: "VARCHAR2",
    dragElement: function () {
        var dragelement = {};
        dragelement.name = "联动控件";
        dragelement.icon = "fa fa-link";
        return dragelement;
    },
    dropElement: function () {
        return '<input type="text" value="联动选择框">';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();

        var colName = attrJson.colName;
        var linkageColumnid = attrJson.linkageColumnid;
        var linkageImpl = attrJson.linkageImpl;
        var linkageResultType = attrJson.linkageResultType;

        //修改所关联的联动控件属性
        var theEle = $('#tinymceArea_ifr').contents().find('span:contains("colName":"' + linkageColumnid + '")[class="eleattr-span"]');
        if(theEle.length == 1) {
            var theEleAttr = theEle.prop("innerHTML");
            var theEleAttrJson = $.parseJSON(theEleAttr);
            if (linkageImpl!=null&&linkageImpl!=""&&linkageImpl!="undefined") {
	            theEleAttrJson.linkageEle_ctrl = "YES";
	            
	            theEleAttrJson.linkageColumnid_ctrl = colName;
	            theEleAttrJson.linkageImpl_ctrl = linkageImpl;
	            theEleAttrJson.linkageResultType_ctrl = linkageResultType;

            }else{
                delete theEleAttrJson.linkageEle_ctrl;
                delete theEleAttrJson.linkageColumnid_ctrl;
                delete theEleAttrJson.linkageImpl_ctrl;
                delete theEleAttrJson.linkageResultType_ctrl;
            }
            theEle.prop("innerHTML", JSON.stringify(theEleAttrJson));
        }
    },

    validateForm:function(eleattr){
        if(!eleattr.linkagePara)
        {
            layer.msg('联动控件联动属性不能为空', {icon: 7});
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
                }
            });
        });
    }
};