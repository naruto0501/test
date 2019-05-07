/**
 * 初始化对象
 * @param datagrid 表格Id
 * @param url URL参数
 * @param searchDialogId 高级查询Id
 * @param form 高级查询formId
 * @param keyWordId 关键字查询框Id
 * @param searchNames 关键字查询项名称Array
 * @param dataGridColModel 表格列属性Array
 */
function Button(datagrid, url, searchDialogId, form, keyWordId, searchNames, dataGridColModel, eformFormInfoId,version) {
    if (!datagrid || typeof (datagrid) !== 'string' && datagrid.trim() !== '') {
        throw new Error("datagrid不能为空！");
    }
    var _url = url;
    this.getUrl = function () {
        return _url;
    };
    this.datagrid = datagrid;
    this._datagridId = "#" + datagrid;
    this._jqgridToolbar = "#t_" + datagrid;
    this._doc = document;
    this._formId = "#" + form;
    this._searchDialogId = "#" + searchDialogId;
    this._keyWordId = "#" + keyWordId;
    this._searchNames = searchNames;
    this.dataGridColModel = dataGridColModel;
    this.eformFormInfoId = eformFormInfoId;
    this.notnullFiled = [];//非空字段
    this.notnullFiledComment = []; //非空字段注释
    this.version = version;//当前版本
    this._clickrowid = "";
    //除时间,数字等类型长度校验字段
    this.lengthValidFiled = [];
    //除时间,数字等类型长度校验字段注释
    this.lengthValidFiledComment = [];
    //除时间,数字等类型长度
    this.lengthValidFiledSize = [];
    this.init.call(this);
}

/**
 * 初始化操作
 */
Button.prototype.init = function () {
    var _self = this;
    $(_self._datagridId).jqGrid({
        url: this.getUrl() + 'getEformButtonList?eformFormInfoId=' + _self.eformFormInfoId+"&version="+_self.version,
        mtype: 'POST',
        datatype: "json",
        toolbar: [true, 'top'],//启用toolbar
        colModel: this.dataGridColModel,//表格列的属性
        height: $(window).height() - 120,//初始化表格高度
        scrollOffset: 20, //设置垂直滚动条宽度
        altRows: true,//斑马线
        styleUI: 'Bootstrap', //Bootstrap风格
        viewrecords: true, //是否要显示总记录数
        hasTabExport: false, //导出
        hasColSet: false,  //设置显隐
        onCellSelect: function (rowid, iCol, cellcontent, e) {
            _self._clickrowid = rowid;
            var theRow = $(_self._datagridId).jqGrid('getRowData', rowid);

            if (theRow.buttonCode == "customize" || theRow.buttonCode == "print") {
                $(_self._datagridId).jqGrid('setCell', rowid, 'eventClass', '', 'not-editable-cell');
                var buttonUrl = 'platform/eform/bpmsCRUDClient/toPrint?formInfoId=' + _self.eformFormInfoId;

                $(_self._datagridId).jqGrid('setCell', rowid, 'buttonUrl', buttonUrl );

                $("#" + rowid).find("td[aria-describedby='" + _self.datagrid + "_eventClass']").attr("title", "");
                $("#" + rowid).find("td[aria-describedby='" + _self.datagrid + "_eventClass']").html("&nbsp;");
            }
            else {
                $("#" + rowid).find("td[aria-describedby='" + _self.datagrid + "_eventClass']").removeClass("not-editable-cell");
            }

            if (iCol == 4){
                _self.selectIcon();
            }
            if (iCol == 7){
                _self.valueEdit(cellcontent,rowid,"preJs");
            }
            if (iCol == 8){
                _self.valueEdit(cellcontent,rowid,"postJs");
            }
            if (iCol === 9 && theRow.buttonCode === "print"){
                _self.setPrintTemp(cellcontent, rowid, 'eventClass');
            }
        },
        autowidth: true,//列宽度自适应
        responsive: true,//开启自适应
        cellEdit: true,
        cellsubmit: 'clientArray',
        loadComplete: function(){

            var re_records = $(_self._datagridId).getGridParam('records');
            if(re_records == 0 || re_records == null){
                if($(".norecords").html() == null){
                    $(_self._datagridId).parent().append("<div class=\"norecords\">请先保存设计，再添加按钮</div>");
                }
                $(".norecords").show();
            }
        }
    });
    $(_self._datagridId).setColProp("preJs",{editable:false});
    $(_self._datagridId).setColProp("postJs",{editable:false});
    $(_self._datagridId).setColProp("buttonIcon",{editable:false});
    //放入表格toolbar中
    $(this._jqgridToolbar).append($("#tableToolbar"));

    //初始化校验字段
    _self.notnullFiled.push("buttonCode");
    _self.notnullFiledComment.push("按钮代码");
    _self.lengthValidFiled.push("buttonCode");
    _self.lengthValidFiledComment.push("按钮代码");
    _self.lengthValidFiledSize.push(50);

    _self.notnullFiled.push("buttonName");
    _self.notnullFiledComment.push("按钮名称");
    _self.lengthValidFiled.push("buttonName");
    _self.lengthValidFiledComment.push("按钮名称");
    _self.lengthValidFiledSize.push(50);

    _self.notnullFiled.push("buttonOrder");
    _self.notnullFiledComment.push("按钮顺序");
    _self.lengthValidFiled.push("buttonOrder");
    _self.lengthValidFiledComment.push("按钮顺序");
    _self.lengthValidFiledSize.push(16);
};
/**
 * 添加页面
 */
var newRowIndex = 0;
var newRowStart = "new_row";
Button.prototype.insert = function () {
    $(this._datagridId).jqGrid('endEditCell');
    var newRowId = newRowStart + newRowIndex;
    var parameters = {
        rowID: newRowId,
        initdata: {isSystemDefault: 0,buttonCode:"customize"},
        position: "first",
        useDefValues: true,
        useFormatter: true,
        addRowParams: {
            extraparam: {}
        }
    };
    $(this._datagridId).jqGrid('addRow', parameters);
    newRowIndex++;
};

/**
 * 非空验证
 * @param
 * @param
 */
Button.prototype.nullvalid = function (data, item, nullfiled, notnullFiledComment) {
    var msg = "";
    $.each(data, function (i, dataitem) {
        if (dataitem[item] == "") {
            msg = notnullFiledComment[$.inArray(item, nullfiled)] + "为必填字段";
        }
    });
    return msg;
};
/**
 * 长度验证
 * @param
 * @param
 */
Button.prototype.lengthvalid = function (data, item, lengthValidFiled, lengthValidFiledComment, lengthValidFiledSize) {
    var msg = "";
    $.each(data, function (i, dataitem) {
        if (dataitem[item] != "" && dataitem[item].replace(/[^\x00-\xff]/g, "**").length > lengthValidFiledSize[$.inArray(item, lengthValidFiled)]) {
            msg = lengthValidFiledComment[$.inArray(item, lengthValidFiled)] + "的输入长度超过预设长度" + lengthValidFiledSize[$.inArray(item, lengthValidFiled)];
        }
    });
    return msg;
};

/**
 * 保存功能
 * @param form
 * @param callback
 */
Button.prototype.save = function () {
    var _self = this;
    $(this._datagridId).jqGrid('endEditCell');
    var data = $(this._datagridId).jqGrid('getRowData');
    var hasvalidate = true;
    $.each(_self.notnullFiled, function (i, item) {
        var msg = _self.nullvalid(data, item, _self.notnullFiled, _self.notnullFiledComment);
        if (msg && msg.length > 0) {
            layer.alert(msg, {
                icon: 7,
                area: ['400px', ''], //宽高
                closeBtn: 0
            });
            hasvalidate = false;
            return false;
        }
    });
    $.each(_self.lengthValidFiled, function (i, item) {
        if (hasvalidate) {
            var msg = _self.lengthvalid(data, item, _self.lengthValidFiled, _self.lengthValidFiledComment, _self.lengthValidFiledSize);
            if (msg && msg.length > 0) {
                layer.alert(msg, {
                    icon: 7,
                    area: ['400px', ''], //宽高
                    closeBtn: 0
                });
                hasvalidate = false;
                return false;
            }
        }
    });
    if (!hasvalidate) {
        return false;
    }
    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id.indexOf(newRowStart) > -1) {
                data[i].id = '';
            }
            //添加属性
            data[i].formId = _self.eformFormInfoId;

            if (data[i].isDefault == "是" && data[i].buttonCode == "customize") {
                layer.alert('不能修改默认按钮类型！', {
                    icon: 7,
                    area: ['400px', ''], //宽高
                    title: '提示',
                    closeBtn: 0
                });

                return false;
            }
            
            if (data[i].isDefault == "是"){
            	data[i].isDefault = "Y";
            }else{
            	data[i].isDefault = "N";
            }
            
            if (parent.funinfochar.length>0){
            	var funinfo = findFuninfo(data[i].actionTarget);
            	data[i].actionTarget = funinfo.key;
            }
            
        }

        avicAjax.ajax({
            url: _self.getUrl() + "saveEformButton",
            data: {
                data: JSON.stringify(data),version:_self.version,formInfoId:_self.eformFormInfoId
            },
            type: 'post',
            dataType: 'json',
            success: function (r) {
                if (r.flag == "success") {
                    _self.reLoad();
                    layer.msg('保存成功！');
                } else {
                    layer.alert('保存失败！' + r.msg, {
                        icon: 7,
                        area: ['400px', ''], //宽高
                        closeBtn: 0
                    });
                }
            }
        });
    } else {
        layer.alert('没有修改数据！', {
            icon: 7,
            area: ['400px', ''], //宽高
            title: '提示',
            closeBtn: 0
        });
    }
};

/**
 * 删除
 */
Button.prototype.del = function () {
    var id = $(this._datagridId).jqGrid('getGridParam', 'selrow');
    var _self = this;
    var ids = [];
    if (id==null) {
        layer.alert('请选择要删除的数据！', {
                icon: 7,
                area: ['400px', ''], //宽高
                closeBtn: 0,
                title: '提示'
            }
        );
    }
    else {
        var theRow = $(this._datagridId).jqGrid('getRowData', id);
        if (theRow.isDefault == "是") {
            layer.alert('不能删除默认按钮！', {
                    icon: 7,
                    area: ['400px', ''], //宽高
                    closeBtn: 0,
                    title: '提示'
                }
            );
        }
        else {
            layer.confirm('确认要删除选择的数据吗?', {
                icon: 3,
                title: "提示",
                area: ['400px', '']
            }, function (index) {
                ids.push(id);
                avicAjax.ajax({
                    url: _self.getUrl() + 'deleteEformButton',
                    data: JSON.stringify(ids),
                    contentType: 'application/json',
                    type: 'post',
                    dataType: 'json',
                    success: function (r) {
                        if (r.flag == "success") {
                            _self.reLoad();
                        } else {
                            layer.alert('删除失败！' + r.msg, {
                                icon: 7,
                                area: ['400px', ''],
                                closeBtn: 0
                            });
                        }
                    }
                });
                layer.close(index);
            });
        }
    }
};

/**
 * 重载数据
 */
Button.prototype.reLoad = function () {
    var searchdata = {
        keyWord: null,
        param: JSON.stringify(serializeObject($(this._formId)))
    };
    $(this._datagridId).jqGrid('setGridParam', {
        datatype: 'json',
        postData: searchdata
    }).trigger("reloadGrid");
};

Button.prototype.valueEdit = function(value, rowid,colname){
    var _self = this;
    if (value =="&nbsp;"){
        value = "";
    }
    var content = 'avicit/platform6/eform/common/jseditor.html';
    layer.open({
        type: 2,
        title: "",
        skin: 'layui-layer-rim',
        area: ['70%', '80%'],
        content: content,
        btn: ['确认', '取消'],
        success: function (layero, index) {
            //传入参数，并赋值给iframe的元素
            var iframeWin = layero.find('iframe')[0].contentWindow;
            iframeWin.setEditorValue(value);
        },
        yes: function (index, layero) {
            var frm = layero.find('iframe')[0].contentWindow;
            var content = frm.getEditorValue();
            if (content){
                $(_self._datagridId).jqGrid("setCell",rowid,colname,content);
            }else{
                $(_self._datagridId).jqGrid("setCell",rowid,colname,'&nbsp');
            }

            layer.close(index);
        }
    });


};



Button.prototype.selectIcon = function(){

    var content = 'static/h5/selectIcon/index.html';
    iconlayer = layer.open({
        type: 2,
        title: "",
        skin: 'layui-layer-rim',
        area: ['70%', '80%'],
        content: content
    });


};

Button.prototype.setIconInfo = function(){

}



Button.prototype.setPrintTemp = function(value, rowid,colname){
    var _self = this;
    var content = 'print/sysPrintController/selectTemplate?resourceId='+_self.eformFormInfoId;
    layer.open({
        type: 2,
        title: "选择打印模板",
        skin: 'bs-modal',
        area: ['60%', '60%'],
        content: content,
        btn: ['确认', '取消'],
        yes: function (index, layero) {
            var frm = layero.find('iframe')[0].contentWindow;
            var selected = frm.$('#sysPrintjqGrid').jqGrid('getGridParam','selrow');
            if(selected != null){
                var rowData = frm.$('#sysPrintjqGrid').jqGrid('getRowData', selected);
                var content = rowData.printTempCode;
                var url = "";
                if (content){
                    url = "platform/print/sysPrintClientController/toPrint?printId=" + selected ;
                    $(_self._datagridId).jqGrid("setCell",rowid,colname,content);
                    $(_self._datagridId).jqGrid("setCell",rowid,"buttonUrl",url);
                }
            }
            layer.close(index);
        }
    });

};