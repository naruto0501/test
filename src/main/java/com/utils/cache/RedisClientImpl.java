package com.utils.cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import redis.clients.jedis.ShardedJedis;

import com.utils.cache.RedisExecuteTemplate.ExecuteCallback;


@Component
public class RedisClientImpl implements RedisClient {

    @Autowired
    private RedisExecuteTemplate redisExecuteTemplate;


    public boolean putObjectWithExpire(final String key, final String obj, final long expireTime) {
        String result = redisExecuteTemplate.excute(new ExecuteCallback() {

            public String command(ShardedJedis shardedJedis) {
                return shardedJedis.set(key, obj, "nx", "ex", expireTime);
            }
        });
        return "OK".equals(result);
    }


    public String getObjectByKey(final String key) {
        return  redisExecuteTemplate.excute(new ExecuteCallback() {

            public String command(ShardedJedis shardedJedis) {
            	return shardedJedis.get(key);
            }
            
        });
    }
    
    public String delObjectByKey(final String key) {
        return  redisExecuteTemplate.excute(new ExecuteCallback() {

            public String command(ShardedJedis shardedJedis) {
            	return shardedJedis.del(key)+"";
            }
            
        });
    }
    
    

}
