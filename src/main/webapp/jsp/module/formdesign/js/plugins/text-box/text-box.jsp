<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<form class="form">
    <div class="form-group">
        <label class="control-label">中文名称：</label>
        <input type="text" name="colLabel" id="colLabel" style="width: 120px;" onblur="getPinyin();">
    </div>

    <div class="form-group">
        <label class="control-label">英文名称：</label>
        <input type="text" name="colName" id="colName" style="width: 120px;">
    </div>

    <div class="form-group">
        <label class="control-label">字段长度：</label>
        <input type="text" name="colLength" id="colLength" style="width: 120px;" value="50">
    </div>

    <div class="form-group">
        <label class="control-label">是否显示：</label>
        <select name="colIsVisible" id="colIsVisible">
            <option value="Y" selected>是</option>
            <option value="N">否</option>
        </select>
    </div>

    <div class="form-group">
        <label class="control-label">是否查询字段：</label>
        <select name="colIsSearch" id="colIsSearch">
            <option value="Y" selected>是</option>
            <option value="N">否</option>
        </select>
    </div>

    <div class="form-group">
        <label class="control-label">是否必填：</label>
        <select name="colIsMust" id="colIsMust">
            <option value="Y">是</option>
            <option value="N" selected>否</option>
        </select>
    </div>

    <div class="form-group">
        <label class="control-label">是否列表显示：</label>
        <select name="colIsTabVisible" id="colIsTabVisible">
            <option value="Y" selected>是</option>
            <option value="N">否</option>
        </select>
    </div>

    <div class="form-group">
        <label class="control-label">是否详细显示：</label>
        <select name="colIsDetail" id="colIsDetail">
            <option value="Y" selected>是</option>
            <option value="N">否</option>
        </select>
    </div>

    <div class="form-group">
        <label class="control-label">是否只读：</label>
        <select name="colDropdownType" id="colDropdownType">
            <option value="Y">是</option>
            <option value="N" selected>否</option>
        </select>
    </div>

    <div class="form-group">
        <label class="control-label">是否唯一：</label>
        <select name="colIsUnique" id="colIsUnique">
            <option value="Y">是</option>
            <option value="N" selected>否</option>
        </select>
    </div>
</form>