package com.springmvc.storagemodel.model;


import com.springmvc.bean.BeanBase;

/**
 * <p>
 * 金航数码科技有限责任公司
 * </p>
 * <p>
 * 作者：请填写
 * </p>
 * <p>
 * 邮箱：请填写
 * </p>
 * <p>
 * 创建时间： 2017-05-20 18:07
 * </p>
 * <p>
 * 类说明：请填写
 * </p>
 * <p>
 * 修改记录：
 * </p>
 */
public class DbTable extends BeanBase {
	private static final long serialVersionUID = 1L;

	private String id;
	private String tableName;
	private String tableComments;
	private String tableIsCreated;

	private java.util.Date lastUpdateDateBegin;

	private java.util.Date lastUpdateDateEnd;

	private java.util.Date creationDateBegin;

	private java.util.Date creationDateEnd;
	private String tableType;
	private String dataSourceId;

	private String dataSourceName;

	private String connectType;

	private String dbType;

	public String getConnectType() {
		return connectType;
	}

	public void setConnectType(String connectType) {
		this.connectType = connectType;
	}

	private String fkColName;

	public String getFkColName() {
		return fkColName;
	}

	public void setFkColName(String fkColName) {
		this.fkColName = fkColName;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTableComments() {
		return tableComments;
	}

	public void setTableComments(String tableComments) {
		this.tableComments = tableComments;
	}

	public String getTableIsCreated() {
		return tableIsCreated;
	}

	public void setTableIsCreated(String tableIsCreated) {
		this.tableIsCreated = tableIsCreated;
	}

	public java.util.Date getLastUpdateDateBegin() {
		return lastUpdateDateBegin;
	}

	public void setLastUpdateDateBegin(java.util.Date lastUpdateDateBegin) {
		this.lastUpdateDateBegin = lastUpdateDateBegin;
	}

	public java.util.Date getLastUpdateDateEnd() {
		return lastUpdateDateEnd;
	}

	public void setLastUpdateDateEnd(java.util.Date lastUpdateDateEnd) {
		this.lastUpdateDateEnd = lastUpdateDateEnd;
	}

	public java.util.Date getCreationDateBegin() {
		return creationDateBegin;
	}

	public void setCreationDateBegin(java.util.Date creationDateBegin) {
		this.creationDateBegin = creationDateBegin;
	}

	public java.util.Date getCreationDateEnd() {
		return creationDateEnd;
	}

	public void setCreationDateEnd(java.util.Date creationDateEnd) {
		this.creationDateEnd = creationDateEnd;
	}

	public String getTableType() {
		return tableType;
	}

	public void setTableType(String tableType) {
		this.tableType = tableType;
	}

	public String getDataSourceId() {
		return dataSourceId;
	}

	public void setDataSourceId(String dataSourceId) {
		this.dataSourceId = dataSourceId;
	}

	public String getDataSourceName() {
		return dataSourceName;
	}

	public void setDataSourceName(String dataSourceName) {
		this.dataSourceName = dataSourceName;
	}

	public String getDbType() {
		return dbType;
	}

	public void setDbType(String dbType) {
		this.dbType = dbType;
	}

}