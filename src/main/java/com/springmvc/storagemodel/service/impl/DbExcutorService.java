package com.springmvc.storagemodel.service.impl;

import com.core.db.DbUtils;
import com.core.exception.DaoException;
import com.springmvc.storagemodel.dao.dbExecutorDao;
import com.springmvc.storagemodel.factory.DbTableFactory;
import com.springmvc.storagemodel.factory.DbTableInterface;
import com.springmvc.storagemodel.model.DbTableColDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DbExcutorService {
	
	@Autowired
	private dbExecutorDao dao;
	
	public int checkTableExist(String tableName){
		DbTableInterface produce = DbTableFactory.produce(DbUtils.getDbType());
		String sql = produce.checkTableExist(tableName);
		Integer i = dao.tableIsExist(sql);
		if (i == null){
			i = 0;
		}
		return i;
	}

	public int createDbTable(String tableName,List<DbTableColDTO> tableColList) throws DaoException {
		//实现创建表方法
	    try{

			Map<String,Object> columns=new HashMap<String,Object>();
			DbTableInterface produce = DbTableFactory.produce(DbUtils.getDbType());
			String pKey = produce.getColumns(tableColList, columns);
			int i = checkTableExist(tableName);
			if(i==0){
				dao.createTable(tableName, columns,pKey);

			}else{
				throw new DaoException("【"+tableName+"】已存在！");
			}
			for (DbTableColDTO col : tableColList){
				if(!StringUtils.isEmpty(col.getColComments())){
					alterColumnComment(tableName,col);
				}
				if(!StringUtils.isEmpty(col.getColDefault())){
					alterColumnDefault(col.getColType(),tableName, col.getColName(), col.getColDefault());
				}
			}
			dao.createIndex(tableName+"c",tableName,"CREATION_DATE,"+pKey+" ASC","");
		    return 1;
				
		}catch(Exception e){
			throw new DaoException(e.getMessage(),e);
		}
	}

	public void alterColumnComment(String tableName,DbTableColDTO col) throws DaoException{
        String colName = col.getColName();
        String colLabel = col.getColComments();
        String colType = col.getColType();
        String colLength = col.getColLength();
	    if("sqlserver2008".equals(DbUtils.getDbType())) {
            dao.deleteColumnComment(tableName, colName);
            dao.alterColumnComment(tableName, colName, colLabel,"");
        }else if("sqlserver2008".equals(DbUtils.getDbType())){
            String colTypeLength = "";
            if(colType.equals("VARCHAR2")){
            	colTypeLength = "VARCHAR("+colLength+")";
            }else if(colType.equals("DATE")){
            	colTypeLength = "DATETIME";
            }else if(colType.equals("NUMBER")){
            	colTypeLength = "DECIMAL("+colLength+","+(col.getAttribute02() == ""||col.getAttribute02()==null?0:col.getAttribute02())+")";
            }else if(colType.equals("BLOB")){
            	colTypeLength = "LONGBLOB";
            }else if(colType.equals("CLOB")){
            	colTypeLength = "LONGTEXT";
            }
            dao.alterColumnComment(tableName, colName, colLabel,colTypeLength);
        }
        else {
            dao.alterColumnComment(tableName, colName, colLabel,"");
        }
    }
	
	public void alterColumnDefault(String colType,String tableName, String colName,String colDefault) throws DaoException{
		if("sqlserver2008".equals(DbUtils.getDbType())) {
            dao.deleteColumnConstraint(tableName, colName);
            if(!StringUtils.isEmpty(colDefault)){
            	dao.alterColumnDefault(tableName, colName, colDefault);
            }
        }
        else {
        	if(!colType.equals("DATE")){
        		dao.alterColumnDefault(tableName, colName, colDefault);
        	}else{
        		dao.alterDateColumnDefault(tableName, colName, colDefault);
        	}
            
        }
	}
	
	public String addTableColumn(String tableName,DbTableColDTO entity) throws DaoException{
		return addTableColumn(tableName,entity, DbUtils.getDbType());
	}

	public String addTableColumn(String tableName,DbTableColDTO entity,String dbType) throws DaoException{
		String msg="";
		String coltype="";
		DbTableInterface produce = DbTableFactory.produce(dbType);
		coltype = produce.joinColumnStatement(entity);
		String colNullable="";
		if(entity.getColNullable().equalsIgnoreCase("N"))
		{
			colNullable="not null";
		}
		try{
			dao.addColumn(tableName, entity.getColName(),coltype,colNullable);
			if(entity.getColDefault()!=null&&entity.getColDefault()!=""){
				alterColumnDefault(entity.getColType(),tableName, entity.getColName(), entity.getColDefault());
			}
			if(entity.getColComments()!=null&&entity.getColComments()!=""){
				alterColumnComment(tableName,entity);
			}
			return "1";
		}catch(Exception e){
			msg=e.getMessage();
			msg=msg.substring(msg.lastIndexOf(":")+1);
			return msg;
		}
	}
	
	
	public String updateTableColumn(String tableName,DbTableColDTO oldentity,DbTableColDTO entity) throws DaoException {
		return updateTableColumn(tableName,oldentity,entity,DbUtils.getDbType());
		
	}
	
	
	public String updateTableColumn(String tableName,DbTableColDTO oldentity,DbTableColDTO entity,String dbType) {
		String msg="";

		DbTableInterface produce = DbTableFactory.produce(dbType);
		String coltype = produce.joinColumnStatement(entity);
		
		try{
			
			if(!oldentity.getColName().equals(entity.getColName())){
				dao.alterColumnName(tableName, oldentity.getColName(), entity.getColName());
			}
			if(!oldentity.getColType().equals(entity.getColType())){
				dao.alterColumnType(tableName, entity.getColName(), coltype);
			}
			if(!oldentity.getColComments().equals(entity.getColComments())){
				alterColumnComment(tableName,entity);
			}
			if(oldentity.getColLength()!=null&&(oldentity.getColLength()).compareTo(entity.getColLength())!=0){
				dao.alterColumnType(tableName, entity.getColName(), coltype);

                //更新eform_tab_columns_detail、eform_tab_form
                String tableId = oldentity.getTableId();
                String columnId= oldentity.getId();
                String colLength = entity.getColLength();

            }
			if(oldentity.getAttribute02()!=null&&(oldentity.getAttribute02()).compareTo(entity.getAttribute02())!=0){
				dao.alterColumnType(tableName, entity.getColName(), coltype);
			}

			return "1";
		}catch(Exception e){
			msg=e.getMessage();
			msg=msg.substring(msg.lastIndexOf(":")+1);
			return msg;
		}
		
	}
	
	
	public int createIndex(String indexName, String tableName, String colName,String indexType) {
		int i=0;
		i = checkTableExist(tableName);
		if(i==0){
			return 1;
		}else{
			return dao.createIndex(indexName, tableName, colName,indexType);
		}
	}
	
	public int  dropTable(String tableName){
		int i=0;

		i = checkTableExist(tableName);

		if(i==1){
			return this.dao.dropTable(tableName);
		}else{
			return 0;
		}
	}
	
	public int dropIndex(String indexName) {
		return dao.dropIndex(indexName);
	}
	
	public String dropCol(String colName,String tableName) {
		String sql = "select * from "+tableName;
		List<Map<String, Object>> selectSql = dao.selectSql(sql);
		String msg = "";
		if (selectSql.size()>0){
			msg=colName;
			return msg;
		}
		dao.dropColumn(tableName, colName);
		return msg;
	}
}
