<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<form class="form">
    <input type="hidden" name="elementType" id="elementType" value="text">
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
                  <%--   <jsp:include page="../attr-jsp/base-attr.jsp"/> --%>
                    <%--2.添加当前元素特定"基本属性"--%>
                <table><tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">绑定控件：</label>
                        <select name="bindField" id="bindField" class="input-medium" style="width:100%">
                           <!--  <option value="">请选择</option> -->
                        </select>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">标签名称：</label>
                        <input type="text" name="labelName" id="labelName" class="input-medium" value="标签" style="width:100%">
                        <input type="hidden" name="labeltype" id="labeltype" >
                    </div>
                    </td></tr>
                    <tr><td>
                    <%--radio 只用来显示，传值用隐藏字段 --%>
                    <div class="form-group" style="width:99%">
					  <label class="control-label">显示：</label>
					  <label>
					      <input name="colIsVisibleShow" type="radio" class="ace" value="Y" checked disabled>
					      <span class="lbl">是</span>
					  </label>
					  <label style="padding-left: 10px;">
					        <input name="colIsVisibleShow" type="radio" class="ace" value="N" disabled>
					        <span class="lbl">否</span>
					    </label>
					</div>
					</td></tr>
					<tr><td>		
					 <div class="form-group" style="display: none">
                        <label class="control-label">显示：</label>
                        <input type="text" name="colIsVisible" id="colIsVisible" value="Y" class="input-medium">
                    </div>
                    </td></tr>
                    <tr><td>
                        <input type="hidden" name="colIsMust" id="colIsMust"  class="input-medium">
                    </td></tr></table>
                    <!-- <div class="form-group">
                        <label class="control-label">格式校验：</label>
                        <select name="formatValidate" id="formatValidate">
                            <option value="">请选择</option>
                            <option value="email">邮箱1</option>
                            <option value="phone">手机</option>
                            <option value="idcard">身份证</option>
                            <option value="zipcode">邮编</option>
                        </select>
                    </div>  -->
                    
                    
                    
                </div>
            </div>
        </div>
    
	    <div class="panel panel-default">
	            <div class="panel-heading">
	                <h4 class="panel-title">
	                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion"
	                       href="#collapse_css">
	                        <i data-icon-show="ace-icon fa fa-angle-right" data-icon-hide="ace-icon fa fa-angle-down"
	                           class="bigger-110 ace-icon fa fa-angle-right"></i>
	                       css扩展属性
	                    </a>
	                </h4>
	            </div>
	            <div id="collapse_css" class="panel-collapse collapse">
	                <div class="panel-body">
	                    <%--1.添加css扩展"--%>
	                    <jsp:include page="../attr-jsp/css-attr.jsp"/>
	                </div>
	            </div>
	       </div>
    
    </div>
</form>

