/**
 * 
 */
package com.core.exception;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class MyExceptionHandler implements HandlerExceptionResolver {  
	
	public MyExceptionHandler(){
		System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
	}
  
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler,   
            Exception ex) {   
        Map<String, Object> model = new HashMap<String, Object>();   
        model.put("ex", ex);   
           
        // 根据不同错误转向不同页面   
        if(ex instanceof SessionTimeOutException) {   
            return new ModelAndView("login/login_error", model);   
        } else {   
            return new ModelAndView("error", model);   
        }   
    }   
}  

