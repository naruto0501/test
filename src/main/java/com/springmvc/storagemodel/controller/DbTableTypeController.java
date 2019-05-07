package com.springmvc.storagemodel.controller;

import com.springmvc.storagemodel.common.StorageUtils;
import com.springmvc.storagemodel.model.DbTable;
import com.springmvc.storagemodel.model.DbTableColDTO;
import com.springmvc.storagemodel.service.DbTableManageService;
import com.springmvc.storagemodel.service.impl.DbExcutorService;
import com.springmvc.storagemodel.service.impl.DbTableColService;
import com.utils.JsonHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/db/dbTableManageController")
public class DbTableTypeController {
    

    @Autowired
    private DbTableManageService dbtableService;

    @Autowired
    private DbTableColService dbtablecolService;

    @Autowired
    private DbExcutorService dbExcutorService;

    private static Logger logger = LoggerFactory.getLogger(DbTableTypeController.class);



    //跳转存储模型主界面
    @RequestMapping(value = "/toDbManager")
    public ModelAndView toDbManager(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("avicit/platform6/db/dbtabletype/dbmanager");

        return mv;
    }


    //#########DbTable#########

    //获取存储模型列表
    @RequestMapping(value = "/getDbTableList")
    @ResponseBody
    public String getDbTableList(HttpServletRequest request) {

        DbTable parm = new DbTable();

        List<DbTable> eformComponentList = dbtableService.selectDbTableList(parm);

        Map<String, List<DbTable>> back = new HashMap<String, List<DbTable>>();
        back.put("data", eformComponentList);

        return JsonHelper.getInstance().writeValueAsString(back);
    }

    //添加存储模型
    @RequestMapping(value = "/addDbTable")
    @ResponseBody
    public String addDbTable(HttpServletRequest request) {
        String formDataJson = request.getParameter("formDataJson");
        Map<String, Object> back = new HashMap<String, Object>();
        DbTable data = JsonHelper.getInstance().readValue(formDataJson, DbTable.class);
        data.setTableName("DYN_"+data.getTableName());
        data.setTableIsCreated("N");
        data.setDataSourceId("dataSource");
        try {
            Map<String, Object> map = dbtableService.saveDbTable(data);
            back = map;
        }catch (Exception e){
            logger.error(e.getMessage(),e);
            back.put("error", e.getMessage());
            back.put("result","2");
        }

        return JsonHelper.getInstance().writeValueAsString(back);
    }
    
    //删除存储模型
    @RequestMapping(value = "/deleteDbTable")
    @ResponseBody
    public String deleteDbTable(HttpServletRequest request) {
        String id = request.getParameter("id");
        Map<String, Integer> back = new HashMap<String, Integer>();
        try {
            int result = dbtableService.deleteDbTable(id);

            back.put("result", result);
        }catch (Exception e){
            logger.error(e.getMessage(),e);
        }

        return JsonHelper.getInstance().writeValueAsString(back);
    }

  //编辑存储模型
    @RequestMapping(value = "/toAddDbTable")
    public ModelAndView toAddDbTable(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("avicit/platform6/db/dbtabletype/addDbTable");

        return mv;
    }
    
    //编辑存储模型
    @RequestMapping(value = "/toImportJsp")
    public ModelAndView toImportJsp(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("avicit/platform6/db/dbtabletype/importTable");

        return mv;
    }
    
    //导入外部
    @RequestMapping(value = "/toImportOutJsp")
    public ModelAndView toImportOutJsp(HttpServletRequest request) {
    	String dataSourceId = request.getParameter("id");
        ModelAndView mv = new ModelAndView();
        mv.setViewName("avicit/platform6/db/dbtabletype/importOutTable");

        return mv;
    }
    

    
    
    //编辑存储模型
    @RequestMapping(value = "/editDbTable")
    public ModelAndView editDbTable(HttpServletRequest request) {
        String id = request.getParameter("id");
        DbTable dbTable = dbtableService.getDbTable(id);
        
        String tableName = dbTable.getTableName();
        String dataSourceId = dbTable.getDataSourceId();
        if (dbTable.getTableIsCreated()!=null&&!dbTable.getTableIsCreated().equals("Y")){
	        String[] split = tableName.split("DYN_");
	        if (split.length>1){
	        	tableName = split[1];
	        }
        }
        ModelAndView mv = new ModelAndView();
        mv.addObject("dbTable", dbTable);
        mv.addObject("tableName", tableName);
        mv.addObject("dataSourceId", dataSourceId);
        mv.setViewName("avicit/platform6/db/dbtabletype/editDbTable");

        return mv;
    }

    //提交编辑存储模型
    @ResponseBody
    @RequestMapping(value = "/subEditDbTable")
    public String subEditDbTable(HttpServletRequest request) {
        String formDataJson = request.getParameter("formDataJson");
        Map<String, Object> back = new HashMap<String, Object>();
        DbTable data = JsonHelper.getInstance().readValue(formDataJson, DbTable.class);
        if (data.getTableIsCreated()!=null&&!data.getTableIsCreated().equals("Y")){
        	data.setTableName("DYN_"+data.getTableName());
        }


        try {
            back = dbtableService.updateDbTable(data);
        }catch (Exception e){
            logger.error(e.getMessage(),e);
        }

        return JsonHelper.getInstance().writeValueAsString(back);
    }
    
  //创建表
    @RequestMapping(value = "/createDbTable")
    @ResponseBody
    public String createDbTable(HttpServletRequest request) {
        String id = request.getParameter("id");
        Map<String, String> back = new HashMap<String, String>();
        String tableName ="";
		try{
			//建表
			List<DbTableColDTO> colunmsByTableId = dbtablecolService.findDbTableColListByTableId(id);
			DbTable selectDbTable = dbtableService.getDbTable(id);
			tableName = selectDbTable.getTableName();
            dbExcutorService.createDbTable(tableName, colunmsByTableId);

			
			
			try{
				//更新建表状态
				DbTable table = new DbTable();
				table.setId(id);
				table.setTableIsCreated("Y");
                dbtableService.updateDbTable(table);
				boolean hasPk = false;
				for (DbTableColDTO col :colunmsByTableId){
					if (col.getColIsPk().equals("Y")){
						hasPk = true;
						break;
					}
				}
				
				List<DbTableColDTO> setBaseCol = new ArrayList<DbTableColDTO>();
				if (hasPk){
					setBaseCol = StorageUtils.setBaseCol(id,false);
				}else{
					setBaseCol = StorageUtils.setBaseCol(id,true);
				}


                dbtablecolService.insertOrUpdateDbTableCol(setBaseCol);
			
			}catch(Exception ex){
                dbExcutorService.dropTable(tableName);
				throw new RuntimeException(ex.getMessage());
			}
			
		    back.put("result", "1");
		    
		}catch(Exception e){
            dbExcutorService.dropTable(tableName);
			logger.error(e.getMessage(),e);
			String[] msg = e.getMessage().split("###");
			if (msg.length>1){
				back.put("result", msg[1]);
			}else{
				back.put("result", e.getMessage());
			}
			
		}
        
        return JsonHelper.getInstance().writeValueAsString(back);
    }
    
    

    
}
