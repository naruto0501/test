package com.springmvc.sysuser.controller;
 
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.core.page.Page;
import com.springmvc.sysuser.model.User;
import com.springmvc.sysuser.service.UserService;
import com.springmvc.util.EncryptUtil;
import com.utils.JsonHelper;
import com.utils.cache.RedisClient;
 
@Controller
@RequestMapping("mvc/user")
public class UserController {
	
	static Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RedisClient cache;
 
    @RequestMapping("index")
    public String index(){
        return "index";
    }
    
    @RequestMapping("test")
    public String test(){
        return "test";
    }
    
   
    
    @RequestMapping("insertUser")
    @ResponseBody
    public Map<String,String> insertUser(HttpServletRequest request){
    	Map<String,String> map = new HashMap<String,String>();
    	String json = request.getParameter("data");
    	if (json == null){
    		json = "";
    	}
    	try{
    		User user = JsonHelper.getInstance().readValue(json, User.class);
	    	user.setPassword(EncryptUtil.MD5("123",user.getUsername()));
	    	userService.insertUser(user);
	    	map.put("flag", "success");
    	}catch(Exception e){
    		e.printStackTrace();
    		logger.error(e.getMessage());
    		map.put("flag", "failure");
    		map.put("msg", e.getMessage());
    	}
    	return map;
    }
    
    @RequestMapping(value="getUserById/{id}")
    public ModelAndView getUserById(@PathVariable String id){
    	ModelAndView mav = new ModelAndView();
    	User user = new User();
    	String json = null;
    	try{
    	user = userService.getUserById(id);
    	ObjectMapper objectMapper=new ObjectMapper();
    	json = objectMapper.writeValueAsString(user);
    	}catch(Exception e){
    		e.printStackTrace();
    		logger.error(e.getMessage());
    	}
    	mav.addObject("userJson", json);
    	return mav;
    }
    
    @RequestMapping(value="getUser")
    @ResponseBody
    public ModelAndView getUser(HttpServletRequest request){
    	ModelAndView mav = new ModelAndView();
    	int offset = Integer.parseInt(request.getParameter("offset"));
    	int limit = Integer.parseInt(request.getParameter("limit"));
    	try{
    		Page<User> userPage = userService.getUserPage(limit, offset/limit+1);
    		
    		mav.addObject("rows", userPage.getResult());
    		mav.addObject("total", userPage.getTotal());
    	}catch(Exception e){
    		logger.error(e.getMessage());
    		e.printStackTrace();
    	}
    	return mav;
    }
    
    @RequestMapping(value="toEdit/{id}")
    public ModelAndView toEdit(HttpServletRequest request,@PathVariable(value="id") String id){
    	ModelAndView mav = new ModelAndView();
    	User user = userService.getUserById(id);
    	mav.addObject("user", JsonHelper.getInstance().writeValueAsString(user));
    	mav.setViewName("module/sysuser/sys_user_edit");
    	return mav;
    }
     
}