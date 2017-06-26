/**
 * 
 */
package com.utils;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

import com.core.id.UUIDHexGenerator;

/**
 * @author admin
 *
 */
public class CommonUtil {
	
    public static String getId() {
        UUIDHexGenerator uuid = new UUIDHexGenerator();
        return uuid.generate();
    }
	
	public static String getRequestPath(HttpServletRequest request) {
		String path = request.getContextPath();
		String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
		return basePath;
	}
	
	public static String readProperties(String key) throws IOException{
		ResourcePatternResolver resourceResolver = new PathMatchingResourcePatternResolver();
		String value="";
		Resource res = resourceResolver
				.getResource("classpath:conf/common.properties");
		
		Properties p = new Properties();

		p.load(res.getInputStream());
		if (!p.getProperty(key).trim().isEmpty())
			value = p.getProperty(key);
		return value;
	}

}
