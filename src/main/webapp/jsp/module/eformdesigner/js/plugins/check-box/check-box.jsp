<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<form class="form">
    <input type="hidden" name="elementType" id="elementType" value="checkbox">
    <input type="hidden" name="attribute01" id="attribute01" value="">
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
                    <jsp:include page="../attr-jsp/base-attr.jsp">
                    	<jsp:param value="unique" name="except"/>
					</jsp:include>
					
                    <%--2.添加当前元素特定"基本属性"--%>
                    <div class="form-group" style="display: none">
                        <label class="control-label">字段长度：</label>
                        <input type="text" name="colLength" id="colLength" value="50" class="input-medium">
                    </div>
                    <div class="form-group">
                        <label class="control-label">选项：</label>
                        <div id="selectarea">
                        </div>
                    </div>
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
                        <jsp:include page="../attr-jsp/event-attr.jsp">
                            <jsp:param value="blur,focus,keyup" name="except"/>
                        </jsp:include>

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