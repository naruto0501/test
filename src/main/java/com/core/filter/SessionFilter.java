package com.core.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.core.exception.SessionTimeOutException;

/**
 * Servlet Filter implementation class SessionFilter
 */
@WebFilter("/SessionFilter")
public class SessionFilter implements Filter {
	
	 /** 要检查的 session 的名称 */
    private String sessionKey; 
      
    /** 需要排除（不拦截）的URL的正则表达式 */
    private String excepUrl;
      
    /** 检查不通过时，转发的URL */
    private String forwardUrl; 

    private final String homeUrl = "mvc/home/toHome.do";
	/**
	 * Default constructor.
	 */
	public SessionFilter() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;// ;//如果处理HTTP请求，并且需要访问诸如getHeader或getCookies等在ServletRequest中无法得到的方法，就要把此request对象构造成HttpServletRequest
		HttpServletResponse resp = (HttpServletResponse) response;

		String currentURL = req.getRequestURI();// 取得根目录所对应的绝对路径:

		String targetURL = currentURL.substring(currentURL.indexOf("/", 1),
				currentURL.length()); // 截取到当前文件名用于比较

		HttpSession session = req.getSession(false);
		//登陆后再次访问登录页跳到首页
		if (targetURL.equals(forwardUrl)||targetURL.equals("/")){
			if (session != null && session.getAttribute(sessionKey) != null) {// *用户登录以后需手动添加session
				resp.sendRedirect(req.getContextPath() + "/" + homeUrl);
				return;
			}
		}else if (!excepFlag(excepUrl.split(";"),targetURL)) {// 判断当前页是否是重定向以后的登录页面页面，如果是就不做session的判断，防止出现死循环
			if (session == null || session.getAttribute(sessionKey) == null) {// *用户登录以后需手动添加session
//				throw new SessionTimeOutException();
				resp.sendRedirect(req.getContextPath() + forwardUrl);// 如果session为空表示用户没有登录就重定向到login.jsp页面
				return;
			}
		}
		// 加入filter链继续向下执行
		chain.doFilter(req, resp);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig cfg) throws ServletException {
		// TODO Auto-generated method stub
		sessionKey = cfg.getInitParameter("sessionKey"); 
		  
        excepUrl = cfg.getInitParameter("excepUrlRegex"); 
  
        forwardUrl = cfg.getInitParameter("forwardUrl"); 

	}
	
	/**
	 * 判断路径是否包含登录注销
	 * @param s
	 * @param targetUrl
	 * @return
	 */
	private boolean excepFlag(String[] s,String targetUrl){
		for (String str : s){
			if (targetUrl.indexOf(str)>1){
				return true;
			}
		}
		return false;
	}

}
