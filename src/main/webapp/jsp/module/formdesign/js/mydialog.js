(function($){
	/**
	 * 
	 */
/*	$.fn.modalDialog = function(obj) {
		var modalId = $(this).attr("data-target").replace("#","");
		if ($("#"+modalId)){
			$("#"+modalId).remove();
		}
		var type = $(this).attr("data-toggle");
		if (type === "modal"){
			var modalDiv = $('<div/>').addClass("modal fade")
						.attr("id",modalId).attr("tabindex","-1").attr("role","dialog").attr("aria-hidden","true");
			var modalDialog = $('<div/>').addClass("modal-dialog");

			if (typeof(obj.width) === 'string'){
				modalDialog.css("width",obj.width+"px");
			}
			var modalContent = $('<div/>').addClass("modal-content");
			modalContent.append('<div class="modal-header"></div><div class="modal-body"></div><div class="modal-footer"></div>');
			modalContent.appendTo(modalDialog);
			modalDialog.appendTo(modalDiv);
			modalDiv.appendTo('body');
		}
		$("#"+modalId).on('hidden.bs.modal', function () {
			$("#"+modalId).remove();
		})
	}*/
	
	$.fn.modalDialog = function(obj) {
		var modalId = $(this).attr("data-target").replace("#","");
		if ($("#"+modalId)){
			$("#"+modalId).remove();
		}
		var type = $(this).attr("data-toggle");
		if (type === "modal"){
			var modalDiv = $('<div/>').addClass("modal fade")
						.attr("id",modalId).attr("tabindex","-1").attr("role","dialog").attr("aria-hidden","true");
			var modalDialog = $('<div/>').addClass("modal-dialog");
			if (obj){
				if (typeof(obj.width) === 'string'){
					modalDialog.css("width",obj.width+"px");
				}
			}
			var modalContent = $('<div/>').addClass("modal-content");
			modalContent.append('<div class="modal-header"></div><div class="modal-body"></div><div class="modal-footer"></div>');
			
			modalContent.appendTo(modalDialog);
			modalDialog.appendTo(modalDiv);
			modalDiv.appendTo('body');
		}
		$("#"+modalId).on('hidden.bs.modal', function () {
			$("#"+modalId).remove();
		});
		if (obj){
			if (obj.src){
				$("#"+modalId).on('show.bs.modal', function () {
					var _this = this;
					$.ajax({url: obj.src}).done(function(content) {
						$(_this).find(".modal-content").html(content);
					});
				}); 
			}
		}
	}
	
	$.fn.beforeShowEvent = function(callback) {
		if (typeof(callback) === 'function'){
			var modalId = $(this).attr("data-target");
			if ($(modalId).length>0){
				$(modalId).on('show.bs.modal', function () {
					callback(this);
				}); 
			}
		}
	}
	
	$.fn.afterShowEvent = function(callback) {
		if (typeof(callback) === 'function'){
			var modalId = $(this).attr("data-target");
			if ($(modalId).length>0){
				$(modalId).on('shown.bs.modal', function () {
					callback(this);
				}); 
			}
		}
	}
})(jQuery);


/**
 * 创建通用选择对话框
 * @param id            可选 创建dialog需要用的div的id
 * @param width      可选 dialog的宽
 * @param height     可选 dialog的高
 * @param content   必填 dialog需要显示的内容（url或文本内容）
 * @param title         可选 dialog的标题
 * @param closable   可选 是否显示dialog的toolbar的关闭按钮
 * @param modal      可选 是否设置额为模态
 */
CommonJQueryUIDialog= function(id,width,height,content,title,onCloseFunction,closable,modal,useDefaultButton){
	id = id || "_comframe_id_" + ( Math.random() + "" ).split(".")[1];
	var iframeId = "_iframe_" + id;
	width = width || "500";
	height = height || "500";
	title = title || "弹出页";
	if(closable == null || closable == ''){
		closable = true;
	}
	
	if(typeof(modal) == 'undefined'||modal == null || modal == ''){
		modal = true;
	}
	
	if(typeof(useDefaultButton) == 'undefined'|| useDefaultButton == null){
		useDefaultButton = true;
	}
	/**
	 * 显示对话框
	 */
	this.createDom = function(){
		if(jQuery("#" + id).length == 0 ){
			if(content.indexOf('<') == -1){
				if(content.indexOf('?') == -1){//判断content(url)是否有参数
					content + '?j='+Math.random();
				} else {
					content + '&j='+Math.random();
				}
				var iframe = jQuery("#" + id+" iframe");
				if(typeof(iframe.attr("id"))=='undefined'){
					jQuery(document.body).append("<div id='" + id + "' class='hide'><iframe frameborder='0' scrolling='no'></iframe></div>");
					iframe = jQuery("#" + id + " iframe");
					iframe.attr("id",iframeId);
					iframe.attr("height","98%");
					iframe.attr("width","100%");
					iframe.attr("frameborder","0");
					iframe.attr("scrolling","auto");
				}else{
					
				}
			} else {
				jQuery(document.body).append("<div id='" + id + "' class='hide'>" + content + "</div>");
			}
		} else {
			jQuery("#" + id).dialog('open');
		}
		
	};
	this.createDialog = function(){
		if(useDefaultButton){
			var closeButtons=[{
				text: "关闭",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 

			}];
			$( "#"+id ).removeClass('hide').dialog({
				modal: true,
				// title: "<div class='widget-header widget-header-small'><h5 class='smaller'>"+title+"</h5></div>",
				title: title,
				title_html: true,
				height: height,
				width: width,
				maximizable:false,
			    resizable:true,
			    minimizable:false,
			    zIndex:10000,
				buttons: closeButtons,
				close: function(){
					$( "#"+id ).remove();
				}
			});

		}else{
			$( "#"+id ).removeClass('hide').dialog({
				modal: true,
				// title: "<div class='widget-header widget-header-small'><h5 class='smaller'>"+title+"</h5></div>",
				title: title,
				title_html: true,
				height: height,
				width: width,
				maximizable:false,
			    resizable:true,
			    minimizable:false,
				close : function(){
					if(onCloseFunction != null && onCloseFunction != 'undefined'){
						 eval(onCloseFunction);
					}
					jQuery('#' + id).remove();
				}
			});
		}
	};
	this.createButtonsInDialog = function(buttons){
		$('#' + id).dialog({
			buttons: buttons
		});
	};
	this.close = function(){
		jQuery('#' + id).remove();
	};
	this.getDialogDivId=function(){
		return id ;
	};
	this.getDialogIframeId=function(){
		return iframeId ;
	};
	this.createDom();
	this.createDialog();
	this.show = function(){
		jQuery('#' + id).dialog('open');
		var iframe = jQuery("#" + id + " iframe");
		iframe.attr("src",content);
		if (modal==true){
			var windowMask = $(".window-mask");
			windowMask.append("<iframe frameborder='no' class='platform6BackgroundIframe'> </iframe>");
		}else {
			iframe.parent().parent().parent().after("<iframe frameborder='no' class='platform6BackgroundIframe'> </iframe>");
		}
	};
};


