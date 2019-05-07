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
                    <jsp:include page="../attr-jsp/base-attr.jsp"/>
			<table><tr><td>
                    <%--2.添加当前元素特定"基本属性"--%>
                    <div class="form-group" style="display: none" style="width:99%">
                        <label class="control-label">字段长度：</label>
                        <input type="text" name="colLength" id="colLength" value="20" class="input-medium" style="width:99%">
                    </div>
                  </td></tr>
                  <tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">小数位数：</label>
                        <input type="text" name="attribute02" id="attribute02" value="0" class="input-medium" style="width:99%">
                    </div>
                    </td></tr>
                  <tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">最小值：</label>
                        <input type="text" name="minValue" id="minValue" class="input-medium" style="width:99%">
                    </div>
                    </td></tr>
                  <tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">最大值：</label>
                        <input type="text" name="maxValue" id="maxValue" class="input-medium" style="width:99%">
                    </div>
                    </td></tr>
                  <tr><td>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">默认值：</label>
                        <input type="text" name="defaultValue" id="defaultValue" class="input-medium" style="width:99%">
                    </div>
                    </td></tr>
                    <tr>
                        <td>
                            <input type="hidden" name="calculateValue" id="calculateValue"/>
                            <input type="hidden" name="calculateCol" id="calculateCol">
                            <input type="hidden" name="calculateText" id="calculateText">

                            <div class="form-group">
                                <label class="control-label">计算属性：<a title="计算属性" id="propertyBtn"><i
                                        class="fa fa-fw fa-lg fa-pencil-square-o"></i></a></label>
                                <ul id="colArea" class="item-list">
                                </ul>
                            </div>
                        </td>
                    </tr>
					</table>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion"
                       href="#collapse3">
                        <i data-icon-show="ace-icon fa fa-angle-right" data-icon-hide="ace-icon fa fa-angle-down"
                           class="bigger-110 ace-icon fa fa-angle-right"></i>
                        元素事件属性
                    </a>
                </h4>
            </div>
            <div id="collapse3" class="panel-collapse collapse">
                <div class="panel-body">
                    <%--1.添加公共"事件属性"--%>
                    <jsp:include page="../attr-jsp/event-attr.jsp"/>

                    <%--2.添加当前元素特定"事件属性"--%>
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