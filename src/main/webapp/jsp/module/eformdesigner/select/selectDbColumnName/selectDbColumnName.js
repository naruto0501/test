function SelectDbColumnName(tableId) {
    this.tableId = tableId;
}

SelectDbColumnName.prototype.init = function (postFunction) {
    var _this = this;

    var tableId = _this.tableId;
    var parm = "tableId=" + tableId;

    layer.open({
        type: 2,
        title: '选择列',
        skin: 'bs-modal',
        area: ['350px', '450px'],
        maxmin: false,
        content: "avicit/platform6/eform/formdesign/select/selectDbColumnName/selectDbColumnName.jsp?" + parm,
        btn : [ '确定', '关闭' ],
        yes : function(index, layero) {
            var iframeWin = layero.find('iframe')[0].contentWindow;
            var data = iframeWin.getSelectedData();

            if (data == undefined) {
                layer.alert("请选择一行数据！");
            } else {
                if (postFunction != undefined && typeof postFunction == 'function') {
                    postFunction(data);
                }

                layer.close(index);
            }
        }
    });
};