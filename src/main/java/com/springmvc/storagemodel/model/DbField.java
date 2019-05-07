package com.springmvc.storagemodel.model;

import java.io.Serializable;

public class DbField implements Serializable{
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String columnName;
    private String dataType;
    private String dataLength;
    private String isNullable;
    private String isPrimary;
    private String comment;
    private String scale;
	public String getColumnName() {
		return columnName;
	}
	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}
	public String getDataType() {
		return dataType;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public String getDataLength() {
		return dataLength;
	}
	public void setDataLength(String dataLength) {
		this.dataLength = dataLength;
	}
	public String getIsNullable() {
		return isNullable;
	}
	public void setIsNullable(String isNullable) {
		this.isNullable = isNullable;
	}
	public String getIsPrimary() {
		return isPrimary;
	}
	public void setIsPrimary(String isPrimary) {
		this.isPrimary = isPrimary;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getScale() {
		return scale;
	}
	public void setScale(String scale) {
		this.scale = scale;
	}
    
}