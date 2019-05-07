package com.springmvc.bean;

import java.io.Serializable;

public abstract class BeanBase implements Serializable {
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -8846053093880926413L;

	protected String createdBy; // 创建人

	protected java.util.Date creationDate; // 创建时间

	protected java.util.Date lastUpdateDate; // 最后修改时间
	protected String lastUpdatedBy; // 最后修改人
	protected String lastUpdateIp; // 修改IP

	protected Long version; // 版本


	public String getCreatedBy() {
		return createdBy;
	}


	public java.util.Date getCreationDate() {
		return creationDate;
	}


	public java.util.Date getLastUpdateDate() {
		return lastUpdateDate;
	}


	public String getLastUpdatedBy() {
		return lastUpdatedBy;
	}

	public String getLastUpdateIp() {
		return lastUpdateIp;
	}


	public Long getVersion() {
		return version;
	}
	/**
	 * 平台定义的CREATED_BY必填字段set方法
	 * @return void
	 */
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	/**
	 * 平台定义的CREATION_DATE必填字段set方法
	 * @return void
	 */
	public void setCreationDate(java.util.Date creationDate) {
		this.creationDate = creationDate;
	}
	/**
	 * 平台定义的LAST_UPDATE_DATE必填字段set方法
	 * @return void
	 */
	public void setLastUpdateDate(java.util.Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	/**
	 * 平台定义的LAST_UPDATED_BY必填字段set方法
	 * @return void
	 */
	public void setLastUpdatedBy(String lastUpdatedBy) {
		this.lastUpdatedBy = lastUpdatedBy;
	}
	/**
	 * 平台定义的LAST_UPDATE_IP必填字段set方法
	 * @return void
	 */
	public void setLastUpdateIp(String lastUpdateIp) {
		this.lastUpdateIp = lastUpdateIp;
	}

	public void setVersion(Long version) {
		this.version = version;
	}
	

	
}
