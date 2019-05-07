package com.core.exception;


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
