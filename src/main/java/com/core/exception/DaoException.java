package com.core.exception;
import org.springframework.dao.DataAccessException;


public class DaoException extends DataAccessException {

	private static final long serialVersionUID = 8335164454108338833L;
	public DaoException(String msg, Throwable cause) {
        super(msg, cause);
    }
    public DaoException(String s) {
        super(s);
    }
}
