package com.springmvc.sysmenu.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * <p>Title: 所有业务实体对象的基类，在基类中定义了 创建人 创建时间 最后修改时间 最后修改人 修改IP 版本</p>
 * <p> Description: 业务对象 集成业务实体对象的类就不需要再设置这些对象</p>
 * <p>Copyriht: Copyright (c) 2012 </p>
 * <p>Company: AVICIT Co., Ltd</p>
 * @author wang xiu zhen
 * @version 1.0 Date: 2012-09-24 11:21
 * 
 */

public class Element implements Serializable{

	private static final long serialVersionUID = 1981121902843093325L;

	protected Map<String,String> style = new HashMap<String,String>();
	protected String id;
	protected String name;
	protected String classname;
	protected String title;
	protected String elementType;
	protected String value;
	protected String text;
	protected String clickFunction;
	protected String href;
	protected List<Element> innerElemet = new ArrayList<Element>(); 
	
	public List<Element> getInnerHtml() {
		return innerElemet;
	}

	public void setInnerHtml(List<Element> innerElemet) {
		this.innerElemet = innerElemet;
	}
	public String getHref() {
		return href;
	}
	public void setHref(String href) {
		this.href = href;
	}

	public Element(String type){
		this.elementType = type;
	}
	
	public String getClickFunction() {
		return clickFunction;
	}
	public void setClickFunction(String clickFunction) {
		this.clickFunction = clickFunction;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Map<String, String> getStyle() {
		return style;
	}
	public void setStyle(Map<String, String> style) {
		this.style = style;
	}
	public String getElementType() {
		return elementType;
	}
	public void setElementType(String elementType) {
		this.elementType = elementType;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getClassname() {
		return classname;
	}
	public void setClassname(String classname) {
		this.classname = classname;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public void addStyle(String key, String value){
		style.put(key, value);
	}
	
	@Override
	public String toString(){
		StringBuffer ele = new StringBuffer("");
		StringBuffer attr = new StringBuffer("");
		if (elementType != null){
			ele.append("<").append(elementType).append(">").append("</"+elementType+">");
		}else{
			return "";
		}
		if (id != null){
			attr.append(" id=\"").append(id).append("\"");
		}
		if (name != null){
			attr.append(" name=\"").append(name).append("\"");
		}
		if (classname != null){
			attr.append(" class=\"").append(classname).append("\"");
		}
		if (title != null){
			attr.append(" title=\"").append(title).append("\"");
		}
		if (value != null){
			attr.append(" value=\"").append(value).append("\"");
		}
		if (clickFunction != null){
			attr.append(" onclick=\"").append(clickFunction).append("\"");
		}
		if (href != null){
			attr.append(" href=\"").append(href).append("\"");
		}
		if (style.size()>0){
			attr.append(" style=\"");
			for (Map.Entry<String, String> entry : style.entrySet()){
				attr.append(entry.getKey()).append(":").append(entry.getValue()).append(";");
			}
			attr.append("\"");
		}
		int offset = ele.indexOf("</");
		if (offset > 0){
			StringBuffer html = new StringBuffer("");
			if (text != null){
				html.append(text);
			}
			if (innerElemet != null && innerElemet.size()>0){
				for (Element element : innerElemet){
					html.append(element.toString());
				}
			}
			ele.insert(offset, html);
			ele.insert(offset-1, attr.toString());
		}
		return ele.toString();
	}
	
	public void append(Element element){
		if (element != null){
			innerElemet.add(element);
		}
	}

}
