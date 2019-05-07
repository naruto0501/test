package com.core.redis;

import java.io.Serializable;


public class BaseCacheConf implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5577568419199151305L;

	public static final String flg = "6fd2e0ba-e28a-49ad-88f1-6a70727e6dfb";//UUID
	
	/**
	 * 缓存指向的对象的前缀
	 */
	private String prefixString;
	
	/**
	 * 缓存指向的对象的ID
	 */
	private String idString;
	
	public BaseCacheConf(){
		
	}
	public BaseCacheConf(String prefixString, String idString){
		this.prefixString = prefixString;
		this.idString = idString;
	}
	public String getPrefixString() {
		return prefixString;
	}
	public void setPrefixString(String prefixString) {
		this.prefixString = prefixString;
	}
	public String getIdString() {
		return idString;
	}
	public void setIdString(String idString) {
		this.idString = idString;
	}
	public String getFlg() {
		return flg;
	}
	public void setFlg(String flg) {
	}
	
}
