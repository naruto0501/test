var MyElement = {
    elecode: "label-box",
    colType: "NOT_DB_COL_ELE",
    dragElement: function () {
        var dragelement = {};
        dragelement.name = "标签";
        dragelement.icon = "fa fa-tag";
        return dragelement;
    },
    dropElement: function () {
        return '<label for="">标签</label>';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();
    },
    initAttrForm: function (form, attrJson) {

        var labelEle = EformEditor.nowElement[0].firstChild;//面板标签dom
        //var labelAttr=$.parseJSON(EformEditor.nowElement.children('.eleattr-span').html());//标签属性
        var allEle = editorUtil.getAllDomAttr();
        var bindField = form[0].bindField;//右侧菜单栏绑定字段dom
        var labelText = form[0].labelName;//右侧菜单栏标签名称
        var eleMap={};//用来存储所有控件的英文名和中文名
        var i = 1;
        var op = new Option("请选择");
        bindField.options[0] = op;
        for (ele in allEle) {
            if (ele != "clone" && ("domId" in allEle[ele] || "colName" in allEle[ele])) {
            	if (allEle[ele]["colName"] != undefined && allEle[ele]["colName"] != "") {
                    var op = new Option(allEle[ele]["colName"], allEle[ele]["colName"]);
                    bindField.options[i] = op;
                    if(allEle[ele]["colLabel"]!= undefined&& $.trim(allEle[ele]["colLabel"])!="")
                	{
                    	 eleMap[allEle[ele]["colName"]] = allEle[ele]["colLabel"];
                	}else if(allEle[ele]["title"]!= undefined&& $.trim(allEle[ele]["title"])!="")
            		{
                		eleMap[allEle[ele]["colName"]] = allEle[ele]["title"];
            		}else if(allEle[ele]["colName"]!= undefined&& $.trim(allEle[ele]["colName"])!="")
        			{
        				eleMap[allEle[ele]["colName"]] = allEle[ele]["colName"];
        			}else
    				{
        				eleMap[allEle[ele]["colName"]] = "标签";
    				}
                   
                }else if (allEle[ele]["domId"] != undefined && allEle[ele]["domId"] != "") {
                    var op = new Option(allEle[ele]["domId"], allEle[ele]["domId"]);
                    bindField.options[i] = op;
                    if(allEle[ele]["colLabel"]!= undefined&& $.trim(allEle[ele]["colLabel"])!="")
                	{
                    	eleMap[allEle[ele]["domId"]] = allEle[ele]["colLabel"];
                	}else if(allEle[ele]["title"]!=undefined&& $.trim(allEle[ele]["title"])!="")
            		{
                		eleMap[allEle[ele]["domId"]] = allEle[ele]["title"];
            		}else if(allEle[ele]["colName"]!= undefined&& $.trim(allEle[ele]["colName"])!="")
        			{
        				eleMap[allEle[ele]["domId"]] = allEle[ele]["colName"];
        			}else
    				{
        				eleMap[allEle[ele]["domId"]] = "标签";
    				}
                    
                }
                i = i + 1;
            }
        }
        
        
        bindField.onclick = function () {
            if (bindField.value != "请选择") {
                if (labelText.value == "" || labelText.value == "标签") {
                    labelText.value = eleMap[bindField.value];
                    labelEle.innerHTML = labelText.value;

                }
                for (e in allEle) {
                    if ((e != "clone" && ("colName" in allEle[e]) && allEle[e]["colName"] == bindField.value)
                        || e != "clone" && ("domId" in allEle[e]) && allEle[e]["domId"] == bindField.value) {

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
                            labelEle.setAttribute("for", allEle[e]["domId"]);
                         
                        }
                        else {
                            labelEle.setAttribute("for", allEle[e]["colName"]);
                            
                        }
                        $("#labeltype").val(allEle[e]["domType"]);
                    }
                }
            }
            $("#labelName").trigger("keyup");
        };
        labelText.onchange = function () {
            labelEle.innerHTML = labelText.value;
            $('#tinymceArea_ifr').contents().find(".eleattr-span").each(function(){
                var json = $.parseJSON($(this).html());
                if ((json.hasOwnProperty("domId") && json.domId == bindField.value)
                        || (json.hasOwnProperty("colName") && json.domId == bindField.value) ){
                    json.title = labelText.value;
                    $(this).text(JSON.stringify(json));
                    return false;
                }
            });

        };

        //var labelAttr=$.parseJSON(EformEditor.nowElement.children('.eleattr-span').html());//标签属性
        if (labelEle.getAttribute('for') != '') {

            for (e in allEle) {
                if ((e != "clone" && ("colName" in allEle[e]) && allEle[e]["colName"] == labelEle.getAttribute('for'))
                    || (e != "clone" && ("domId" in allEle[e]) && allEle[e]["domId"] == labelEle.getAttribute('for'))) {

                    if (allEle[e]["colIsVisible"] == 'Y') {
                        $('input[name=colIsVisibleShow]').eq(1).removeAttr("checked");
                        $('input[name=colIsVisibleShow]').eq(0).attr("checked", 'checked');
                        $('input[name=colIsVisibleShow]').eq(0).trigger("click");
                    }
                    else {
                        $('input[name=colIsVisibleShow]').eq(0).removeAttr("checked");
                        $('input[name=colIsVisibleShow]').eq(1).attr("checked", 'checked');
                        $('input[name=colIsVisibleShow]').eq(1).trigger("click");
                    }
                }
            }

            /* if(labelAttr.colIsVisible=='Y')
                 {
                     $('input[name=colIsVisibleShow]').eq(1).removeAttr("checked");
                     $('input[name=colIsVisibleShow]').eq(0).attr("checked",'checked');
                     $('input[name=colIsVisibleShow]').eq(0).trigger("click");
                 }
                 else
                 {
                     $('input[name=colIsVisibleShow]').eq(0).removeAttr("checked");
                     $('input[name=colIsVisibleShow]').eq(1).attr("checked",'checked');
                     $('input[name=colIsVisibleShow]').eq(1).trigger("click");
                 }*/
        }
    }

};



