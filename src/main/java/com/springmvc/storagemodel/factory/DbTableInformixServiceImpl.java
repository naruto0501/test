package com.springmvc.storagemodel.factory;

import com.springmvc.storagemodel.common.StorageConstant;
import com.springmvc.storagemodel.model.DbTableColDTO;
import com.springmvc.storagemodel.model.TableColData;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class DbTableInformixServiceImpl implements DbTableInterface {
	
	
	@Override
	public String getColumns(List<DbTableColDTO> list, Map<String,Object> columns) {

		String pKey = "";
		
		columns.put("LAST_UPDATE_DATE", "DATETIME YEAR TO SECOND NOT NULL");
		columns.put("LAST_UPDATED_BY", "Varchar(36) NOT NULL");
		columns.put("CREATION_DATE", "DATETIME YEAR TO SECOND NOT NULL");
		columns.put("CREATED_BY", "Varchar(36) NOT NULL");
		columns.put("LAST_UPDATE_IP", "Varchar(36) NOT NULL");
		columns.put("VERSION", "DECIMAL(16,0) NOT NULL");
		columns.put("ORG_IDENTITY", "Varchar(32) NOT NULL");

		for(DbTableColDTO item:list){
			if(item.getColType().equals("VARCHAR2")){
				columns.put(item.getColName(), ("LVARCHAR"+"("+item.getColLength()+")"+(item.getColNullable()=="N"?" NOT NULL":"")));
			}
			if(item.getColType().equals("DATE")){
				columns.put(item.getColName(),  ("DATETIME YEAR TO SECOND"+(item.getColNullable()=="Y"?" NOT NULL":"")));
			}
			if(item.getColType().equals("NUMBER")){
				columns.put(item.getColName(), ("DECIMAL"+"("+item.getColLength()+","+(item.getAttribute02() == ""||item.getAttribute02()==null?0:item.getAttribute02())+")"+(item.getColNullable()=="N"?" NOT NULL":"")));
			}
			if(item.getColType().equals("BLOB")){
				columns.put(item.getColName(), "byte  NULL");
			}
			if(item.getColType().equals("CLOB")){
				columns.put(item.getColName(), "text  NULL");
			}
			if (item.getColIsPk().equals("Y")){
				pKey += item.getColName()+",";
			}
		}

		if (StringUtils.isEmpty(pKey)){
			columns.put("ID", "VARCHAR(50) NOT NULL");
			pKey = "ID";
		}else{
			pKey = pKey.substring(0,pKey.length()-1);
		}
		return pKey;
	}
	
	
	public String joinColumnStatement(DbTableColDTO entity) {
		String coltype = "";
		if(entity.getColType().equals("VARCHAR2")){
			coltype= ("LVARCHAR("+entity.getColLength()+")"+(entity.getColNullable()=="N"?" NOT NULL":""));
		}
		if(entity.getColType().equals("DATE")){
			coltype=("DATETIME YEAR TO SECOND"+(entity.getColNullable()=="N"?" NOT NULL":""));
		}
		if(entity.getColType().equals("NUMBER")){
			coltype = ("DECIMAL"
					+ "("
					+ entity.getColLength()
					+ ","
					+ (entity.getAttribute02() == ""||entity.getAttribute02() == null ? 0 : entity
					.getAttribute02()) + ")" + (entity.getColNullable() == "N" ? " NOT NULL"
					: ""));
		}
		if(entity.getColType().equals("BLOB")){
			coltype=("byte  NULL");
		}
		if(entity.getColType().equals("CLOB")){
			coltype=("text  NULL");
		}
		return coltype;
	}

	@Override
	public String checkTableExist(String tableName) {
		return "select count(1) from systables where tabname ='"+tableName.toLowerCase()+"'";
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
		return column;
	}


	@Override
	public String getDateFormat(String dateString) {
		if(!StringUtils.isEmpty(dateString)){
			return " to_date('" + dateString + "','YYYY-MM-DD hh24:mi:ss') ";
		}
		return "";
	}


}
