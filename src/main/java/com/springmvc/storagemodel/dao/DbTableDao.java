package com.springmvc.storagemodel.dao;

import com.springmvc.storagemodel.model.DbTable;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DbTableDao {

    int insert(DbTable record);

    int deleteByPrimaryKey(String id);

    int update(DbTable record);

    DbTable selectByPrimaryKey(String id);

    List<DbTable> selectList(DbTable record);

    List<DbTable> searchDbTableList(@Param("searchParm") String searchParm);

    DbTable selectTableByName(@Param("tableName") String tableName);
    
    DbTable selectTableByNameAndDataSourceId(@Param("tableName") String tableName, @Param("dataSourceId") String dataSourceId);
	

}