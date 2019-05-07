//MyElement 所添加元素必须叫做MyElement
var MyElement = {
    //元素code 必要属性
    elecode: "table-ext",
    datatype: "0",
    //属性保存按钮所调用的方法，form为当前属性表单元素，ui为当前所选元素
    update: function (form, ui) {
    	if (form.find("input:radio:checked").val() == "0"){
    		var oldsummary = ui.attr("summary");
    		var type = "0";
            var domId = ui.attr("id");
        	if (oldsummary){
        		 var old = $.parseJSON(oldsummary);
        		 if (old.datatype!="0"){
        			 type = old.datatype;
        		 }
        	}
        	if (type == "0" && this.datatype != "0"){

	    		var tablearray = editorUtil.getAllTableAttr(domId);
	        	var mainattr = tablearray["maintable"];
	            if (mainattr.hasOwnProperty("paralist")){
	            	var rs = [];
	            	$("#paraarea").empty();
	    			for (var i = 0,length=mainattr.paralist.length; i < length; i++) {
	                    var data = mainattr.paralist[i];
	                    var li = $('<li class="item-red clearfix"></li>');
	                    var coltypediv = $('<div class="col-xs-3"><i class="ace-icon fa fa-bars"></i></div>');
	                    var colLabeldiv = $('<div class="col-xs-9"></div>');
	                    colLabeldiv.append('<span class="lbl">' + data.paratypename + '</span>');
	                    li.append(coltypediv).append(colLabeldiv);
	                    $("#paraarea").append(li);
	                    rs.push(data);
	                }
	                $("#paralist").val(JSON.stringify(rs));
	    		}
        	}

    		if ( form.find("#paralist").val()=="" ){
	    		ui.removeAttr("summary");
	    		editorUtil.setTableDomAttr(EformEditor.nowDbid,"");
    		}else{
    			var json  = form.serializeObject();
            	editorUtil.setTableDomAttr(EformEditor.nowDbid,JSON.stringify(json));
    		}
    	}
    	this.datatype = form.find("input:radio:checked").val();
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
        }else if (elementType == "group"){
        	coltypediv.append('<i class="ace-icon fa fa-cubes"></i>');
        }else if (elementType == "role"){
        	coltypediv.append('<i class="ace-icon fa fa-street-view"></i>');
        }else if (elementType == "position"){
        	coltypediv.append('<i class="ace-icon fa fa-suitcase"></i>');
        }
    },
    
    initAttrForm: function (form, attrJson,ui) {
    	var _this = this;
        EformEditor.nowDbid = tableId;

        if (attrJson) {
            var json = $.parseJSON(attrJson);
          //点击表格时，设置当前存储模型id
      	
          	if (json.hasOwnProperty("dbid")){
          		if (!isEmptyObject(json.dbid)){
          			EformEditor.nowDbid = json.dbid;
          			 $("#dbname").trigger("keyup");
          		} 		
          	}
      	  
           if (json.paralist) {
               var list = $.parseJSON(json.paralist);
               for (var i = 0; i < list.length; i++) {
                   var data = list[i];
                   var li = $('<li class="item-red clearfix"></li>');
                   var coltypediv = $('<div class="col-xs-3"><i class="ace-icon fa fa-bars"></i></div>');
                   var colLabeldiv = $('<div class="col-xs-9"></div>');
                   colLabeldiv.append('<span class="lbl">' + data.paratypename + '</span>');
                   li.append(coltypediv).append(colLabeldiv);
                   $("#paraarea").append(li);
               }
           }
           
           if (json.hasOwnProperty("datatype")){
        	   this.datatype = json.datatype;
        	   if (json.datatype == "0"){
        		    $("#dbdata").css("display","none");
           			$("#dbdata").find("input").val("");
        	   }else if (json.datatype == "1"){
        		   $("#dbdata").css("display","block");
        	   }
           }else{
        	   $("input[type='radio'][name='datatype'][value='0']").attr("checked", "checked");
        	   $("#dbdata").css("display","none");
      			$("#dbdata").find("input").val("");
           }

           if (json.hasOwnProperty("isaccordion")){
          		if (json.isaccordion == "Y"){
                    $("#accordiontitlediv").show();
                    $("#activediv").show();
				}else{
                    $("#accordiontitlediv").hide();
					$("#activediv").hide();
				}
		   }

        }else{
        	$("input[type='radio'][name='datatype'][value='0']").attr("checked", "checked");
        	$("#dbdata").css("display","none");
  			$("#dbdata").find("input").val("");
            $("#accordiontitlediv").hide();
			$("#activediv").hide();
        }


        $(":checkbox[name='isaccordion']").change(function(){
            if (!$(this).is(':checked')){
            	$("#accordiontitlediv").hide();
				$("#activediv").hide();
            }else{
                $("#accordiontitlediv").show();
				$("#activediv").show();
			}
        });


        
        $(":checkbox[name='issave']").change(function(){
        	var datatype = $(":radio[name=datatype]:checked").val();
        	if (datatype == "1"){
        		if (!$(this).is(':checked')){
        			ui.find(".eleattr-span").each(function(){
                    	var text = $(this).html();
                    	var json = $.parseJSON(text);
                    	if (json.hasOwnProperty("colIsMust")){
                    		json.colIsMust = "N";
                    	}
                    	if (json.hasOwnProperty("colDropdownType")){
                    		json.colDropdownType = "Y";
                    	}
                    	$(this).html(JSON.stringify(json));
                    });
        		}
        	}
            $("#dbname").trigger("keyup");
        });

        $(":radio[name=datatype]").change(function(){
        	var datatype = this.value;
   
        	if (datatype == "0"){
        		$("#dbdata").css("display","none");
        		$("#dbdata").find("input").val("");
        		ui.find(".eleattr-span").each(function(){
                	var text = $(this).html();
                	var json = $.parseJSON(text);
                	if (json.hasOwnProperty("colName")){
                		json.colName = "";
                	}
                	if (json.hasOwnProperty("colLabel")){
                		json.colLabel = "";
                	}
                	if (json.hasOwnProperty("domId")){
                		json.domId = "";
                	}
                	$(this).html(JSON.stringify(json));
                });
                EformEditor.nowDbid = tableId;
                
        	}else if(datatype == "1"){
        		$("#dbdata").css("display","block");
        	}
        	
        	$("#paralist").val("");
            $("#paraarea").html("");
            $("#dbname").trigger("keyup");
        });

        $.validator.addMethod("checkdataname",function(value,element,params){
        	if (!isEmptyObject($("#dbname").val())){
        		if (isEmptyObject(value)){
        			return false;
        		}else{
        			return true;
        		}
        	}else{
        		return true;
        	}
        	},"字段不能为空");
        
        $.validator.addMethod("checkdb",function(value,element,params){
        	if ($(":radio[name=datatype]:checked").val() != "0"){
        		if (isEmptyObject(value)){
        			return false;
        		}else{
        			return true;
        		}
        	}else{
        		return true;
        	}
        	},"请选择存储模型");
        
        $.validator.addMethod("checkpara",function(value,element,params){
        	if ($(":radio[name=datatype]:checked").val() != "0"){
        		if (isEmptyObject(value)){
        			return false;
        		}else{
        			return true;
        		}
        	}else{
        		return true;
        	}
        	},"请配置查询参数");
        
        $.validator.addMethod("positiveinteger", function(value, element) {
        		if (value){
	        	   if((/^(\+|-)?\d+$/.test( value ))&&parseInt(value)>0){  
	        	        return true;  
	        	   }else{
	        		   return false;
	        	   }
        		}else{
        			return true;
        		}
        	  }, "请输入正整数");

		$.validator.addMethod("checkaccordiontitle",function(value,element,params){
			if ($(":checkbox[name='isaccordion']").is(':checked')){
				if (isEmptyObject(value)){
					return false;
				}else{
					return true;
				}
			}else{
				return true;
			}
		},"折叠标题不能为空");
        
        
        $('#attrform').validate({
    		errorElement: 'div',
    		errorClass: 'help-block error_block',
    		focusInvalid: false,
    		ignore: "",
    		rules:{
    			dataname:{
    				checkdataname:true
    				},
    			dbname:{
    				checkdb:true
    			},
    			paralist:{
    				checkpara:true
    			},
    			order:{
    				positiveinteger:true
    			},
				accordiontitle:{
					checkaccordiontitle:true
				}
    		},
    		highlight: function (e) {
    	        $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
    	    },

    	    success: function (e) {
    	        $(e).closest('.form-group').removeClass('has-error').addClass('has-info');
    	        $(e).remove();
    	    },

    	    errorPlacement: function (error, element) {
    	        error.insertAfter(element.parent());
    	    }
        });
        
        var selectCreatedDbTable = new SelectCreatedDbTable("dbid", "dbname");
        selectCreatedDbTable.init(function(data) {
            $("#dbname").val(data.tablename);
            $("#dataname").val(data.name);
            ui.find(".eleattr-span").each(function(){
            	var text = $(this).html();
            	var json = $.parseJSON(text);
            	if (json.hasOwnProperty("colName")){
            		json.colName = "";
            	}
            	if (json.hasOwnProperty("colLabel")){
            		json.colLabel = "";
            	}
            	if (json.hasOwnProperty("domId")){
            		json.domId = "";
            	}
            	$(this).html(JSON.stringify(json));
            });
            //选择存储模型后 设置当前选择存储id
            EformEditor.nowDbid = data.id;
            $("#paralist").val("");
            $("#paraarea").html("");
            $("#dbname").trigger("keyup");
            
        });
        $("#addpara").click(function () {
        	/*if (isEmptyObject($("#dbid").val())){
        		layer.msg('请先选择数据集！', {icon: 7});
        		return false;
        	}*/
        	publishDialog = top.layer.open({
                type: 2,
                title: '参数配置',
                skin: 'bs-modal',
                area: ['45%', '85%'],
                maxmin: false,
                content: "avicit/platform6/eform/formdesign/js/plugins/attr-jsp/selectcolumn.jsp",
                btn: ['确定', '取消'],
                yes: function(index, layero){
                	var frm = layero.find('iframe')[0].contentWindow;
                	var jsonData = [], rs = [];
                    jsonData = frm.dataJsonList;
                    $("#paraarea").html("");
                    if (jsonData.length > 0) {
                        for (var i = 0,length=jsonData.length; i < length; i++) {
                            var data = jsonData[i].data;
                            var li = $('<li class="item-red clearfix"></li>');
                            var coltypediv = $('<div class="col-xs-3"><i class="ace-icon fa fa-bars"></i></div>');
                            var colLabeldiv = $('<div class="col-xs-9"></div>');
                            colLabeldiv.append('<span class="lbl">' + data.paratypename + '</span>');
                            li.append(coltypediv).append(colLabeldiv);
                            $("#paraarea").append(li);
                            rs.push(data);
                        }
                        $("#paralist").val(JSON.stringify(rs));
						$("#dbname").trigger("keyup");
                    } else {
                    	$("#paraarea").empty();
                    	$("#paralist").val("");
						$("#dbname").trigger("keyup");
                    }
                    top.layer.close(index);
                	
                },
                no: function(index, layero){
                	layero.close(index);
                }
            });
        });
        $("#issave").val("Y");
        $("#isdelete").val("Y");
    }
}