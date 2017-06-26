var EformEditor;
var historyStorage;
var timerSave = 1000;
var stopsave = 0;
var startdrag = 0;

function EformEditor(id){
	this.editor = $("#"+id);
	this.element=[];
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
	var $modules = $('<div id="modules" style="position:fixed;width:210px;"></div>');
	var $tab = $('<ul class="nav nav-tabs" id="navtab"><li class="active"><a href="#layout" data-toggle="tab">布局</a></li><li class><a href="#domele" data-toggle="tab">元素</a></li></ul>');
	var $tabcontent = $('<div class="tab-content"></div>');
	var $domele = $('<div class="tab-pane" id="domele"></div>');
	var newScripts =[];
	for (var i=0 ;i<EformConfig.dropitems.length;i++){
		newScripts.push(EformConfig.pluginPath+"/"+EformConfig.dropitems[i]+"/"+EformConfig.dropitems[i]+".js");
	}
	 (function scriptRecurse(count, callback) {
         if (count == newScripts.length) {
         callback && callback();
         } else {
        	 var dragElement,dropElement;
        	 _this.loadScript(newScripts[count],function(){
     			var elementcontent = $('<p class="drop-item ele-item"></p>');
     			var $dragbutton = $('<span class="drag label layout-label"><i class="icon-move"></i>拖动</span>');
     			$dragbutton.appendTo(elementcontent);
     			_this.addElement(MyElement.elecode,MyElement);
     			dragElement = MyElement.dragElement();
     			dropElement = MyElement.dropElement();
     			elementcontent.append('<div class="preview">'+dragElement+"</div>");
     			var $view = $("<div></div>").addClass("view").attr("code",MyElement.elecode); 
     			$view.append('<div class="tool-top"><a class="fa fa-arrows"></a><a class="fa fa-times"></a></div>');
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
		var $dragbutton = $('<span class="drag label layout-label"><i class="icon-move"></i>拖动</span>');
		$dragbutton.appendTo($layoutItem);
		var layouts = EformConfig.layout[j];
		var layout = layouts.split(",");
		var $preview = $('<div class="preview"><input value="'+layouts+'" type="text" style="width: 120px;"></div>');
		$preview.appendTo($layoutItem);
		var $view = $('<div class="view"></div>');
		var $row= $('<div class="row-fluid clearfix"></div>');
		for (k=0;k<layout.length;k++){
			var $column = $('<div class="span'+layout[k]+' column" layout="'+layout[k]+'"></div>');
			$column.appendTo($row);
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
	editor.append('<div class="col-sm-2" style="padding: 0 5px;"><div id="attrArea" style="position:fixed;"></div></div>');
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
			for (var j=0;j<domNum;j++){
				var dom = $(column).find(".view")[j];
				var myelement = EformEditor.getElement($(dom).attr("code"));
				var obj = myelement.transferElement(dom);
				colDomArray[i][j] = obj;
			}
		}
		if (colDomArray.length>0){
			//行列转置
			var arryNew = transArray(colDomArray);
			param.push({domArray:arryNew,colArray:colArray});
		}
	}
	
	return TransferDOM.toHtml(param,minCol);//$table.prop('outerHTML');
}

EformEditor.prototype.preview = function() {
/*	var previewHtml = this.toHtml();

    $("#previewModal").find(".modal-body").html(previewHtml);
    $("#previewModal").modal("show");*/

    var dialog = new CommonJQueryUIDialog("previewDialog","1000","600", "avicit/platform6/eform/formdesign/preview.jsp","电子表单预览", null, true, false, true);
    dialog.show();
}

function transArray(arr1) {
	var arr2 = [];
	// 确定新数组有多少行
	var maxlen = 0;
	for (var ii=0;ii<arr1.length;ii++){
		if (arr1[ii].length>maxlen)
			maxlen = arr1[ii].length;
	}
	for (var i = 0; i < maxlen; i++) {
		arr2[i] = [];
	}
	// 遍历原数组
	for (var i = 0; i < arr1.length; i++) {
		for (var j = 0; j < arr1[i].length; j++) {
			if (arr1[i][j])
				arr2[j][i] = arr1[i][j];
		}
	}
	return arr2;
}

function initContainer(){
	$(".demo .column").sortable({
		connectWith: ".column",
		opacity: .35,
		update:function(e,ui){
			$(ui.item).removeAttr("style");
			if(stopsave>0) stopsave--;
			startdrag = 0;
		},
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		}
	});
	$(".demo").sortable({
		opacity: .35,
		update:function(e,ui){
			$(ui.item).removeAttr("style");
			var $el = $(ui.item);
			var $del = $('<a class="remove-layout label label-important"><i class="fa fa-times"></i>删除</a>').click(function () { $("#attrArea").html(""); $(this).parent().detach();if(stopsave>0) stopsave--;});
			if ($el.hasClass("lyrow"))
				$el.find(".layout-label").replaceWith($del);
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
				update:function(e,ui){ 
					var $el = $('<div></div>');
					var $view = $(ui.item.find(".view").prop('outerHTML'));
					var code = $view.attr("code");
					$view.click(function(){
                        var allView = $("#dropzone").find(".view");
                        for (var i = 0; i < allView.length; i++) {
                            $(allView[i]).removeClass("viewOnClick");
                        }
                        $view.addClass("viewOnClick");

						$("#attrArea").html("");
						var ele = EformEditor.getElement(code);
						EformEditor.nowElement = $el.find(".view");
						var $saveButton = $('<button class=\'btn btn-info\'>保存</button> ').click(function(){
							var json = $("#attrform").serializeObject();
							var $ele = EformEditor.nowElement;
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
					$el.append($view);
				    $(ui.item).replaceWith($el);
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
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	$('#domele').find('.ele-item').draggable({
		connectToSortable: ".column",
		helper: "clone",
		drag: function(e, t) {
			t.helper.width(400)
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
	$(ele).detach();
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
		dropzone.find(".ui-sortable-handle").removeAttr("class");
	}
	if (dropzone.find(".viewOnClick").length>0){
		dropzone.find(".viewOnClick").removeClass("viewOnClick");
	}
	var e = dropzone.html();
	if (!stopsave && e != window.demoHtml) {
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
	}
	if (data.list.length>data.count) {
		for (i=data.count;i<data.list.length;i++)
			data.list[i]=null;
	}
	data.list[data.count] = window.demoHtml;
	data.count++;
	historyStorage = data;
}

function undoLayout() {
	var data = historyStorage;
	if (data) {
		if (data.count<2) return false;
		window.demoHtml = data.list[data.count-2];
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
			data.count++;
			$('#dropzone').html(window.demoHtml);
			return true;
		}
	}
	return false;
}

function setEleEvent(){
	$("#dropzone").find(".column .view").click(function(){
		var allView = $("#dropzone").find(".view");
        for (var i = 0; i < allView.length; i++) {
            $(allView[i]).removeClass("viewOnClick");
        }
        $(this).addClass("viewOnClick");
		$("#attrArea").html("");
		var code = $(this).attr("code");
		var ele = EformEditor.getElement(code);
		EformEditor.nowElement = $(this);
		var $saveButton = $('<button class=\'btn btn-info\'>保存</button> ').click(function(){
			var json = $("#attrform").serializeObject();
			var $ele = EformEditor.nowElement;
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
	$(".demo .column").sortable({
		opacity: .35,
		connectWith: ".column",
		update:function(e,ui){ 
			var $el = $('<div></div>');
			var $view = $(ui.item.find(".view").prop('outerHTML'));
			var code = $view.attr("code");
			$view.click(function(){
				var allView = $("#dropzone").find(".view");
                for (var i = 0; i < allView.length; i++) {
                    $(allView[i]).removeClass("viewOnClick");
                }
                $view.addClass("viewOnClick");
				$("#attrArea").html("");
				var ele = EformEditor.getElement(code);
				EformEditor.nowElement = $el.find(".view");
				var $saveButton = $('<button class=\'btn btn-info\'>保存</button> ').click(function(){
					var json = $("#attrform").serializeObject();
					var $ele = EformEditor.nowElement;
					$ele.attr("eleattr",JSON.stringify(json));
					ele.update($("#attrform"),$ele);
					handleSaveLayout();
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
			$el.append($view);
		    $(ui.item).replaceWith($el);
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
	$('.label-important').click(function () { $("#attrArea").html(""); $(this).parent().detach();if(stopsave>0) stopsave--;});
}

$(document).ready(function() {
	$('#undo').click(function(){
		stopsave++;
		if (undoLayout()) {
			initContainer();
			setEleEvent();
		}
		stopsave--;
	});
	$('#redo').click(function(){
		stopsave++;
		if (redoLayout()){
			initContainer();
			setEleEvent();
		}
		stopsave--;
	});
	setInterval(function() {
		handleSaveLayout()
	}, timerSave);
});
