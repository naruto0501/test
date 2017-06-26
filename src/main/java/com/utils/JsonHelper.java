package com.utils;


import java.text.DateFormat;



import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
public class JsonHelper extends ObjectMapper implements java.io.Serializable {
	
	private static final long serialVersionUID = 1L;

	private static  class _class{
		private static JsonHelper instance  = new JsonHelper();
		private static JsonHelper baseInstance  = new JsonHelper();
	}
	private JsonHelper() {
		super();
	}
	
	public  static  JsonHelper getInstance(){
			_class.instance.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			_class.instance.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true) ; 
			return _class.instance;
	}
	
	public  static  JsonHelper getBaseInstance(){
		_class.baseInstance.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return _class.baseInstance ;
	}
	
	public String writeValueAsString(Object value){
		try {
		    //super.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);//去掉时间戳
		    //m.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);//去掉时间戳
		    //super.setDateFormat(dateFormat);
		    //m.setDateFormat(dateFormat);
			return super.writeValueAsString(value);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		//return null;
	}
	
	public <T> T readValue(String content, TypeReference valueTypeRef){
		try {
			//super.setDateFormat(dateFormat);
			return super.readValue(content, valueTypeRef);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	public <T> T readValue(String content, Class<T> calss){
		try {
			//super.setDateFormat(dateFormat);
			return super.readValue(content, calss);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	public <T> T readValue(String content, DateFormat dateFormat, TypeReference valueTypeRef){
		try {
			super.setDateFormat(dateFormat);
			
			return super.readValue(content, valueTypeRef);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	public <T> T transformDto(Object object, TypeReference<?> typeReference){
		String json = this.writeValueAsString(object);
		return this.readValue(json, typeReference);
	}
}
