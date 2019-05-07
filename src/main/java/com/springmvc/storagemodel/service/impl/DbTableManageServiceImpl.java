package com.springmvc.storagemodel.service.impl;

import com.core.exception.DaoException;
import com.springmvc.storagemodel.common.StorageConstant;
import com.springmvc.storagemodel.dao.DbTableDao;
import com.springmvc.storagemodel.model.DbField;
import com.springmvc.storagemodel.model.DbTable;
import com.springmvc.storagemodel.model.DbTableColDTO;
import com.springmvc.storagemodel.model.DbTableVo;
import com.springmvc.storagemodel.service.DbTableManageService;
import com.utils.CommonUtil;
import com.utils.PojoUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DbTableManageServiceImpl implements DbTableManageService {

    @Autowired
	private DbTableDao dbTableDao;
	@Autowired
	private DbTableColService colService;

    private static Logger logger = LoggerFactory.getLogger(DbTableManageServiceImpl.class);

    @Override
    public Map<String, Object> saveDbTable(DbTable data) {
    	DbTable table = this.validateTableByNameAndDataSourceId(data.getTableName(),data.getDataSourceId());
    	if (table!=null){
    		throw new DaoException("表名已经存在!");
    	}
    	if (StringUtils.isEmpty(data.getId())){
            String id = CommonUtil.getId();
            data.setId(id);
        }

        PojoUtil.setSysProperties(data, "insert");
        int result = dbTableDao.insert(data);

        Map<String, Object> back = new HashMap<String, Object>();
        back.put("result", result);
        back.put("data", data);

        return back;
    }

    private Map<String, Object> importDbTable(DbTable data) {
        PojoUtil.setSysProperties(data, "insert");
        int result = dbTableDao.insert(data);


        Map<String, Object> back = new HashMap<String, Object>();
        back.put("result", result);
        back.put("data", data);

        return back;
    }

    @Override
    public int deleteDbTable(String id) {
        return dbTableDao.deleteByPrimaryKey(id);
    }
    
    @Override
    public int deleteDbTableAll(String id) {

    	colService.deleteColByTableId(id);
    	return this.deleteDbTable(id);
    }

    @Override
    public Map<String, Object> updateDbTable(DbTable data) {
    	//DbTable table = this.validateTableName(data.getTableName());
    	DbTable table = this.validateTableByNameAndDataSourceId(data.getTableName(),data.getDataSourceId());
    	if (table!=null && !table.getId().equals(data.getId())){
    		throw new DaoException("表名已经存在!");
    	}
    	
    	
        //记录日志
        DbTable old = dbTableDao.selectByPrimaryKey(data.getId());
        PojoUtil.setSysProperties(data, "update");
        PojoUtil.copyProperties(old, data, true);
        int result = dbTableDao.update(old);

        Map<String, Object> back = new HashMap<String, Object>();
        back.put("result", result);
        back.put("data", old);

        return back;
    }
    
    public DbTable validateTableName(String tableName){
    	return dbTableDao.selectTableByName(tableName);
    }
    
    public DbTable validateTableByNameAndDataSourceId(String tableName,String dataSourceId){
    	return dbTableDao.selectTableByNameAndDataSourceId(tableName,dataSourceId);
    }

    @Override
    public DbTable getDbTable(String id) {
        DbTable data = dbTableDao.selectByPrimaryKey(id);

        return data;
    }

    @Override
    public List<DbTable> selectDbTableList(DbTable parm) {
        return dbTableDao.selectList(parm);
    }

    @Override
    public List<DbTable> searchDbTableList(String searchParm) {
        return dbTableDao.searchDbTableList(searchParm);
    }

    public void doImportTable(DbTableVo table,String dataSourceId) {
    	DbTable extdataTable = DbTableVoToDbTable(table);
		extdataTable.setDataSourceId(dataSourceId);
		String id = "";
		DbTable para = new DbTable();
		para.setTableName(extdataTable.getTableName());
		para.setDataSourceId(dataSourceId);
		List<DbTable> selectDbTableList = this.selectDbTableList(para);
		if (selectDbTableList.size()>0){
			id = selectDbTableList.get(0).getId();
			this.deleteDbTableAll(id);
		}else{
			id = CommonUtil.getId();
		}
		extdataTable.setId(id);
		Map<String, Object> saveDbTable = this.importDbTable(extdataTable);
		extdataTable = (DbTable)saveDbTable.get("data");
		String tableId = extdataTable.getId();
		for (DbField field : table.getFieldList()){
			DbTableColDTO extdataColumn = DbFieldToDbTableColDTO(field);
			extdataColumn.setTableId(tableId);
			colService.insertDbTableCol(extdataColumn);
		}

	}
    
    
    private DbTable DbTableVoToDbTable(DbTableVo table){
    	DbTable dbTable = new DbTable();
    	dbTable.setTableIsCreated("Y");
        dbTable.setDbType(StorageConstant.getDbType(table.getType()));
    	dbTable.setTableName(table.getTableName());
		if (StringUtils.isEmpty(table.getTableComment())){
			dbTable.setTableComments(table.getTableName());
		}else{
			dbTable.setTableComments(table.getTableComment());
		}
		return dbTable;
	}
    
    private DbTableColDTO DbFieldToDbTableColDTO(DbField field){
    	DbTableColDTO extdataColumn = new DbTableColDTO();
    	if ("ID".equals(field.getColumnName())){
            extdataColumn.setColIsPk("Y");
        }else {
            extdataColumn.setColIsPk(field.getIsPrimary());
        }
		extdataColumn.setColName(field.getColumnName());
		if (StringUtils.isEmpty(field.getComment())){
			extdataColumn.setColComments(field.getColumnName());
		}else{
			extdataColumn.setColComments(field.getComment());
		}
		extdataColumn.setColType(StorageConstant.getDbColType(field.getDataType()));
		BigDecimal precision =new BigDecimal(field.getDataLength());
		extdataColumn.setColLength(precision.toString());
		BigDecimal scale =new BigDecimal(field.getScale());
		if (scale!=null){
			extdataColumn.setAttribute02(scale.toString());
		}
		extdataColumn.setColNullable(field.getIsNullable());
		return extdataColumn;
	}


	@Override
	public String doCheckTableName(List<DbTableVo> tables) {
		String msg = "";
		for (DbTableVo table : tables){
			//DbTable check = this.validateTableName(table.getTableName());
			DbTable check = this.validateTableByNameAndDataSourceId(table.getTableName(),table.getDataSourceId());
			if (check!=null){
	    		msg += "【"+table.getTableName()+"】表名已经存在";
	    	}
		}
		return msg;
	}

}
