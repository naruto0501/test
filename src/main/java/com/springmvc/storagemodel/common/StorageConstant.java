/**
 *
 */
package com.springmvc.storagemodel.common;

import java.io.File;

/**
 * @author admin
 *
 */
public class StorageConstant {

	public static final String CHARSET="UTF-8";

	public static final String DOM_TEMP = "domtemp";

	public static final String MAIN_DB = "main";

	public static final String DEFAULT_VERSION = "V1";


	/**
	 * 模板类型
	 * @author admin
	 *
	 */
	public class TempType{
		public static final String EASYUI = "easyui";
		public static final String BOOTSTRAP = "bootstrap";
	}

	/**
	 * 来源类型
	 * @author admin
	 *
	 */
	public class TarType{
		public static final String FORM = "0";
		public static final String VIEW = "1";
	}

	/**
	 * 字段保存时所对应的存储id
	 * @author admin
	 *
	 */
	public class  FieldSaveType{
		public static final String db = "-db-";
	}

	/**
	 * 空间元素类型
	 * @author admin
	 *
	 */
	public class DomType{
		public static final String TEXT_BOX = "text-box";
		public static final String USER_BOX = "user-box";
		public static final String DEPT_BOX = "dept-box";
		public static final String POSITION_BOX = "position-box";
		public static final String ROLE_BOX = "role-box";
		public static final String GROUP_BOX = "group-box";
		public static final String DATE_BOX = "date-box";
		public static final String NUMBER_BOX = "number-box";
		public static final String TEXTAREA_BOX = "textarea-box";
		public static final String MARCO_BOX = "marco-box";
		public static final String SELECT_BOX = "select-box";
		public static final String RADIO_BOX = "radio-box";
		public static final String CHECK_BOX = "check-box";
		public static final String DATATABLE = "datatable";
		public static final String FORM_BOX = "form-box";
	}

	public enum MarcoType {
		list("1"), string("2");

		private String code;

		MarcoType(String string)

		{
			code = string;
		}

		public String getCode() {
			return code;
		}
	}


	private StorageConstant() {
	}
	

	public static class Generator{
		public static final String DOM_TEMPLATE_PATH = "avicit/platform6/eformbpms/generator/template/";
		
		public static final String DOM_PARAMETER_CLASS_PATH = "avicit.platform6.eformbpms.generator.velocityparameter.";

		public static final String GENERATOR_PARA_BASE_PATH = "avicit.platform6.eformbpms.generator.velocityparameter.generator.";
		
		public static final String FORM_PUBLISH_PATH = "avicit/eformmodule/form/";
		
		public static final String VIEW_PUBLISH_PATH = "avicit/eformmodule/view/";

		public static final String GENERATOR_PATH = "avicit"+ File.separator+"eformgenerator" + File.separator;

		public class FormTemplateType{
			public static final String dommethod = "dommethod";
			public static final String domsave = "domsave";
			public static final String domparse = "domparse";
		}
	}
	
	public class MyBatisType{
		public static final String VARCHAR = "VARCHAR";
		public static final String NUMBER = "DECIMAL";
		public static final String DATE = "DATE";
		public static final String DATETIME = "TIMESTAMP";
		public static final String BLOB = "BLOB";
		public static final String BOOLEAN = "BOOLEAN";
		public static final String CLOB = "CLOB";
	}

    /**
     * MyBatis jdbcType枚举
     */
    public enum ColJdbcTypeEnum {
        VARCHAR("VARCHAR"),
        DECIMAL("DECIMAL"),
        DATE("DATE"),
        TIMESTAMP("TIMESTAMP"),
        BLOB("BLOB");


        private String value;

        public String getValue() {
            return value;
        }

        ColJdbcTypeEnum(String value) {
            this.value = value;
        }
    }

    /**
     * 列查询类型枚举
     */
    public enum ColSelectTypeEnum {
        EQUAL("="),
        NOT_EQUAL("!="),
        LIKE("like"),
        LESS_THAN("<"),//&lt;
        LESS_THAN_OR_EQUAL("<="),//&lt;=
        MORE_THAN(">"),//&gt;
        MORE_THAN_OR_EQUAL(">=");//&gt;=

        private String value;

        public String getValue() {
            return value;
        }

        ColSelectTypeEnum(String value) {
            this.value = value;
        }
    }

	public enum ButtonType {
		insert("insert"), delete("delete"), update("update");

		private String code;

		ButtonType(String string)

		{
			code = string;
		}

		public String getCode() {
			return code;
		}
	}

	public enum ColProp {
		marcoType("marcoType"),marco("marco"),
		linkageEle("linkageEle"),linkageImpl("linkageImpl"),linkageColumnid("linkageColumnid"),linkageResultType("linkageResultType"),
        linkageEle_ctrl("linkageEle_ctrl"),linkageImpl_ctrl("linkageImpl_ctrl"),linkageColumnid_ctrl("linkageColumnid_ctrl"),linkageResultType_ctrl("linkageResultType_ctrl"),
        colName("colName"), colLabel("colLabel"), colLength("colLength"), minValue("minValue"), maxValue("maxValue"), colIsMust(
				"colIsMust"), colDropdownType("colDropdownType"), colIsVisible(
				"colIsVisible"), colIsSearch("colIsSearch"), colIsTabVisible(
				"colIsTabVisible"), colIsDetail("colIsDetail"), colIsUnique(
				"colIsUnique"), validateType("validateType"),decimal("decimal"), attribute01("attribute01"), attribute02("attribute02"),attribute03(
				"attribute03"),elementType("elementType"),domType("domType"),colType("colType"),colRuleName("colRuleName"),rows(
				"rows"),selectedoption("selectedoption"),selectedvalues("selectedvalues"),domId("domId");



		private String key;

		ColProp(String string)

		{
			key = string;
		}

		public String getKey() {
			return key;
		}

	}



	public enum DbType{
    	TABLE("TABLE","1"),VIEW("VIEW","2");

    	private String name;
    	private String code;
    	DbType(String name,String code){this.name = name;this.code=code;}

	}
	public static String getDbType(String name){
		for (DbType temp : DbType.values()){
			if (temp.name.equals(name)){
				return temp.code;
			}
		}
		return "";
	}

	/**
	 * MyBatis jdbcType枚举
	 */
	public enum DbColTypeEnum {
		VARCHAR2("VARCHAR2","VARCHAR2","VARCHAR","LVARCHAR","CHAR"),
		NUMBER("NUMBER","DECIMAL","NUMBER"),
		DATE("DATE","DATE","TIMESTAMP","DATETIME","DATETIME2"),
		CLOB("CLOB","CLOB","LONGTEXT","TEXT"),
		BLOB("BLOB","BLOB","BYTE","LONGBLOB");


		private String value;

		private String[] args;

		public String getValue() {
			return value;
		}

		public boolean contains(String key) {
			for (String arg : args){
			    if (key.equals(arg)){
			        return true;
                }
            }
            return false;
		}

		DbColTypeEnum(String value,String...args) {
			this.value = value;
			this.args = args;
		}
	}

	public static String getDbColType(String databasecol){
	    for (DbColTypeEnum temp : DbColTypeEnum.values()){
			if (temp.contains(databasecol)){
				return temp.getValue();
			}
		}
	    return "";
    }

}
