package com.springmvc.storagemodel.controller;

import com.core.db.DbUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.springmvc.storagemodel.model.DbField;
import com.springmvc.storagemodel.model.DbTableVo;
import com.springmvc.storagemodel.service.DbTableManageService;
import com.utils.CommonUtil;
import com.utils.JsonHelper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value="/db/import")
public class DbImportController {
	private static Logger log =LoggerFactory.getLogger(DbImportController.class);

	@Autowired
	private JdbcTemplate jdbc;

	@Autowired
	private DbTableManageService dbtableService;


//	@Autowired
//	DataBaseService dataSourceService;



	@RequestMapping(value="/getImportTable")
	public ModelAndView getImporttable(HttpServletRequest request){
		ModelAndView  mav = new ModelAndView();
		String tableName = request.getParameter("tableName");
		if (StringUtils.isEmpty(tableName)){
			tableName = null;
		}else{
			tableName = "%"+tableName.toUpperCase()+"%";
		}
		List<Map<String,String>> list = new ArrayList<Map<String,String>>();
		Connection connection = null;
		ResultSet rs = null;
		try {
			connection = jdbc.getDataSource().getConnection();
			DatabaseMetaData metaData = connection.getMetaData();
			String types[] = {
					"TABLE","VIEW"
			};

			if("sqlserver2008".equals(DbUtils.getDbType())) {
				rs = metaData.getTables(connection.getCatalog(), "dbo", tableName, types);
			}
			else {
				rs = metaData.getTables(null, metaData.getUserName(), tableName, types);
			}

			while(rs.next()){
				//过滤以“SYS”、“BPM”、“EFORM”开头的数据库表
				if(hasString(rs.getString(3))){
					continue;
				}

				Map<String,String> map = new HashMap<String,String>();
				ResultSet pk = metaData.getPrimaryKeys(null, metaData.getUserName(),  rs.getString(3));
				while(pk.next()){
					map.put("pk", pk.getObject(4)+"");
				}
				if (pk.getStatement() != null) {
					pk.getStatement().close();
				}
				pk.close();
				if (DbUtils.isOracle()){
					//获取表描述信息
					ResultSet commentsSet = connection.prepareStatement("select * from  (SELECT A.TABLE_NAME,A.COMMENTS table_comments  FROM USER_TAB_COMMENTS A) where table_name='" + rs.getString(3) + "'").executeQuery();
					while (commentsSet.next()) {
						if (commentsSet.getString("TABLE_COMMENTS") != null && !commentsSet.getString("TABLE_COMMENTS").equals("")) {
							map.put("tableComment", commentsSet.getString("TABLE_COMMENTS"));
						}
					}
					if (commentsSet.getStatement() != null) {
						commentsSet.getStatement().close();
					}

					commentsSet.close();
				}else{
					map.put("tableComment", rs.getString("REMARKS"));
				}
				map.put("tableName", rs.getString(3));
				map.put("id", CommonUtil.getId());
				map.put("dataSourceId", "dataSource");
				list.add(map);
			}

		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (rs!=null) {
				try {
					rs.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			JdbcUtils.closeConnection(connection);
		}
		mav.addObject("total", list.size());
		mav.addObject("rows", list);
		return mav;
	}

	@RequestMapping(value="/checkTableName")
	public ModelAndView doCheckTableName(HttpServletRequest request){
		ModelAndView mav = new ModelAndView();
		String datas = request.getParameter("datas");
		String msg = "";
		List<DbTableVo> list = JsonHelper.getInstance().readValue(datas,new TypeReference<List<DbTableVo>>() {});

		try {
			msg = dbtableService.doCheckTableName(list);
			if (StringUtils.isEmpty(msg)){
				mav.addObject("flag", "success");
			}else{
				mav.addObject("flag", "echo");
				mav.addObject("error", msg);
			}
		}catch (Exception e){
			log.error(e.getMessage(),e);
			mav.addObject("flag", "failure");
			mav.addObject("error", e.getMessage());
			return mav;
		}
		return mav;
	}


	@RequestMapping(value = "/{tableTypeId}/doImport")
	public ModelAndView doImporttable(@PathVariable(value = "tableTypeId") String tableTypeId, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView();
		String datas = request.getParameter("datas");
		DatabaseMetaData dbmd = null;
		Connection conn = null;
		List<DbTableVo> list = JsonHelper.getInstance().readValue(datas, new TypeReference<List<DbTableVo>>() {
		});
		List<DbTableVo> tableList = new ArrayList<DbTableVo>();
		ResultSet resultSet = null;
		try {

			conn = jdbc.getDataSource().getConnection();
			dbmd = conn.getMetaData();
			String schema = getSchema(conn);
			for (DbTableVo table : list) {
				ArrayList<DbField> fieldList = new ArrayList<DbField>();
				resultSet = dbmd.getTables(null, schema, table.getTableName(), new String[]{"TABLE", "VIEW"});

				while (resultSet.next()) {
					String tableName = resultSet.getString("TABLE_NAME");
					String tpe = resultSet.getString("TABLE_TYPE");
					table.setType(tpe);
					if (tableName.equals(table.getTableName())) {

						//获取列信息
						ResultSet rs = dbmd.getColumns(conn.getCatalog(), schema, tableName, "%");

						while (rs.next()) {
							DbField field = new DbField();
							field.setColumnName(rs.getString("COLUMN_NAME"));
							if (rs.getString("TABLE_SCHEM") != null && !rs.getString("TABLE_SCHEM").equals(schema)) {
								continue;
							}
							//获取字段描述信息
							if (DbUtils.isOracle()) {
								//oracle需特殊操作获取描述
								ResultSet commentsSet = conn.prepareStatement("select * from user_col_comments where table_name='" + tableName + "' and column_name='" + rs.getString("COLUMN_NAME") + "'").executeQuery();
								while (commentsSet.next()) {
									if (commentsSet.getString("COMMENTS") != null && !commentsSet.getString("COMMENTS").equals("")) {
										field.setComment(commentsSet.getString("COMMENTS"));
									}
								}

								commentsSet.getStatement().close();
								commentsSet.close();
							} else {
								field.setComment(rs.getString("REMARKS"));
							}
							field.setDataLength(rs.getInt("COLUMN_SIZE") + "");
							field.setDataType(rs.getString("TYPE_NAME"));
							field.setScale((rs.getInt("DECIMAL_DIGITS") != -127 ? rs.getInt("DECIMAL_DIGITS") : 0) + "");
							if (rs.getInt("NULLABLE") == 1) {
								field.setIsNullable("Y");
							} else {
								field.setIsNullable("N");
							}
							if (rs.getString("COLUMN_NAME").equals(table.getPk())) {
								field.setIsPrimary("Y");
							} else {
								field.setIsPrimary("N");
							}
							fieldList.add(field);
						}

						rs.close();
					}
				}


				table.setFieldList(fieldList);
				tableList.add(table);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (resultSet != null) {
				try {
					resultSet.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			JdbcUtils.closeConnection(conn);
		}
		try {
			for (DbTableVo table : tableList) {
				dbtableService.doImportTable(table, "dataSource");
			}
			mav.addObject("flag", "success");
		}catch (Exception e){
			log.error(e.getMessage(),e);
			mav.addObject("error", e.getMessage());
			return mav;
		}

		return mav;
	}


	private boolean hasString(String sysWord){
		return sysWord.toLowerCase().startsWith("SYS".toLowerCase())
				||sysWord.toLowerCase().startsWith("BPM".toLowerCase())
				||sysWord.toLowerCase().startsWith("EFORM".toLowerCase())
				||sysWord.toLowerCase().startsWith("DB".toLowerCase());
	}

	//其他数据库不需要这个方法 oracle和db2需要

	private String getSchema(Connection conn) throws Exception {
		String schema;

		if("sqlserver2008".equals(DbUtils.getDbType())) {
			return "dbo";
		}
		else {
			schema = conn.getMetaData().getUserName();
			if ((schema == null) || (schema.length() == 0)) {
				throw new Exception("ORACLE数据库模式不允许为空");
			}
		}

		return schema.toString();
	}

}
