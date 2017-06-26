<%@page import="com.utils.JsonHelper"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="com.utils.CommonUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*"%>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.util.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.apache.commons.fileupload.FileItemIterator" %>
<%@ page import="org.apache.commons.fileupload.disk.DiskFileItemFactory" %>
<%@ page import="java.io.BufferedInputStream" %>
<%@ page import="java.io.BufferedOutputStream" %>
<%@ page import="java.io.File"%>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.io.FileOutputStream" %>
<%@ page import="java.util.regex.Matcher" %>
<%@ page import="java.util.regex.Pattern" %>
<%@ page import="java.util.Date" %>


<%

//保存文件路径
String filePath = "uploadfile";
String userName = (String)request.getSession().getAttribute("_USER_NAME");
String realPath = request.getRealPath("\\") + filePath + "\\" + userName;
String baseUrl = CommonUtil.getRequestPath(request);
//判断路径是否存在，不存在则创建
File dir = new File(realPath);
if(!dir.isDirectory())
    dir.mkdir();

if(ServletFileUpload.isMultipartContent(request)){

    DiskFileItemFactory dff = new DiskFileItemFactory();
    dff.setRepository(dir);
    dff.setSizeThreshold(1024000);
    ServletFileUpload sfu = new ServletFileUpload(dff);
    FileItemIterator fii = sfu.getItemIterator(request);
    String title = "";  
    String url = "";    
    String fileName = "";
    String newFileName = "";
	String state="SUCCESS";
	Map<String,String> jsonMap = new HashMap<String,String>();
    while(fii.hasNext()){
        FileItemStream fis = fii.next();

        try{
            if(!fis.isFormField() && fis.getName().length()>0){
                fileName = fis.getName();
				/* Pattern reg=Pattern.compile("[.]jpg|png|jpeg|gif|rar|doc|docx|ppt|pptx|$");
				Matcher matcher=reg.matcher(fileName);
				if(!matcher.find()) {
					state = "文件类型不允许！";
					break;
				} */
				//newFileName = new Date().getTime()+fileName.substring(fileName.lastIndexOf("."),fileName.length());
                url = realPath+"\\"+fileName;
				
                BufferedInputStream in = new BufferedInputStream(fis.openStream());//获得文件输入流
                FileOutputStream a = new FileOutputStream(new File(url));
                BufferedOutputStream output = new BufferedOutputStream(a);
                Streams.copy(in, output, true);//开始把文件写到你指定的上传文件夹
                jsonMap.put("url",baseUrl +"uploadfile/"+userName+"/"+ fileName);
                jsonMap.put("state",state);
            }

        }catch(Exception e){
            e.printStackTrace();
            state = "FAILED";
            jsonMap.put("state",state);
            jsonMap.put("msg",e.getMessage());
        }
    }
    response.setCharacterEncoding("UTF-8");  
    response.setContentType("application/json; charset=utf-8");
    response.getWriter().print(JsonHelper.getInstance().writeValueAsString(jsonMap));
    /* response.getWriter().print("<script type='text/javascript'>");
    response.getWriter().print("alert('"+baseUrl +"uploadfile/"+userName+"/"+ fileName+"')"); 
    response.getWriter().print("</script>"); */
}
%>
