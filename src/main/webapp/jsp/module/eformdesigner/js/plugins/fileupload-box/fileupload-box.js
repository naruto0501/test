var MyElement = {
    elecode: "fileupload-box",
    colType:"NOT_DB_COL_ELE",
    dragElement: function () {
    	var dragelement = {};
    	dragelement.name = "文件上传";
    	dragelement.icon = "fa fa-upload";
    	return dragelement;
    },
    dropElement: function () {
        return '<input type="file" value="文件上传">';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();
    },
    validateForm:function(eleattr){
        if (eleattr.allowSecret=='true') {
            if ((!eleattr.formSecret) || (eleattr.formSecret == "请选择")) {
                layer.msg('文件上传控件关联的密级字段不能为空', {icon: 7});
                return false;
            }
        }

        var regExp = /[\S+]/i;
        if((!eleattr.domId)||(eleattr.domId!=null && !regExp.test(eleattr.domId)))
        {
            layer.msg('文件上传控件页面元素ID属性不能为空', {icon: 7});
            return false;
        }else{
            var value=eleattr.domId,
                regEn = /[`~!@#$%^&*()+<>?:{},.\/;'[\]]/im,
                regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
                regCh = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
            if(regEn.test(value) || regCn.test(value) ||regCh.test(value)) {
                layer.msg('文件上传控件页面元素ID属性不能含有特殊字符或中文', {icon: 7});
                return false;
            }
        }
        return true;
    },
    initAttrForm: function (form, attrJson) {

        var fileEle = EformEditor.nowElement[0].firstChild;//面板标签dom
        //var labelAttr=$.parseJSON(EformEditor.nowElement.children('.eleattr-span').html());//标签属性
        var allEle = editorUtil.getAllDomAttr();
        var formSecret = form[0].formSecret;//右侧菜单栏绑定字段dom
        //var labelText = form[0].labelName;//右侧菜单栏标签名称
        var i = 1;
        var op = new Option("请选择");
        formSecret.options[0] = op;
        for (ele in allEle) {
            if (ele != "clone" && ("domId" in allEle[ele] || "colName" in allEle[ele])) {
                if (allEle[ele]["domId"] != undefined && allEle[ele]["domId"] != "") {
                    var op = new Option(allEle[ele]["domId"], allEle[ele]["domId"]);
                    formSecret.options[i] = op;
                } else if (allEle[ele]["colName"] != undefined && allEle[ele]["colName"] != "") {
                    var op = new Option(allEle[ele]["colName"], allEle[ele]["colName"]);
                    formSecret.options[i] = op;
                }
                i = i + 1;
            }
        }
        formSecret.onclick = function () {
            if (formSecret.value != "请选择") {
                for (e in allEle) {
                    if ((e != "clone" && ("colName" in allEle[e]) && allEle[e]["colName"] == formSecret.value)
                        || e != "clone" && ("domId" in allEle[e]) && allEle[e]["domId"] == formSecret.value) {

                        if (allEle[e]["colIsMust"] == 'Y') {
                            if (EformEditor.nowElement.find(".required").length == 0)//防止多填
                            {
                                EformEditor.nowElement.find("label").prepend("<i class='required' style='color:red;'>*</i>");
                                $("#colIsMust").val("Y").trigger("keyup");
                            }
                        }
                        else {
                            if (EformEditor.nowElement.find(".required").length > 0) {
                                EformEditor.nowElement.find(".required").remove();
                                $("#colIsMust").val("N").trigger("keyup");
                            }
                        }

                        if (allEle[e]["colIsVisible"] == 'Y') {
                            $('input[name=colIsVisibleShow]').eq(1).removeAttr("checked");
                            $('input[name=colIsVisibleShow]').eq(0).attr("checked", 'checked');
                            $('input[name=colIsVisibleShow]').eq(0).trigger("keyup");
                        }
                        else {
                            $('input[name=colIsVisibleShow]').eq(0).removeAttr("checked");
                            $('input[name=colIsVisibleShow]').eq(1).attr("checked", 'checked');
                            $('input[name=colIsVisibleShow]').eq(1).trigger("keyup");
                        }

                        $('input[name=colIsVisible]').val(allEle[e]["colIsVisible"]);
                        $('input[name=colIsVisible]').trigger("keyup");

                        if (allEle[e]["domId"] != "") {
                            fileEle.setAttribute("for", allEle[e]["domId"]);
                        }
                        else {
                            fileEle.setAttribute("for", allEle[e]["colName"]);
                        }
                    }
                }
            }
        };
    }
};