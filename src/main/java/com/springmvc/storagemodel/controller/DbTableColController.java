package com.springmvc.storagemodel.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.springmvc.storagemodel.model.DbTable;
import com.springmvc.storagemodel.model.DbTableColDTO;
import com.springmvc.storagemodel.service.DbTableManageService;
import com.springmvc.storagemodel.service.impl.DbExcutorService;
import com.springmvc.storagemodel.service.impl.DbTableColService;
import com.utils.JsonHelper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Scope("prototype")
@RequestMapping("platform6/db/dbtablecol/dbTableColController")
public class DbTableColController{
	
	private static final Logger LOGGER = LoggerFactory
			.getLogger(DbTableColController.class);

	@Autowired
	private DbTableManageService dbtableService;

	@Autowired
	private DbTableColService dbtablecolService;
	@Autowired
	private DbExcutorService dbExcutorService;

	/**
	 * @description:跳转到管理页面
	 * @param request
	 *            请求,reponse 响应
	 * @return
	 */
	@RequestMapping(value = "toDbTableColManage/{id}")
	public ModelAndView toDbTableColManage(@PathVariable String id,HttpServletRequest request,
			HttpServletResponse reponse) {
		ModelAndView mav = new ModelAndView();
		String iscreated = request.getParameter("iscreated");
		String dataSourceName = request.getParameter("dataSourceName");
		String tableName = request.getParameter("tableName");
		String dbtype = request.getParameter("dbtype");
		mav.addObject("iscreated", iscreated);
		mav.addObject("dataSourceName", dataSourceName);
		mav.addObject("tableName", tableName);
		mav.addObject("dbtype", dbtype);
		mav.setViewName("avicit/platform6/db/dbtablecol/DbTableColManage");
		request.setAttribute("url",
				"platform/platform6/db/dbtablecol/dbTableColController/operation/");
		request.setAttribute("tableId",id);
		return mav;
	}

	/**
	 * @author RX
	 * @throws IOException 
	 * @description:获取所有列名
	 */
	@RequestMapping(value = "/operation/getCol/{tableId}")
	public void getAllColsById(@PathVariable String tableId,HttpServletRequest request,
			HttpServletResponse reponse) throws IOException{
		List<DbTableColDTO> colList = dbtablecolService.findDbTableColListByTableId(tableId);
		Map<String,String> map = new HashMap<String,String>();
		for(DbTableColDTO dto:colList){
			if((dto.getColIsSys()!=null&&!dto.getColIsSys().equals("Y"))||dto.getColIsSys() == null){
				map.put(dto.getColName(), dto.getColName());
			}
		}
		String result = JsonHelper.getInstance().writeValueAsString(map);
		PrintWriter pw = reponse.getWriter();
		pw.write(result);	
	}
	

	
//	/**
//	 * @description:管理页面分页查询
//	 * @param request
//	 *            pageParameter
//	 * @return
//	 */
//	@RequestMapping(value = "/operation/getDbTableColsByPage")
//	@ResponseBody
//	public Map<String, Object> togetDbTableColByPage(
//			PageParameter pageParameter, HttpServletRequest request) {
//		QueryReqBean<DbTableColDTO> queryReqBean = new QueryReqBean<DbTableColDTO>();
//		queryReqBean.setPageParameter(pageParameter);
//		HashMap<String, Object> map = new HashMap<String, Object>();
//		String json = ServletRequestUtils.getStringParameter(request, "tableId",
//				"");
//		json = "{\"tableId\":\""+json+"\"}";
//		String keyWord = ServletRequestUtils.getStringParameter(request,
//				"keyWord", "");// 字段查询条件
//		String sord = ServletRequestUtils.getStringParameter(request, "sord",
//				"");// 排序方式
//		String sidx = ServletRequestUtils.getStringParameter(request, "sidx",
//				"");// 排序字段
//		if (!"".equals(keyWord)) {
//			json = keyWord.substring(0,keyWord.length()-1)+","+json.substring(1);
//		}
//		String oderby = "";
//		if (sidx != null && sord != null && !sord.equals("")
//				&& !sidx.equals("")) {
//			String cloumnName = ComUtil.getColumn(DbTableColDTO.class, sidx);
//			if (cloumnName != null) {
//				oderby = " " + cloumnName + " " + sord;
//			}
//		}
//		DbTableColDTO param = null;
//		QueryRespBean<DbTableColDTO> result = null;
//		if (json != null && !"".equals(json)) {
//			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//			param = JsonHelper.getInstance().readValue(json, dateFormat,
//					new TypeReference<DbTableColDTO>() {
//					});
//			queryReqBean.setSearchParams(param);
//		}
//		try {
//
//			Muti3Bean<QueryReqBean<DbTableColDTO>, String,String> mutibean = new Muti3Bean<QueryReqBean<DbTableColDTO>, String,String>();
//			mutibean.setDto1(queryReqBean);
//			mutibean.setDto2(SessionHelper.getCurrentOrgIdentity(request));
//			mutibean.setDto3(oderby);
//			ResponseMsg<QueryRespBean<DbTableColDTO>> responseMsg = RestClient.doPost(RestClientConfig.getRestHost(RestClientConfig.db) + "/api/platform6/db/dbtablecol/DbTableColRest/searchByPage/v1", mutibean, new GenericType<ResponseMsg<QueryRespBean<DbTableColDTO>>>(){});
//			if(responseMsg.getRetCode().equals(ResponseStatus.HTTP_OK)){
//				result = responseMsg.getResponseBody();
//			}else{
//				throw new RuntimeException(responseMsg.getErrorDesc());
//			}
//
//
//		} catch (Exception ex) {
//			LOGGER.error(ex.getMessage());
//			ex.printStackTrace();
//			return map;
//		}
//
//		for (DbTableColDTO dto : result.getResult()) {
//			String name = "";
//			if(dto.getColType()!=null){
//				if(dto.getColType().equals("VARCHAR2")){
//					name="VARCHAR2";
//				}else if(dto.getColType().equals("DATE")){
//					name="DATE";
//				}else if(dto.getColType().equals("NUMBER")){
//					name="NUMBER";
//				}else if(dto.getColType().equals("BLOB")){
//					name="BLOB";
//				}else if(dto.getColType().equals("CLOB")){
//					name="CLOB";
//				}
//			}
//			dto.setColTypeName(name);
//		}
//		map.put("records", result.getPageParameter().getTotalCount());
//		map.put("page", result.getPageParameter().getPage());
//		map.put("total", result.getPageParameter().getTotalPage());
//		map.put("rows", result.getResult());
//		LOGGER.info("成功获取DbTableColDTO分页数据");
//		return map;
//	}

	/**
	 * @description:保存数据
	 * @param id
	 *            主键id,demoBusinessTripDTO 保存的对象
	 * @return
	 */
	@RequestMapping(value = "/operation/save/{id}", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView saveOrUpdateDbTableCol(HttpServletRequest request,@PathVariable String id) {
		ModelAndView mav = new ModelAndView();
		String datas = ServletRequestUtils.getStringParameter(request, "data",
				"");
		if (datas == "") {
			mav.addObject("flag", "success");
			return mav;
		}
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		try {
			
			DbTable dbtable = dbtableService.getDbTable(id);
			
			List<DbTableColDTO> list = JsonHelper.getInstance().readValue(
					datas, dateFormat,
					new TypeReference<List<DbTableColDTO>>() {
					});
			List<DbTableColDTO> colList = dbtablecolService.findDbTableColListByTableId(id);
			List<String> checkList = new ArrayList<String>();
			for(DbTableColDTO dto:colList){
				checkList.add(dto.getColName());
			}
			for(DbTableColDTO dto:list){

				if(checkList.contains(dto.getColName().toUpperCase())&&(dto.getId() == null||"".equals(dto.getId()))){
					String resultMsg = "列名:“"+dto.getColName()+"”重复！";
					mav.addObject("flag", "failure");
					mav.addObject("error",resultMsg);
					return mav;
				}else{
					checkList.add(dto.getColName());
				}
			}
			if (dbtable.getTableIsCreated().equals("Y")){
				for (DbTableColDTO col : list){
					String resultMsg = "";
					if ("".equals(col.getId()) || null == col.getId()) {
						resultMsg = dbExcutorService.addTableColumn(dbtable.getTableName(), col);
					} else {
						DbTableColDTO updatecol = dbtablecolService.findDbTableColById(col.getId());
						resultMsg = dbExcutorService.updateTableColumn(dbtable.getTableName(), updatecol, col);
					}
					if(!resultMsg.equals("1")){
						mav.addObject("flag", "failure");
						mav.addObject("error", resultMsg);
						return mav;
					}
				}
			}
			dbtablecolService.insertOrUpdateDbTableCol(list);
			mav.addObject("flag", "success");
			return mav;
		} catch (Exception ex) {
			LOGGER.error(ex.getMessage(),ex);
			mav.addObject("flag", "failure");
			mav.addObject("error", ex.getMessage());
			return mav;
		}
	}

	/**
	 * @description:按照id批量删除数据
	 * @param ids
	 *            id数组
	 * @return
	 */
	@RequestMapping(value = "/operation/delete", method = RequestMethod.POST)
	public ModelAndView deleteDbTableCol(@RequestBody String[] ids,
			HttpServletRequest request) {
		ModelAndView mav = new ModelAndView();
		try {
			String tableId = "";
			String tableName = "";
			String msg = "";
			String msg1 = "";//Col使用情况
			String isCreated = "";
			if (ids.length>0){
				DbTableColDTO colunmsById = dbtablecolService.findDbTableColById(ids[0]);
				tableId = colunmsById.getTableId();
				DbTable table = dbtableService.getDbTable(tableId);
				tableName = table.getTableName();
				isCreated = table.getTableIsCreated();
			}
			
			for (String id : ids){
				DbTableColDTO colunmsById = dbtablecolService.findDbTableColById(ids[0]);
				try{
					if (isCreated.equals("Y")){
						//判断列是否被使用
//						boolean isColUsed = eformAPI.isDbTableColUsed(id);
//						if(isColUsed){
//							msg1 += "字段["+colunmsById.getColName()+"]，";
//							continue;
//						}
						String err =  dbExcutorService.dropCol(colunmsById.getColName(), tableName);
						if (!StringUtils.isEmpty(err)){
							msg += "字段["+err+"]，";
							continue;
						}
					}
					dbtablecolService.deleteDbTableColById(id);
				}catch(Exception e){
					e.printStackTrace();
					msg += "字段["+colunmsById.getColName()+"]，";
					continue;
				}
			}

			if(!msg.equals("")||!msg1.equals("")){
				if(!msg.equals("")){
					msg += "无法被删除，请检查数据库中是否已经存在数据!";
				}
				if(!msg1.equals("")){
					msg += msg1 + "无法被删除，请检查字段是否被使用！";
				}
				mav.addObject("error", msg);
				mav.addObject("flag", "failure");
			}else{
				mav.addObject("flag", "success");
			}
		} catch (Exception ex) {
			LOGGER.error(ex.getMessage());
			mav.addObject("error", ex.getMessage());
			mav.addObject("flag", "failure");
			return mav;
		}
		return mav;
	}
}
