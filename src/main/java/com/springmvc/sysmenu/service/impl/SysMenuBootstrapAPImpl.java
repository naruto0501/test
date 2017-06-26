package com.springmvc.sysmenu.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.springmvc.sysmenu.model.SysMenu;
import com.springmvc.sysmenu.model.SysMenuItem;
import com.springmvc.sysmenu.service.SysMenuBootstrapAPI;
import com.springmvc.sysuser.model.User;

public class SysMenuBootstrapAPImpl implements SysMenuBootstrapAPI {

	private static final Logger log = LoggerFactory.getLogger(SysMenuBootstrapAPImpl.class);

	@Override
	public String getBootStrapMenu(String currentLanguagecode, User loginUser,
			SysMenu menu, Class<?> cls) throws InstantiationException,
			IllegalAccessException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public SysMenuItem getMenuItemList(String currentLanguagecode,
			User loginUser, SysMenu menu, Class<?> cls)
			throws InstantiationException, IllegalAccessException {
		// TODO Auto-generated method stub
		return null;
	}
	
//	@Autowired
//	private SysMenuAPI sysMenuAPI;
//	
//	@Override
//	public String getBootStrapMenu(String currentLanguagecode,
//			User loginUser, SecurityMenu menu, String appId,Class<?> cls) throws InstantiationException, IllegalAccessException{
//		StringBuffer res = new StringBuffer("");
//		if (loginUser == null ) {
//			log.error("==================loginUser无效=======================");
//			return "";
//		} else if (!SysMenuItem.class.isAssignableFrom(cls)){
//			log.error(cls+"没有继承SysMenuItem，无法生成菜单元素");
//			return "";
//		}else {
//			// 从当前登录人获取其已经分配的资源
//			List<SysMenu> rootList = sysMenuAPI.getSubSysMenus(SysMenu.MENU_ROOT_PID, appId,SessionHelper.getCurrentOrgIdentity());
//			Collection<SysMenuVo> sysMenuVoList =new ArrayList<SysMenuVo>();
//			if(rootList.size()>0){
//				sysMenuVoList=menu.getMenusByParentId(rootList.get(0).getId());
//			}
//			for(SysMenuVo sysMenuVo : sysMenuVoList){
//				if ("1".equals(sysMenuVo.getType())){
//					SysMenuItem menuItem = (SysMenuItem)cls.newInstance();
//					menuItem.setIconClass(sysMenuVo.getIconClass());
//					menuItem.setParentId(sysMenuVo.getParentId());
//					menuItem.setMenuCode(sysMenuVo.getCode());
//					menuItem.setMenuTitle(sysMenuVo.getName());
//					menuItem.setUrl(sysMenuVo.getUrl());
//					menuItem.setImageUrl(sysMenuVo.getImage());
//					if(sysMenuVo.getHasChild()){
//						menuItem = IterativeSubMenu(menu.getMenusByParentId(sysMenuVo.getId()),menu,menuItem,cls);
//					}
//					res.append(menuItem.toString());
//				}
//			}
//			
//		}
//		return res.toString();
//	}
//	
//	@Override
//	public SysMenuItem getMenuItemList(String currentLanguagecode,
//			User loginUser, SecurityMenu menu, String appId,Class<?> cls) throws InstantiationException, IllegalAccessException{
//		SysMenuItem menuItems = (SysMenuItem)cls.newInstance();
//		if (loginUser == null ) {
//			log.error("==================loginUser无效=======================");
//			return null;
//		} else if (!SysMenuItem.class.isAssignableFrom(cls)){
//			log.error(cls+"没有继承SysMenuItem，无法生成菜单元素");
//			return null;
//		}else {
//			// 从当前登录人获取其已经分配的资源
//			List<SysMenu> rootList = sysMenuAPI.getSubSysMenus(SysMenu.MENU_ROOT_PID, appId,SessionHelper.getCurrentOrgIdentity());
//			Collection<SysMenuVo> sysMenuVoList =new ArrayList<SysMenuVo>();
//			if(rootList.size()>0){
//				sysMenuVoList=menu.getMenusByParentId(rootList.get(0).getId());
//			}
//			for(SysMenuVo sysMenuVo : sysMenuVoList){
//				if ("1".equals(sysMenuVo.getType())){
//					SysMenuItem menuItem = (SysMenuItem)cls.newInstance();
//					menuItem.setIconClass(sysMenuVo.getIconClass());
//					menuItem.setParentId(sysMenuVo.getParentId());
//					menuItem.setMenuCode(sysMenuVo.getCode());
//					menuItem.setMenuTitle(sysMenuVo.getName());
//					menuItem.setUrl(sysMenuVo.getUrl());
//					menuItem.setImageUrl(sysMenuVo.getImage());
//					if(sysMenuVo.getHasChild()){
//						menuItem = IterativeSubMenu(menu.getMenusByParentId(sysMenuVo.getId()),menu,menuItem,cls);
//					}
//					menuItems.addSubMenu(menuItem);
//				}
//			}
//			
//		}
//		return menuItems;
//	}
//
//	private SysMenuItem IterativeSubMenu(Collection<SysMenu> sysMenuVoList,SecurityMenu menu,SysMenuItem menuItems,Class<?> cls) throws InstantiationException, IllegalAccessException{
//		if (sysMenuVoList!=null && sysMenuVoList.size()>0){
//			for(SysMenu sysMenuVo : sysMenuVoList){
//				if ("1".equals(sysMenuVo.getType())){
//					SysMenuItem menuItem = (SysMenuItem)cls.newInstance();
//					menuItem.setIconClass(sysMenuVo.getIconClass());
//					menuItem.setParentId(sysMenuVo.getParentId());
//					menuItem.setMenuCode(sysMenuVo.getCode());
//					menuItem.setMenuTitle(sysMenuVo.getName());
//					menuItem.setUrl(sysMenuVo.getUrl());
//					if(sysMenuVo.getHasChild()){
//						menuItem = IterativeSubMenu(menu.getMenusByParentId(sysMenuVo.getId()),menu,menuItem,cls);
//					}
//					menuItems.addSubMenu(menuItem);
//				}
//			}
//			return menuItems;
//		}else{
//			return null;
//		}
//		
//	}

	
	
}
