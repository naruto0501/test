package com.springmvc.storagemodel.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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
 * 创建时间： 2017-05-20 16:11
 * </p>
 * <p>
 * 类说明：请填写
 * </p>
 * <p>
 * 修改记录：
 * </p>
 */
public class DbTableColDTO extends BeanBase {
	private static final long serialVersionUID = 1L;

	private String id;

	private String tableId;

	private String colName;

	private String colType;
	private String colTypeName;

	private String colLength;

	private String attribute02;

	private String colNullable;

	private String colDefault;

	private String colComments;

	private String colIsPk;

	private String colIsSys;

	private String colIsUnique;

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	private java.util.Date lastUpdateDateBegin;
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	private java.util.Date lastUpdateDateEnd;
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	private java.util.Date creationDateBegin;
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	private java.util.Date creationDateEnd;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTableId() {
		return tableId;
	}

	public String getColIsSys() {
		return colIsSys;
	}

	public void setColIsSys(String colIsSys) {
		this.colIsSys = colIsSys;
	}

	public void setTableId(String tableId) {
		this.tableId = tableId;
	}

	public String getColName() {
		return colName;
	}

	public void setColName(String colName) {
		this.colName = colName;
	}

	public String getColType() {
		return colType;
	}

	public void setColType(String colType) {
		this.colType = colType;
	}

	public String getAttribute02() {
		return attribute02;
	}

	public void setAttribute02(String attribute02) {
		this.attribute02 = attribute02;
	}

	public String getColTypeName() {
		return colTypeName;
	}

	public void setColTypeName(String colTypeName) {
		this.colTypeName = colTypeName;
	}

	public String getColLength() {
		return colLength;
	}

	public void setColLength(String colLength) {
		this.colLength = colLength;
	}

	public String getColNullable() {
		return colNullable;
	}

	public void setColNullable(String colNullable) {
		this.colNullable = colNullable;
	}

	public String getColDefault() {
		return colDefault;
	}

	public void setColDefault(String colDefault) {
		this.colDefault = colDefault;
	}

	public String getColComments() {
		return colComments;
	}

	public void setColComments(String colComments) {
		this.colComments = colComments;
	}

	public String getColIsPk() {
		return colIsPk;
	}

	public void setColIsPk(String colIsPk) {
		this.colIsPk = colIsPk;
	}

	public String getColIsUnique() {
		return colIsUnique;
	}

	public void setColIsUnique(String colIsUnique) {
		this.colIsUnique = colIsUnique;
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



}