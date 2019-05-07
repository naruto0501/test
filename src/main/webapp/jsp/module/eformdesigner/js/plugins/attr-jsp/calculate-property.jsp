<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ page import="avicit.platform6.commons.utils.ViewUtil"%>
<%@taglib prefix="pt6" uri="/WEB-INF/tags/platform6.tld"%>
<%@taglib prefix="sec" uri="/WEB-INF/tags/shiro.tld"%>
<%
    String importlibs = "common,table,form";
%>
<!DOCTYPE html>
<html>
<head>
    <title>JS文件扩展</title>
    <base href="<%=ViewUtil.getRequestPath(request)%>">
    <jsp:include
            page="/avicit/platform6/h5component/common/h5uiinclude-css.jsp">
        <jsp:param value="<%=importlibs%>" name="importlibs" />
    </jsp:include>
    <jsp:include
            page="/avicit/platform6/h5component/common/h5uiinclude-js.jsp">
        <jsp:param value="<%=importlibs%>" name="importlibs" />
    </jsp:include>
    <style>
        .var-area{
            border: 1px solid;
            height:100%;
            border-right: 0;
            padding:0;
            height: 457px;
        }
        .caculate-area{
            border: 1px solid;
            height:100%;
            padding:0;
            height: 457px;
        }
        .var-title{
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
            background: #ccc;
        }
        .var-list{
            border-top: 1px solid;
            overflow:auto;
            height: 420px;
        }
        ul,li{
            padding: 0;
            margin: 0;
            list-style: none;
            overflow-x:hidden;
        }
        .var-list .item-list{
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            padding-left: 5px;
            background: #ddd;
            margin: 3px;
            position: relative;
        }

        .var-list  .hover {
            background: #F39814; color: white;
        }


        .var-list .item-list .item-title{
            margin-left: 5px;
        }

        #selectable .ui-selecting { background: #FECA40; }
        #sortable { list-style-type: none; margin: 0; padding: 0; width: 335px;padding-top: 5px;}
        #sortable li { margin: 3px 3px 3px 0; padding: 1px; float: left; width: 80px; height: 75px; font-size: 4em; text-align: center; }

        .ui-state-default:hover{
            background: #F39814; color: white;
            cursor: pointer;
        }
        .display-area{
            width:100%;
            font-size: 2.5em;
            word-wrap:break-word;
            word-break:break-all;
            padding: 0;
            height: 420px;
            overflow:auto;
        }
        .display-area li{
            min-width:25px;
            float:left;
            text-align: center;
        }

    </style>
</head>

<body class="easyui-layout" fit="true">
<div data-options="region:'center',split:true,border:false" style="padding: 8px 0;">
    <input id="tableId" value="DYN_HY_01" type="hidden"/>
    <form id='form' style="height: 100%;">
        <div class="container" style="height: inherit;">
            <div class="row" style="height: inherit;">
                <div class="col-xs-3 var-area">
                        <div class="var-title">
                            <label>参数字段</label>

                        </div>
                    <ul id="list_area" class="var-list" style="visibility: visible; outline: none;"></ul>
                </div>
                <div class="col-xs-9 caculate-area">
                    <div class="var-title">
                        <label>计算区域</label>

                    </div>
                    <div class="col-xs-6">
                    <ul class="display-area">
                    </ul>
                    </div>
                    <div class="col-xs-6">
                    <ul id="sortable">
                        <li class="ui-state-default" _value=")">)</li>
                        <li class="ui-state-default" _value="(">(</li>
                        <li class="ui-state-default" style="width: 163px;" _value="backspace">←</li>
                        <li class="ui-state-default" _value="7">7</li>
                        <li class="ui-state-default" _value="8">8</li>
                        <li class="ui-state-default" _value="9">9</li>
                        <li class="ui-state-default" _value="+">+</li>
                        <li class="ui-state-default" _value="4">4</li>
                        <li class="ui-state-default" _value="5">5</li>
                        <li class="ui-state-default" _value="6">6</li>
                        <li class="ui-state-default" _value="-">-</li>
                        <li class="ui-state-default" _value="1">1</li>
                        <li class="ui-state-default" _value="2">2</li>
                        <li class="ui-state-default" _value="3">3</li>
                        <li class="ui-state-default" _value="*">×</li>
                        <li class="ui-state-default" _value="0" style="width: 163px;">0</li>
                        <li class="ui-state-default" _value=".">.</li>
                        <li class="ui-state-default" _value="/">÷</li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>


<jsp:include page="/avicit/platform6/h5component/common/h5uiinclude-js.jsp">
    <jsp:param value="<%=importlibs%>" name="importlibs"/>
</jsp:include>
<script src="static/js/platform/eform/common.js"></script>
<script type="text/javascript" src="static/h5/jquery-form/jquery.form.js"></script>
<script type="text/javascript" src="static/js/platform/eform/jqgridValidate.js"></script>
<script type="text/javascript" src="avicit/platform6/eform/formdesign/js/plugins/attr-jsp/calculate-property.js"></script>


</body>

</html>