package com.springmvc.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.junit.Ignore;

/**
 * 
 * <p>金航数码科技有限责任公司</p>
 * <p>作者:zhanglei1@avicit.com</p>  
 * <p>创建时间: 2015年3月30日 下午3:53:17</p>
 * <p>类说明：树节点实体对象</p>
 */
public class JsonTree<T> implements Serializable{
	
	
	private int id;
	private String text;
	private boolean hasChildren;
	private boolean isexpand;
	private int page;
	private boolean complete;
	private int write;
	private String path;
	private String value;
	private String parentid;
	private int design;
	private List<T>  ChildNodes;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getParentid() {
		return parentid;
	}
	public void setParentid(String parentid) {
		this.parentid = parentid;
	}
	public int getDesign() {
		return design;
	}
	public void setDesign(int design) {
		this.design = design;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public boolean isHasChildren() {
		return hasChildren;
	}
	public void setHasChildren(boolean hasChildren) {
		this.hasChildren = hasChildren;
	}
	public boolean isIsexpand() {
		return isexpand;
	}
	public void setIsexpand(boolean isexpand) {
		this.isexpand = isexpand;
	}
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public boolean isComplete() {
		return complete;
	}
	public void setComplete(boolean complete) {
		this.complete = complete;
	}
	public int getWrite() {
		return write;
	}
	public void setWrite(int write) {
		this.write = write;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public List<T> getChildNodes() {
		return ChildNodes;
	}
	public void setChildNodes(List<T> childNodes) {
		ChildNodes = childNodes;
	}

	

}
