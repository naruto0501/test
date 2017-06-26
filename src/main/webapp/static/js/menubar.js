/**
 * 激活当前选中菜单
 */
function menuClick(obj){
	$(".active").removeClass("active");
	$(obj).parent().addClass("active");
}


function addTabs(obj) {
    var id = "tab_" + obj.id;
 
    $(".active").removeClass("active");
     
    //如果TAB不存在，创建一个新的TAB
    if (!$("#" + id)[0]) {
        //固定TAB中IFRAME高度
        mainHeight = $(window).height() - 100;
        //创建新TAB的title
        title = '<li role="presentation" id="tab_' + id + '"><a href="#' + id + '" aria-controls="' + id + '" role="tab" data-toggle="tab">' + obj.title;
        //是否允许关闭
        
        if (obj.close) {
            title += ' <span onclick="closeTab(\'' + id + '\')">x</span>';
        }
        
        title += '</a></li>';
        //是否指定TAB内容
        if (obj.content) {
            content = '<div role="tabpanel" class="tab-pane" id="' + id + '">' + obj.content + '</div>';
        } else {//没有内容，使用IFRAME打开链接
            content = '<div role="tabpanel" class="tab-pane" id="' + id + '"><iframe src="' + obj.url + '" width="100%" height="' + mainHeight +
                    '" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe></div>';
        }
        //加入TABS
        $(".nav-tabs").append(title);
        $(".tab-content").append(content);
    }
     
    //激活TAB
    $("#tab_" + id).addClass('active');
    $("#" + id).addClass("active");
};
 
function closeTab(id) {
    //如果关闭的是当前激活的TAB，激活他的前一个TAB
    if ($("li.active").attr('id') == "tab_" + id) {
    	if ($("#tab_" + id).prev().length > 0){
	        $("#tab_" + id).prev().addClass('active');
	        $("#" + id).prev().addClass('active');
    	}else{
    		$("#tab_" + id).next().addClass('active');
	        $("#" + id).next().addClass('active');
    	}
    }
    //关闭TAB
    $("#tab_" + id).remove();
    $("#" + id).remove();
};