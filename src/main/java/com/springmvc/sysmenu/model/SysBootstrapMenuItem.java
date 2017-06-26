package com.springmvc.sysmenu.model;



import java.io.Serializable;

/**
 * 
 * <p>金航数码科技有限责任公司</p>
 * <p>作者:zhanglei1@avicit.com</p>  
 * <p>创建时间: 2015年3月30日 下午4:17:26</p>
 * <p>类说明：系统角色对象实体类</p>
 */
public class SysBootstrapMenuItem extends SysMenuItem implements Serializable{
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public SysBootstrapMenuItem(){
		super();
	}

	@Override
	public Element toElement(){
    	Element li = new Element("li");
		Element a = new Element("a");
		Element i = new Element("i");
		Element span = new Element("span");
		Element b = new Element("b");
		//构造li标签
		li.setClassname("");
		
		//构造a标签
		a.setId(menuCode);
//		a.setHref("#"+menuCode);
		a.setHref("javascript:void(0)");
		if (url != null && !"".equals(url)){
			a.setClickFunction("menuClick(this,{id: '"+menuCode+"', close:true,title: '"+menuTitle+"',className:'"+iconClass+"', url:'"+url+"'});");
		}
		if (hasSub()){
			a.setClassname("dropdown-toggle");
		}
		
		//构造i标签
		i.setClassname(iconClass);
		
		//构造span
		if (parentId.equals(ROOT_MENU_ID)){
			span.setClassname("menu-text");
		}
		span.setText(menuTitle);

		a.append(i);
		a.append(span);
	
		
		li.append(a);
		b.setClassname("arrow");
		li.append(b);
		
		//如果有下级菜单
		if (hasSub()){
			Element bsub = new Element("b");
			bsub.setClassname("arrow fa fa-angle-down");
			a.append(bsub);
			Element ul = new Element("ul");
			ul.setClassname("submenu");
			for (SysMenuItem sub : subMenu){
				ul.append(sub.toElement());
			}
			li.append(ul);
		}
		return li;
    }
	
}