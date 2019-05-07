var xy="0:0";
var conX=0;//当前模型最大X坐标
var jsonList=[];//用于存储当前页面portlet位置信息

/**
 * 添加小页方法
 * @param obj {portletId,isShowTitle,subUrl,menuCode,title,isClose,height,url,position{x,y}}
 */
function addPortlet(obj){
	var id = "portlet_" + obj.portletId;
	var portlet = $('<div/>').addClass("widget-box").attr("id",id);
	var header = $('<div/>').addClass("widget-header");
	var title = $('<h6/>').addClass("widget-title");
	var toolbar = $('<div/>').addClass("widget-toolbar");
	var body = $('<div/>').addClass("widget-body");
	var widget_main = $('<div/>').addClass("widget-main padding-4 scrollable");
	if (obj.isShowTitle==null || obj.isShowTitle == "1"){
		if (obj.subUrl != null && obj.subUrl != ""){
			var a_title = "<a href='javascript:void(0)' onclick=\"parent.addTabs({id:'"+obj.menuCode+"',close:true,title:'"+obj.title+"',url:'"+obj.subUrl+"'})\">"
				+obj.title
				+"</a>";
			title.append(a_title);
		}else{
			title.append(obj.title);
		}
	}
	toolbar.append('<a href="javascript:void(0)" data-action="reload"><i class="ace-icon fa fa-refresh"></i></a>')
		   .append('<a href="javascript:void(0)" data-action="collapse"><i class="ace-icon fa fa-chevron-up"></i></a>');
	if (obj.isClose == null || obj.isClose == "1"){
		toolbar.append('<a href="javascript:void(0)" data-action="close"><i class="ace-icon fa fa-times"></i></a>');
	}
	title.appendTo(header);
	toolbar.appendTo(header);
		
	//添加header
	header.appendTo(portlet);
	
	if (obj.height!=null&&obj.height!=""){
		widget_main.attr("data-size",obj.height);
	}else{
		widget_main.attr("data-size","250");
	}
	widget_main.append('<div id="'+ 'content_'+  id +'" class="content"><iframe src="'+obj.url+'" width="100%" height="'+obj.height+'" border="0" frameBorder="0" scrolling="auto" vspace="0" hspace="0" bordercolor="#000000"></iframe></div>')
	widget_main.appendTo(body);
	
	body.appendTo(portlet);
	var colunm = $(".widget-container-col").eq(obj.position.y);
	if(colunm.find(".widget-box").eq(obj.position.x).length > 0){
		colunm.find(".widget-box").eq(obj.position.x).before(portlet);
	}else{
		colunm.append(portlet);
	}
		
	
	if (obj.url != null && obj.url != "" ){
		portlet.on('reload.ace.widget', function(ev) {
			$(this).find("iframe").eq(0).attr('src', $(this).find("iframe").eq(0).attr('src'));
		});
	}
	
}

/**
 * 加载首页小页
 * @param areaId 小页容器id
 */
function loadPortlet(areaId){
	$("#"+areaId).html("");
	$.ajax({
		url : baseUrl+'platform/IndexPortalController/getIndexPortlet.json',
		data : {'baseUrl':baseUrl},
		type : 'post',
		dataType : 'json',
		async:false,
		success : function(result) {
			if (result.flag == "success") {
				$("#layout").val(result.layout);
				/**小页信息**/
				var portletList = result.portletList;
				/**布局信息**/
				var layoutList = result.layoutList;
				/**新的X最大坐标**/
				var newConX = 0;
				var layoutId = "";
				if(layoutList!=null&&layoutList.length!=null){
					//动态画布局行div
					for (var i = 0; i < layoutList.length; i++) {
						var layout = layoutList[i];
						/**栅格大小数组**/
						var rowWidthList = layout.bootstrapCol;
						//初始化conX
						if (conX == 0 ){
							conX = rowWidthList.length-1;
						}
						//模版变化后conX
						newConX = rowWidthList.length-1;
						layoutId = layout.layoutId;
						if($("#"+layout.rowId).length==0){//判断是否已经存在
							/**分组容器**/
							var layoutDiv = $("<div/>").attr("id",layout.rowId).addClass("row portal_group");
							$("#"+areaId).append(layoutDiv).append('<div class="space-24"></div>');
						}
						for(var j=0; j<rowWidthList.length; j++){//构造行容器
							/**行容器**/
							var portal_row = $("<div/>").addClass("widget-container-col").addClass(rowWidthList[j]);
							portal_row.attr("style","min-height: 100px;");
							$("#"+layout.rowId).append(portal_row);
						}
					}
				}
				//判断conX是否变化，是则从新计算小页位置
				if (layoutChangeFlag(newConX)){
					conX = newConX;
					saveNewPortlet(portletList,layoutId,newConX);
				}else{
					conX = newConX;
					if(portletList!=null&&portletList.length!=null){
						//动态增加portlet
						for (var i = 0; i < portletList.length; i++) {
							var portlet = portletList[i];
							realAddPortlet(portlet,portlet.rowId);
						}
					}
				}
			}
		}
	});
	
	//设置widget可拖拽排序
	 $('.widget-container-col').sortable({
	        connectWith: '.widget-container-col',
			items:'> .widget-box',
			handle: ace.vars['touch'] ? '.widget-header' : false,
			cancel: '.fullscreen',
			opacity:0.8,
			revert:true,
			forceHelperSize:true,
			placeholder: 'widget-placeholder',
			forcePlaceholderSize:true,
			tolerance:'pointer',
			start: function(event, ui) {
				//when an element is moved, it's parent becomes empty with almost zero height.
				//we set a min-height for it to be large enough so that later we can easily drop elements back onto it
				ui.item.parent().css({'min-height':ui.item.height()})
				//ui.sender.css({'min-height':ui.item.height() , 'background-color' : '#F5F5F5'})
			},
			update: function(event, ui) {
				ui.item.parent({'min-height':''})
				//p.style.removeProperty('background-color');
			}
	    }); 
}

//判断模版最大X坐标是否改变
function layoutChangeFlag(con){
	if (con!=conX)
		return true;
	else
		return false;
}

/**
 * 
 * @param portlet 小页对象
 * @param rowId 行id
 */
function realAddPortlet(portlet,rowId){
	//获取小页坐标
	var x1 = portlet.xy.split(":")[1];
	var y1 = portlet.xy.split(":")[0];
	//获取url
	var subUrl;
	if (portlet.moreUrl!=null && portlet.moreUrl!=""){
		subUrl = portlet.moreUrl;
	}else{
		subUrl = portlet.url;
	}
	//判断布局是否正确
	if ($('#'+rowId).length > 0){
		//调用添加方法
		addPortlet({
			portletId : portlet.portletId, //小页id
			subUrl : subUrl,			   //标题跳转url
			menuCode : portlet.menuCode,   //菜单编号
			url : portlet.url,             //小页内容url
			title : portlet.title,         //小页标题
			height : portlet.height,       //小页高度
			position:{x: x1,y: y1}         //小页坐标
		});
	}else{
	}
}

//激活行之间的编辑状态
function activeModifyPortal(buttonId,areaId){
	var button = $("#"+buttonId);
	var portalArea = $("#"+areaId);
	
	button.click(function(){
		if (this.checked){
			portalArea.find(".portal_group").each(function(){
				/**小页区域编辑工具按钮**/
				var tools = $("<div/>").addClass("tools portal-tool").attr("id","tool_"+$(this).attr("id"));
				
				var modifyLayout = $("<a/>").attr("href","javascript:void(0)").append('<i class="ace-icon fa fa-paperclip"></i>');
				modifyLayout.appendTo(tools);
				
				var choosePortlet = $("<a/>").attr("href","javascript:void(0)").append('<i class="ace-icon fa fa-pencil"></i>');
				choosePortlet.click(function(){
					$("#addBox").modal('show');
				});
				choosePortlet.appendTo(tools);
				
				var deletePortal = $("<a/>").attr("href","javascript:void(0)").append('<i class="ace-icon fa fa-times red"></i>');
				deletePortal.appendTo(tools);
				$(this).before(tools);
				$(this).addClass("rowactive");
			});
		}else{
			portalArea.find(".portal-tool").remove();
			portalArea.find(".rowactive").removeClass("rowactive");
			//$('.widget-container-col').sortable( "disable" );
		}
	});
}

//查找页面上空余位置
function findPosition(){
	if (jsonList.length==0)return "0:0";
	//y轴循环
	for (var j=0; true; j++){
		//x轴循环
		for (var i=0;i<=conX; i++){
		 	var flag = false;
		 	//如果当前位置上有portlet则进行下一位置循环，直到当前位置上没有portlet，返回当前位置
			 for (var k=0;k<jsonList.length;k++){
				if (jsonList[k].x==i&&jsonList[k].y==j){
					flag = true;
					break;
				 } 
				 
			 }
			 if (flag == false){
				 return i+':'+j;
			 }
		 }
	}
}

/**
 * 初始化小页添加页面
 * @param portal_area  小页区域ID
 */
function initAddHtml(portal_area,e,admin){
	//ajax请求可添加小页列表信息
	$.ajax({ 
		url: baseUrl+'platform/IndexPortalController/getIndexPortletList/'+admin+'.json',
		data : {},
		type : 'post',
		dataType : 'json',
		success: function(result){
			if (result.flag == "success") {
				//重置添加页面
				$(e).find(".modal-body").html("");
				
				//开始页面布局
				$(e).find(".modal-body").append('<div class="space-8"></div>');
				
				/**小页列表**/
				var portletList = result.portletList;
				
				/**获取页面已存在小页ID串**/
				var portletids = getExistsPortletids(portal_area);
				for (var i = 0; i < portletList.length; i++) {
					//判断小页是否以添加进首页，并过滤掉
					var display = true;
					var portlet = portletList[i];
					if (portletids != 'undefind' && portletids != null) {
						if (portletids.indexOf("@"+portlet.portletId+"@") > -1) {
							display = false;
						}
					} 
					if (display){
						var widgetsbox = $("<div/>");
						var label = $("<label/>").addClass("inline");
						label.append('<input type="checkbox" name="form-field-checkbox" class="ace" value="'+portlet.portletId+'">')
							 .append('<span class="lbl"> '+portlet.title+' </span>');
						label.appendTo(widgetsbox);
						
						widgetsbox.appendTo($(e).find(".modal-body"));
						$(e).find(".modal-body").append('<div class="space-8"></div>');
					}
				}
			}
		}
	});
}

/**
 * 获取页面上已存在小页id
 * @param portal_area
 * @returns {String}
 */
function getExistsPortletids(portal_area){
	var portletids = "@";
	$("#"+portal_area).find(".widget-box").each(function(){
		var id = $(this).attr("id").replace("portlet_","");
		portletids = portletids + id + "@";
	});
	return portletids;
}

/**
 * 添加已选小页到首页
 * @param ids 已选小页id串
 * @param rowId 行id
 */
function addPortletToIndex(ids,rowId){
	var idArray = ids.split(",");
	for(var i=0; i<idArray.length; i++){
		if(idArray[i]==null||idArray[i]==""){
			continue;
		}
		//获得页面全部portlet信息   portlet.rowId;
		var indexs = getExistWidget();
		//遇到相同id的先删除再添加进json数组，没有的直接添加
		 $.each(indexs, function(k, v) {
			 for (var i=0;i<jsonList.length;i++){
		        if (jsonList[i].id == k) {
		        	jsonList.splice(i, 1);
		           	break;
		        }
			 }
			jsonList.push({"x":v.x,"y":v.y,"id":k});
		}); 
		//查找空余位置
		xy = findPosition();
		jsonList.push({"x":xy.split(":")[1],"y":xy.split(":")[0],"id":idArray[i]});
		$.ajax({
			url : 'platform/IndexPortalController/getPortletInfo.json?portletId='+idArray[i]+'&baseUrl='+baseUrl+'&xy='+xy,
			data : {},
			type : 'post',
			dataType : 'json',
			async:false,
			success : function(result) {
				if (result.flag == "success") {
					var portlet = result.portletModel;
					realAddPortlet(portlet,rowId);
				}
			}
		});
	}
}

/**
 * 获取首页已存在小页坐标
 * @returns {___anonymous10448_10449}
 */
function getExistWidget(){
	var indexs={};
	 $('.widget-container-col').each(function(i, v) {
         $('.widget-box', this).each(function(j, v2) {
             var id = $(this).attr("id").replace("portlet_","");
             indexs[id] = {
                 x: i,
                 y: j
             };
         });
     });
	 return indexs;
}

/**
 * 添加页面调用方法
 * @param groupId
 */
function add(rowId){
	var ids="";
    $("input[name='form-field-checkbox']:checkbox").each(function(){ 
        if(this.checked){
            ids += $(this).val()+","
        }
    });
    addPortletToIndex(ids,rowId);
    
    //隐藏模态框
    $("#addBox").modal('hide');
}



//布局更改时调用，从新计算小页坐标
function saveNewPortlet(portletList,layout,newConX){
	var portletStr = "";
	var x=0;
	var y=0;
	if(portletList!=null&&portletList.length!=null){
		//动态增加portlet
		for (var i = 0; i < portletList.length; i++) {
			var portlet = portletList[i];
			portlet.xy= x+":"+y;
			realAddPortlet(portlet,portlet.rowId);
			portletStr = portletStr + portlet.rowId+";"+portlet.portletId+";"+x+":"+y+"@";
			if (x!=newConX){
				x++;
			}else{
				x=0;
				y++;
			}
		}
		portletStr = portletStr.substring(0,portletStr.length-1);
	}
	$.ajax({ 
		url: 'platform/IndexPortalController/saveIndexPortlet.json',
		async : false,
		type: "POST",
		data : 'portlet=' + portletStr+'&layout='+layout,
		success: function(){
		},
		error : function(){
			//alert('portlet配置信息保存失败!');
		}
	});
}

/**
 * 初始化设置页面
 * @param e 模态框对象
 */
function initConfigHtml(e){
	$.ajax({ 
		async:true,
		url: 'platform/IndexPortalController/getPortletConfig.json',
		data : {},
		type : 'post',
		dataType : 'json',
		success: function(result){
			//清空页面，重新生成
			$(e).find("#layoutContent").html("");
			$(e).find("#layoutContent").append(result.layoutContent);
		},
		error : function(){
		}
	});
}

/**
 * 保存页面布局配置
 * @param portal_area 小页展示区域id
 */
function saveLayout(portal_area){
	var layoutKey=$('input:radio[name="layoutId"]:checked').val();
	if(layoutKey==null||layoutKey==""){
		alert("请您选择一个模板");return;
	}
	$.ajax({ 
		url: 'platform/IndexPortalController/saveIndexLayout.json',
		async : false,
		type: "POST",
		data : 'layoutKey=' + layoutKey,
		success: function(){

			$("#editBox").modal('hide');
	        loadPortlet(portal_area);
	        $.gritter.add({  
			    title: '首页布局设置成功',  
			    text: '操作成功',  
			    sticky: false,  
			    time: 2000,  
			    speed:500,  
			    class_name: 'gritter-info gritter-light gritter-center'//gritter-center   
			});
		},
		error : function(){
			//alert('portlet配置信息保存失败!');
		}
	});
}



function getExistsPortlet(){
	var portlet = "";
	$('.widget-container-col').each(function(i, v) {
		//行id
		var rowId = $(this).parent().attr("id");
        $('.widget-box', this).each(function(j, v2) {
            var id = $(this).attr("id").replace("portlet_","");
            portlet = portlet + rowId+";"+id+";"+i+":"+j+"@";
        });
    });
	return portlet;
}

/**
 * 小页位置更改后 用于保存其信息
 */
function savePortlet(){
	var portlet = getExistsPortlet();
	var layout = $("#layout").val();
	if(portlet!=null&&portlet!=""){
		portlet = portlet.substring(0,portlet.length-1);
		$.ajax({ 
			url: baseUrl+'platform/IndexPortalController/saveIndexPortlet.json',
			async : false,
			type: "POST",
			data : 'isgloable=false&portlet=' + portlet+'&layout='+layout,
			success: function(){
				$.gritter.add({  
				    title: '提示',  
				    text: '首页布局设置成功',  
				    sticky: false,  
				    time: 2000,  
				    speed:500,  
				    class_name: 'gritter-info gritter-light gritter-center'//gritter-center   
				}); 
			},
			error : function(){
				//alert('portlet配置信息保存失败!');
			}
		});
	}else{
	}
}






