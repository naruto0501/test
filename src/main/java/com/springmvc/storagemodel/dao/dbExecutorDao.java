package com.springmvc.storagemodel.dao;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface dbExecutorDao {
	
	int createTable(@Param(value = "tableName") String tableName, @Param(value = "columns") Map<String, Object> columns, @Param(value = "pkey") String pKey);

	Integer tableIsExist(@Param(value = "sql") String sql);

	int addColumn(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName, @Param(value = "colType") String colType, @Param(value = "colNullable") String colNullable);

	int alterColumnName(@Param(value = "tableName") String tableName, @Param(value = "oldColName") String oldColName, @Param(value = "colName") String colName);

	int alterColumnType(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName, @Param(value = "colType") String colType);

	int alterColumnDefault(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName, @Param(value = "colDefault") String colDefault);

	int alterDateColumnDefault(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName, @Param(value = "colDefault") String colDefault);

	int deleteColumnComment(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName);

	int alterColumnComment(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName, @Param(value = "colLabel") String colLabel, @Param(value = "colTypeLength") String colTypeLength);

	int createIndex(@Param(value = "indexName") String indexName, @Param(value = "tableName") String tableName, @Param(value = "colName") String colName, @Param(value = "indexType") String indexType);

	int dropIndex(@Param(value = "indexName") String indexName);

	int dropTable(@Param(value = "tableName") String tableName);

	int dropColumn(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName);

	List<Map<String,Object>> selectSql(@Param(value = "sql") String sql);

	int deleteColumnConstraint(@Param(value = "tableName") String tableName, @Param(value = "colName") String colName);
	
	

}
