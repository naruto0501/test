<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>表单帮助</title>
</head>
<body>
    <h3>1.页面全局JS参数说明</h3>
    <span>
        电子表单封装全局js对象pageParams，可通过该对象获取到当前页面的相关信息：
        <br>
        <span style="color: red;">pageParams.dataSourceId</span> 返回字符串；表示表单数据源ID；
        <br>
        <span style="color: red;">pageParams.tableName</span> 返回字符串；表示表单物理表名称；
        <br>
        <span style="color: red;">pageParams.id</span> 返回字符串；表示业务数据ID；
        <br>
        <!-- <span style="color: red;">pageParams.isInsert</span> 返回布尔值；表示表单是否为添加数据，true表示新增、false表示更新；
        <br> -->
        <span style="color: red;">pageParams.entryId</span> 返回字符串；表示流程实例ID；
        <br>
        <span style="color: red;">pageParams.formData</span> 返回对象；表示表单数据,不可在当前表数据集配置中使用；
        <br>
        <span style="color: red;">pageParams.urlParam</span> 返回对象；表示页面URL参数；
        <br>
        <span style="color: red;">pageParams.session</span> 返回对象；表示页面session数据；具体如下：
        <ul style="margin-top:0">
        <li>orgIndentity：当前组织应用ID</li>
        <li>appId：当前应用ID</li>
        <li>userId：当前用户ID</li>
        <li>userName：当前用户名称</li>
        <li>loginName：当前用户登录名</li>
        <li>deptId：当前部门ID</li>
        <li>deptName：当前部门名称</li>
        <li>user：当前用户对象</li>
        </ul>
    </span>
</body>
</html>