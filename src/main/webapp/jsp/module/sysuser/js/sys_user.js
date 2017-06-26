/**
 * 
 */

function addUser(){
	var formData = $('#formUser').serializeObject();
	$.ajax({ 
		url: 'mvc/user/insertUser.do',
		async : false,
		type: "POST",
		data : {data : JSON.stringify(formData)},
		success: function(r){
			if (r.flag === "success"){
				$.gritter.add({
                    title: '提示',
                    text: '保存成功！',
                    time: '2000',
                    class_name: 'gritter-success gritter-light'
                });
				$("#userTable").bootstrapTable('refresh');
				$("#myModal").modal('hide');		
			}
		}
	});
}

function editUser() {
	var rows = $('#userTable').bootstrapTable('getSelections');
    if (rows.length == 0) {
        alert("请选择数据！");
        return false;
    }else if (rows.length > 1) {
        alert("只能选择一条数据！");
        return false;
    }else{
       var temp = "mvc/user/toEdit/"+ rows[0].id+".do";
        $("#edit_user").modalDialog({src:temp});
    }
}