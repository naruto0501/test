package com.core.redis;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import redis.clients.jedis.ShardedJedis;
import com.core.redis.JedisSentinelPool;

import com.fasterxml.jackson.core.type.TypeReference;
import com.utils.JsonHelper;

/**
 * 
 * Title   : BaseCacheManager.java
 * 类描述      ：xxxxxx 
 * 作者           : lidong@avicit.com  
 * 创建时间 : 2014-12-8 下午4:46:25
 * 版本           : 1.00
 * 
 * 修改记录: 
 * 版本            修改人          修改时间                  修改内容描述
 * ----------------------------------------
 * 1.00     xx          2014-12-8 下午4:46:25
 * ----------------------------------------
 */
public class BaseCacheManager {
	
	private static final String SYSTEM_CACHE_KEY = "_SYSTEM_CACHE_KEY_";//内置缓存对象前缀，用于存放已经放置进缓存的KEY，并与对应的实体关联，便于重新加载时清空缓存使用
	
	private final static Logger log = LoggerFactory.getLogger(BaseCacheManager.class);

	private JedisSentinelPool  jedisSentinelPool;
	
	
	public JedisSentinelPool getJedisSentinelPool() {
		return jedisSentinelPool;
	}

	public void setJedisSentinelPool(JedisSentinelPool jedisSentinelPool) {
		this.jedisSentinelPool = jedisSentinelPool;
	}
	/****************************************************以下缓存同步基本方法**********************************************************************/

	/**
	 * 同包方法，主要是缓存切面时使用，执行插入缓存
	 * 改为public--2015.06.29
	 * @param info
	 */
	public void insertCache(BaseCacheBean info) {
		Set<BaseCacheValue> infoSet = this.getValueSet(info, true);
		ShardedJedis jedis = this.getShardedJedis();
		try{
			this.insertCacheBySet(infoSet, info.getClass().getName(), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
	}
	
	/**
	 * 同包方法，切面使用，执行更新缓存
	 * 改为public--2015.06.29
	 * @param info
	 */
	public void updateCache(BaseCacheBean info) {
		//start version+1，只负责平台的模块，不管beandto

		String id = BaseCacheUtil.getId(info);
		String prefix = BaseCacheUtil.getPrefix(info);
		if(BaseCacheUtil.isNull(id) || BaseCacheUtil.isNull(prefix)){
			return;
		}
		BaseCacheBean oldObject = (BaseCacheBean) this.getObjectFromCacheNoFilter(prefix, id, info.getClass());
		if(BaseCacheUtil.isNull(oldObject)){
			return;
		}
		Set<BaseCacheValue> oldInfo = this.getValueSet(oldObject, false);
		Set<BaseCacheValue> newInfo = this.getValueSet(info, true);
		oldInfo.removeAll(newInfo);
		ShardedJedis jedis = this.getShardedJedis();
		try{
			this.insertCacheBySet(newInfo, info.getClass().getName(), jedis);
			this.deleteCacheBySet(oldInfo, jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
	}
	
	/**
	 * 同包方法，切面使用，执行删除缓存
	 * 改为public--2015.06.29
	 * @param info
	 */
	public void deleteCache(BaseCacheBean info) {
		Set<BaseCacheValue> infoSet = this.getValueSet(info, false);
		ShardedJedis jedis = this.getShardedJedis();
		try{
			this.deleteCacheBySet(infoSet, jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
	}
	
	/**
	 * 同包方法，切面使用，执行删除缓存，按照ID进行删除
	 * 改为public--2015.06.29
	 * @param id
	 * @param prefix
	 * @param c
	 */
	public void deleteCacheById(String id, String prefix, Class<?> c){
		if(BaseCacheUtil.isNull(id) || BaseCacheUtil.isNull(prefix)){
			return;
		}
		BaseCacheBean oldObject = (BaseCacheBean) this.getObjectFromCacheNoFilter(prefix, id, c);
		if(BaseCacheUtil.isNull(oldObject)){
			return;
		}
		deleteCache(oldObject);
	}
	
	/**
	 * 根据集合，写入缓存
	 * @param infoSet
	 * @param className
	 * @param jedis
	 * @throws Exception
	 */
	private void insertCacheBySet(Set<BaseCacheValue> infoSet, String className, ShardedJedis jedis) throws Exception {
		for(BaseCacheValue value : infoSet){
			jedis.sadd(SYSTEM_CACHE_KEY + className, value.getKey());
			jedis.hset(value.getKey(), value.getField(), value.getValue());
		}
	}
	
	/**
	 * 根据集合，写入缓存
	 * @param infoSet
	 * @param className
	 * @param jedis
	 * @throws Exception
	 */
	private void deleteCacheBySet(Set<BaseCacheValue> infoSet, ShardedJedis jedis) throws Exception {
		for(BaseCacheValue value : infoSet){
			jedis.hdel(value.getKey(), value.getField());
		}
	}
	
	/**
	 * 解析对象，得到要操作的数据
	 * @param info
	 * @param needValue
	 * @return
	 */
	private Set<BaseCacheValue> getValueSet(BaseCacheBean info, boolean needValue){
		Set<BaseCacheValue> resultSet = new HashSet<BaseCacheValue>();
		Map<String, ?> keyMap = BaseCacheUtil.getKey(info);
		for (Map.Entry<String, ?> entry : keyMap.entrySet()) {
			if(BaseCacheUtil.isNull(entry.getValue())){
				continue;
			}
			if(entry.getValue() instanceof String){
				String field = (String) entry.getValue();
				BaseCacheValue bean = new BaseCacheValue(entry.getKey(), field);
				if(needValue){
					bean.setValue(JsonHelper.getBaseInstance().writeValueAsString(info));
				}
				resultSet.add(bean);
			}else if(entry.getValue() instanceof BaseCacheConf){
				BaseCacheConf conf = (BaseCacheConf) entry.getValue();
				if(BaseCacheUtil.isNull(conf.getIdString())){
					continue;
				}
				BaseCacheValue bean = new BaseCacheValue(entry.getKey(), conf.getIdString());
				if(needValue){
					bean.setValue(JsonHelper.getBaseInstance().writeValueAsString(conf));
				}
				resultSet.add(bean);
			}else if(entry.getValue() instanceof BaseCacheBlank){
				BaseCacheBlank blank = (BaseCacheBlank) entry.getValue();
				if(blank.getField() != null){
					BaseCacheValue bean = new BaseCacheValue(entry.getKey(), blank.getField());
					if(needValue){
						bean.setValue(JsonHelper.getBaseInstance().writeValueAsString(info.returnId()));
					}
					resultSet.add(bean);
				}
			}
		}
		return resultSet;
	}
	
	/**
	 * 内部方法，插入缓存，接收外部jedis，仅限于在启动了线程，且在对象loader时使用
	 * @param info
	 * @param jedis
	 * @throws Exception
	 */
	private void insertCacheForLoaderOnThread(BaseCacheBean info, ShardedJedis jedis) throws Exception {
		Set<BaseCacheValue> infoSet = this.getValueSet(info, true);
		this.insertCacheBySet(infoSet, info.getClass().getName(), jedis);
	}
	
	/****************************************************以下是获取缓存集合接口方法**********************************************************************/
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口，不过滤是否有效
	 * @param prefix 缓存数据KEY
	 * @param c 缓存对象Class
	 * @return 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<?> getAllFromCacheNoFilter(String prefix, Class<?> c) {
		List<?> resultList = this.getAllFromCacheBaseNoFilter(prefix, c);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口
	 * @param prefix 缓存数据KEY
	 * @param c 缓存对象Class
	 * @return 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<?> getAllFromCache(String prefix, Class<?> c) {
		List<?> resultList = this.getAllFromCacheBase(prefix, c);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口,按指定appId过滤,不过滤是否有效
	 * @param prefix 缓存数据KEY
	 * @param c 缓存对象Class
	 * @param appId 指定appId
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<?> getAllFromCacheNoFilter(String prefix, Class<?> c, String appId) {
		if(BaseCacheUtil.isNull(appId)){
			return null;
		}
		List<?> resultList = this.getAllFromCacheBaseNoFilter(prefix, c, appId);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口,按指定appId过滤
	 * @param prefix 缓存数据KEY
	 * @param c 缓存对象Class
	 * @param appId 指定appId
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<?> getAllFromCache(String prefix, Class<?> c, String appId) {
		if(BaseCacheUtil.isNull(appId)){
			return null;
		}
		List<?> resultList = this.getAllFromCacheBase(prefix, c, appId);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口，不过滤是否有效
	 * @param prefix 缓存数据KEY
	 * @param typeReference 指定对象泛型
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public <T> List<T> getAllFromCacheNoFilter(String prefix, TypeReference<T> typeReference) {
		List<T> resultList = this.getAllFromCacheBaseNoFilter(prefix, typeReference);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口
	 * @param prefix 缓存数据KEY
	 * @param typeReference 指定对象泛型
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public <T> List<T> getAllFromCache(String prefix, TypeReference<T> typeReference) {
		List<T> resultList = this.getAllFromCacheBase(prefix, typeReference);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口
	 * @param prefix 缓存数据KEY
	 * @param typeReference 指定对象泛型
	 * @return
	 */
	public <T> List<T> getAllFromCacheByList(String prefix, TypeReference<T> typeReference) {
		List<T> resultList = this.getAllFromCacheBaseByList(prefix, typeReference);
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口,按指定appId过滤，不过滤是否有效
	 * @param prefix 缓存数据KEY
	 * @param typeReference 指定对象泛型
	 * @param appId 指定appId
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public <T> List<T> getAllFromCacheNoFilter(String prefix, TypeReference<T> typeReference, String appId) {
		if(BaseCacheUtil.isNull(appId)){
			return null;
		}
		List<T> resultList = this.getAllFromCacheBaseNoFilter(prefix, typeReference, appId);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,按默认排序，默认排序对象需要实现BaseCacheComparator接口,按指定appId过滤
	 * @param prefix 缓存数据KEY
	 * @param typeReference 指定对象泛型
	 * @param appId 指定appId
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public <T> List<T> getAllFromCache(String prefix, TypeReference<T> typeReference, String appId) {
		if(BaseCacheUtil.isNull(appId)){
			return null;
		}
		List<T> resultList = this.getAllFromCacheBase(prefix, typeReference, appId);
		if(resultList.size() > 0){
			if(resultList.get(0) instanceof Comparable){
				Collections.sort(resultList, new Comparator() {
					
					@Override
					public int compare(Object o1, Object o2) {
						Comparable a1 = (Comparable) o1;
						return a1.compareTo(o2);
					}
					
				});
			}
		}
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,通过排序规则进行排序
	 * @param prefix 缓存数据KEY
	 * @param c 缓存对象Class
	 * @param comparator 指定排序规则
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<?> getAllFromCacheByOrder(String prefix, Class<?> c, Comparator comparator) {
		List<?> resultList = this.getAllFromCacheBase(prefix, c);
		Collections.sort(resultList, comparator);
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,通过排序规则进行排序,按指定appId过滤
	 * @param prefix 缓存数据KEY
	 * @param c 缓存对象Class
	 * @param comparator 指定排序规则
	 * @param appId 指定appId
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<?> getAllFromCacheByOrder(String prefix, Class<?> c, Comparator comparator, String appId) {
		List<?> resultList = this.getAllFromCacheBase(prefix, c, appId);
		Collections.sort(resultList, comparator);
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,通过排序规则进行排序
	 * @param prefix 缓存数据KEY
	 * @param typeReference 指定对象泛型
	 * @param comparator 指定排序规则
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public <T> List<T> getAllFromCacheByOrder(String prefix, TypeReference<T> typeReference, Comparator comparator) {
		List<T> resultList = this.getAllFromCacheBase(prefix, typeReference);
		Collections.sort(resultList, comparator);
		return resultList;
	}
	
	/**
	 * 读取指定缓存下的所有对象列表,通过排序规则进行排序,按指定appId过滤
	 * @param prefix 缓存数据KEY
	 * @param typeReference 指定对象泛型
	 * @param comparator 指定排序规则
	 * @param appId 指定appId
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public <T> List<T> getAllFromCacheByOrder(String prefix, TypeReference<T> typeReference, Comparator comparator, String appId) {
		List<T> resultList = this.getAllFromCacheBase(prefix, typeReference, appId);
		Collections.sort(resultList, comparator);
		return resultList;
	}
	
	/****************************************************************以下是获取缓存对象接口方法*************************************************************/
	
	/**
	 * 通过id获取缓存中的对象，不过滤是否有效
	 * @param prefix
	 * @param id
	 * @param c
	 * @return
	 */
	public Object getObjectFromCacheNoFilter(String prefix, String id, Class<?> c) {
		if(BaseCacheUtil.isNull(id)){
			return null;
		}
		ShardedJedis jedis = this.getShardedJedis();
		String string = null;
		try{
			string = parseValue(prefix, jedis.hget(prefix, id), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		if(string != null){
			return parseObject(string, c, false);
		}
		return null;
	}
	
	/**
	 * 通过id获取缓存中的对象
	 * @param prefix
	 * @param id
	 * @param c
	 * @return
	 */
	public Object getObjectFromCache(String prefix, String id, Class<?> c) {
		if(BaseCacheUtil.isNull(id)){
			return null;
		}
		ShardedJedis jedis = this.getShardedJedis();
		String string = null;
		try{
			string = parseValue(prefix, jedis.hget(prefix, id), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		if(string != null){
			return parseObject(string, c, true);
		}
		return null;
	}
	
	/**
	 * 通过id获取缓存中的对象,指定appId进行过滤,不过滤是否有效
	 * @param prefix
	 * @param id
	 * @param c
	 * @param appId
	 * @return
	 */
	public Object getObjectFromCacheNoFilter(String prefix, String id, Class<?> c, String appId) {
		if(BaseCacheUtil.isNull(id)){
			return null;
		}
		ShardedJedis jedis = this.getShardedJedis();
		String string = null;
		try{
			string = parseValue(prefix, jedis.hget(prefix, id), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		if(string != null){
			return parseObject(string, c, appId, false);
		}
		return null;
	}
	
	/**
	 * 通过id获取缓存中的对象,指定appId进行过滤
	 * @param prefix
	 * @param id
	 * @param c
	 * @param appId
	 * @return
	 */
	public Object getObjectFromCache(String prefix, String id, Class<?> c, String appId) {
		if(BaseCacheUtil.isNull(id)){
			return null;
		}
		ShardedJedis jedis = this.getShardedJedis();
		String string = null;
		try{
			string = parseValue(prefix, jedis.hget(prefix, id), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		if(string != null){
			return parseObject(string, c, appId, true);
		}
		return null;
	}
	
	/**
	 * 通过id获取缓存中的对象,不过滤是否有效
	 * @param prefix
	 * @param id
	 * @param typeReference
	 * @return
	 */
	public <T> T getObjectFromCacheNoFilter(String prefix, String id, TypeReference<T> typeReference) {
		if(BaseCacheUtil.isNull(id)){
			return null;
		}
		ShardedJedis jedis = this.getShardedJedis();
		String string = null;
		try{
			string = parseValue(prefix, jedis.hget(prefix, id), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		if(string != null){
			return parseT(string, typeReference, false);
		}
		return null;
	}
	
	/**
	 * 通过id获取缓存中的对象
	 * @param prefix
	 * @param id
	 * @param typeReference
	 * @return
	 */
	public <T> T getObjectFromCache(String prefix, String id, TypeReference<T> typeReference) {
		if(BaseCacheUtil.isNull(id)){
			return null;
		}
		ShardedJedis jedis = this.getShardedJedis();
		String string = null;
		try{
			string = parseValue(prefix, jedis.hget(prefix, id), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		if(string != null){
			return parseT(string, typeReference, true);
		}
		return null;
	}
	
	/**
	 * 通过id获取缓存中的对象,指定appId进行过滤
	 * @param prefix
	 * @param id
	 * @param typeReference
	 * @param appId
	 * @return
	 */
	public <T> T getObjectFromCache(String prefix, String id, TypeReference<T> typeReference, String appId) {
		if(BaseCacheUtil.isNull(id)){
			return null;
		}
		ShardedJedis jedis = this.getShardedJedis();
		String string = null;
		try{
			string = parseValue(prefix, jedis.hget(prefix, id), jedis);
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		if(string != null){
			return parseT(string, typeReference, appId, true);
		}
		return null;
	}
	
	/******************************************************************以下是获取缓存集合的内部方法********************************************************************/
	
	/**
	 * 内部方法，不过滤是否有效
	 * @param prefix
	 * @param c
	 * @return
	 */
	private List<?> getAllFromCacheBaseNoFilter(String prefix, Class<?> c) {
		ShardedJedis jedis = this.getShardedJedis();
		List<Object> resultList = new ArrayList<Object>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				Object object = parseObject(value, c, false);
				if(object != null){
					resultList.add(object);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		return resultList;
	}
	
	/**
	 * 内部方法
	 * @param prefix
	 * @param c
	 * @return
	 */
	private List<?> getAllFromCacheBase(String prefix, Class<?> c) {
		ShardedJedis jedis = this.getShardedJedis();
		List<Object> resultList = new ArrayList<Object>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				Object object = parseObject(value, c, true);
				if(object != null){
					resultList.add(object);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		return resultList;
	}
	
	/**
	 * 内部方法,不过滤是否有效
	 * @param prefix
	 * @param c
	 * @param appId
	 * @return
	 */
	private List<?> getAllFromCacheBaseNoFilter(String prefix, Class<?> c, String appId) {
		ShardedJedis jedis = this.getShardedJedis();
		List<Object> resultList = new ArrayList<Object>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				Object object = parseObject(value, c, appId, false);
				if(object != null){
					resultList.add(object);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		return resultList;
	}
	
	/**
	 * 内部方法
	 * @param prefix
	 * @param c
	 * @param appId
	 * @return
	 */
	private List<?> getAllFromCacheBase(String prefix, Class<?> c, String appId) {
		ShardedJedis jedis = this.getShardedJedis();
		List<Object> resultList = new ArrayList<Object>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				Object object = parseObject(value, c, appId, true);
				if(object != null){
					resultList.add(object);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		return resultList;
	}
	
	/**
	 * 内部方法，不过滤是否有效
	 * @param prefix
	 * @param typeReference
	 * @return
	 */
	private <T> List<T> getAllFromCacheBaseNoFilter(String prefix, TypeReference<T> typeReference) {
		ShardedJedis jedis = this.getShardedJedis();
		List<T> resultList = new ArrayList<T>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				T t = parseT(value, typeReference, false);
				if(t != null){
					resultList.add(t);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		return resultList;
	}
	
	/**
	 * 内部方法
	 * @param prefix
	 * @param typeReference
	 * @return
	 */
	private <T> List<T> getAllFromCacheBase(String prefix, TypeReference<T> typeReference) {
		ShardedJedis jedis = this.getShardedJedis();
		List<T> resultList = new ArrayList<T>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				T t = parseT(value, typeReference, true);
				if(t != null){
					resultList.add(t);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		return resultList;
	}
	
	/**
	 * 内部方法
	 * @param prefix
	 * @param typeReference
	 * @return
	 */
	private <T> List<T> getAllFromCacheBaseByList(String prefix, TypeReference<T> typeReference) {
		ShardedJedis jedis = this.getShardedJedis();
		List<T> resultList = new ArrayList<T>();
		try{
			List<String> list = jedis.lrange(prefix, 0, -1);
			for (String value : list) {
				value = parseValue(prefix, value, jedis);
				if(value == null){
					continue;
				}
				T t = parseT(value, typeReference, true);
				if(t != null){
					resultList.add(t);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		return resultList;
	}
	
	/**
	 * 内部方法,不过滤是否有效
	 * @param prefix
	 * @param typeReference
	 * @param appId
	 * @return
	 */
	private <T> List<T> getAllFromCacheBaseNoFilter(String prefix, TypeReference<T> typeReference, String appId) {
		ShardedJedis jedis = this.getShardedJedis();
		List<T> resultList = new ArrayList<T>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				T t = parseT(value, typeReference, appId, false);
				if(t != null){
					resultList.add(t);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		
		return resultList;
	}
	
	/**
	 * 内部方法
	 * @param prefix
	 * @param typeReference
	 * @param appId
	 * @return
	 */
	private <T> List<T> getAllFromCacheBase(String prefix, TypeReference<T> typeReference, String appId) {
		ShardedJedis jedis = this.getShardedJedis();
		List<T> resultList = new ArrayList<T>();
		try{
			Map<String, String> map = jedis.hgetAll(prefix);
			for (Map.Entry<String, String> entry : map.entrySet()) {
				String value = parseValue(prefix, entry.getValue(), jedis);
				if(value == null){
					continue;
				}
				T t = parseT(value, typeReference, appId, true);
				if(t != null){
					resultList.add(t);
				}
			}
		}catch(Exception e){
			log.error(e.getMessage());
		}finally{
			jedisSentinelPool.returnResource(jedis);
		}
		
		return resultList;
	}
	
	/**
	 * 解析redis中的baseCacheConf对象并处理
	 * @param prefix
	 * @param value
	 * @param jedis
	 * @return
	 * @throws Exception
	 */
	private String parseValue(String prefix, String value, ShardedJedis jedis) {
		if(value != null && value.indexOf(BaseCacheConf.flg) != -1){
			BaseCacheConf conf = JsonHelper.getBaseInstance().readValue(value, new TypeReference<BaseCacheConf>(){});
			value = jedis.hget(conf.getPrefixString(), conf.getIdString());
		}
		return value;
	}
	
	/**
	 * 通过class解析json,不过滤appId
	 * @param string
	 * @param c
	 * @param isValid 是否验证有效
	 * @return
	 */
	private Object parseObject(String string, Class<?> c, boolean isValid) {
		Object object = JsonHelper.getBaseInstance().readValue(string, c);
		if(object instanceof BaseCacheBean){
			BaseCacheBean baseBean = (BaseCacheBean) object;
			if(isValid){
				if(BaseCacheUtil.isValid(baseBean)){
					return object;
				}
			}else{
				return object;
			}
		}else{
			return object;//返回object，而不是返回null，不进行严格校验了，如果不是BaseCacheBean对象，则返回即可
		}
		return null;
	}
	
	/**
	 * 通过class解析json,过滤appId
	 * @param string
	 * @param c
	 * @param appId
	 * @return
	 */
	private Object parseObject(String string, Class<?> c, String appId, boolean isValid) {
		Object object = JsonHelper.getBaseInstance().readValue(string, c);
		if(object instanceof BaseCacheBean){
			BaseCacheBean baseBean = (BaseCacheBean) object;
			if(BaseCacheUtil.isAppId(baseBean, appId)){
				if(isValid){
					if(BaseCacheUtil.isValid(baseBean)){
						return object;
					}
				}else{
					return object;
				}
			}
		}
		return null;
	}
	
	/**
	 * 通过TypeReference解析json,不过滤appId
	 * @param string
	 * @param typeReference
	 * @return
	 */
	private <T> T parseT(String string, TypeReference<T> typeReference, boolean isValid) {
		T t = JsonHelper.getBaseInstance().readValue(string, typeReference);
		if(t instanceof BaseCacheBean){
			BaseCacheBean baseBean = (BaseCacheBean) t;
			if(isValid){
				if(BaseCacheUtil.isValid(baseBean)){
					return t;
				}
			}else{
				return t;
			}
		}else{
			return t;//返回t，而不是返回null，不进行严格校验了，如果不是BaseCacheBean对象，则返回即可
		}
		return null;
	}
	
	/**
	 * 通过TypeReference解析json,过滤appId
	 * @param string
	 * @param typeReference
	 * @param appId
	 * @return
	 */
	private <T> T parseT(String string, TypeReference<T> typeReference, String appId, boolean isValid) {
		T t = JsonHelper.getBaseInstance().readValue(string, typeReference);
		if(t instanceof BaseCacheBean){
			BaseCacheBean baseBean = (BaseCacheBean) t;
			if(BaseCacheUtil.isAppId(baseBean, appId)){
				if(isValid){
					if(BaseCacheUtil.isValid(baseBean)){
						return t;
					}
				}else{
					return t;
				}
			}
		}
		return null;
	}
	
	/***********************************************************************以下是缓存的工具方法*****************************************************************************/
	
	/**
	 * 判断是否存在的key
	 * @return
	 */
	public boolean exists(String key) {
		ShardedJedis jedis = this.getShardedJedis();
		boolean b = jedis.exists(key);
		jedisSentinelPool.returnResource(jedis);
		return b;
	}
	
	/**
	 * 是否包含key、field指定的对象
	 * @param key
	 * @param field
	 * @return
	 */
	public boolean containsKey(String key, String field) {
		ShardedJedis jedis = this.getShardedJedis();
		boolean b = jedis.hexists(key, field);
		jedisSentinelPool.returnResource(jedis);
		return b;
	}

	/**
	 * 通过模糊的key从缓存删除数据
	 * @param pattern ke的模糊值
	 * @return
	 */
	public boolean delByPattern(String pattern) {
		ShardedJedis jedis = this.getShardedJedis();
		Set<String> keys = jedis.getAllShards().iterator().next().keys("*" + pattern + "*");
		for(String defaultKey:keys){
			jedis.del(defaultKey);
		}
		jedisSentinelPool.returnResource(jedis);
		return true;
	}
	
	/**
	 * 通过key删除缓存数据
	 * @param key 指定的key
	 * @return
	 */
	public boolean delByKey(String key) {
		ShardedJedis jedis = this.getShardedJedis();
		jedis.del(key);
		jedisSentinelPool.returnResource(jedis);
		return true;
	}
	
	/**
	 * 查询缓存中指定key下的条数
	 * @param key
	 * @return
	 */
	public int countSizeByKey(String key) {
		ShardedJedis jedis = this.getShardedJedis();
		Map<String, String> map = jedis.hgetAll(key);
		jedisSentinelPool.returnResource(jedis);
		return map.keySet().size();
	}
	
	/**
	 * 读库，将对象数据加入缓存
	 * @param c
	 */
	public void loaderBeanList(Class<?> c) {
		log.info("开始加载目标【" + c.getName() + "】......");
		ShardedJedis jedis = this.getShardedJedis();
		try {
			//删除
			Set<String> keyList = jedis.smembers(SYSTEM_CACHE_KEY + c.getName());
			log.debug("目标【" + c.getName() + "】原缓存key长度="+keyList.size());
			for(String keyString : keyList){
				jedis.del(keyString);
			}
			jedis.del(SYSTEM_CACHE_KEY + c.getName());
			//添加
			List<?> list = null;//this.commonHibernateDao.loadAll(c);
			log.info("目标【" + c.getName() + "】总长度="+list.size());
			for(Object object : list){
				this.insertCacheForLoaderOnThread((BaseCacheBean) object, jedis);
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		} finally {
			jedisSentinelPool.returnResource(jedis);
		}
		log.info("目标【" + c.getName() + "】加载完成。");
	}
	
	/**
	 * 读库，将对象数据加入缓存
	 * @param c
	 */
	public void loaderBeanList(Class<?> c, Collection<?> dataList) {
		log.info("开始加载目标【" + c.getName() + "】......");
		ShardedJedis jedis = this.getShardedJedis();
		try {
			//删除
			Set<String> keyList = jedis.smembers(SYSTEM_CACHE_KEY + c.getName());
			log.debug("目标【" + c.getName() + "】原缓存key长度="+keyList.size());
			for(String keyString : keyList){
				jedis.del(keyString);
			}
			jedis.del(SYSTEM_CACHE_KEY + c.getName());
			//添加
			log.info("目标【" + c.getName() + "】总长度="+dataList.size());
			for(Object object : dataList){
				this.insertCacheForLoaderOnThread((BaseCacheBean) object, jedis);
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		} finally {
			jedisSentinelPool.returnResource(jedis);
		}
		log.info("目标【" + c.getName() + "】加载完成。");
	}
	
	/*********************************************************************************/
	
	/**
	 * 内部方法，判断jedis是否为空
	 * @param jedis
	 * @return
	 */
	private ShardedJedis getShardedJedis() {
		ShardedJedis jedis = null;
		try{
			jedis = jedisSentinelPool.getResource();
		}catch(Exception e){
			jedisSentinelPool.returnBrokenResource(jedis);
		}
		if(jedis == null){
			log.error("==========获取jedis为null");;
		}
		return jedis;
	}
	
	/**************************为流程扩展*************************************/
	
	/**
	 * 通过key删除缓存数据
	 * @param key 指定的key
	 * @return
	 */
	public boolean delByKey(byte[] key) {
		ShardedJedis jedis = this.getShardedJedis();
		jedis.del(key);
		jedisSentinelPool.returnResource(jedis);
		return true;
	}
	
	/**
	 * 通过key和field删除缓存
	 * @param key
	 * @param field
	 */
	public boolean delByField(String key, String field){
		ShardedJedis jedis = this.getShardedJedis();
		jedis.hdel(key, field);
		jedisSentinelPool.returnResource(jedis);
		return true;
	}
	
	/**
	 * 获取指定key下面的所有field
	 * @param key
	 * @return
	 */
	public Set<String> getFields(String key){
		ShardedJedis jedis = this.getShardedJedis();
		Set<String> result = jedis.hkeys(key);
		jedisSentinelPool.returnResource(jedis);
		return result == null ? new HashSet<String>() : result;
	}
	
	/**
	 * 读取指定的key下的fileld的值
	 * @param key
	 * @param field
	 * @return
	 */
	public String getFromRedis(String key, String field){
		String result = null;
		ShardedJedis jedis = this.getShardedJedis();
		try {
			result = jedis.hget(key, field);
		} catch (Exception e) {
			log.error(e.getMessage());
		} finally {
			jedisSentinelPool.returnResource(jedis);
		}
		return result;
	}
	
	/**
	 * 读取指定的key下的fileld的值
	 * @param key
	 * @param field
	 * @return
	 */
	public byte[] getFromRedis(byte[] key, byte[] field){
		byte[] result = null;
		ShardedJedis jedis = this.getShardedJedis();
		try {
			result = jedis.hget(key, field);
		} catch (Exception e) {
			log.error(e.getMessage());
		} finally {
			jedisSentinelPool.returnResource(jedis);
		}
		return result;
	}
	
	/**
	 * 往缓存中写入数据
	 * @param key
	 * @param field
	 * @param value
	 */
	public void insert2redis(String key, String field, String value){
		ShardedJedis jedis = this.getShardedJedis();
		try {
			jedis.hset(key, field, value);
		} catch (Exception e) {
			log.error(e.getMessage());
		} finally {
			jedisSentinelPool.returnResource(jedis);
		}
	}
	
	/**
	 * 往缓存中写入数据
	 * @param key
	 * @param field
	 * @param value
	 */
	public void insert2redis(byte[] key, byte[] field, byte[] value){
		ShardedJedis jedis = this.getShardedJedis();
		try {
			jedis.hset(key, field, value);
		} catch (Exception e) {
			log.error(e.getMessage());
		} finally {
			jedisSentinelPool.returnResource(jedis);
		}
	}
	
}