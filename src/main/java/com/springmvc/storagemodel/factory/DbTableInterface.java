package com.springmvc.storagemodel.factory;

import com.springmvc.storagemodel.model.DbTableColDTO;
import com.springmvc.storagemodel.model.TableColData;

import java.util.List;
import java.util.Map;

public interface DbTableInterface {
	
	
	/**
	 * 获取字段sql
	 * @param list 字段设计表数据集
	 * @param columns 返回的字段拼接map
	 */
    String getColumns(List<DbTableColDTO> list, Map<String, Object> columns);
	

	/**
	 * 查询表是否存在
	 * @param tableName 表名
	 * @return
	 */
	String checkTableExist(String tableName);
	
	
	String joinColumnStatement(DbTableColDTO entity) ;

	String getTableColSelectSqlExpression(TableColData tableColData);

	String getCLOBorderby(String column);
	
	String getDateFormat(String dateString);
}
