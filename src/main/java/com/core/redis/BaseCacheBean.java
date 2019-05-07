package com.core.redis;

import java.util.Map;

public interface BaseCacheBean {

	/**
	 * 返回对象的主键值,不能返回空.
	 * @return
	 */
	public String returnId();
	
	/**
	 * 返回该对象validFlag的值,如果该对象没有该字段,则返回NULL即可.
	 * @return
	 */
	public String returnValidFlag();

	/**
	 * 自定义规则,用户存放、更新缓存,不能返回空.
	 * @return
	 */
	public Map<String, ?> returnCacheKey();
	
	/**
	 * 返回以id为field存放缓存的key,不能返回空.
	 * @return
	 */
	public String prefix();
	
	/**
	 * 返回该对象的appId,如果该对象没有appId,则返回NULL即可.
	 * @return
	 */
	public String returnAppId();

}
