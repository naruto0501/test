<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<form class="form">
    <input type="hidden" name="elementType" id="elementType" value="fileupload">
    <div class="accordion-style1 panel-group" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion"
                       href="#collapse1">
                        <i data-icon-show="ace-icon fa fa-angle-right" data-icon-hide="ace-icon fa fa-angle-down"
                           class="bigger-110 ace-icon fa fa-angle-down"></i>
                        元素基本属性
                    </a>
                </h4>
            </div>
            <div id="collapse1" class="panel-collapse collapse in">
                <div class="panel-body">
                    <%--1.添加公共"基本属性"--%>
                    <%--<jsp:include page="../attr-jsp/base-attr.jsp"/>--%>
                  	<table>
                    <tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">页面元素ID：</label>
                        <input type="text" name="domId" id="domId" class="input-medium" value="" style="width:100%">
                    </div>
					</td></tr>
					<tr><td>
                    <%--2.添加当前元素特定"基本属性"--%>
                    <div class="form-group" style="width:99%">
					    <label class="control-label">存储类型：</label>
					    <select name="saveType" id="saveType" style="width:100%">
					        <option value="DataBase" selected>数据库</option>
					        <option value="Disk" >磁盘</option>
					        <option value="Fastfds">FastDFS</option>
					    </select>
					</div>
					</td></tr>
					<tr><td>
					<div class="form-group" style="width:99%">
    					<label class="control-label">元素title：</label>
    					<input type="text" name="title" id="title" class="input-medium" value="" style="width:100%">
					</div>
					</td></tr>
                    <%--<div class="form-group">
                        <label class="control-label">自动上传：</label>
                        <br>
                        <label>
                            <input name="auto" type="radio" class="ace" value="true">
                            <span class="lbl">是</span>
                        </label>
                        <label style="padding-left: 10px;">
                            <input name="auto" type="radio" class="ace" value="false" checked>
                            <span class="lbl">否</span>
                        </label>
                    </div>--%>
					<tr><td>
                    <div class="form-group">
                    	<table><tr>
                        <td><label class="control-label">展开：</label></td>
                        <td>
                        <label>
                            <input name="expand" type="radio" class="ace" value="true" checked>
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="expand" type="radio" class="ace" value="false">
                            <span class="lbl">否</span>
                        </label></td>
                        </tr></table>
                    </div>
					</td></tr>
					<tr><td>
                    <div class="form-group">
                    	<table><tr>
                        <td><label class="control-label">多选：</label></td>
                        <td>
                        <label>
                            <input name="multiple" type="radio" class="ace" value="true" checked>
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="multiple" type="radio" class="ace" value="false">
                            <span class="lbl">否</span>
                        </label></td>
                        </tr></table>
                    </div>
					</td></tr>
                    <%--<div class="form-group">
                        <label class="control-label">显示上传按钮：</label>
                        <br>
                        <label>
                            <input name="allowUpload" type="radio" class="ace" value="true">
                            <span class="lbl">是</span>
                        </label>
                        <label style="padding-left: 10px;">
                            <input name="allowUpload" type="radio" class="ace" value="false" checked>
                            <span class="lbl">否</span>
                        </label>
                    </div>--%>
					<tr><td>
                    <div class="form-group">
                    	<table><tr>
                        <label class="control-label">允许下载附件：</label></tr>
                        <tr><td>
                        <label>
                            <input name="allowDownload" type="radio" class="ace" value="true" checked>
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="allowDownload" type="radio" class="ace" value="false">
                            <span class="lbl">否</span>
                        </label></td>
                        </tr></table>
                    </div>
					</td></tr>
					<tr><td>
                    <div class="form-group">
                    	<table><tr>
                        <label class="control-label">允许添加附件：</label></tr>
                        <tr><td>
                        <label>
                            <input name="allowAdd" type="radio" class="ace" value="true" checked>
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="allowAdd" type="radio" class="ace" value="false">
                            <span class="lbl">否</span>
                        </label></td>
                        </tr></table>
                    </div>
					</td></tr>
					<tr><td>
                    <div class="form-group">
                    	<table>
                        <tr><label class="control-label">允许删除附件：</label></tr>
                        <tr><td>
                        <label>
                            <input name="allowDelete" type="radio" class="ace" value="true" checked>
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="allowDelete" type="radio" class="ace" value="false">
                            <span class="lbl">否</span>
                        </label></td>
                        </tr></table>
                    </div>
					</td></tr>
                        <%--<tr><td>
                            <div class="form-group">
                                <table>
                                    <tr><label class="control-label">允许预览附件：</label></tr>
                                    <tr><td>
                                        <label>
                                            <input name="allowPreview" type="radio" class="ace" value="true" >
                                            <span class="lbl">是</span>
                                        </label></td>
                                        <td><label style="padding-left: 10px;">
                                            <input name="allowPreview" type="radio" class="ace" value="false" checked>
                                            <span class="lbl">否</span>
                                        </label></td>
                                    </tr></table>
                            </div>
                        </td></tr>--%>

                    <%--

                    <div class="form-group">
                        <label class="control-label">允许存网盘：</label>
                        <br>
                        <label>
                            <input name="allowSaveOnlineDisk" type="radio" class="ace" value="true">
                            <span class="lbl">是</span>
                        </label>
                        <label style="padding-left: 10px;">
                            <input name="allowSaveOnlineDisk" type="radio" class="ace" value="false" checked>
                            <span class="lbl">否</span>
                        </label>
                    </div>--%>
					<tr><td>
                    <div class="form-group">
                    <table>
                        <tr><label class="control-label">允许文件名重复：</label></tr>
                        <tr><td>
                        <label>
                            <input name="allowSameName" type="radio" class="ace" value="true">
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="allowSameName" type="radio" class="ace" value="false" checked>
                            <span class="lbl">否</span>
                        </label></td>
                    </tr></table>
                    </div>
					</td></tr>
					<tr><td>
                    <div class="form-group">
                    <table>
                        <tr><label class="control-label">显示折叠按钮：</label></tr>
                        <tr><td>
                        <label>
                            <input name="collapsible" type="radio" class="ace" value="true" checked>
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="collapsible" type="radio" class="ace" value="false">
                            <span class="lbl">否</span>
                        </label></td>
                    </tr></table>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group" id="allowEncryDiv">
                    <table>
                        <tr><label class="control-label">允许加密存储：</label></tr>
                        <tr><td>
                        <label>
                            <input name="allowEncry" type="radio" class="ace" value="true" >
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="allowEncry" type="radio" class="ace" value="false" checked>
                            <span class="lbl">否</span>
                        </label></td>
                        </tr></table>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group">
                    <table>
                        <tr><label class="control-label">是否关联密级：</label></tr>
                        <tr><td>
                        <label>
                            <input name="allowSecret" type="radio" class="ace" value="true">
                            <span class="lbl">是</span>
                        </label></td>
                        <td><label style="padding-left: 10px;">
                            <input name="allowSecret" type="radio" class="ace" value="false" checked>
                            <span class="lbl">否</span>
                        </label></td>
                    </tr></table>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group" id="formSecretDiv" style="width:99%">
                    	<label class="control-label">表单密级字段：</label>
                        <%--<input type="text" name="formSecret" id="formSecret" class="input-medium">--%>
                        <select name="formSecret" id="formSecret" class="input-medium" style="width:100%">
                            <!--  <option value="">请选择</option> -->
                        </select>
                    </div>
					</td></tr>

					<tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">允许上传的个数：</label>
                        <input type="text" name="fileNumLimit" id="fileNumLimit" class="input-medium" value="10" onchange="checkFileNumLimit(this.value)" style="width:100%">
                    </div>
					</td></tr>
					<tr><td>
                    <div class="form-group" style="width:100%">
                        <label class="control-label">
                            单个附件大小限制：
                            <span class="help-button" data-rel="popover" data-trigger="hover" data-placement="left"
                                  data-original-title="提示"
                                  data-content="可带单位包括B、KB、MB、GB，如果省略则默认为KB；属性为0或大于0小于1的小数均表示不限制文件大小；"
                            >?</span>
                        </label>
                        <input type="text" name="fileSizeLimit" id="fileSizeLimit" class="input-medium" value="0" style="width:99%">
                    </div>
					</td></tr>
					<tr><td>
                    <div class="form-group" style="width:100%">
                        <label class="control-label">
                            可上传的文件类型：
                            <span class="help-button" data-rel="popover" data-trigger="hover" data-placement="left"
                                  data-original-title="提示"
                                  data-content="样例：{title: 'Images', extensions: 'gif,jpg,jpeg,bmp,png',mimeTypes: 'image/*'}；格式：title文字描述，extensions允许的文件后缀，不带点，多个用逗号分割，mimeTypes多个用逗号分割；"
                            >?</span>
                        </label>
                        <input type="text" name="accept" id="accept" class="input-medium" style="width:99%">
                    </div>
                    </td></tr>
               </table>
                </div>
            </div>
        </div>
    

    
    </div>
</form>

<script>
    $('[data-rel=popover]').popover({container:'body'});

    $("#domId").val(GenNonDuplicateID()).trigger("keyup");
    function checkFileNumLimit(val){
    	var r = /^[0-9]*[1-9][0-9]*$/;
    	if(val==null||val==""||!r.test(val)){
    		layer.alert('允许上传的文件个数应为正整数！', {
				icon: 7,
				area: ['400px', ''],
				closeBtn: 0
			});
    		$("#fileNumLimit").val(10);
    	}
    }
    $('input[type=radio][name=allowSecret]').change(function() {
        if (this.value == 'true') {
            $("#formSecretDiv").css("display","block");
        }else if (this.value == 'false') {
            $("#formSecret").val("");
            $("#formSecretDiv").css("display","none");
        }
    });
</script>