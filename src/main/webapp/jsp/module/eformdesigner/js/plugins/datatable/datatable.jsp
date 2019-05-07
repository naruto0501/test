<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="avicit.platform6.commons.utils.ViewUtil"%>
<link href="static/h5/jquery-select2/3.4/select2.min.css" rel="stylesheet" />
<script src="static/h5/jquery-select2/3.4/select2.min.js"></script>

<form class="form">
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
                <table>
                	<tr><td>
                    <div class="form-group">
                    	<table>
                        <tr><label class="control-label">子表类型：</label></tr>
                        <tr>
                            <td><label>
                                <input name="subTableType" type="radio" class="ace" value="0">
                                <span class="lbl">自定义</span>
                            </label></td>
                            <td><label>
                                <input name="subTableType" type="radio" class="ace" value="1">
                                <span class="lbl">数据源</span>
                            </label></td>
                       </tr></table>
                    </div>
                    </td></tr>
					<tr><td>
                    <div class="form-group">
                        <label class="control-label">子表名称：</label>
                        <input type="text" name="subTableName" id="subTableName" class="input-medium" style="width:99%">
                    </div>
                    </td></tr>
                    <tr><td>
                	<div class="form-group">
    					<label class="control-label">元素title</label>
    					<input type="text" name="title" id="title" class="input-medium" value="">
					</div>
					</td></tr>
					<tr><td>
                    <div class="form-group" style="display: none;">
                        <label class="control-label">子表外键：</label>
                        <%--<input type="text" name="fkColName" id="fkColName" class="input-medium">--%>
                        <select name="fkColName" id="fkColName" class="input-medium">
                        </select>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group" id="showRowNum">
                        <label>
                            <input name="showRowNum" type="checkbox" class="ace" value="Y">
                            <span class="lbl">&nbsp;显示序号</span>
                        </label>
                    </div>
					</td></tr>
                    <tr><td>
                        <div class="form-group" id="showCheckbox">
                            <label>
                                <input name="showCheckbox" type="checkbox" checked="checked" class="ace" value="Y">
                                <span class="lbl">&nbsp;显示复选框</span>
                            </label>
                        </div>
                    </td></tr>
					<tr><td>
                    <div class="form-group" >
                        <label>
                            <input name="importChk" id="importChk" type="checkbox" class="ace" value="Y">
                            <span class="lbl">&nbsp;导入</span>
                        </label>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group" name="templetCodeDiv" id="templetCodeDiv" >
                        <label class="control-label">导入模版编码：</label>
                        <input type="text" name="templetCode" id="templetCode" class="input-medium" style="width:99%">
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group" >
                        <label>
                            <input name="exportChk" id="importChk" type="checkbox" class="ace" value="Y">
                            <span class="lbl">&nbsp;导出</span>
                        </label>
                    </div>
                    </td></tr>
					<!--
                    <div class="form-group" id="showInput">
                        <label>
                            <input name="inputChk" id="inputChk" type="checkbox" class="ace" value="Y">
                            <span class="lbl">&nbsp;参考录入</span>
                        </label>
                        <select disabled="disabled" class="js-example-basic-single input-medium"  name="xml" id="xml">
						   <option></option>
						</select>
                    </div> -->

					<tr><td>
                    <input type="hidden" name="rowCount" id="rowCount"/>
                    <input type="hidden" name="dataCombox" id="dataCombox"/>
                     <input type="hidden" name="dataComboxType" id="dataComboxType"/>
                    <input type="hidden" name="dataComboxText" id="dataComboxText"/>
                    <input type="hidden" name="queryStatement" id="queryStatement"/>
					<input type="hidden" name="dictionaryPara" id="dictionaryPara">
					<input type="hidden" name="jsBefore" id="jsBefore"/>
					<input type="hidden" name="jsAfter" id="jsAfter">
					</td></tr>
					<tr><td>
					<div class="form-group">
						<label>
                            <input name="inputChk" id="inputChk" type="checkbox" class="ace" value="Y">
                            <span class="lbl">&nbsp;参考录入</span>
                        </label>
                        <label class="control-label" id="dictionaryListDiv">数据字典配置：<a title="数据字典配置" id="propertyBtn"><i
                                class="fa fa-fw fa-lg fa-pencil-square-o"></i></a></label>
                        <input type="hidden" name="dictionaryList" id="dictionaryList" class="input-medium">
                        <ul id="dictionaryArea" class="item-list">
                        </ul>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group" id="colFit">
                        <label>
                            <input name="colFit" type="checkbox" class="ace" value="Y" checked="checked" style="width:99%">
                            <span class="lbl">&nbsp;列宽自适应</span>
                        </label>
                    </div>
                    </td></tr>
                    <tr><td>
                    <div class="form-group">
                        <label>
                            <input name="pagerChk" id="pagerChk" type="checkbox" class="ace" value="Y">
                            <span class="lbl">&nbsp;启用分页</span>
                        </label>
                    </div>
                    <div id = "pagerInfo" style="display:none">
                        <div class="form-group">
                            <label class="control-label">页数量选项：</label>
                            <input type="text" id="rowList" name="rowList" value="[20, 50, 100, 200, 500]" isnull="false" class="input-medium" style="width:99%" placeholder="页数量选项">
                        </div>
                        <div class="form-group">
                            <label class="control-label">默认页数量：</label>
                            <input type="number" id="rowNum" name="rowNum" value="20" isnull="false" class="input-medium" style="width:99%" placeholder="默认页数量">
                        </div>
                    </div>

                    </td></tr>
                    <tr><td>
                    <div class="form-group">
                        <label class="control-label">字段编辑：<a title="字段编辑" id="addcol"><i
                                class="fa fa-fw fa-lg fa-pencil-square-o"></i></a></label>
                        <input type="hidden" name="colList" id="colList" class="input-medium" style="width:99%">
                        <ul id="colArea" class="item-list">
                        </ul>
                    </div>
                    </td></tr>
                    <tr><td>
                        <div class="form-group">
                            <label class="control-label">设置多级表头：<a title="设置多级表头" id="addheadercol"><i
                                    class="fa fa-fw fa-lg fa-pencil-square-o"></i></a></label>
                            <input type="hidden" name="headerColList" id="headerColList" class="input-medium" style="width:99%">
                            <ul id="headerColArea" class="item-list">
                            </ul>
                        </div>
                    </td></tr>
                    </table>
                </div>
            </div>
        </div>


        <%-- <div class="panel panel-default">
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
                    1.添加公共"事件属性"
                    <jsp:include page="../attr-jsp/event-attr.jsp"/>

                    2.添加当前元素特定"事件属性"
                </div>
            </div>
        </div> --%>
    </div>
</form>

<script>
var baseUrl = "<%=ViewUtil.getRequestPath(request)%>"
</script>