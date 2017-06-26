var EformEditor;
var historyStorage;
var timerSave = 500;
var stopsave = 0;
var startdrag = 0;
var theSelectedRowId;//点击边框按钮时，当前选择的布局id

function EformEditor(id){
	this.editor = $("#"+id);
	this.element=[];
	this.dataJsonList=[];
	EformEditor = this;
	this.addElement = function(name,ele){
		this.element.push({elename:name,ele:ele});
	};
	this.getElement = function(name){
		var _this = this;
		for(var i=0;i<_this.element.length;i++){
			var jsonobj = _this.element[i];
			if (jsonobj.elename == name){
				return jsonobj.ele;
			}
		}
	}
	this.initEformEditor(id);
}

//当前选中元素
EformEditor.prototype.nowElement={}

//初始化设计器
EformEditor.prototype.initEformEditor=function(id){
	this.drawLeftArea(this.editor);
	this.drawCenter(this.editor);
	this.drawRight(this.editor);
	setTimeout("initDrag()",1000);
} 

EformEditor.prototype.drawLeftArea = function(editor){
	var _this = this;
	var $el = $('<div class="col-sm-2" style="padding: 0 5px;"></div>');
	var $modules = $('<div id="modules"></div>');
	var $tab = $('<ul class="nav nav-tabs" id="navtab"><li class="active"><a href="#layout" data-toggle="tab">布局</a></li><li class><a href="#domele" data-toggle="tab">控件</a></li></ul>');
	var $tabcontent = $('<div class="tab-content"></div>');
	var $domele = $('<div class="tab-pane" id="domele"></div>');
	var newScripts =[];
	for (var i=0 ;i<EformConfig.dropitems.length;i++){
		newScripts.push(EformConfig.dropitems[i].name);
		for (var j=0;j<EformConfig.dropitems[i].group.length;j++){
			newScripts.push(EformConfig.pluginPath+"/"+EformConfig.dropitems[i].group[j]+"/"+EformConfig.dropitems[i].group[j]+".js");
		}
	}
	 (function scriptRecurse(count, callback) {
         if (count == newScripts.length) {
         callback && callback();
         }else if((newScripts[count]+"").indexOf(".js")<0){
        	 var elementcontent = $('<div class="domele-title"><span>'+newScripts[count]+'</span></div>');
        	 elementcontent.appendTo($domele);
        	 scriptRecurse(++count, callback);
         }else {
        	 var dragElement,dropElement;
        	 _this.loadScript(newScripts[count],function(){
     			var elementcontent = $('<p class="drop-item ele-item"></p>');
     			_this.addElement(MyElement.elecode,MyElement);
     			dragElement = MyElement.dragElement();
     			dropElement = MyElement.dropElement();
     			elementcontent.append('<div class="preview"><span>'+dragElement.name+'</span><span class="eleicon"><i class="'+dragElement.icon+'"></i></span></div>');
     			var $view = $("<div></div>").addClass("view").attr("code",MyElement.elecode);
     			var $tool = $('<div></div>').addClass("tool-top");
     			$tool.append('<a class="fa fa-arrows bigger-150 blue"></a><a class="fa fa-times bigger-150 blue"></a>');
     			$view.append($tool);
     			$view.append(dropElement);
     			elementcontent.append($view);
     			elementcontent.appendTo($domele);
     			scriptRecurse(++count, callback);
     		});
         }
         })(0);
	
	$domele.appendTo($tabcontent);
	/**************元素标签结束****************/
	
	var $layout = $('<div class="tab-pane active" id="layout"></div>');
	for (var j = 0;j<EformConfig.layout.length;j++){
		var $layoutItem = $('<div class="lyrow ui-draggable"></div>');
		var $dragbutton = $('<span class="drag"><i class="fa fa-arrows bigger-150 blue" aria-hidden="true"></i></span>');
		$dragbutton.appendTo($layoutItem);
		var layouts = EformConfig.layout[j];
		var layout = layouts.split(",");
		var $preview = $('<div class="preview"><input value="'+layouts+'" type="text" class="input-show"></div>');
		$preview.appendTo($layoutItem);
		var $view = $('<div class="view"></div>');
		var $row= $('<div class="row-fluid clearfix"></div>');
		var layouttotal=0;
		for (k=0;k<layout.length;k++){
			layouttotal += parseInt(layout[k]);
			var $column = $('<div class="span'+layout[k]+' column" layout="'+layout[k]+'"></div>');
			$column.appendTo($row);
			if (k!=(layout.length-1)){
				var $line =  $('<div class="drag-line line'+layouttotal+'" linecol="'+layouttotal+'"></div>');
				$line.appendTo($row);
			}
		}
		$row.appendTo($view);
		$view.appendTo($layoutItem);
		$layoutItem.appendTo($layout);
	}
	
	$layout.appendTo($tabcontent);
	$tab.appendTo($modules);
	$tabcontent.appendTo($modules);
	$modules.appendTo($el);
	$el.appendTo(editor);
}

EformEditor.prototype.drawCenter = function(editor){
	editor.append('<div class="col-sm-8" style="padding: 0 5px;"><div id="dropzone" class="demo"></div></div>');
}

EformEditor.prototype.drawRight = function(editor){
	editor.append('<div class="col-sm-2" style="padding: 0 5px;"><div id="attrArea"></div></div>');
}



EformEditor.prototype.loadScript = function(url,callback){
    var script =document.createElement("script");
	script.type="text/javascript";
	if(script.readyState){
		script.onreadystatchange=function(){
		  if(script.readState=="loaded"||script.readyState=="complete"){
			script.onreadystatechange=null;
			callback();
		  }
		};
	}else{
		script.onload=function(){
			callback();
		};
	}
	script.src=url;
	document.getElementsByTagName("head")[0].appendChild(script);
  }

EformEditor.prototype.getRows = function(){
	return this.editor.find(".demo").find(".lyrow");
}

EformEditor.prototype.clear = function() {
	$("#dropzone").empty();
}


EformEditor.prototype.toHtml = function(){
	var param = [];
	var minCol = 100;
	for (var l=0;l<this.editor.find(".demo").find(".lyrow").length;l++){
		var _rowthis = this.editor.find(".demo").find(".lyrow")[l];
		var colNum = $(_rowthis).find(".column").length;
		var colArray = [];
		var colDomArray = [];
        var theRowId = $(_rowthis).find(".row-fluid").attr("id");

		for (var i=0;i<colNum;i++){
			colDomArray[i]=[];
			var column = $(_rowthis).find(".column")[i];
			var domNum = $(column).find(".view").length;
			var layout = $(column).attr("layout");
			colArray[i] = layout;
			if (parseInt(layout)<minCol){
				minCol = parseInt(layout);
			}
			if (domNum == 0){
				colDomArray[i].push("empty");
			}
			var colnum = 0;
			for (var j=0;j<domNum;j++){
				var dom = $(column).find(".view")[j];
				var myelement = EformEditor.getElement($(dom).attr("code"));
				var obj = myelement.transferElement(dom);
				if (obj.rows){
					for (var rownum=0;rownum<parseInt(obj.rows);rownum++){
						if (rownum == 0){
							colDomArray[i][colnum] = obj;
						}else{
							colnum++;
							if (i != 0){
								colDomArray[i][colnum] =  "";
							}else{
								colDomArray[i][colnum] = "colempty";
							}
						}	
					}
				}else{
					colDomArray[i][colnum] = obj;
				}
				colnum++;
			}
		}
		if (colDomArray.length>0){
			//行列转置
			var arryNew = transArray(colDomArray);
			param.push({domArray:arryNew,colArray:colArray,theRowId:theRowId});
		}
	}
	
	return TransferDOM.toHtml(param,minCol);//$table.prop('outerHTML');
}

EformEditor.prototype.preview = function() {
    var dialog = new CommonJQueryUIDialog("previewDialog","1000","600", "avicit/platform6/eform/formdesign/preview.jsp","电子表单预览", null, true, false, true);
    dialog.show();
}

EformEditor.prototype.save = function() {
    var dialog = new CommonJQueryUIDialog("saveDialog","1000","600", "avicit/platform6/eform/formdesign/save.jsp","微调与保存", null, false, false, false);
    dialog.show();
}


EformEditor.prototype.putJsonData = function(id,json){
	var _this = this;
	var colName = json.colName;
	if (colName){

		for (var i=0;i<_this.dataJsonList.length;i++){
			if (_this.dataJsonList[i].colName == colName){
				alert("字段名重复，请检查！");
				return false;
			}
		}
		_this.dataJsonList.push({
			id:id,
			colName:colName,
			data:json
		})
	}
	return true;
}


EformEditor.prototype.delJsonData = function(id){
	var _this = this;
	for (var i=0;i<_this.dataJsonList.length;i++){
		if (_this.dataJsonList[i].id == id){
			_this.dataJsonList.splice(i, 1);
			break;
		}
	}
}

EformEditor.prototype.updateJsonData = function(id,json){
	var _this = this;
	var colName = json.colName;
	if (colName){
		for (var i=0;i<_this.dataJsonList.length;i++){
			if (_this.dataJsonList[i].colName == colName && _this.dataJsonList[i].id != id){
				alert("字段名重复，请检查！");
				return false;
			}
		}
		for (var j=0;j<_this.dataJsonList.length;j++){
			if (_this.dataJsonList[j].id == id){
				_this.dataJsonList[j].colName = colName;
				_this.dataJsonList[j].data = json;
				break;
			}
		}
	}
	return true;
}

EformEditor.prototype.getJsonData = function(colName){
	var _this = this;
	if (colName){
		for (var i=0;i<_this.dataJsonList.length;i++){
			if (_this.dataJsonList[i].colName == colName){
				return _this.dataJsonList[i].data;
			}
		}
	}
}


function initContainer(){
	$(".demo").sortable({
		opacity: .35,
		handle: ".drag-layout",
		update:function(e,ui){
			$(ui.item).removeAttr("style");
			var $el = $(ui.item);

			//拖动布局后自动生成ID
            $el.find(".row-fluid").attr("id", GenNonDuplicateID());

			var $del = $('<a class="remove-layout label label-important"><i class="fa fa-times"></i>&nbsp;删除</a>').click(function () { delElement($(this).parent());});
			var $drag = $('<a class="drag-layout label label-info"><i class="fa fa-arrows"></i>&nbsp;拖动</a>');
			var $edit = $('<a class="edit-layout label label-success"><i class="fa fa-columns"></i>&nbsp;边框</a>').click(function(){
                theSelectedRowId = $el.find(".row-fluid").attr("id");

				var form;
                $.ajax({
                    url: EformConfig.pluginPath + "/border.jsp",
                    async: false,
                    success: function (data) {
                        form = $(data);
                    }
                });

                $("#attrArea").html("");
				$("#attrArea").append(form);
			});

			if ($el.hasClass("lyrow"))
				$el.append($del);
				$el.append($drag);
				$el.append($edit);

            //布局拖动后，模拟点击"边框"按钮
            $el.find(".edit-layout").click();
		},
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		stop: function(e,t) {
			$(t.item).removeAttr("style");
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
}

function sortupdate(e,ui){
	var $el = $('<div></div>');
	var $view = $(ui.item.find(".view").prop('outerHTML'));
	var code = $view.attr("code");
    var ele = EformEditor.getElement(code);

    // drawBorderByAttr();

    //纯文本元素拖动后，执行后置处理函数初始化文本编辑器
    if(ele.elecode == "puretext-box") {
        ele.postScript($view);
    }

    viewEvent($view);
	$el.append($view);
    $(ui.item).replaceWith($el);
	
}

function initDrag(){
	$("#layout").find(".lyrow").draggable({
		connectToSortable: ".demo",
		helper: "clone",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width(400)
		},
		stop: function(e, t) {
			$(".demo .column").sortable({
				opacity: .35,
				connectWith: ".column",
				handle: ".fa-arrows",
				update:function(e,ui){
					sortupdate(e,ui);
				},
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				stop: function(e,t) {
					$(t.item).removeAttr("style");
					$(t.item).removeAttr("class");
					if(stopsave>0) stopsave=0;
					startdrag = 0;
				}
			});
			for (var linenum=0 ;linenum<$(".demo").find(".drag-line").length;linenum++){
				var oline = $(".demo").find(".drag-line").eq(linenum);
				moveLineEvent(oline);
			}
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	$("#layout").find(".ddd").draggable({
		connectToSortable: ".column",
		helper: "clone",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width(400)
		},
		stop: function(e, t) {
			$(".columnn").sortable({
				opacity: .35,
				connectWith: ".column",
				handle: ".fa-arrows",
				update:function(e,ui){
					//sortupdate(e,ui);
				},
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				stop: function(e,t) {
					$(t.item).removeAttr("style");
					$(t.item).removeAttr("class");
					if(stopsave>0) stopsave=0;
					startdrag = 0;
				}
			});
			for (var linenum=0 ;linenum<$(".demo").find(".drag-line").length;linenum++){
				var oline = $(".demo").find(".drag-line").eq(linenum);
				moveLineEvent(oline);
			}
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	$('#domele').find('.ele-item').draggable({
		connectToSortable: ".column,.columnn",
		helper: "clone",
		drag: function(e, t) {
			t.helper.width(200)
		},
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		stop: function() {
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	initContainer();
}

function delElement(ele){
	var views = $(ele).find(".view");
	for (var i=0;i<views.length;i++){
		var view = views.eq(i);
		if (view.attr("id")){
			EformEditor.delJsonData(view.attr("id"));
		}
	}
	$(ele).detach();
	$("#attrArea").html("");
	if(stopsave>0) stopsave--;
}

function supportstorage() {
	if (typeof window.localStorage=='object') 
		return true;
	else
		return false;		
}

function handleSaveLayout() {
	var dropzone = $("#dropzone").clone();
	if (dropzone.find(".ui-sortable-handle").length>0){
		dropzone.find(".ui-sortable-handle").removeClass("ui-sortable-handle");
	}
	if (dropzone.find(".viewOnClick").length>0){
		dropzone.find(".viewOnClick").removeClass("viewOnClick");
	}
	if (dropzone.find(".tool-top-active").length>0){
		dropzone.find(".tool-top-active").removeClass("tool-top-active").addClass("tool-top");
	}
	if (dropzone.find(".wysiwyg-toolbar").length>0){
		dropzone.find(".wysiwyg-toolbar").remove();
	}
	if (dropzone.find(".wysiwyg-editor").length>0){
		dropzone.find(".wysiwyg-editor").removeAttr("style");
	}
	if (dropzone.find(".row-fluid").length>0){
		dropzone.find(".row-fluid").css("background-color","rgb(255, 255, 255)");
	}
	var e = dropzone.html();
	if (!stopsave && e != window.demoHtml) {
		console.log(e);
		/*alert(e+"--------------"+e.length);
		if (window.demoHtml){
			console.log(window.demoHtml);
			alert(window.demoHtml+"---------------------"+window.demoHtml.length);
		}*/
		stopsave++;
		window.demoHtml = e;
		saveStorage();
		stopsave--;
	}
}

function saveStorage(){
	var data = historyStorage;
	if (!data) {
		data={};
		data.count = 0;
		data.list = [];
		data.data = [];
	}
	if (data.list.length>data.count) {
		for (i=data.count;i<data.list.length;i++){
			data.list[i]=null;
			data.data[i]=null;
		}
	}
	var jsondata = EformEditor.dataJsonList.clone();
	data.list[data.count] = window.demoHtml;
	data.data[data.count] = jsondata;
	data.count++;
	historyStorage = data;
}

function undoLayout() {
	var data = historyStorage;
	if (data) {
		if (data.count<2) return false;
		window.demoHtml = data.list[data.count-2];
		EformEditor.dataJsonList = data.data[data.count-2];
		data.count--;
		$('#dropzone').html(window.demoHtml);
		return true;
	}
	return false;
}

function redoLayout() {
	var data = historyStorage;
	if (data) {
		if (data.list[data.count]) {
			window.demoHtml = data.list[data.count];
			EformEditor.dataJsonList = data.data[data.count];
			data.count++;
			$('#dropzone').html(window.demoHtml);
			return true;
		}
	}
	return false;
}

function viewEvent(ui){
	ui.click(function(){
        var allView = $("#dropzone").find(".view");
        for (var i = 0; i < allView.length; i++) {
            $(allView[i]).removeClass("viewOnClick");
            $(allView[i]).find(".wysiwyg-toolbar").css("display", "none");
            $(allView[i]).find(".wysiwyg-editor").css("border-top", "");
        }
        $(this).addClass("viewOnClick");
        $(this).find(".wysiwyg-toolbar").css("display", "");
        $(this).find(".wysiwyg-editor").css("border-top", "none");

		$("#attrArea").html("");
        $("#dropzone .row-fluid").css("background-color", "white");

		var code = $(this).attr("code");
		var ele = EformEditor.getElement(code);

        if(ele.elecode == "puretext-box") {
            return true;
        }

		EformEditor.nowElement = $(this);
		var $saveButton = $('<button class=\'btn btn-info btn-sm\'>保存</button> ').click(function(){
			var json = $("#attrform").serializeObject();
			var $ele = EformEditor.nowElement;
			if (!$ele.attr("id")){
				var id = GenNonDuplicateID();
				if (EformEditor.putJsonData(id,json))
					$ele.attr("id",id);
				else
					return false;
			}else{
				if (!EformEditor.updateJsonData($ele.attr("id"),json))
					return false;
			}
			$ele.attr("eleattr",JSON.stringify(json));
			ele.update($("#attrform"),$ele);
		});
		var form;
        $.ajax({
            url: EformConfig.pluginPath + "/" + code + "/" + code + ".jsp",
            async: false,
            success: function (data) {
                form = $(data);
            }
        });

        for (var i = 0; i < form.length; i++) {
            if(form[i].className == "form") {
                $(form[i]).attr("id","attrform");
            }
        }
		$("#attrArea").append(form).append($saveButton);
	
		var eleattr = $(this).attr("eleattr");
		if (!isEmptyObject(eleattr)){
			$("#attrform").setform($.parseJSON(eleattr));
		}
	}).contextmenu({
		  target:'#context-menu', 
		  onItem: function(context,e) {
			  if ($(e.target).attr("id")=="delEle")
				  delElement(context.parent());
		  }
		}).hover(function(){
			stopsave++;
			$(this).find(".tool-top").find(".fa-times").click(function(){
				delElement($(this).parent().parent().parent());
				 return false;
			});
			$(this).find(".tool-top").removeClass("tool-top").addClass("tool-top-active");
			
		},function(){
			$(this).find(".tool-top-active").removeClass("tool-top-active").addClass("tool-top");
			if(stopsave>0) stopsave--;
		});
}

function setEleEvent(){
	viewEvent($("#dropzone").find(".column .view"));
	$(".demo .column").sortable({
		opacity: .35,
		connectWith: ".column",
		handle: ".fa-arrows",
		update:function(e,ui){
			sortupdate(e,ui);
		},
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		stop: function(e,t) {
			$(t.item).removeAttr("style");
			$(t.item).removeAttr("class");
			if(stopsave>0) stopsave=0;
			startdrag = 0;
		}
	});
	$('.remove-layout').click(function () { $("#attrArea").html(""); $(this).parent().detach();if(stopsave>0) stopsave--;});
	for (var linenum=0 ;linenum<$(".demo").find(".drag-line").length;linenum++){
		var oline = $(".demo").find(".drag-line").eq(linenum);
		moveLineEvent(oline);
	}

	//文本编辑框重新绑定事件
    var allToolbar = $("#dropzone").find(".wysiwyg-toolbar");
    for (var i = 0; i < allToolbar.length; i++) {
        allToolbar[i].detach();
    }

    var allEditor = $("#dropzone").find(".wysiwyg-editor");
    for (var i = 0; i < allEditor.length; i++) {
        $(allEditor[i]).ace_wysiwyg({
            toolbar: [
                'font',
                null,
                'fontSize',
                null,
                {name: 'bold', className: 'btn-info'},
                {name: 'italic', className: 'btn-info'},
                {name: 'strikethrough', className: 'btn-info'},
                {name: 'underline', className: 'btn-info'},
                null,
                {name: 'insertunorderedlist', className: 'btn-success'},
                {name: 'insertorderedlist', className: 'btn-success'},
                // {name: 'outdent', className: 'btn-purple'},
                // {name: 'indent', className: 'btn-purple'},
                null,
                {name: 'justifyleft', className: 'btn-primary'},
                {name: 'justifycenter', className: 'btn-primary'},
                {name: 'justifyright', className: 'btn-primary'},
                {name: 'justifyfull', className: 'btn-inverse'},
                // null,
                // {name: 'createLink', className: 'btn-pink'},
                // {name: 'unlink', className: 'btn-pink'},
                null,
                // {name: 'insertImage', className: 'btn-success'},
                // null,
                'foreColor',
                // null,
                // {name: 'undo', className: 'btn-grey'},
                // {name: 'redo', className: 'btn-grey'}
            ]
        }).prev().addClass('wysiwyg-style2');
    }

}

function keydown(e) {  
    if (!e){
    	var e = window.event;  
    }
    var code;
    if (e.keyCode){
    	code = e.keyCode;  
    }else if (e.which) {
    	code = e.which;  
    }
    if ((event.keyCode == 90) &&                                               
         (event.srcElement.type != "text" &&   
         event.srcElement.type != "textarea" &&   
         event.srcElement.type != "password") ) {                                           
    	event.returnvalue = false;
    	$('#undo').click();
    }else if((event.keyCode == 89) &&                                               
            (event.srcElement.type != "text" &&   
                    event.srcElement.type != "textarea" &&   
                    event.srcElement.type != "password") ){
    	event.returnvalue = false;
    	$('#redo').click();
    }
    return true;  
}

function moveLineEvent(oLine){
	oLine.mousedown(function(e){
		stopsave++;
		var _this = this;
		var prevColunm = $(_this).prev();
		var nextColunm = $(_this).next();
		var originLeft = (e || event).clientX;
		var space = $(_this).parent().width()/12;
		
		$(_this).css("background-color","red");
		 document.onmousemove = function(e) { 
		  var iT = originLeft - (e || event).clientX ;
		  if (Math.abs(iT)>space&&(space*2)>Math.abs(iT)){
			  var colprev = parseInt(prevColunm.attr("layout"));
			  var colnext = parseInt(nextColunm.attr("layout"));
			  var linecol = parseInt($(_this).attr("linecol"));
			  originLeft = (e || event).clientX;
			  if (iT>0){
				  prevColunm.removeClass();
				  prevColunm.addClass("span"+(colprev-1)+" column ui-sortable");
				  prevColunm.attr("layout",(colprev-1));
				  nextColunm.removeClass();
				  nextColunm.addClass("span"+(colnext+1)+" column ui-sortable");
				  nextColunm.attr("layout",(colnext+1));
				  $(_this).removeClass();
				  $(_this).addClass("drag-line line"+(linecol-1));
				  $(_this).attr("linecol",(linecol-1));
			  }else{
				  prevColunm.removeClass();
				  prevColunm.addClass("span"+(colprev+1)+" column ui-sortable");
				  prevColunm.attr("layout",(colprev+1));
				  nextColunm.removeClass();
				  nextColunm.addClass("span"+(colnext-1)+" column ui-sortable");
				  nextColunm.attr("layout",(colnext-1));
				  $(_this).removeClass();
				  $(_this).addClass("drag-line line"+(linecol+1));
				  $(_this).attr("linecol",(linecol+1));
			  }
		  }
		  return false
		 }; 
		 document.onmouseup = function() {
		  document.onmousemove = null;
		  document.onmouseup = null; 
		  $(_this).css("background-color","");
		  oLine.releaseCapture && oLine.releaseCapture();
		  if(stopsave>0) stopsave--;
		 };
		 oLine.setCapture && oLine.setCapture();
		 return false
	});
}

$(document).ready(function() {
	$('#undo').click(function(){
		stopsave++;
		$("#attrArea").html("");
		if (undoLayout()) {
			initContainer();
			setEleEvent();
		}
		stopsave--;
	});
	$('#redo').click(function(){
		stopsave++;
		$("#attrArea").html("");
		if (redoLayout()){
			initContainer();
			setEleEvent();
		}
		stopsave--;
	});
	document.onkeydown = keydown;
	
	setInterval(function() {
		handleSaveLayout()
	}, timerSave);
});
