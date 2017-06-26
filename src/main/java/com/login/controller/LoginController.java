package com.login.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.springmvc.sysuser.model.User;
import com.springmvc.sysuser.service.UserService;

@Controller
@RequestMapping("mvc/login")
public class LoginController {
	static Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("login")
    public ModelAndView login(@RequestParam(value="username") String userName,
    		@RequestParam(value="password") String passWord,HttpServletRequest request,HttpServletResponse response){
    	
    	ModelAndView mv = new ModelAndView();
    	try{
    	if (userService.checkLogin(userName,passWord)){
        	User user = userService.getUserByUsername(userName);
    		request.getSession().setAttribute("_USER", user);
    		request.getSession().setAttribute("_USER_NAME", userName);
    		request.getSession().setMaxInactiveInterval(1200);//20分钟
//    		response.addCookie(new Cookie("_USER_INFO_LOGIN_NAME_",user.getUsername()));
//    		response.addCookie(new Cookie("_USER_INFO_USER_ID_", Integer.toString(user.getId()))); 
    		mv.setViewName("login/login_success");
    	}else{
    		logger.error("验证用户密码错误");
    		mv.setViewName("login/login_error");
    	}
    	}catch(Exception e){
    		e.printStackTrace();
    		logger.error(e.getMessage());
    		mv.setViewName("login/login_error");
    	}
    	return mv;

    }
	
	
	@RequestMapping("timeout")
	public ModelAndView toSessionTimeOut() throws IOException{
		return new ModelAndView("login/login_error");
	}
}
