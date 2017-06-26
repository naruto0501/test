package com.springmvc.sysmenu.model;



import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * <p>金航数码科技有限责任公司</p>
 * <p>作者:zhanglei1@avicit.com</p>  
 * <p>创建时间: 2015年3月30日 下午4:17:26</p>
 * <p>类说明：系统角色对象实体类</p>
 */
public abstract class SysMenuItem implements Serializable{
	
	
	private static final long serialVersionUID = 1L;
	protected static final String ROOT_MENU_ID = "1";
	protected String url;
	protected String iconClass;
	protected String imageUrl;
	protected String menuCode;
	protected String menuTitle;
	protected String clickFunction;
	protected String parentId;
	protected List<SysMenuItem> subMenu = new ArrayList<SysMenuItem>(); 
	
    public SysMenuItem(String url,String iconClass,String imageUrl,String menuCode,String menuTitle,String clickFunction,String parentId){
    	this.url = url;
    	this.iconClass = iconClass;
    	this.menuCode = menuCode;
    	this.menuTitle = menuTitle;
    	this.clickFunction = clickFunction;
    	this.parentId = parentId;
    	this.imageUrl = imageUrl;
    }
    
    public SysMenuItem(){
    	super();
    }
    
    public void addSubMenu(SysMenuItem sub){
    	if (sub != null){
    		subMenu.add(sub);
    	}
    }
    
    public abstract Element toElement();
    
    @Override
    public String toString(){
    	
		return toElement().toString();
   }
    
    public boolean hasSub(){
		if(this.subMenu.size() > 0){
			return true;
		}else{
			return false;
		}
	}

	public String getClickFunction() {
		return clickFunction;
	}

	public void setClickFunction(String clickFunction) {
		this.clickFunction = clickFunction;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getIconClass() {
		return iconClass;
	}

	public void setIconClass(String iconClass) {
		this.iconClass = iconClass;
	}

	public String getMenuCode() {
		return menuCode;
	}

	public void setMenuCode(String menuCode) {
		this.menuCode = menuCode;
	}

	public String getMenuTitle() {
		return menuTitle;
	}

	public void setMenuTitle(String menuTitle) {
		this.menuTitle = menuTitle;
	}

	public List<SysMenuItem> getSubMenu() {
		return subMenu;
	}

	public void setSubMenu(List<SysMenuItem> subMenu) {
		this.subMenu = subMenu;
	}
	
}