package com.utils;

import com.springmvc.bean.BeanBase;
import org.apache.commons.beanutils.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class PojoUtil {

	 static Logger logger = LoggerFactory.getLogger(PojoUtil.class);
	/**
	 * 该方法把数据库列的命名方式转化为Java Bean规范中的命名方式 例如：ID转化为id, LANGUAAGE_CODE 转化为
	 * languageCode
	 * 
	 * @param s
	 *            数据库列名
	 * @return 符合JavaBean规范的名称
	 */
	public static String getJavaNameFromDBColumnName(String s) {
		String string = toUpperCamelCase(s);
		return Introspector.decapitalize(string);
	}
	
	private static final long VERSION =0L;

	/**
	 * 将 pojo bean 中可读的属性按照字段名称和值的方式转化为Map
	 * 
	 * @param bean
	 *            pojo 类型
	 * @return Map
	 * @throws IllegalAccessException
	 *             if the caller does not have access to the property accessor
	 *             method
	 * @throws InvocationTargetException
	 *             if the property accessor method throws an exception
	 * @throws NoSuchMethodException
	 *             if an accessor method for this propety cannot be found
	 */
	public static Map<?, ?> toMap(Object bean) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		Assert.notNull(bean, "参数 bean 不能为空");
		return PropertyUtils.describe(bean);
	}



	/**
	 * 将原对象的属性都复制到目标对象中区
	 * 
	 * @param toObj
	 *            目标对象
	 * @param fromObj
	 *            源对象
	 * @throws Exception
	 *             当发生异常时抛出
	 */
	public static void copyProperties(Object toObj, Object fromObj) throws RuntimeException {
		Assert.notNull(toObj, "参数 toObj 不能为空");
		Assert.notNull(fromObj, "参数 fromObj 不能为空");
		try {
			PropertyUtils.copyProperties(toObj, fromObj);
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage(), e);
		}
	}

	
	
	/**
	 * 将原对象的属性都复制到目标对象中区，可以设置是否跳过空值
	 * 
	 * @param toObj
	 *            目标对象
	 * @param fromObj
	 *            源对象
	 * @param skipNull
	 *            设置为true时，将跳过源对象中属性值为空的数据
	 * @throws Exception
	 *             当发生异常时抛出
	 */
	public static void copyProperties(Object toObj, Object fromObj, boolean skipNull) throws RuntimeException {
		Assert.notNull(toObj, "参数 toObj 不能为空");
		Assert.notNull(fromObj, "参数 fromObj 不能为空");
		Object dest = toObj;
		Object orig = fromObj;
		PropertyUtilsBean utilsBean = BeanUtilsBean.getInstance().getPropertyUtils();
		if (dest == null) {
			throw new IllegalArgumentException("No destination bean specified");
		}
		if (orig == null) {
			throw new IllegalArgumentException("No origin bean specified");
		}

		if (orig instanceof DynaBean) {
			DynaProperty[] origDescriptors = ((DynaBean) orig).getDynaClass().getDynaProperties();
			for (int i = 0; i < origDescriptors.length; i++) {
				String name = origDescriptors[i].getName();
				if (utilsBean.isReadable(orig, name) && utilsBean.isWriteable(dest, name)) {
					try {
						Object value = ((DynaBean) orig).get(name);
						if (skipNull == true && null == value){	/* 跳过空值 */
							continue;
						}
						if (dest instanceof DynaBean) {
							((DynaBean) dest).set(name, value);
						} else {
							utilsBean.setSimpleProperty(dest, name, value);
						}
					} catch (NoSuchMethodException e) {
						if (logger.isDebugEnabled()) {
							logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
							throw new RuntimeException(e.getMessage(), e);
						}
					} catch (IllegalAccessException e) {
						logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
						throw new RuntimeException(e.getMessage(), e);
					} catch (InvocationTargetException e) {
						logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
						throw new RuntimeException(e.getMessage(), e);
					}
				}
			}
		} else if (orig instanceof Map) {
			Iterator entries = ((Map) orig).entrySet().iterator();
			while (entries.hasNext()) {
				Map.Entry entry = (Map.Entry) entries.next();
				String name = (String) entry.getKey();
				if (utilsBean.isWriteable(dest, name)) {
					try {
						Object value = entry.getValue();
						if (skipNull == true && null == value){	/* 跳过空值 */
							continue;
						}
						if (dest instanceof DynaBean) {
							((DynaBean) dest).set(name, entry.getValue());
						} else {
							utilsBean.setSimpleProperty(dest, name, entry.getValue());
						}
					} catch (NoSuchMethodException e) {
							logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
							throw new RuntimeException(e.getMessage(), e);
					} catch (IllegalAccessException e) {
						logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
						throw new RuntimeException(e.getMessage(), e);
					} catch (InvocationTargetException e) {
						logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
						throw new RuntimeException(e.getMessage(), e);
					}
				}
			}
		} else /* if (orig is a standard JavaBean) */{
			PropertyDescriptor[] origDescriptors = utilsBean.getPropertyDescriptors(orig);
			for (int i = 0; i < origDescriptors.length; i++) {
				String name = origDescriptors[i].getName();
				if (utilsBean.isReadable(orig, name) && utilsBean.isWriteable(dest, name)) {
					try {
						Object value = utilsBean.getSimpleProperty(orig, name);
						if (skipNull == true && null == value){	/* 跳过空值 */
							continue;
						}else{//不跳过空值,处理时要跳过平台的必填字段,如:创建时间,creationData等
							if("createdBy".equals(name) || "creationDate".equals(name)){
								continue;
							}
						}
						if (dest instanceof DynaBean) {
							((DynaBean) dest).set(name, value);
						} else {
							utilsBean.setSimpleProperty(dest, name, value);
						}
					} catch (NoSuchMethodException e) {
						logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
						throw new RuntimeException(e.getMessage(), e);
					} catch (IllegalAccessException e) {
						logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
						throw new RuntimeException(e.getMessage(), e);
					} catch (InvocationTargetException e) {
						logger.debug("Error writing to '" + name + "' on class '" + dest.getClass() + "'", e);
						throw new RuntimeException(e.getMessage(), e);
					}
				}
			}
		}
	}

	/**
	 * 给pojo设置系统属性方法
	 * 
	 * @param beanBase
	 *            pojo
	 * @param type
	 *            操作类型
	 */
	public static void setSysProperties(BeanBase beanBase, String type) {
		Assert.notNull(beanBase);
		String userId  ="1";
		String userIp = "127.0.0.1";

		if ("insert".equals(type)){
			beanBase.setCreatedBy(userId);
			if(beanBase.getCreationDate() == null){
				beanBase.setCreationDate(new Date());
			}
			beanBase.setLastUpdateDate(new Date());
			beanBase.setLastUpdatedBy(userId);
			beanBase.setLastUpdateIp(userIp);
		}else if ("update".equals(type)){
			beanBase.setLastUpdateDate(new Date());
			beanBase.setLastUpdatedBy(userId);
			beanBase.setLastUpdateIp(userIp);
		}

	}


	public static String toUpperCamelCase(String s) {
		if ("".equals(s)) {
			return s;
		}
		StringBuffer result = new StringBuffer();

		boolean capitalize = true;
		boolean lastCapital = false;
		boolean lastDecapitalized = false;
		String p = null;
		for (int i = 0; i < s.length(); i++) {
			String c = s.substring(i, i + 1);
			if ("_".equals(c) || " ".equals(c) || "-".equals(c)) {
				capitalize = true;
				continue;
			}

			if (c.toUpperCase().equals(c)) {
				if (lastDecapitalized && !lastCapital) {
					capitalize = true;
				}
				lastCapital = true;
			} else {
				lastCapital = false;
			}

			// if(forceFirstLetter && result.length()==0) capitalize = false;

			if (capitalize) {
				if (p == null || !p.equals("_")) {
					result.append(c.toUpperCase());
					capitalize = false;
					p = c;
				} else {
					result.append(c.toLowerCase());
					capitalize = false;
					p = c;
				}
			} else {
				result.append(c.toLowerCase());
				lastDecapitalized = true;
				p = c;
			}

		}
		String r = result.toString();
		return r;
	}

	
}

