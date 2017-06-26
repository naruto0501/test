package com.core.exception;
import org.springframework.dao.DataAccessException;

/**
 * <p>Title: 统一的数据库层报错须回滚处理</p>
 * <p> Description: 统一的数据库层报错须回滚处理</p>
 * <p>Copyriht: Copyright (c) 2012 </p>
 * <p>Company: AVICIT Co., Ltd</p>
 * @author wang xiu zhen
 * @version 1.0 Date: 2012-09-24 11:21
 * 
 */
public class DaoException extends DataAccessException {

	private static final long serialVersionUID = 8335164454108338833L;
	public DaoException(String msg, Throwable cause) {
        super(msg, cause);
    }
    public DaoException(String s) {
        super(s);
    }
}
