package com.springmvc.sysuser.service;

import java.util.List;

import com.core.exception.DaoException;
import com.core.page.Page;
import com.springmvc.sysuser.model.User;
 

 
 
public interface UserService {
 
    public int insertUser(User user) throws DaoException;
    
    public User getUserById(String id) throws DaoException;
    
    public boolean checkLogin(String username,String password) throws DaoException;
    
    public User getUserByUsername(String username) throws DaoException;
    
    public List<User> getAllUserList() throws DaoException;
    
    public Page<User> getUserPage(int limit,int offset) throws DaoException;
}