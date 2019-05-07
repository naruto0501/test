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
			<table>
				<tr><td>
                    <%--2.添加当前元素特定"基本属性"--%>
                    <div class="form-group" style="width:99%">
                        <label class="control-label">日期格式：</label>
                        <select name="attribute03" id="attribute03" style="width:100%">

                            <option value="2">Y-m-d</option>
                            <option value="1">Y-m-d H:i</option>
                        </select>
                        <script>
	                        $("select#attribute03").change(function(){
	                        	$('#defaultValue').val("");
	                        	$('#defaultValue').datetimepicker('remove');
	                    		if($(this).val()=="2"){
	                    			$('#defaultValue').datetimepicker({
	                    				language:  'zh-CN',
	    	                        	pickerPosition : 'top-left',
	    	                        	minView: "month",
	    	                        	format: 'yyyy-mm-dd',
	    	                            autoclose: true,
	    	                            todayHighlight: true
	    	                        })
	                    		}else{
	                    			$('#defaultValue').datetimepicker({
	                    				language:  'zh-CN',
	    	                        	pickerPosition : 'top-left',
	    	                        	format: 'yyyy-mm-dd hh:ii',
	    	                            autoclose: true,
	    	                            todayHighlight: true
	    	                        })
	                    		}
	                    	});
                        </script>
                    </div>
				</td></tr>
				<tr><td>
                    <div class="form-group" style="width:99%">
                        <label>
                            <input name="defaultVar" type="checkbox" class="ace" value="Y">
                            <span class="lbl">&nbsp;默认值（当前时间）</span>
                        </label>
                       <%-- <label class="control-label">默认值：</label>
                        <div class="input-group">
                            <input class="form-control date-picker" name="defaultValue" id="defaultValue" type="text" 
                            	data-date-format="yyyy-mm-dd hh:ii" style="width:100%">
                            <span class="input-group-addon">
                                <i class="fa fa-calendar"></i>
                            </span>
                            <script>
                            $('.input-group-addon').eq(1).on('click',function(){
                            		//console.log(1)
                            	  $(this).parent().find('input').trigger('focus.datetimepicker.data-api')
                            	})
                            </script>
                        </div>--%>
                    </div>
                    </td></tr></table>
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
                         <jsp:param value="click,keyup,focus" name="except"/>
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