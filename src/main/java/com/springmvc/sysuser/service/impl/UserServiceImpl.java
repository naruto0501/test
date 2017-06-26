package com.springmvc.sysuser.service.impl;
 
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.core.exception.DaoException;
import com.core.page.Page;
import com.core.page.PageHelper;
import com.springmvc.sysuser.dao.UserDAO;
import com.springmvc.sysuser.model.User;
import com.springmvc.sysuser.service.UserService;
import com.springmvc.util.EncryptUtil;
import com.utils.CommonUtil;
 


 
 
@Service
public class UserServiceImpl implements UserService{
 
    @Autowired
    private UserDAO userDAO;
     
    
    public int insertUser(User user) throws DaoException{
        // TODO Auto-generated method stub
    	if (checkUsername(user.getUsername())){
        	user.setId(CommonUtil.getId());
            return userDAO.insertUser(user);
    	}else{
    		throw new DaoException("用户编号已存在！");
    	}
    }
    
    public User getUserById(String id) throws DaoException{
        // TODO Auto-generated method stub
    	if (userDAO.selectUserByID(id).size()>0){
    		return userDAO.selectUserByID(id).get(0);
    	}
    	return null;
    	//return 0;
    }

	
	public boolean checkLogin(String username, String password) throws DaoException {
		String md5Password = EncryptUtil.MD5(password,username);
		int count = userDAO.checkLogin(username, md5Password);
		if (count > 0 ){
			return true;
		}
		return false;
	}
	
	public boolean checkUsername(String username){
		int count = userDAO.checkUsername(username);
		if (count > 0 ){
			return false;
		}
		return true;
	}

	
	public User getUserByUsername(String username) throws DaoException{
		// TODO Auto-generated method stub
		return userDAO.selectUserByUsername(username).get(0);
	}


	@Override
	public List<User> getAllUserList() throws DaoException{
		// TODO Auto-generated method stub
		return userDAO.selectUserList();
	}
	
	
	public Page<User> getUserPage(int limit,int offset) throws DaoException{
		PageHelper.startPage(offset,limit);  
		userDAO.selectUserPage();
		return PageHelper.endPage();
	}

}