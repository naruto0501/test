package com.core.redis;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class BaseCacheUtil {

	/**
	 * 判断对象是否为空字符串
	 * @param string
	 * @return
	 */
	public static boolean isNull(Object string){
		if(string == null || string.equals("")){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 验证方法的参数是否符合拦截条件
	 * @param args
	 * @return
	 */
	public static boolean vadidationArgs( Object[] args){
		 if(args.length != 1 || !(args[0] instanceof BaseCacheBean))
			 return false;
		 return true;
	 }
	
	/**
	 * 验证方法的参数是否符合拦截条件
	 * @param args
	 * @return
	 */
	public static boolean vadidationArgsIsString(Object[] args){
		 if(args.length != 1 || !(args[0] instanceof String))
			 return false;
		 return true;
	 }
	
	/**
	 * 返回缓存指向关系
	 * @param object
	 * @return
	 */
	public static Map<String, ?> getKey(BaseCacheBean object) {
		return object.returnCacheKey();
	}
	
	/**
	 * 读取对象ID
	 * @param object
	 * @return
	 */
	public static String getId(BaseCacheBean object){
		return object.returnId();
	}
	
	/**
	 * 更新前，返回旧的缓存指向关系
	 * @param object
	 * @return
	 */
	public static String getPrefix(BaseCacheBean object) {
		return object.prefix();
	}
	
	/**
	 * validFlg字段是否是1,也就是数据是否有效
	 * 如果valid返回null,一般是未实现该方法,认为是不需要是否有效的判断
	 * @param baseBean
	 * @return
	 */
	public static boolean isValid(BaseCacheBean baseBean){
		if(baseBean.returnValidFlag() == null || "1".equals(baseBean.returnValidFlag())){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 过滤appId字段,也就是所属应用
	 * 如果appId返回null,一般是没有该字段或不需要过滤,此时直接返回true
	 * @param baseBean
	 * @return
	 */
	public static boolean isAppId(BaseCacheBean baseBean, String appId){
		if(baseBean.returnAppId() == null || "".equals(baseBean.returnAppId()) || appId.equals(baseBean.returnAppId())){
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 获取指定类中的成员变量的值
	 * @param c
	 * @return
	 * @throws Exception
	 */
	public static List<String> getFieldStringList(Class<?> c) throws Exception {
		List<String> resultList = new ArrayList<String>();
		Field[] fields = c.getFields();
		for (int i = 0; i < fields.length; i++) {
			resultList.add(fields[i].get(c).toString());
		}
		return resultList;
	}
	
}
