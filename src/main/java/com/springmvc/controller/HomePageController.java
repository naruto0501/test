/**
 * 
 */
package com.springmvc.controller;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.utils.CommonUtil;

/**
 * @author admin
 *
 */
@Controller
@RequestMapping("mvc/home")
public class HomePageController {
	
	@RequestMapping("toHome")
	public ModelAndView toHomePage() throws IOException{
		return new ModelAndView(CommonUtil.readProperties("my.homepage"));
	}

}
