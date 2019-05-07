<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<form class="form">
    <input type="hidden" name="elementType" id="elementType" value="table">
    <div class="accordion-style1 panel-group" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion"
                       href="#collapsedb">
                        <i data-icon-show="ace-icon fa fa-angle-right" data-icon-hide="ace-icon fa fa-angle-down"
                           class="bigger-110 ace-icon fa fa-angle-down"></i>
                        数据集配置
                    </a>
                </h4>
            </div>
            <div id="collapsedb" class="panel-collapse collapse in">
                <div class="panel-body">
                	<div class="form-group">
                        <div class="radio">
                            <label>
                                <input name="datatype" type="radio" class="ace" value="0">
                                <span class="lbl">当前表</span>
                            </label>
                            <label>
                                <input name="datatype" type="radio" class="ace" value="1">
                                <span class="lbl">外部表</span>
                            </label>
                    </div>
                    
                    <div style="display:none;" id="dbdata">
	                	<div class="form-group">
	                        <label class="control-label" for="dataname">数据集名称：</label>
	                        <input type="text" name="dataname" id="dataname" class="input-medium valid" >
	                    </div>
	                    <div class="form-group">
	                        <label class="control-label">存储模型：</label>
	                        <input type="text" name="dbname" id="dbname" class="input-medium" readonly>
	                        <input type="hidden" name="dbid" id="dbid" class="input-medium">
	                    </div>
	                    <div class="form-group">
					    <label class="control-label">加载顺序：</label>
					    <input type="text" name="order" id="order" class="input-medium" value="">
					</div>
					<div class="form-group">
					    <label>
					        <input name="issave" id="issave" type="checkbox" class="ace" value="Y">
					        <span class="lbl">&nbsp;启用存储</span>
					    </label>
					</div>
					<div class="form-group">
					<label>
					        <input name="isdelete" id="isdelete" type="checkbox" class="ace" value="Y">
					        <span class="lbl">&nbsp;启用删除</span>
					    </label>
					    </div>
	                 </div>
	                    <div class="form-group">
	                        <label class="control-label">查询参数配置：<a title="查询参数配置" id="addpara"><i
	                                class="fa fa-fw fa-lg fa-pencil-square-o"></i></a></label>
	                        <input type="hidden" name="paralist" id="paralist" class="input-medium">
	                        <ul id="paraarea" class="item-list">
	                        </ul>
	                    </div>
                    
                </div>
            </div>
        </div>
    </div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title">
					<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion"
					   href="#collapseattr">
						<i data-icon-show="ace-icon fa fa-angle-right" data-icon-hide="ace-icon fa fa-angle-down"
						   class="bigger-110 ace-icon fa fa-angle-down"></i>
						表格属性
					</a>
				</h4>
			</div>
			<div class="panel-collapse collapse" id="collapseattr">
				<div class="panel-body">
					<div class="form-group">
						<label>
							<input name="isaccordion" id="isaccordion" type="checkbox" class="ace" value="Y">
							<span class="lbl">&nbsp;启用折叠</span>
						</label>
					</div>
					<div class="form-group" id="accordiontitlediv">
						<label class="control-label">折叠标题：</label>
						<input type="text" name="accordiontitle" id="accordiontitle" class="input-medium" value="">
					</div>
					<div class="form-group" id="activediv">
						<label>
							<input name="active" id="active" type="checkbox" class="ace" value="1">
							<span class="lbl">&nbsp;默认折叠</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</form>