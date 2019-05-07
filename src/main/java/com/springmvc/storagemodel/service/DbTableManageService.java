package com.springmvc.storagemodel.service;

import com.springmvc.storagemodel.model.DbTable;
import com.springmvc.storagemodel.model.DbTableVo;

import java.util.List;
import java.util.Map;


public interface DbTableManageService {



    Map<String, Object> saveDbTable(DbTable data);

    int deleteDbTable(String id);

    Map<String, Object> updateDbTable(DbTable data);

    DbTable getDbTable(String id);

    List<DbTable> selectDbTableList(DbTable parm);

    List<DbTable> searchDbTableList(String searchParm);

    String doCheckTableName(List<DbTableVo> tables);

    void doImportTable(DbTableVo table, String dataSourceId) throws Exception;

	int deleteDbTableAll(String id);

}
