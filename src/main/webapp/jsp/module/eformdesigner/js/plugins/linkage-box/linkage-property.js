$(function(){

    initForm();
    jqgridInit();

    $('#jslist_insert').bind('click', function() {
        insert();
    });

    $("#jslist_del").bind('click',function(){
        del();
    });
});

var linkageProperty = {
    mydata : [
    ],
    dataGridColModel:[
        {
            label:'目标字段',
            name:'linkageColumnid',
            width : 50,
            hidden:true
        },
        {
            label:'目标字段',
            name:'linkageColumnLabel',
            width : 50
        },
        {
            label:'目标字段值',
            name:'targetValue',
            width : 50
        },
        {
            label:'结果类型',
            name:'linkageResultType',
            width : 50,
            hidden:true
        },
        {
            label:'结果类型',
            name:'linkageResultTypeName',
            width : 50
        },
        {
            label:'结果取值',
            name:'linkageResult',
            width : 50
        },
        {
            label:'通用代码或SQL',
            name:'SysLookupTypeOrSQL',
            width : 50,
            hidden:true
        },
        {
            label:'通用代码名称',
            name:'SysLookupTypeName',
            width : 50,
            hidden:true
        }
    ]
};

function jqgridInit(){


    jQuery("#propertytable").jqGrid(
        {

            datatype: "local",
            data:linkageProperty.mydata,
            toolbar: [false,'top'],//启用toolbar
            colModel: linkageProperty.dataGridColModel,//表格列的属性
            height:$(window).height() - 200,//初始化表格高度
            scrollOffset: 20, //设置垂直滚动条宽度
            altRows:true,//斑马线
            rowNum:10000,
            styleUI : 'Bootstrap', //Bootstrap风格
            viewrecords: true, //是否要显示总记录数
            multiselect: true,//可多选
            autowidth: true,//列宽度自适应
            responsive:true,//开启自适应
            cellsubmit: 'clientArray',
            onCellSelect:function (rowid,iCol,cellcontent,e) {
            	 var data = $("#"+rowid +">td"); //获取这个行里所有的td元素，即：获取所有子元素
                 var sysLookupTypeOrSQL = data[7].innerHTML;
                 var sysLookupTypeName = data[8].innerHTML;
                 
                if (iCol == 3){
                    valueEdit(cellcontent,rowid,"targetValue");
                }
                if (iCol == 6){
                    valueEdit(cellcontent,rowid,"linkageResult",sysLookupTypeOrSQL,$("#linkageResultType").val(),sysLookupTypeName);
                }
            }
        });

    $('#propertytable').validateJqGrid("addValidate","targetValue","required");
    $('#propertytable').validateJqGrid("addValidate","linkageResult","required");

}
var newRowIndex = 0;
var newRowStart = "new_row";
function insert(){
    $("#propertytable").jqGrid('endEditCell');
    var newRowId = newRowStart + newRowIndex;
    var parameters = {
        rowID : newRowId,
        initdata : {
            linkageColumnid:$("#linkageColumnid").val(),
            linkageColumnLabel:$("#linkageColumnid option:selected").text(),
            linkageResultType:$("#linkageResultType").val(),
            linkageResultTypeName:$("#linkageResultType option:selected").text()
        },
        position :"first",
        useDefValues : true,
        useFormatter : true,
        addRowParams : {extraparam:{}}
    };
    $("#propertytable").jqGrid('addRow', parameters);
    newRowIndex++;
}
function del(){
    $("#propertytable").jqGrid('endEditCell');
    var rows = $("#propertytable").jqGrid('getGridParam','selarrrow');
    var ids = [];
    var l =rows.length;
    if(l>0){
        layer.confirm('确定要删除该数据吗？',{icon:2,title:"请确认：",area:['400px','']},function(index){
            for(var i=0;i<l;i++){
                $("#propertytable").jqGrid('delRowData',rows[i]);
            }
            layer.close(index);
        });
    }else{
        layer.alert('请选择要删除的记录！', {
                icon: 7,
                area: ['400px', ''], //宽高
                closeBtn: 0
            }
        );
    }
    $("#propertytable").trigger("reloadGrid");
}
function initForm(){
    var jsondata = $('#linkagePara', window.parent.document).val();
    var linkageResultType = $('#linkageResultType', window.parent.document).val();
    var linkageColumnid = $('#linkageColumnid', window.parent.document).val();
    var linkageImpl = $('#linkageImpl', window.parent.document).val();
    
    if (jsondata){
        var data = $.parseJSON(jsondata);
        linkageProperty.mydata = data;
    }

    var doms = parent.editorUtil.getTableDbDomAttr();
    var count = 0;
    for (var dom in doms){
        if (dom != "clone"){
            var id = doms[dom].domId||doms[dom].colName;
            if (count == 0) {
                $("#linkageColumnid").append("<option value=\"" + id + "\" selected>" + doms[dom].colLabel + "</option>");
            }else{
                $("#linkageColumnid").append("<option value=\"" + id + "\">" + doms[dom].colLabel + "</option>");
            }
            count++;
        }

    }

    if (linkageResultType){
        $("#linkageResultType").val(linkageResultType);
    }
    
    if(linkageProperty.mydata.length == 0){
    	 linkageProperty.mydata = setGrid(doms,$("#linkageColumnid").val(),linkageResultType);
    	 $("#propertytable").jqGrid('setGridParam',{
             datatype:'local',
             data: linkageProperty.mydata
          }).trigger("reloadGrid");
    }
    
    if (linkageColumnid){
        $("#linkageColumnid").val(linkageColumnid);
    }
    if (linkageImpl){
        $("#linkageImpl").val(linkageImpl);
        $("#tabletr").css("display","none");
		$("#impltr").css("display","table-row");
		$("#IsCustom").prop("checked","checked");
    }

    $("#linkageColumnid").change(function(){
        /*linkageProperty.mydata = $("#propertytable").jqGrid("getRowData");
        var value = $("#linkageColumnid").val();
        var text = $("#linkageColumnid option:selected").text();
        for ( var i = 0; i < linkageProperty.mydata.length; i++){
            linkageProperty.mydata[i].linkageColumnid = value;
            linkageProperty.mydata[i].linkageColumnLabel = text;
        }*/
            	 
        linkageProperty.mydata = setGrid(doms,$("#linkageColumnid").val(),linkageResultType);
    	$("#propertytable").jqGrid("clearGridData");
        $("#propertytable").jqGrid('setGridParam',{
           datatype:'local',
           data: linkageProperty.mydata
        }).trigger("reloadGrid");

    });

    $("#linkageResultType").change(function(){
        linkageProperty.mydata = $("#propertytable").jqGrid("getRowData");
        var value = $("#linkageResultType").val();
        var text = $("#linkageResultType option:selected").text();
        for ( var i = 0; i < linkageProperty.mydata.length; i++){
            linkageProperty.mydata[i].linkageResultType = value;
            linkageProperty.mydata[i].linkageResultTypeName = text;
        }
        $("#propertytable").jqGrid('setGridParam',{
            datatype:'local',
            data: linkageProperty.mydata
        }).trigger("reloadGrid");

    });
    
    $("#IsCustom").change(function(){
    	if(this.checked){ 
    		$("#tabletr").css("display","none");
    		$("#impltr").css("display","table-row");
    	}else{
    		$("#tabletr").css("display","table-row");
    		$("#impltr").css("display","none");
    		$(window).resize();
    	}
    });

}

function setGrid(doms,linkageColumnid,linkageResultType){
    var da = new Array();
	for (var dom in doms){
        var id = doms[dom].domId||doms[dom].colName;
        if (dom != "clone" && linkageColumnid ==  id
        		&& (doms[dom].domType == "select-box" 
        			|| doms[dom].domType == "radio-box" 
        				|| doms[dom].domType == "check-box")){
        	var temp = doms[dom].selectedvalues.split(",");
        	for(var i=0; i<temp.length ; i++){
        		if(temp[i] != "" && temp[i] != null){
	        		var d = {linkageColumnLabel : doms[dom].colLabel,
			          			  linkageColumnid : id,
			          			  linkageResult : "",
			          			  linkageResultType : linkageResultType,
			          			  linkageResultTypeName : $("#linkageResultType").find("option:selected").text(),
			          			  targetValue : temp[i]
	          					};
	        		da.push(d);
        		}
        	}
        }
    }
    return da;
}

function commitForm(){
    var obj = {};

    var check = document.getElementById("IsCustom");
    if (check.checked){
    	obj.linkageImpl = $("#linkageImpl").val();
    	if(obj.linkageImpl != null && obj.linkageImpl != ""){
        	$("#propertytable").jqGrid("clearGridData");
    	}
    }else{
    	obj.linkageImpl = "";
        if (!$('#propertytable').validateJqGrid("validate")){
            return false;
        }
    }
    
    obj.linkageColumnid = $("#linkageColumnid").val();
    obj.linkageResultType = $("#linkageResultType").val();
    obj.datagridData = $("#propertytable").jqGrid("getRowData");
    return obj;
}

function valueEdit(value, rowid,colname,sysLookupTypeOrSQL,linkageResultType,sysLookupTypeName) {
    if (value =="&nbsp;"){
        value = "";
    }
    var content = "";
    var radio = "";
    if (colname == "linkageResult"){
    	if(linkageResultType == '2'){//字符串
        	content = '<textarea id="eventEditTextarea" style="width: 100%; height: 70%;">' + value + '</textarea><script type="text/javascript">$("#eventEditTextarea").focus()</script><br><ul><font style="font-weight: 700">说明:</font></ul><ul>使用字符串，输入对应的文本内容.</ul>';
    	}else{//列表
	    	if(sysLookupTypeOrSQL != 2){//通用代码
	    		radio = '<br>&nbsp;&nbsp;&nbsp;<label class="radio-inline"> <input type="radio" id="SYS_LOOKUP_TYPE" name="SYS_LOOKUP_TYPE_OR_SQL" title="SYS_LOOKUP_TYPE_OR_SQL" value="1" checked="true" />通用代码 </label>' +
						   	'<label class="radio-inline"> <input type="radio" id="SQL" name="SYS_LOOKUP_TYPE_OR_SQL" title="SYS_LOOKUP_TYPE_OR_SQL" value="2" />SQL </label><br>';
				    		
	    	}else if(sysLookupTypeOrSQL == 2){//SQL
				radio = '<br>&nbsp;&nbsp;&nbsp;<label class="radio-inline"> <input type="radio" id="SYS_LOOKUP_TYPE" name="SYS_LOOKUP_TYPE_OR_SQL" title="SYS_LOOKUP_TYPE_OR_SQL" value="1" />通用代码 </label>' +
	    					'<label class="radio-inline"> <input type="radio" id="SQL" name="SYS_LOOKUP_TYPE_OR_SQL" title="SYS_LOOKUP_TYPE_OR_SQL" value="2" checked="true"/>SQL </label><br>';
	
	    	}
	    	content = '<script>$(function(){' +
	    						'$("#jslist_checK").bind("click",function(){' +
	    				        	'check();' +
	    						'});' +
								'$("#selectLook").select2({' +
										'placeholder:"--请选择--",' +
										'ajax: {' +
							                'url: "console/lookup/operation/getSysLookupTypes.json",' +
							                'dataType: "json",' +
							                'delay: 250,' +
							    			'type : "post",' +
							                'data: function (params) {' +
							                	'var temp = {'+
							                		'lookupType : encodeURI(params.toUpperCase()),' +
							                		'lookupTypeName : encodeURI(params.toUpperCase())};' +
							                    'return {' +
							                        'keyWord: JSON.stringify(temp)' +
							                    '};' +
							                '},' +
							                'processResults: function (datas, params) {' +
								                'var dataList = ['+
								                	'{ id: "", text: "--请选择--"}'+
								                '];'+
					    	                   	'$.each(datas.rows,function(index,value){' +
						    	                   	'var temp = new Object();' +
					    	                        'temp.id = value.lookupType;' + 
					    	                        'temp.text = value.lookupTypeName;' + 
					    	                   		'dataList.push(temp)' +
					    	                   	'});' +
							                    'return {' +
							                        'results: dataList' +
							                    '};' +
							                '},' +
							                'cache: false' +
							            '}' + 
									'});' +
								'var chec = $("input[name=\'SYS_LOOKUP_TYPE_OR_SQL\'][checked]").val(); ' +
								'if(chec == 1){' +//通用代码
					            	'$("#SQL_DIV").hide();' +
					            '}else if(chec == 2){' + //sql
									'$("#SELECT_DIV").hide();' + 
								'}' +
								'$("#SYS_LOOKUP_TYPE").change(function() {' +
									'$("#SQL_DIV").hide();' + 
									'$("#SELECT_DIV").show();' + 
								'});' + 
								
								'$("#SQL").change(function() {' +
									'$("#SQL_DIV").show();' +
									/*'if($(\'#selectLook\').select2(\'data\') != null && $(\'#selectLook\').select2(\'data\').text != null && $(\'#selectLook\').select2(\'data\').text != ""){' +
										'$("#eventEditTextarea").val("");' +
									'}' +*/ 
									'$("#eventEditTextarea").focus();' +
									'$("#SELECT_DIV").hide();' + 
								'});' + 
								'if(chec == 2){' +//sql
									'$("#eventEditTextarea").val("' + value + '")' +
								'}' +
								'if("' + value + '" != null && "' + value + '" != "" && chec == 1){' +//通用代码
									'$("#selectLook").select2("data",{"id":"' + value + '","text":"' + sysLookupTypeName + '"});' +
								'}' +
							'});' +
							'function check(){' +
							    '$("#propertytable").jqGrid("endEditCell");' +
						        'var queryStatement = $("#eventEditTextarea").val();' +
						        'if(queryStatement != null || queryStatement != ""){' +
						        	'$.ajax({' +
							        	'url : "platform/eform/linkage/getLinkageValue",' +
							            'async:false,' +
							            'dataType: "json",' +
							            'data : {' +
							                'pageParams : JSON.stringify({}),' +
							                'value : "",' +
							                'linkageResult : queryStatement' +
							            '},' +
							            'type : "POST",' +
						    			'success : function(result) {' +
							    			  'if (result.error){' +
							    	                'layer.alert(result.error, {' +
							    	                    'icon: 7,' +
							    	                    'area: ["400px", ""],' +
							    	                    'closeBtn: 0' +
							    	                '});' +
							    	            '}else{' +
								    	            'layer.alert("查询语句通过校验！", {' +
						    			         '       icon: 7,' +
						    			        '        area: ["400px", ""],' +
						    			       '         closeBtn: 0' +
						    			      '      }' +
						    			      '   );' +
						    			     '	}' +
						    		'	}' +
						    		'});' +
						        '}' +
						    '}' +
						'</script>' + 
						radio +
						'<br><div id="SELECT_DIV" style="width: 100%; height:15%;">' + 
			    	    '&nbsp;&nbsp;&nbsp;<span>通用代码：</span><input id="selectLook" class="js-example-basic-single" style="height: 60%; width: 50%;">' + 
			            '</input>' + 
			            '<br><br><ul><font style="font-weight: 700">说明:</font></ul><ul>&nbsp;&nbsp;选择通用代码。如：使用“用户类型[USER_TYPE]通用代码”,</ul><ul>则在控件中显示“用户类型”通用代码名称“实体用户/虚拟用户”.</ul>' +
			    		'</div>' +
			    		'<div id = "SQL_DIV" style="width: 100%; height: 50%;"><textarea id="eventEditTextarea" style="width: 100%; height: 100%;"></textarea>' + 
						'&nbsp;<a id="jslist_checK" href="javascript:void(0)"' + 
	                    	'class="btn btn-primary form-tool-btn btn-sm" role="button"' +
		                       'title="检测SQL"><i class="fa fa-check"></i> 检测SQL</a>' +
					    '<script type="text/javascript">$("#eventEditTextarea").focus()</script><ul><font style="font-weight: 700">说明:</font></ul><ul>选择sql，只支持select查询语句.</ul><ul><li>只能包含两个字段，并且需要以key和value进行命名。如：SELECT t.id AS KEY, t.name AS VALUE FROM Sys_User t;</li></ul><ul><li>支持where参数，参数为电子表单自定义参数pageParams,如：SELECT t.id AS KEY, t.name AS VALUE FROM Sys_User t where t.id = #{pageParams.session.user.id}</li></ul>' +
	                    '</div>';	
	    	}
    	}else{
    	content = '<textarea id="eventEditTextarea" style="width: 100%; height: 98%;">' + value + '</textarea><script type="text/javascript">$("#eventEditTextarea").focus()</script>';
    }
    layer.open({
        type: 1,
        title: "请输入",
        skin: 'layui-layer-rim',
        area: ['70%', '80%'],
        content: content,
        btn: ['确认', '取消'],
        yes: function (index) {
            $("#propertytable").jqGrid("setCell",rowid,"SysLookupTypeOrSQL",$('input:radio:checked').val());

            if ($("#eventEditTextarea").val() || $("#selectLook").val()){
            	if($('input:radio:checked').val() == 1){//通用代码
            		if($("#selectLook").val() == null || $("#selectLook").val() == ""){
                        layer.msg('请选择通用代码！', {icon: 2});
            			return;
            		}
            		$("#propertytable").jqGrid("setCell",rowid,colname,$("#selectLook").val());
                    $("#propertytable").jqGrid("setCell",rowid,"SysLookupTypeName",$('#selectLook').select2('data').text);
            	}else if($('input:radio:checked').val() == 2){//sql
            		if($("#eventEditTextarea").val() == null || $("#eventEditTextarea").val() == ""){
                        layer.msg('请填写SQL语句！', {icon: 2});
            			return;
            		}
                    $("#propertytable").jqGrid("setCell",rowid,colname,$("#eventEditTextarea").val());
            	}else{//字符串
                    $("#propertytable").jqGrid("setCell",rowid,colname,$("#eventEditTextarea").val());
            	}
            }else{
                $("#propertytable").jqGrid("setCell",rowid,colname,'&nbsp');
            }

            layer.close(index);
        }
    });
}

function setSubGrid(doms,linkageColumnid,linkageResultType){
    var da = new Array();
	for (var dom in doms){

        if (dom != "clone" && linkageColumnid ==  doms[dom].data.colName
        		&& doms[dom].data.elementType == "select"){
            var id = doms[dom].data.colName;
        	var temp = doms[dom].data.selectedvalues.split(",");
        	for(var i=0; i<temp.length ; i++){
        		if(temp[i] != "" && temp[i] != null){
	        		var d = {linkageColumnLabel : doms[dom].data.colLabel,
			          			  linkageColumnid : id,
			          			  linkageResult : "",
			          			  linkageResultType : linkageResultType,
			          			  linkageResultTypeName : $("#linkageResultType").find("option:selected").text(),
			          			  targetValue : temp[i]
	          					};
	        		da.push(d);
        		}
        	}
        }
    }
    return da;
}

function initFormByParam(linkageColumnid,linkageResultType,linkageImpl,linkagePara,doms){
	var jsondata = linkagePara;
    var linkageResultType = linkageResultType;
    var linkageColumnid = linkageColumnid;
    var linkageImpl = linkageImpl;

    var dataRow;
    if (jsondata){
        dataRow = $.parseJSON(jsondata);
        linkageProperty.mydata = dataRow;
    }

    $("#linkageColumnid").empty();
    var count = 0;
    for (var dom in doms){
        if (dom != "clone"){
            var id = doms[dom].data.colName;
            if (count == 0) {
                $("#linkageColumnid").append("<option value=\"" + id + "\" selected>" + doms[dom].data.colLabel + "</option>");
            }else{
                $("#linkageColumnid").append("<option value=\"" + id + "\">" + doms[dom].data.colLabel + "</option>");
            }
            count++;
        }

    }

    if (linkageResultType){
        $("#linkageResultType").val(linkageResultType);
    }
    
    if (linkageColumnid){
        $("#linkageColumnid").val(linkageColumnid);
    }
    if(linkageProperty.mydata.length == 0){
      	linkageProperty.mydata = setSubGrid(doms,$("#linkageColumnid").val(),linkageResultType);
      	$("#propertytable").jqGrid('setGridParam',{
            datatype:'local',
            data: linkageProperty.mydata
        }).trigger("reloadGrid");
     }
    
    if (linkageImpl){
        $("#linkageImpl").val(linkageImpl);
        $("#tabletr").css("display","none");
		$("#impltr").css("display","table-row");
		$("#IsCustom").prop("checked","checked");
    }

    $("#linkageColumnid").change(function(){
        /*linkageProperty.mydata = $("#propertytable").jqGrid("getRowData");
        var value = $("#linkageColumnid").val();
        var text = $("#linkageColumnid option:selected").text();
        for ( var i = 0; i < linkageProperty.mydata.length; i++){
            linkageProperty.mydata[i].linkageColumnid = value;
            linkageProperty.mydata[i].linkageColumnLabel = text;
        }*/
    	linkageProperty.mydata = setSubGrid(doms,$("#linkageColumnid").val(),linkageResultType);
    	$("#propertytable").jqGrid("clearGridData");

        $("#propertytable").jqGrid('setGridParam',{
           datatype:'local',
           data: linkageProperty.mydata
        }).trigger("reloadGrid");

    });

    $("#linkageResultType").change(function(){
        linkageProperty.mydata = $("#propertytable").jqGrid("getRowData");
        var value = $("#linkageResultType").val();
        var text = $("#linkageResultType option:selected").text();
        for ( var i = 0; i < linkageProperty.mydata.length; i++){
            linkageProperty.mydata[i].linkageResultType = value;
            linkageProperty.mydata[i].linkageResultTypeName = text;
        }
        $("#propertytable").jqGrid('setGridParam',{
            datatype:'local',
            data: linkageProperty.mydata
        }).trigger("reloadGrid");

    });

    $("#IsCustom").change(function(){
    	if(this.checked){
    		$("#tabletr").css("display","none");
    		$("#impltr").css("display","table-row");
    	}else{
    		$("#tabletr").css("display","table-row");
    		$("#impltr").css("display","none");
    		$(window).resize();
    	}
    });
    //
    if(dataRow != "" && dataRow != undefined){
        $('#propertytable').jqGrid("clearGridData");
    	for (var i = 0; i < dataRow.length; i++) {
    		$("#propertytable").jqGrid('endEditCell');
			var newRowId = newRowStart + newRowIndex;
    		var parameters = {
       	 	rowID : newRowId,
        	initdata : dataRow[i],
        	position :"first",
        	useDefValues : true,
        	useFormatter : true,
        	addRowParams : {extraparam:{}}
   	 		};
    		$("#propertytable").jqGrid('addRow', parameters);
    		newRowIndex++;
    	}

    }

}