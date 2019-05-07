/**
 * 首页上方导航条方法js
 * 
**/


(function($){

/**
 * 初始化导航条
 */
$.fn.initMyNavBar = function() {
	//var container = $('<div/>').addClass("navbar-container");
	//var header = $('<div/>').addClass("navbar-header");
	//设置header位置
	//header.addClass("pull-left");
	
	//使用背景图片设置logo
	//container.addClass("logo");
	//使用font-awesome设置logo

	
	//header.append('<a href="#" class="navbar-brand"><small> Ace Admin</small></a>');
	//header.append('<a href="#" class="navbar-brand" style="height:46px;"><small  style="font-family:微软雅黑;"><img src="static\\css\\platform\\aceadmin\\css\\img\\LOGO.png" style=" padding-bottom: 3px;"/> 业务基础平台V6</small></a>');
	//header.appendTo(container);

	//var navButtons = $('<div/>').addClass("navbar-buttons navbar-header collapse navbar-collapse").attr("role","navigation");
	//设置navbar按钮位置
	//navButtons.addClass("pull-right");
	//ace-admin自定义nav样式
	//var aceArea = $('<ul/>').addClass("nav ace-nav");
	
	//调用扩展方法initMassageButton
	$(this).initMassageButton();
	//调用扩展方法initUserButton
	$(this).initUserButton();
	//aceArea.appendTo(navButtons);
	
	//navButtons.appendTo(container);
	
	
	//container.appendTo($(this));
}

/**
 * 创建用户按钮
 * @returns
 */
$.fn.initUserButton = function() {
	var _this = this;
	$.ajax({
		type: "GET",
        url: "platform/sysBootstrapIndexController/getIndexInfo.json",
        dataType: "json"
	}).done(function(data){
		/**用户dom**/
		var userButton = $('<li/>').addClass("light-blue").attr("id","portalUserButton");
		
		/*********************设置用户信息开始***********************/
		/**用户信息dom**/
		var userinfo = $('<a/>').addClass("dropdown-toggle").attr("data-toggle","dropdown").attr("href","#");
		//添加用户头像
		userinfo.append('<img class="nav-user-photo" width="40px" height="40px" src="platform/sysuser/photo/upload/headerphoto?sysUserId='+data.userid+'" alt="'+data.username+'的头像" />');
		//添加欢迎信息
		userinfo.append('<span class="user-info"><small>欢迎,</small>'+data.username+'</span>');
		//添加下拉箭头
		userinfo.append('<i class="ace-icon fa fa-caret-down"></i>');
		userinfo.appendTo(userButton);
		/*********************设置用户信息结束***********************/
		
		
		/*********************设置用户操作按钮开始********************/
		/**用户操作dom**/
		var userOp = $('<ul/>').addClass("user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close");
		
		/**分割线**/
		var divider = $('<li/>').addClass("divider");
		
		/**个人设置按钮**/
		var setting = $('<li/>');
		setting.append('<a href="javascript:void(0)" onclick="addTabs({id:\'customedSetting\',close:true,title:\'个人设置\',url:\'platform/syscustomed/sysCustomedController/toSyscustomed\'})"><i class="ace-icon fa fa-cog"></i>个人设置</a>');
		setting.appendTo(userOp);
		
		/**修改密码按钮**/
		var password = $('<li/>');
		password.append('<a href="javascript:void(0)" onclick="openSubWindow_pwd()"><i class="ace-icon fa fa-key"></i>修改密码</a>');
		password.appendTo(userOp);
		userOp.append(divider);
		
		/**退出按钮**/
		var logout = $('<li/>');
		logout.append('<a href="javascript:void(0)" onclick="logout(event,\''+data.logouttip+'\')"><i class="ace-icon fa fa-power-off"></i>退出</a>');
		userOp.append(logout);
		
		userOp.appendTo(userButton);
		/*********************设置用户操作按钮结束********************/
		
		userButton.appendTo($(_this));
	});
}

$.fn.initMassageButton = function(){

	var massageButton = $("<li/>").addClass("green").attr("id","portalMassageButton");
	var a = $("<a/>").addClass("dropdown-toggle").attr("href","javascript:void(0)");
	a.click(function(){
		addTabs({id:"messageMgr",close:true,title:"消息",url:"platform/sysmessage/sysMessageController/toSysMessage"});
	});
	var icon = $("<i/>").addClass("ace-icon fa fa-bell");
	icon.appendTo(a);
	var massageCount = $("<span/>").addClass("badge badge-success");
	massageCount.appendTo(a);
	a.appendTo(massageButton);
	massageButton.appendTo($(this));
}

})(jQuery);

function loadMessageInterval(){  
	if(typeof messageIntervalTime == 'undefined' || messageIntervalTime == null){
		messageIntervalTime = 30000;
	}
	refreshMessageCount();
    setInterval(function(){
    	refreshMessageCount();
    }, messageIntervalTime);
}; 

function refreshMessageCount(){
	$.ajax({
	     type: "GET",//使用GET方法访问后台
	     url: "platform/sysmessage/sysMessageController/getSysMessageCount?_dc="+new Date().getTime(),//要访问的后台地址
	     async : false,
	     success: function(msg){//msg为返回的数据，在这里做数据绑定
	    	if(parseInt(msg) > 0){
	    		$("#portalMassageButton").find(".badge").text(msg);
	    		if(!$("#portalMassageButton").find(".fa-bell").hasClass("icon-animated-bell")){
	    			$("#portalMassageButton").find(".fa-bell").addClass("icon-animated-bell");
	    		}
//	    		$(".msgbg").find("a").get(0).innerText= msg;  这两种方法都可以
	    	}else{
	    		$("#portalMassageButton").find(".badge").text("");
	    		$("#portalMassageButton").find(".fa-bell").removeClass("icon-animated-bell");
	    	}
	     }, 
	     error : function(msg){
		   }
	   });
};

/**
 * 退出
 * @param logoutTip
 */
function logout(e,logoutTip) {
	//e.preventDefault();
	bootbox.confirm({
		message: "<h4><i class='ace-icon fa fa-question-circle'></i> "+logoutTip+"</h4>",
		buttons: {
			cancel: {
				label: "取消",
				className: "btn-sm",
			},
			confirm: {
				label: "确定",
				className: "btn-primary btn-sm",
			}
		},
		callback: function(result) {
			if(result){
				window.location = baseUrl+'login/logout_forCas.jsp';
			}
		}
	});
};

function openSubWindow_pwd(){
	bootbox.dialog({
		message : "<iframe name='applyPasFrame' id='applyPasFrame' scrolling='yes' frameborder='0' src='"+baseUrl+"platform/syspassword/sysPasswordController/toPassword' style='width:100%;height:91%;'></iframe>"
	});
};

/**
 * 加载显示条目
 */
function loadPortalItems(){
	$.ajax({
		url: 'platform/syslookuptype/getLookUpCode/PLATFORM_PORTAL_ITEMS.json',
		type :'get',
		dataType :'json',
		success : function(r){
			if(r){
				$.each(r,function(i,n){
					var child =$('<li></li>');
					var d=n.lookupDes ||'';
					var a=$('<a title="'+d+'" href="javascript:void(0);">'+n.lookupName+'</a>');
					(function(lookup){
						a.bind("click",function(e){
							e.preventDefault();
							var list =lookup.lookupCode.split('::');
							if(list[1] ==='js'){
								window[list[0]](lookup.lookupName);
							}else if(list[1] ==='menu'){
								$.ajax({
									url: 'platform/sysmenu/getSysmenuByCode/'+list[0]+'.json',
									type :'get',
									async :false,
									dataType :'json',
									success :function(r){
										if(r){
											var i=[];
											if(r.image){  
												i=r.image.split(' ');
											}
											addTab(lookup.lookupName,r.url,i[0],r.code,i[1]+' '+i[2]);
										}else{
											alert("个人设置不存在请联系管理员！");
										}
									}
								});
							}
						});
					})(n);
					a.appendTo(child);
					child.appendTo($('#portalItems'));
				});
			}
		}
	});
};

