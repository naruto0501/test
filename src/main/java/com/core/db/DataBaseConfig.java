package com.core.db;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

import javax.annotation.PostConstruct;


@PropertySource("classpath:/conf/jdbc.properties")
public class DataBaseConfig {

	/**
	 *  mysql, mariadb, sqlite, oracle, hsqldb, postgresql,sqlserver2008
	 * @return
	 */
	@PostConstruct
	public String getCurrentDbType(){
		targetDriverClassname = new String(driverClassName);
		String dbType;

		if(targetDriverClassname.contains("OracleDriver")){
    		dbType = "oracle";
    	}else if(targetDriverClassname.contains("SQLServerDriver")){
    		dbType = "sqlserver2008";
    	}else if(targetDriverClassname.contains("mysql.jdbc")){
    		dbType = "mysql";
    	}else if (targetDriverClassname.contains("informix.jdbc")){
			dbType = "informix";
		}else{
    		dbType = "oracle";
    	}
    	new DbUtils(dbType);
		return dbType;
	}
	
	

	@Value("${jdbc_driverClassName}")
	private String driverClassName;

	private String targetDriverClassname;
}
