package com.springmvc.storagemodel.factory;

public class DbTableFactory {
	//private static Logger logger =LoggerFactory.getLogger(EformDbFactory.class);
	
	public static DbTableInterface produce(String type) {
       if (type.contains("mysql")) {  
            return new DbTableMysqlServiceImpl();
        } else if (type.contains("oracle")) {  
            return new DbTableOracleServiceImpl();
        } else if(type.contains("sqlserver")){
        	return new DbTableSqlserverServiceImpl();
        } else if (type.contains("informix"))
           return new DbTableInformixServiceImpl();
       else{
        	//logger.info("数据库类型【"+type+"】无法匹配!");
            return null;  
        }  
    }
	
}
