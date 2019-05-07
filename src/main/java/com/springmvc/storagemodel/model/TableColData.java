package com.springmvc.storagemodel.model;

import com.springmvc.storagemodel.common.StorageConstant;

import java.io.Serializable;

/**
 * 列数据
 */
public class TableColData implements Serializable {

    private static final long serialVersionUID = -2898020543733559740L;

    /**
     * 列名称
     */
    private String colName;
    /**
     * 列类型
     */
    private StorageConstant.ColJdbcTypeEnum colJdbcType;

    /**
     * 列查询类型
     */
    private StorageConstant.ColSelectTypeEnum colSelectType;

    /**
     * 列值
     */
    private Object colValue;

    public String getColName() {
        return colName;
    }

    public void setColName(String colName) {
        this.colName = colName;
    }

    public StorageConstant.ColJdbcTypeEnum getColJdbcType() {
        return colJdbcType;
    }

    public void setColJdbcType(StorageConstant.ColJdbcTypeEnum colJdbcType) {
        this.colJdbcType = colJdbcType;
    }

    public StorageConstant.ColSelectTypeEnum getColSelectType() {
        return colSelectType;
    }

    public void setColSelectType(StorageConstant.ColSelectTypeEnum colSelectType) {
        this.colSelectType = colSelectType;
    }

    public Object getColValue() {
        return colValue;
    }

    public void setColValue(Object colValue) {
        this.colValue = colValue;
    }

}