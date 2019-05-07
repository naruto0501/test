package com.springmvc.storagemodel.model;

import java.io.Serializable;
import java.util.List;

public class DbTableVo implements Serializable{
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String tableName;
    private String pk;
    private String tableComment;
    private List<DbField> fieldList;
    private String dataSourceId;
    private String type;
	public String getDataSourceId() {
		return dataSourceId;
	}
	public void setDataSourceId(String dataSourceId) {
		this.dataSourceId = dataSourceId;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getPk() {
		return pk;
	}
	public void setPk(String pk) {
		this.pk = pk;
	}
	public String getTableComment() {
		return tableComment;
	}
	public void setTableComment(String tableComment) {
		this.tableComment = tableComment;
	}
	public List<DbField> getFieldList() {
		return fieldList;
	}
	public void setFieldList(List<DbField> fieldList) {
		this.fieldList = fieldList;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}