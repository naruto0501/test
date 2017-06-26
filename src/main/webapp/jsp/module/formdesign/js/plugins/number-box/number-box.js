var MyElement = {
    elecode: "number-box",
    dragElement: function () {
        return '<input type="text" value="数字型" style="width: 120px;">';
    },
    dropElement: function () {
        return '<div class="drop-item"><input type="text" class="form-control"></div>';
    },
    transferElement: function (ui) {
        return TransferDOM.toNumberBox(ui);
    },
    update: function (form, ui) {
        var attrJson = form.serializeObject();
        var obj = $(ui).find("input");

        obj.val(attrJson.colLabel);
    }
}