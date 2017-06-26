package com.core.exception;

/**
 * (non-Javadoc)
 * <p>Title: session过期异常</p>
 * <p> Description: session过期异常</p>
 * <p>Copyriht: Copyright (c) 2012 </p>
 * <p>Company: AVICIT Co., Ltd</p>
 * @author wang xiu zhen
 * @version 1.0 Date: 2012-09-24 11:21
 * 
 */
public class SessionTimeOutException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = -2284011857712987325L;
	public SessionTimeOutException() {
    }
    public SessionTimeOutException(String s) {
        super(s);
    }
}
