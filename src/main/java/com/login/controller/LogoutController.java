package com.login.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.springmvc.sysuser.service.UserService;


@Controller
@RequestMapping("mvc/logout")
public class LogoutController {
	static Logger logger = LoggerFactory.getLogger(LogoutController.class);
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("logout")
    public ModelAndView login(HttpServletRequest request,HttpServletResponse response){
    	ModelAndView mv = new ModelAndView("logout/logout_success");
    	request.getSession().invalidate();
    	return mv;
    }
	
}
