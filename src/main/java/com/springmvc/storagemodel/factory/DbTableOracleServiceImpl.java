package com.springmvc.storagemodel.factory;

import com.springmvc.storagemodel.common.StorageConstant;
import com.springmvc.storagemodel.model.DbTableColDTO;
import com.springmvc.storagemodel.model.TableColData;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class DbTableOracleServiceImpl implements DbTableInterface {
	
	
	@Override
	public String getColumns(List<DbTableColDTO> list, Map<String,Object> columns) {

		String pKey = "";
		
		columns.put("LAST_UPDATE_DATE", "DATE NOT NULL");
		columns.put("LAST_UPDATED_BY", "VARCHAR2(36) NOT NULL");
		columns.put("CREATION_DATE", "DATE NOT NULL");
		columns.put("CREATED_BY", "VARCHAR2(36) NOT NULL");
		columns.put("LAST_UPDATE_IP", "VARCHAR2(36) NOT NULL");
		columns.put("VERSION", "NUMBER(16) NOT NULL");
		columns.put("ORG_IDENTITY", "VARCHAR2(32) NOT NULL");
		
		for(DbTableColDTO item:list){
			if(item.getColType().equals("VARCHAR2")){
				//if(item.getColRuleName()==null){
					columns.put(item.getColName(), (item.getColType()+"("+item.getColLength()+")"+(item.getColNullable()=="N"?" NOT NULL":"")));
				//}else{
				//	columns.put(item.getColName(), "CLOB  NULL");
				//}
			}
			if(item.getColType().equals("DATE")){
				columns.put(item.getColName(),  ("DATE"+(item.getColNullable()=="N"?" NOT NULL":"")));
			}
			if(item.getColType().equals("NUMBER")){
				if (StringUtils.isEmpty(item.getAttribute02())){
					columns.put(item.getColName(), (item.getColType()+"("+item.getColLength()+")"+(item.getColNullable()=="N"?" NOT NULL":"")));
				}else{
					columns.put(item.getColName(), (item.getColType()+"("+item.getColLength()+","+(item.getAttribute02()==null?0:item.getAttribute02())+")"+(item.getColNullable()=="N"?" NOT NULL":"")));
				}
			}
			if(item.getColType().equals("BLOB")){
				columns.put(item.getColName(), "BLOB  NULL");
			}
			if(item.getColType().equals("CLOB")){
				columns.put(item.getColName(), "CLOB  NULL");
			}
			if (item.getColIsPk().equals("Y")){
				pKey += item.getColName()+",";
			}
		}
		
		if (StringUtils.isEmpty(pKey)){
			columns.put("ID", "VARCHAR2(50) NOT NULL");
			pKey = "ID";
		}else{
			pKey = pKey.substring(0,pKey.length()-1);
		}
		return pKey;
	}
	
	
	public String joinColumnStatement(DbTableColDTO entity) {
		String coltype = "";
		if(entity.getColType().equals("VARCHAR2")){
			coltype= (entity.getColType()+"("+entity.getColLength()+")"+(entity.getColNullable()=="N"?" NOT NULL":""));
		}
		if(entity.getColType().equals("DATE")){
			coltype=("DATE"+(entity.getColNullable()=="N"?" NOT NULL":""));
		}
		if(entity.getColType().equals("NUMBER")){
			
			if (!StringUtils.isEmpty(entity.getAttribute02())){
				coltype=(entity.getColType()+"("+entity.getColLength()+","+(entity.getAttribute02()==null?0:entity.getAttribute02())+")"+(entity.getColNullable()=="N"?" NOT NULL":""));
			}else{
				coltype=(entity.getColType()+"("+entity.getColLength()+")"+(entity.getColNullable()=="N"?" NOT NULL":""));
			}
		}
		if(entity.getColType().equals("BLOB")){
			coltype=("BLOB  NULL");
		}
		if(entity.getColType().equals("CLOB")){
			coltype=("CLOB  NULL");
		}
		return coltype;
	}

	@Override
	public String checkTableExist(String tableName) {
		return "select count(1)  from user_tables where TABLE_NAME ='"+tableName+"'";
	}


	public String getTableColSelectSqlExpression(TableColData tableColData) {
		String colName = tableColData.getColName();
		StorageConstant.ColJdbcTypeEnum colJdbcType = tableColData.getColJdbcType();
		StorageConstant.ColSelectTypeEnum colSelectType = tableColData.getColSelectType();

		StringBuilder sqlBuilder = new StringBuilder();
		sqlBuilder.append(colName);
		sqlBuilder.append(" ");
		sqlBuilder.append(colSelectType.getValue());
		sqlBuilder.append(" ");

		if (colSelectType == StorageConstant.ColSelectTypeEnum.LIKE) {
			sqlBuilder.append("concat(concat('%', ");//%

			sqlBuilder.append("#{data.");
			sqlBuilder.append(colName);
			sqlBuilder.append(", jdbcType=");
			sqlBuilder.append(colJdbcType.getValue());
			sqlBuilder.append("}");

			sqlBuilder.append("), '%')");//%
			return sqlBuilder.toString();
		}

		if (colJdbcType == StorageConstant.ColJdbcTypeEnum.DATE || colJdbcType == StorageConstant.ColJdbcTypeEnum.TIMESTAMP) {
			sqlBuilder.append("to_date(");

			sqlBuilder.append("#{data.");
			sqlBuilder.append(colName);
			sqlBuilder.append("}");
		}
		else {
			sqlBuilder.append("#{data.");
			sqlBuilder.append(colName);
			sqlBuilder.append(", jdbcType=");
			sqlBuilder.append(colJdbcType.getValue());
			sqlBuilder.append("}");
		}
		if (colJdbcType == StorageConstant.ColJdbcTypeEnum.DATE) {
			sqlBuilder.append(",'yyyy-mm-dd')");
		}
		if (colJdbcType == StorageConstant.ColJdbcTypeEnum.TIMESTAMP) {
			sqlBuilder.append(",'yyyy-mm-dd hh24:mi:ss')");
		}

		return sqlBuilder.toString();
	}

	@Override
	public String getCLOBorderby(String column) {
		String orderby = "dbms_lob.substr("+column+",50)";
		return orderby;
	}


	@Override
	public String getDateFormat(String dateString) {
		if(!StringUtils.isEmpty(dateString)){
			return " to_date('" + dateString + "','YYYY-MM-DD hh24:mi:ss') ";
		}
		return "";
	}


}
