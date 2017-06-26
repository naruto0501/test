var MyElement = {
    elecode: "select-box",
    dragElement: function () {
        return '<select style="width: 120px;"><option>下拉框</option></select>';
    },
    dropElement: function () {
        return '<div class="drop-item"><select  class="form-control" onChange="this.blur();"><option>下拉框</option></select></div>';
    },
    transferElement: function (ui) {
        return TransferDOM.toSelectBox(ui);
    },
    update: function (form, ui) {
    	var selectValues = form.find("#selectvalues");
    	var selectOptions = form.find("#selectoptions");
    	var select = ui.find("select");
		select.empty();
    	for (var i=0;i<selectValues.find("li").length;i++){
    		var value = selectValues.find("li").eq(i).text();
    		var num = selectValues.find("li").eq(i).attr("num");
    		var option = selectOptions.find("li[num='" + num + "']").eq(0).text();
    		select.append('<option value="'+value+'">'+option+'</option>');
    	}
    }
}