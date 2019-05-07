package com.core.spring;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;

import java.util.HashMap;
import java.util.Map;

public final class SpringFactory {

    private SpringFactory(){

    }
	
	private static ApplicationContext applicationContext = null;

	private static Logger logger = LoggerFactory.getLogger(SpringFactory.class);
	
	/**
	 * 实现ApplicationContextAware接口, 注入Context到静态变量中.
	 */
	public static void setApplicationContext(ApplicationContext ac) {
		logger.info("注入ApplicationContext到SpringFactory:" + ac);
		if (applicationContext != null) {
			logger.warn("SpringFactory中的ApplicationContext被覆盖, 原有ApplicationContext为:"+ SpringFactory.applicationContext);
		}

		applicationContext = ac;
	}

	/**
	 * 实现DisposableBean接口,在Context关闭时清理静态变量.
	 */
	public static void destroy() throws Exception {
		SpringFactory.clear();
	}

	/**
	 * 取得存储在静态变量中的ApplicationContext.
	 */
	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	/**
	 * 从静态变量applicationContext中取得Bean, 自动转型为所赋值对象的类型.
	 */
	@SuppressWarnings("unchecked")
	public static <T> T getBean(String name) {
		return (T) applicationContext.getBean(name);
	}

	/**
	 * 从静态变量applicationContext中取得Bean, 自动转型为所赋值对象的类型.
	 */
	public static <T> T getBean(Class<T> requiredType) {
		return applicationContext.getBean(requiredType);
	}

	/**
	 * 清除SpringFactory中的ApplicationContext为Null.
	 */
	private static void clear() {
		logger.debug("清除SpringFactory中的ApplicationContext:" + applicationContext);
		applicationContext = null;
	}


	public static Map<String, BeanDefinition> getBeanDefinitions(){
		ApplicationContext springAppContext =  SpringFactory.getApplicationContext();
		
		XmlWebApplicationContext webContext = (XmlWebApplicationContext)springAppContext;
		
		DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory)webContext.getBeanFactory();
		
		String[] beanNames = springAppContext.getBeanDefinitionNames();
		Map<String, BeanDefinition> beanMap = new HashMap<String, BeanDefinition>();
		
		for(int i = 0; i < beanNames.length; i++){
			beanMap.put(beanNames[i], beanFactory.getBeanDefinition(beanNames[i]));
		}
		//webContext.close();
		return beanMap;
	}
}
