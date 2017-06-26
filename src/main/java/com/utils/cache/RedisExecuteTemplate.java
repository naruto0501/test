package com.utils.cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import redis.clients.jedis.ShardedJedis;

import com.core.redis.JedisSentinelPool;


@Component
public class RedisExecuteTemplate {

    @Autowired
    private JedisSentinelPool shardedJedisPool;
    
    public ShardedJedis getRedisClient() {
        try {
            ShardedJedis shardJedis = shardedJedisPool.getResource();
            return shardJedis;
        } catch (Exception e) {

        }
        return null;
    }

    public void returnResource(ShardedJedis shardedJedis) {
        shardedJedisPool.returnResource(shardedJedis);
    }

    public String excute(ExecuteCallback executeCallback) {

        ShardedJedis shardedJedis = getRedisClient();
        if (shardedJedis == null) {
            return null;
        }
        try {
            // 通过回调方法执行具体执行
            return executeCallback.command(shardedJedis);
        } catch (Exception e) {

        } finally {
            // 释放资源
            returnResource(shardedJedis);
        }
        return null;
    }

    public interface ExecuteCallback {
        public String command(ShardedJedis shardedJedis);
    }
}
