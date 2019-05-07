<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ page import="avicit.platform6.commons.utils.ViewUtil" %>
<%
    String importlibs = "common,table,form";
%>
<!DOCTYPE html>
<html>
<head>
    <title>表单自定义按钮管理</title>
    <base href="<%=ViewUtil.getRequestPath(request)%>">
    <jsp:include page="/avicit/platform6/h5component/common/h5uiinclude-css.jsp">
        <jsp:param value="<%=importlibs%>" name="importlibs"/>
    </jsp:include>
    <style>
        .norecords {
            border-width: 2px !important;
            display:none;
            font-weight: bold;
            left: 45%;
            margin: 5px;
            padding: 6px;
            position: absolute;
            text-align: center;
            top: 45%;
            width: auto;
            z-index: 102;
        }
    </style>
</head>

<body>
<div id="tableToolbar" class="toolbar">
    <div class="toolbar-left">
        <a id="button_insert" href="javascript:void(0)"
           class="btn btn-primary form-tool-btn btn-sm" role="button"
           title="添加"><i class="icon icon-add"></i> 添加</a>

        <a id="button_del" href="javascript:void(0)"
           class="btn btn-primary form-tool-btn btn-sm" role="button"
           title="删除"><i class="icon icon-delete"></i> 删除</a>

        <a id="button_save" href="javascript:void(0)"
           class="btn btn-primary form-tool-btn btn-sm" role="button"
           title="保存"><i class="icon icon-save"></i> 保存</a>
    </div>
</div>
<table id="buttonGrid"></table>
</body>

<jsp:include page="/avicit/platform6/h5component/common/h5uiinclude-js.jsp">
    <jsp:param value="<%=importlibs%>" name="importlibs"/>
</jsp:include>
<script src="avicit/platform6/eform/formdesign/button/button.js"></script>
<script type="text/javascript">
    var button,fundrop={};
    var funinfoArray;
    var iconlayer;
    var dataGridColModel = [
            {
                 label: 'id',
                  name: 'id',
                    width: 75,
                    key: true,
                    hidden: true
                },
                {
                    label: '类型',
                    name: 'buttonType',
                    width: 100,
                    editable: true,
                    edittype: "select",
                    editoptions: {
                        value: {"customize": "自定义", "insert": "新增", "update": "更新","print":"打印"},
                        dataEvents: [
                            {
                                type: 'change',
                                fn: function (e) {
                                    var value = $(this).val();
                                    var isDefault = "N";
                                    if (value == "update" || value == "insert" || value == "print") {
                                        isDefault = "Y";
                                    }
                                    var rowid = $(e.target).closest("tr").attr("id");//通过事件获得行ID
                                    $("#buttonGrid").jqGrid('setCell', rowid, 'isDefault', isDefault);
                                    $("#buttonGrid").jqGrid('setCell', rowid, 'buttonCode', $(this).val());
                                    var eventClass = $("#buttonGrid").jqGrid('getCell', rowid, 'eventClass');
                                    if (value === "print" && (eventClass === null || eventClass.length ===0)){
                                        <%--打印按钮的信息体现在 eventClass 与 buttonUrl 两列，两者要保持一致--%>
                                        var url = "platform/eform/bpmsCRUDClient/toPrint?formInfoId=" + parent.formEditor.eformFormInfoId;
                                        $("#buttonGrid").jqGrid("setCell",rowid,"buttonUrl",url);
                                    }
                                }
                            }

                        ]
                    }
                },
                {
                    //label: '代码',
                    label: '编码',
                    name: 'buttonCode',
                    width: 150
                },
                {
                    label: '名称',
                    name: 'buttonName',
                    width: 150,
                    editable: true,
                    edittype: 'text'
                },{
            label: '图标',
            name: 'buttonIcon',
            width: 150,
            editable: true,
            edittype: 'text'
        },
                {
                    label: '顺序',
                    name: 'buttonOrder',
                    width: 50,
                    editable: true,
                    edittype: 'text'
                },
                {
                    label: '是否默认',
                    name: 'isDefault',
                    width: 50,
                    formatter : function (cellvalue, options, rowObject) {
                        if(cellvalue == "Y"){
                            return "是";
                        }else{
                            return "否";
                        }
                    }
                },
                {
                    label: '前置js',
                    name: 'preJs',
                    width: 150,
                    editable: true,
                    edittype: 'text'
                }, {
                    label: '后置js',
                    name: 'postJs',
                    width: 150,
                    editable: true,
                    edittype: 'text'
                }, {
                    label: 'java处理类/打印模板',
                    name: 'eventClass',
                    width: 150,
                    editable: true,
                    edittype: 'text'
                }, {
                    label:'按钮地址',
                    name: 'buttonUrl',
                    width: 75,
                    editable: true,
                    hidden: true
                }];

    function findFuninfo(value){
    	if (!value){
    		return null;
    	}
    	for (var i=0;i<funinfoArray.length;i++){
	    	var info = funinfoArray[i];
	    	var key = info.key.split("(");
	    	if (key[0] == value){
	    		return info;
	    	}
	    }
    	return null;
    }

    function setIconInfo(data){
        $("#buttonGrid").jqGrid("setCell",button._clickrowid,'buttonIcon',data.icon);
        layer.close(iconlayer);
    }
    
    if (parent.funinfochar.length>0){
	    funinfoArray = $.parseJSON(parent.funinfochar);
	 //   funinfoArray.push({key:"请选择",value:""});
	    for (var i=0;i<funinfoArray.length;i++){
	    	var info = funinfoArray[i];
	    	var key = info.key.split("(");
	    	eval("fundrop."+key[0]+"='"+key[0]+"'");
	    }
	    dataGridColModel.push( {
	        label: '目标方法',
	        name: 'actionTarget',
	        width: 100,
	        editable: true,
	        edittype: "select",
	        editoptions: {
	            value: fundrop,
	            dataEvents: [
	                         {type: 'change',
	                          fn: function(e) {
	                        	  var value = $(this).val();
	                          var rowid=$(e.target).closest("tr").attr("id");//通过事件获得行ID
	                          var info = findFuninfo(value);
	                          if (info){
	                          $("#buttonGrid").jqGrid('setCell', rowid, 'buttonUrl', info.value);
	                          }else{
	                        	  $("#buttonGrid").jqGrid('setCell', rowid, 'buttonUrl', '');
	                          }
	                                 }}
	       
	                 ]
	        }
	    },{
	        label: 'url',
	        name: 'buttonUrl',
	        width: 150
	    });
	}
   
    		
            button = new Button('buttonGrid', 'eform/bpmsCRUDClient/', '', '', '', '', dataGridColModel, parent.formEditor.eformFormInfoId,parent.version);

            //添加按钮绑定事件
            $('#button_insert').bind('click', function () {
                button.insert();
            });
            //删除按钮绑定事件
            $('#button_del').bind('click', function () {
                button.del();
            });
            //保存按钮绑定事件
            $('#button_save').bind('click', function () {
                button.save();
            });

</script>
</html>