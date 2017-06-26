//MyElement 所添加元素必须叫做MyElement
var MyElement = {
    //元素code 必要属性
    elecode: "text-box",
    //拖动区域用所显示的元素样式
    dragElement: function () {
        return '<input type="text" value="字符串" style="width: 120px;">';
    },
    //设计区域中所显示的的元素样式
    dropElement: function () {
        return '<div class="drop-item form-inline"><label style="width:15%;">文本框：</label><input type="text" class="form-control" style="width:85%"></div>';
    },
    //转换元素样式，ui为当前所选元素
    transferElement: function (ui) {
        return TransferDOM.toTextBox(ui);
    },
    //属性保存按钮所调用的方法，form为当前属性表单元素，ui为当前所选元素
    update: function (form, ui) {
        var attrJson = form.serializeObject();
        var obj = $(ui).find("input");
        $(ui).find("label").text(attrJson.colLabel+"：");
    }
}