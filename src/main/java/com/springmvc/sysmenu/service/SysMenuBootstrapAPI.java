package com.springmvc.sysmenu.service;

import com.springmvc.sysmenu.model.SysMenu;
import com.springmvc.sysmenu.model.SysMenuItem;
import com.springmvc.sysuser.model.User;

/**
 * <p>金航数码科技有限责任公司</p>
 * <p>作者：李超</p>
 * <p>创建时间：2015-3-23 下午6:21:29</p>
 * <p>类说明：平台菜单管理使用接口</p>
 */
public interface SysMenuBootstrapAPI {

	public String getBootStrapMenu(String currentLanguagecode, User loginUser,
			SysMenu menu,  Class<?> cls)
			throws InstantiationException, IllegalAccessException;

	public SysMenuItem getMenuItemList(String currentLanguagecode,
			User loginUser, SysMenu menu, Class<?> cls) 
		    throws InstantiationException, IllegalAccessException;

	
}