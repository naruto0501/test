package com.utils.cache;

public interface RedisClient {

    public boolean putObjectWithExpire(String key, String obj, long expire);
    
    public String getObjectByKey(String key);
    
    public String delObjectByKey(String key);
    
}
