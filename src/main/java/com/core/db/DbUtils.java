package com.core.db;



public class DbUtils {

	private static  String dbType;
	
	public DbUtils(String dbtype) {
		dbType=dbtype;
	}
	
	public static String getDbType(){
		return dbType;
	}
	
	public static boolean isMySql(){
		return "mysql".equals(dbType);
	}
	
	public static boolean isOracle(){
		return "oracle".equals(dbType);
	}
	
	public static boolean isSqlServer(){
		return "sqlserver2008".equals(dbType);
	}
	
}
