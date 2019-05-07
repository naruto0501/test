package com.springmvc.storagemodel.model;

import java.io.Serializable;
import java.util.List;

/**
 * 表数据
 */
public class TableData implements Serializable {

    private static final long serialVersionUID = 3444522792193792054L;

    private String tableName;

    private String dataSourceId;

    private String primaryKeyValue;

    private List<TableColData> tableColDataList;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getDataSourceId() {
        return dataSourceId;
    }

    public void setDataSourceId(String dataSourceId) {
        this.dataSourceId = dataSourceId;
    }

    public String getPrimaryKeyValue() {
        return primaryKeyValue;
    }

    public void setPrimaryKeyValue(String primaryKeyValue) {
        this.primaryKeyValue = primaryKeyValue;
    }

    public List<TableColData> getTableColDataList() {
        return tableColDataList;
    }

    public void setTableColDataList(List<TableColData> tableColDataList) {
        this.tableColDataList = tableColDataList;
    }

}