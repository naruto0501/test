package com.springmvc.sysmenu.service;
 
import java.util.List;

import com.springmvc.sysmenu.model.SysMenu;

 
 
public interface MenuService {
 
    public List<SysMenu> getMenuList();
}