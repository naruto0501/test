var MyElement = {
    elecode: "datatable",
    dragElement: function () {
        var dragelement = {};
        dragelement.name = "子表控件";
        dragelement.icon = "fa fa-bars";
        return dragelement;
    },
    dropElement: function () {
        return '<input type="text" value="子表控件">';
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();
        var parentTable = ui.parents(".sub_table:first");
        var subTableType = attrJson.subTableType;
        var fkColName = attrJson.fkColName;

        //更新设计区表格结构预览样式
        // parentTable.find("tbody").find("tr:first").find("input").val("子表：" + attrJson.subTableName);
        parentTable.find("tbody").find("tr:first").find("input").remove();
        parentTable.find("tbody").find("tr:first").find(".eleattr-span").before('<input style="width: 95%;" type="text" value="子表：'+attrJson.subTableName+'" />');
        if (parentTable.find("tbody").find("tr").length != 1) {
            parentTable.find("tbody").find("tr:last").remove();
        }

        if (attrJson.colList == "") {
            parentTable.find("tbody").find("tr:first").find("td").attr("colspan", 1);
            parentTable.find(".eleattr-span").remove();
            parentTable.find(".datatable").append($("<span class='eleattr-span' style='display: none;'>" + JSON.stringify(attrJson) + "</span>"));
        }
        else {
            var colList = $.parseJSON(attrJson.colList);

            var colTr = $("<tr></tr>");
            for (var i = 0; i < colList.length; i++) {
                var colAttr = colList[i];
                var colName = colAttr.colName;
                var colLabel = colAttr.colLabel;

                if (colName == fkColName||(colName == "FK_SUB_COL_ID" && fkColName =="")) {
                    continue;
                }

                colTr.append("<td>" + colLabel + "</td>");
            }

            parentTable.find("tbody").find("tr:first").find("td").attr("colspan", colList.length);
            parentTable.find("tbody").append(colTr);
        }

        //更新树子表字段节点
//        dataTree.removeChildNodes(dataTree.getNodeByParam("id", ui.attr("id"), null));
//        if (attrJson.colList != "") {
//            var colList = $.parseJSON(attrJson.colList);
//
//            for (var i = 0; i < colList.length; i++) {
//                var colAttr = colList[i];
//                var colName = colAttr.colName;
//
//                var subTableCol = {"name": colName, "id": colName};
//
//                if(i != colList.length - 1) {
//                    dataTree.addNodes(dataTree.getNodeByParam("id", ui.attr("id"), null), subTableCol);
//                }
//            }
//        }

    },

    setIcon:function(elementType,coltypediv){
    	if (elementType == "date") {
            coltypediv.append('<i class="ace-icon fa fa-calendar"></i>');
        } else if (elementType == "text") {
            coltypediv.append('<i class="ace-icon fa fa-bars"></i>');
        } else if (elementType == "select") {
            coltypediv.append('<i class="ace-icon fa fa-caret-square-o-down"></i>');
        } else if (elementType == "user") {
        	coltypediv.append('<i class="ace-icon fa fa-user"></i>');
        } else if (elementType == "dept"){
        	coltypediv.append('<i class="ace-icon fa fa-sitemap"></i>');
        }else if (elementType == "org"){
        	coltypediv.append('<i class="ace-icon fa fa-tree"></i>');
        }else if (elementType == "group"){
        	coltypediv.append('<i class="ace-icon fa fa-cubes"></i>');
        }else if (elementType == "role"){
        	coltypediv.append('<i class="ace-icon fa fa-street-view"></i>');
        }else if (elementType == "position"){
        	coltypediv.append('<i class="ace-icon fa fa-suitcase"></i>');
        }else if (elementType == "dictionary"){
            coltypediv.append('<i class="ace-icon fa fa-book"></i>');
        }else if (elementType == "linkage"){
            coltypediv.append('<i class="ace-icon fa fa-link"></i>');
        }else if (elementType == "number"){
            coltypediv.append('<i class="ace-icon fa fa-sort-numeric-asc"></i>');
        }else if (elementType == "currency"){
            coltypediv.append('<i class="ace-icon fa fa-money"></i>');
        }else if (elementType == "calculate"){
            coltypediv.append('<i class="ace-icon fa fa-link"></i>');
        }

    },

    validateForm:function(eleattr){
       if(!eleattr.colList)
        {
            layer.msg('子表控件字段编辑不能为空', {icon: 7});
            return false;
        }
        if(eleattr.importChk=="Y") {
            var regExp = /[\S+]/i;
            if((!eleattr.templetCode)||(eleattr.templetCode!=null && !regExp.test(eleattr.templetCode)))
            {
                layer.msg('子表控件导入模板编码属性不能为空', {icon: 7});
                return false;
            }
        }
        if(eleattr.pagerChk=="Y") {
            var regExp = /[\S+]/i;
            if((!eleattr.rowList)||(eleattr.rowList!=null && !regExp.test(eleattr.rowList)))
            {
                layer.msg('子表控件页数量选项不能为空', {icon: 7});
                return false;
            }else{
                try{
                    JSON.parse(eleattr.rowList);
                }catch(ex){
                    layer.msg('子表控件页数量选项格式出错', {icon: 7});
                    return false;
                }
            }

            if((!eleattr.rowNum)||(eleattr.rowNum!=null && !regExp.test(eleattr.rowNum)))
            {
                layer.msg('子表控件默认页数量不能为空', {icon: 7});
                return false;
            }else{
                var numbReg = new RegExp("^[0-9]*$");
                if(!numbReg.test(eleattr.rowNum)){
                    layer.msg('子表控件默认页数量格式出错', {icon: 7});
                    return false;
                }
            }

        }
        if(eleattr.inputChk=="Y") {
            if((!eleattr.dictionaryPara) ||(eleattr.dictionaryPara == "[]" ))
            {
                layer.msg('子表控件数据字典配置不能为空', {icon: 7});
                return false;
            }
        }
        if(eleattr.subTableType=="1") {
            if((!eleattr.fkColName)||(eleattr.fkColName=="请选择"))
            {
                layer.msg('子表控件子表外键属性不能为空', {icon: 7});
                return false;
            }
        }
        if(eleattr.subTableType=="0") {
            if((eleattr.subTableName)&&(eleattr.subTableName.length>18))
            {
                layer.msg('子表控件表名过长，请控制在18个字符以内', {icon: 7});
                return false;
            }
        }
        return true;
    },

    initAttrForm: function (form, attrJson) {
    	var _this = this;
        if (attrJson) {
            var json = $.parseJSON(attrJson);
            var subTableName = json.subTableName;
            var fkColName = json.fkColName;
            var subTableType = json.subTableType;
            if(subTableType==1){
                $.ajax({
                    url: 'platform/eform/bpmsManageController/getColumnsBytableName',
                    type: 'POST',
                    async: false,
                    data: {
                        tableName: subTableName
                    },
                    dataType: 'json',
                    success: function (backData, status) {
                        if (backData) {
                            var rs = [];
                            var columnsList = backData;
                            var subTableType = $('input[name="subTableType"]:checked').val();
                            $("#fkColName").find("option").remove();
                            var fkColNameSelect = $("#fkColName")[0];
                            var op = new Option("请选择");
                            fkColNameSelect.options[0] = op;
                            var index = 1;
                            for (var i = 0; i < columnsList.length; i++) {
                                var column = columnsList[i];
                                var colName = column.colName;
                                var colIsPk = column.colIsPk;
                                if (colIsPk == "Y"
                                    || colName == "CREATION_DATE"
                                    || colName == "CREATED_BY"
                                    || colName == "LAST_UPDATE_DATE"
                                    || colName == "LAST_UPDATED_BY"
                                    || colName == "VERSION"
                                    || colName == "LAST_UPDATE_IP"
                                    || colName == "ORG_IDENTITY") {
                                    continue;
                                }
                                var op = new Option(column.colComments, column.colName);
                                fkColNameSelect.options[index] = op;
                                index = index + 1 ;
                            }
                            $("#fkColName").val(fkColName);
                        }
                        else {
                            layer.msg('获取表数据失败！', {icon: 2});
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }else{
                $("#fkColName").val("FK_SUB_COL_ID");
            }

            if (json.colList) {
                var list = $.parseJSON(json.colList);
                for (var i = 0; i < list.length; i++) {
                    var data = list[i];
                    if (data.colName == "FK_SUB_COL_ID") {
                        continue;
                    }
                    var li = $('<li class="item-red clearfix"></li>');
                    var coltypediv = $('<div class="col-xs-3"></div>');
                    this.setIcon(data.elementType,coltypediv);
                    var colLabeldiv = $('<div class="col-xs-9"></div>');
                    colLabeldiv.append('<span class="lbl">' + data.colLabel + '</span>');
                    li.append(coltypediv).append(colLabeldiv);
                    $("#colArea").append(li);
                }
            }
            if (json.hasOwnProperty("headerColList")) {
                if (json.headerColList != "") {
                    var list = $.parseJSON(json.headerColList);
                    for (var i = 0; i < list.length; i++) {
                        var li = $('<li class="item-red clearfix"></li>');
                        var colLabeldiv = $('<div class="col-xs-12"></div>');
                        colLabeldiv.append('<span class="lbl">' + (i + 1) + '级表头</span>');
                        li.append(colLabeldiv);
                        $("#headerColArea").append(li);
                    }
                }
            }
        }
        $("#addcol").click(function () {
            var subTabName =  $('#subTableName').val();
            var layerTitle = (subTabName?'【'+subTabName+'】': '子表')+'设置';

        	publishDialog = top.layer.open({
                type: 2,
                title: layerTitle,
                skin: 'bs-modal',
                area: ['45%', '85%'],
                maxmin: false,
                content: "jsp/module/eformdesigner/js/plugins/datatable/selectcolumn.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                	var frm = layero.find('iframe')[0].contentWindow;
                	var jsonData = [], rs = [];
                    jsonData = frm.dataJsonList;
                    var fkColName = "";
                    var subTableType = $('input[name="subTableType"]:checked').val();
                    if (subTableType == "1") {
                        fkColName = $("#fkColName").val();
                    }else {
                        fkColName = "FK_SUB_COL_ID";
                    }

                    //子表外键
                    $("#fkColName").find("option").remove();
                    var fkColNameSelect = $("#fkColName")[0];
                    var op = new Option("请选择");
                    fkColNameSelect.options[0] = op;
                    var selectIndex = 1;
                    /*if(fkColName){
                        var op = new Option(fkColName,fkColName);
                        fkColNameSelect.options[selectIndex] = op;
                        selectIndex = selectIndex + 1;
                    }*/
                    $("#colArea").html("");
                    if (jsonData.length > 0) {
                        var selfDefHasFK = false;
                        for (var i = 0; i < jsonData.length; i++) {
                            var data = jsonData[i].data;
                            if(subTableType=="0"&&data.colName=="FK_SUB_COL_ID") selfDefHasFK=true;
                            /*if(!data.colLength||data.colLength==""){
                                layer.msg("【"+data.colLabel+'】字段长度不能为空！', {icon: 7});
                                return false;
                            }*/
                            var velColLength = velifyColLength(data);
                            if(velColLength){
                                layer.msg(velColLength, {icon: 7});
                                return false;
                            }

                            //校验排序类型和数据排序
                            if(data.hasOwnProperty("sorttype") && data.hasOwnProperty("orderindex")){
                                if(((data.sorttype != null && data.sorttype != "")
                                        && (data.orderindex == null || data.orderindex == ""))
                                    ||  ((data.sorttype == null || data.sorttype == "")
                                        && (data.orderindex != null && data.orderindex != ""))){
                                    layer.msg('排序类型或数据排序必须同时为空或不为空！', {icon: 7});
                                    return false;
                                }
                                if (data.orderindex != null && data.sorttype != "" && !verifyOrderIndex(data.orderindex)) {
                                    layer.msg('数据排序只能为大于等于零的整数！', {icon: 7});
                                    return false;
                                }
                            }


                            if (verifyIsEmpty(data.xml)) {
                            	layer.msg('字段名称(英文)[引入XML]不能为空！', {icon: 7});
                            	verifyStatus = false;

                            	return false;
                        	}
                            var li = $('<li class="item-red clearfix"></li>');
                            var coltypediv = $('<div class="col-xs-3"></div>');
                            _this.setIcon(data.elementType,coltypediv);
                            var colLabeldiv = $('<div class="col-xs-9"></div>');
                            colLabeldiv.append('<span class="lbl">' + data.colLabel + '</span>');
                            li.append(coltypediv).append(colLabeldiv);
                            if(!(fkColName&&data.colName&&fkColName==data.colName)){
                                $("#colArea").append(li);
                            }

                            rs.push(data);
                            var op = new Option(data.colLabel, data.colName);
                            fkColNameSelect.options[selectIndex] = op;
                            selectIndex = selectIndex + 1 ;
                        }

                        if(subTableType == "0"){
                            if(!selfDefHasFK){
                                rs.push({
                                    colName: "FK_SUB_COL_ID",
                                    colLabel: "外键",
                                    elementType: "text",
                                    colLength: "50",
                                    width:"100",
                                    colType: "VARCHAR2",
                                    colIsVisible: "N"
                                });
                                var op = new Option("FK_SUB_COL_ID", "FK_SUB_COL_ID");
                                fkColNameSelect.options[selectIndex] = op;
                            }
                            $("#fkColName").val("FK_SUB_COL_ID");
                            $("#fkColName").find("option[value='FK_SUB_COL_ID']").attr("selected",true);
                            var ss = $("#fkColName").val();
                        }else{
                            $("#fkColName").val(fkColName);
                        }
                        $("#colList").val(JSON.stringify(rs));
                        $("#colList").trigger("keyup");
                    } else {
                        alert("字段列表为空，请选择添加字段后再提交");
                        return false;
                    }
                    top.layer.close(index);

                },
                no: function(index, layero){
                	layero.close(index);
                }
            });
        });

        //设置多级标题
        $("#addheadercol").click(function () {
            var subTabName =  $('#subTableName').val();
            var layerTitle = (subTabName?'【'+subTabName+'】': '多级标题')+'多级标题设置';

            publishDialog = top.layer.open({
                type: 2,
                title: layerTitle,
                skin: 'bs-modal',
                area: ['45%', '85%'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/datatable/setheadercolumn.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var jsonData = frm.submitJsonData();
                    if (jsonData == false){
                        return false;
                    }
                    $("#headerColList").val(JSON.stringify(jsonData.dataList));
                    $("#headerColList").trigger("keyup");
                    $("#headerColArea").html("");
                    for (var s=0;s<jsonData.dataList.length;s++) {
                        var li = $('<li class="item-red clearfix"></li>');
                        var colLabeldiv = $('<div class="col-xs-12"></div>');
                        colLabeldiv.append('<span class="lbl">' + (s+1) + '级表头</span>');
                        li.append(colLabeldiv);
                        $("#headerColArea").append(li);
                    }

                    top.layer.close(index);
                },
                no: function(index, layero){
                    layero.close(index);
                },
                success: function(layero, index){
                    var subTableColumns = [];
                    if($("#colList").val()&&$("#colList").val()!=""){
                        subTableColumns = $.parseJSON($("#colList").val());
                    }
                    var frm = layero.find('iframe')[0].contentWindow;
                    frm.jqgridInit($('#headerColList').val(), subTableColumns);
                }
            });
        });



        //初始化控制参考录入对应的XML文本框只读
        if(attrJson){
        	var ajObject = JSON.parse(attrJson);
        	if(ajObject.inputChk == "Y"){
        		$("#dictionaryListDiv").show();
        		$("#dictionaryList").show();
        	}else{
        		$("#dictionaryListDiv").hide();
        		$("#dictionaryList").hide();
        	}
        }else{
        	$("#dictionaryListDiv").hide();
        	$("#dictionaryList").hide();
        }

        //控制参考录入对应的XML文本框只读
        $("#inputChk").change(function() {
        	if($("#inputChk").is(':checked')){
        		$("#dictionaryListDiv").show();
        		$("#dictionaryList").show();
        	}else{
        		$("#dictionaryListDiv").hide();
        		$("#dictionaryList").hide();
        	}
        });

        //控制子表外键选择后刷新colArea
        $("#fkColName").change(function() {
            $("#colArea").html("");
            var jsonData = [];
            if($("#colList").val()&&$("#colList").val()!=""){
                jsonData = $.parseJSON($("#colList").val());
            }else{
                jsonData = $.parseJSON($.parseJSON(attrJson).colList);
            }

            var oldfkColName = "";
            if (attrJson&&$.parseJSON(attrJson).fkColName){
                oldfkColName = $.parseJSON(attrJson).fkColName;
            }
            var fkColName = this.value;
            for (var i = 0; i < jsonData.length; i++) {
                var data = jsonData[i];
                var li = $('<li class="item-red clearfix"></li>');
                var coltypediv = $('<div class="col-xs-3"></div>');
                _this.setIcon(data.elementType, coltypediv);
                var colLabeldiv = $('<div class="col-xs-9"></div>');
                colLabeldiv.append('<span class="lbl">' + data.colLabel + '</span>');
                li.append(coltypediv).append(colLabeldiv);
                if (!(fkColName && data.colName && fkColName == data.colName)) {
                    $("#colArea").append(li);
                    if (oldfkColName && data.colName && oldfkColName == data.colName){
                        data.colIsVisible = "Y";
                    }
                }else{
                    data.colIsVisible = "N";
                }
            }
            $("#colList").val(JSON.stringify(jsonData)).trigger("keyup");
        });

        $("#propertyBtn").click(function () {
            linkagedialog = top.layer.open({
                type: 2,
                title: '数据字典配置维护',
                skin: 'bs-modal',
                area: ['45%', '85%'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/dictionary-box/dictionary-property.jsp?isMain=0",
                btn: ['确定', '取消'],
                success: function (layero, index) {
                	var iframeWin = layero.find('iframe')[0].contentWindow;
                    var dictionaryPara = $('#dictionaryPara').val();
                    var rowCount = $('#rowCount').val();
                    var queryStatement = $('#queryStatement').val();
                    var jsBefore = $('#jsBefore').val();
                    var jsAfter = $('#jsAfter').val();
                    var dataCombox = $('#dataCombox').val();
                    var dataComboxType = $('#dataComboxType').val();
                    var dataComboxText = $('#dataComboxText').val();
                    iframeWin.initForm(rowCount,escape2Html(queryStatement),dictionaryPara,jsBefore,jsAfter,dataCombox,dataComboxType,dataComboxText);
                	var attrJson = form.serializeObject();
                    var colList = $.parseJSON(attrJson.colList);
                	iframeWin.changeTargetNameFunc(colList);
                },
                yes: function(index, layero){
                    var frm = layero.find('iframe')[0].contentWindow;
                    var reData = frm.commitForm();
                    if (reData == false){
                    	return false;
                    }
                    //$("#dictionaryName").val(reData.dictionaryName);
                    $("#rowCount").val(reData.rowCount);
                    $("#queryStatement").val(reData.queryStatement);
                    $("#jsBefore").val(reData.jsBefore);
                    $("#jsAfter").val(reData.jsAfter);
                    $("#dictionaryPara").val(JSON.stringify(reData.datagridData)).trigger("keyup");
                    
                    $("#dataCombox").val(reData.dataCombox);
                    $("#dataComboxType").val(reData.dataComboxType);
                    $("#dataComboxText").val(reData.dataComboxText);
                    top.layer.close(index);

                },
                no: function(index, layero){
                    layero.close(index);
                }
            });
        });

        // 加载时，属性面板显示导入模板编码与分页参数
        if(attrJson){
            var ajObject = JSON.parse(attrJson);
            if(ajObject.importChk == "Y"){
                $("#templetCodeDiv").show();
            }else{
                $("#templetCodeDiv").hide();
            }
            if(ajObject.pagerChk == "Y"){
                $("#pagerInfo").show();
            }else{
                $("#pagerInfo").hide();
            }
        }else{
            $("#templetCodeDiv").hide();
            $("#pagerInfo").hide();
        }


        //导入模板编码设置
        $("#importChk").change(function() {
            if($("#importChk").is(':checked')){
                $("#templetCodeDiv").show();
            }else{
                $("#templetCodeDiv").hide();
            }
        });
        // 绑定启用子表分页复选框
        $("#pagerChk").change(function() {
            if($("#pagerChk").is(':checked')){
                $("#pagerInfo").show();
            }else{
                $("#pagerInfo").hide();
            }
        });

    }

};


/**
 * 验证是否为空
 * @param value
 * @returns {boolean}
 */
function verifyIsEmpty(value) {
    var regExp = /[\S+]/i;
    if (regExp.test(value)) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 验证是否为空
 * @param value
 * @returns {boolean}
 */
function verifyOrderIndex(value) {
    var regExp =  /^(0|([1-9]\d*))$/;
    if (regExp.test(value)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 验证子表字段长度
 * @param str
 * @returns {*}
 */
function velifyColLength(data){
    var msg = null;
    if (data.elementType=="date"){
        return msg;
    }
    if(!data.colLength||data.colLength==""){
         msg = "【"+data.colLabel+'】字段长度不能为空！';
    }else if(data.elementType=="number"||data.elementType=="currency"||data.elementType=="calculate"){
        if(Number(data.colLength)>38||Number(data.colLength)<1){
            msg = "【"+data.colLabel+'】字段长度范围：1-38！';
        }else if(Number(data.attribute02)>Number(data.colLength)){
            msg = "【"+data.colLabel+'】小数位长度不能超过字段长度！';
        }
    }else if(data.colLength>4000){
        msg = "【"+data.colLabel+'】字段长度不能超过4000！';
    }
    return msg;
}

function escape2Html(str) {
	   var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
	   return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
	}