package com.springmvc.sysuser.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.springmvc.sysuser.model.User;

 
 
@Repository
public interface UserDAO {
 
    /**
     * 添加新用户
     * @param user
     * @return
     */
    public int insertUser(User user);
    
    /**
     * 添加新用户
     * @param user
     * @return
     */
    public int updateUser(User user);
    
    /**
     * 添加新用户
     * @param user
     * @return
     */
    public int deleteUser(User user);
    
    /**
     * 根据id查询用户
     * @param id
     * @return
     */
    public List<User> selectUserByID(String id);
     
    /**
     * 登录验证
     * @param username
     * @param password
     * @return
     */
    public int checkLogin(String username,String password);
    
    /**
     * 根据username获取对象
     * @param username
     * @return
     */
    public List<User> selectUserByUsername(String username);
    
    /**
     * 获取所有User对象集合
     * @return
     */
    public List<User> selectUserList();
    
    /**
     * 获取所有User对象集合
     * @return
     */
    public List<User> selectUserPage();
    
    /**
     * 验证唯一性
     * @param username
     * @return
     */
    public int checkUsername(String username);
}