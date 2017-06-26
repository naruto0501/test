var MyElement = {
    elecode: "check-box",
    dragElement: function () {
        return '<label><input type="checkbox">多选按钮</label>';
    },
    dropElement: function () {
        return '<div class="drop-item"><label><input type="checkbox">多选按钮</label></div>';
    },
    transferElement: function (ui) {
        return TransferDOM.toCheckBox(ui);
    },
    update: function (form, ui) {
    	var attrJson = form.serializeObject();
    	var selectValues = form.find("#selectvalues");
    	var selectOptions = form.find("#selectoptions");
    	var checkboxs = ui.find("label").parent();
    	checkboxs.empty();
    	for (var i=0;i<selectValues.find("li").length;i++){
    		var value = selectValues.find("li").eq(i).text();
    		var num = selectValues.find("li").eq(i).attr("num");
    		var option = selectOptions.find("li[num='" + num + "']").eq(0).text();
    		checkboxs.append('<label><input type="checkbox" name="'+attrJson.colName+'" id="'+attrJson.colName+num+'" value="'+value+'">'+option+'</label>&nbsp;');
    	}
    }
}