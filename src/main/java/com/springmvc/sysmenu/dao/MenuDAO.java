package com.springmvc.sysmenu.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.springmvc.sysmenu.model.SysMenu;


 
@Repository
public interface MenuDAO {
 

	public List<SysMenu> selectAllMenu();
}