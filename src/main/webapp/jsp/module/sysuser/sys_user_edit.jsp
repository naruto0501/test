<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
	
	 <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
               aria-hidden="true">×
            </button>
            <h4 class="modal-title" id="myModalLabel">
               用户编辑
            </h4>
         </div>
         <div class="modal-body">
         <form class="form-horizontal" role="form" id="formUser">
                    <fieldset>
                       <div class="form-group">
                          <label class="col-lg-2 control-label" for="username">用户名</label>
                          <div class="col-lg-4">
                             <input class="form-control" id="username" name="username" type="text"/>
                          </div>
                          <label class="col-lg-2 control-label" for="nickname">用户名称</label>
                          <div class="col-lg-4">
                             <input class="form-control" id="nickname" name="nickname" type="text" placeholder=""/>
                          </div>
                       </div>
				<div class="form-group">
					<label class="col-lg-2 control-label" for="ds_username">用户状态</label>
					<label class="radio-inline"> 
						<input type="radio" name="state" id="inlineRadio1" value="1">
						有效
					</label> 
					<label class="radio-inline"> 
						<input type="radio" name="state" id="inlineRadio2" value="0">
						无效
					</label>
				</div>
			</fieldset>     
                    
         </form>
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-default" 
               data-dismiss="modal">
               关闭
            </button>
            <button type="button" class="btn btn-primary" onclick="addUser();">
               提交
            </button>
         </div>
<script type="text/javascript">
	var results=$.parseJSON('${user}');
	$('#formUser').setform(results);
</script> 