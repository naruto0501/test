<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String except  = request.getParameter("except")!=null ? request.getParameter("except"): "" ;
%>

<table>

    <%if (!except.contains("init")) {%>
    <tr><td>
        <div class="form-group">
            <label class="control-label">初始化事件：</label>
            <textarea name="onLoadEvent" id="onLoadEvent" style="width: 100%;"></textarea>
        </div>
    </td></tr>
    <% }%>
    <%if (!except.contains("click")) {%>
<tr><td>
<div class="form-group">
    <label class="control-label">Click事件：</label>
    <textarea name="onClickEvent" id="onClickEvent" style="width: 100%;"></textarea>
</div>
</td></tr>
<% }%>

<%if (!except.contains("change")) {%>
<tr><td>
<div class="form-group">
    <label class="control-label">Change事件：</label>
    <textarea name="onChangeEvent" id="onChangeEvent" style="width: 100%;"></textarea>
</div>
</td></tr>
<% }%>

<%if (!except.contains("keyup")) {%>
<tr><td>
<div class="form-group">
    <label class="control-label">Keyup事件：</label>
    <textarea name="onKeyupEvent" id="onKeyupEvent" style="width: 100%;"></textarea>
</div>
</td></tr>
<% }%>

<%if (!except.contains("blur")) {%>
<tr><td>
<div class="form-group">
    <label class="control-label">Blur事件：</label>
    <textarea name="onBlurEvent" id="onBlurEvent" style="width: 100%;"></textarea>
</div>
</td></tr>
<% }%>

<%if (!except.contains("focus")) {%>
<tr><td>
<div class="form-group">
    <label class="control-label">Focus事件：</label>
    <textarea name="onFocusEvent" id="onFocusEvent" style="width: 100%;"></textarea>
</div>
</td></tr>
<% }%>

<%if (!except.contains("before")) {%>
<tr><td>
<div class="form-group">
    <label class="control-label">前置事件：</label>
    <textarea name="onBeforeEvent" id="onBeforeEvent" style="width: 100%;"></textarea>
</div>
</td></tr>
<% }%>

</table>
<script>
    function eventEdit(_this, title) {
        layer.open({
            type: 2,
            title: title,
            skin: 'layui-layer-rim',
            area: ['70%', '80%'],
            content: 'avicit/platform6/eform/common/jseditor.html',
            btn: ['确认', '取消'],
            success: function (layero, index) {
                //传入参数，并赋值给iframe的元素
                var iframeWin = layero.find('iframe')[0].contentWindow;
                iframeWin.setEditorValue(_this.value);
            },
            yes: function (index,layero) {
                var frm = layero.find('iframe')[0].contentWindow;
                $(_this).val(frm.getEditorValue()).trigger("keyup");
                layer.close(index);
            }
        });
    }

    $("#onClickEvent").click(function () {
        var _this = this;
        eventEdit(_this, 'Click事件');
    });
    $("#onChangeEvent").click(function () {
        var _this = this;
        eventEdit(_this, 'Change事件');
    });
    $("#onKeyupEvent").click(function () {
        var _this = this;
        eventEdit(_this, 'Keyup事件');
    });
    $("#onBlurEvent").click(function () {
        var _this = this;
        eventEdit(_this, 'Blur事件');
    });
    $("#onFocusEvent").click(function () {
        var _this = this;
        eventEdit(_this, 'Focus事件');
    });
    $("#onBeforeEvent").click(function () {
        var _this = this;
        eventEdit(_this, '前置事件');
    });
    $("#onLoadEvent").click(function () {
        var _this = this;
        eventEdit(_this, '初始化事件');
    });
</script>