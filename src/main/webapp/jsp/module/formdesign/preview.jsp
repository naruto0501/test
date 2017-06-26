<%--
  Created by IntelliJ IDEA.
  User: xb
  Date: 2017/2/24
  Time: 10:40
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="avicit.platform6.commons.utils.ViewUtil"%>
<html>
<head>
    <title>表单预览</title>

    <base href="<%=ViewUtil.getRequestPath(request)%>">
    <jsp:include page="/avicit/platform6/component/common/EasyUIJsInclude.jsp"></jsp:include>
    <jsp:include page="/avicit/platform6/modules/system/commonpopup/commonSelectionHead.jsp"></jsp:include>
</head>

<body>
    <div id="previewDiv">
        <%-- 电子表单预览区域 --%>
    </div>

    <script type="text/javascript">
        var previewHtml = parent.editor.toHtml();
        $("#previewDiv").append(previewHtml);
    </script>
</body>
</html>
