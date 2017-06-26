<%@page import="com.utils.CommonUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<base href="<%=CommonUtil.getRequestPath(request)%>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
   	<title>排位</title>
   	<link href="static/css/bootstrap.min.css" rel="stylesheet">
   	<link href="static/css/bootstrap.css" rel="stylesheet">
  	<script src="static/js/jquery-1.11.3.min.js"></script>
   	<script src="static/js/bootstrap.min.js"></script>
<style type="text/css">
.span6 {
width:500px;
}

.container-fluid {
  padding-right: 0px;
  padding-left: 0px;
  margin-right: auto;
  margin-left: auto;
}
</style>
</head>
<body>
<div class="container-fluid">
	<div class="row-fluid">
		<div class="col-md-6 col-lg-4" style="padding-right:0px;padding-left:0px;">
			<table class="table table-responsive table-striped table-bordered table-hover">
				<thead>
					<tr>
						<th>
							编号
						</th>
						<th>
							产品
						</th>
						<th>
							交付时间
						</th>
						<th>
							状态
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							1
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							01/04/2012
						</td>
						<td>
							Default
						</td>
					</tr>
					<tr>
						<td>
							1
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							01/04/2012
						</td>
						<td>
							Approved
						</td>
					</tr>
					<tr>
						<td>
							2
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							02/04/2012
						</td>
						<td>
							Declined
						</td>
					</tr>
					<tr>
						<td>
							3
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							03/04/2012
						</td>
						<td>
							Pending
						</td>
					</tr>
					<tr>
						<td>
							4
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							04/04/2012
						</td>
						<td>
							Call in to confirm
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="col-md-6 col-lg-8">
			<canvas id="myCanvas" style="width:600px;height:400px">
			</canvas>
		</div>
	</div>
</div>
</body>
<script type="text/javascript">
$(function(){
	var isdrag = false;
	var currentx = 0;
	var currenty = 0;
	var canvas=document.getElementById('myCanvas');
	canvas.width=600;
	canvas.height=400;
	
	var ctx=canvas.getContext('2d');
	ctx.fillStyle='#FF0000';
	ctx.fillRect(0,0,50,50);
	
	function draw(point){
		ctx.clearRect(0,0,600,400);
		ctx.fillStyle='#FF0000';
		ctx.fillRect(point.x,point.y,50,50);
		currentx = point.x;
		currenty = point.y;
	}
	
	function getMousePoint(mycanvas,x,y){
		var box = mycanvas.getBoundingClientRect();
		var point = {
				x:x-box.left,
				y:y-box.top
		};
		return point;
	}
	
	function isInCtx(event){
		var point = getMousePoint(canvas,event.pageX,event.pageY);
		if (point.x > currentx+50 || point.x<currentx){
			return false;
		}
		if (point.y > currenty+50 || point.y<currenty){
			return false;
		}
		return true;
	}
	
	$("#myCanvas").mouseup(function(event){isdrag=false;});
	$("#myCanvas").mousedown(function(event){
		if(isInCtx(event)){
			isdrag = true;
		}
	});
	$("#myCanvas").mousemove(function(event){

		if (!isdrag)
			return;
		var point = getMousePoint(canvas,event.pageX-25,event.pageY-25);
		currentx = point.x;
		currenty = point.y;
		draw(point);
	});
});
</script>
</html>