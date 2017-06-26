package com.springmvc.sysmenu.service.impl;
 
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springmvc.sysmenu.dao.MenuDAO;
import com.springmvc.sysmenu.model.SysMenu;
import com.springmvc.sysmenu.service.MenuService;

 
 
@Service
public class MenuServiceImpl implements MenuService{
 
    @Autowired
    private MenuDAO menuDAO;

	@Override
	public List<SysMenu> getMenuList() {
		// TODO Auto-generated method stub
		return menuDAO.selectAllMenu();
	}

    
   
}