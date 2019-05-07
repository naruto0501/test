package com.springmvc.storagemodel.service.impl;

import com.core.exception.DaoException;
import com.springmvc.storagemodel.dao.DbTableColDao;
import com.springmvc.storagemodel.model.DbTableColDTO;
import com.utils.CommonUtil;
import com.utils.PojoUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Service
public class DbTableColService implements Serializable {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(DbTableColService.class);

	private static final long serialVersionUID = 1L;

	@Autowired
	private DbTableColDao dbTableColDao;


	/**
	 * @description:批量新增或修改对象
	 * @param demos
	 * @return
	 * @throws Exception
	 */
	public void insertOrUpdateDbTableCol(List<DbTableColDTO> demos) {
		for (DbTableColDTO demo : demos) {
			if(!demo.getColIsSys().equals("Y")){
				demo.setColIsSys("N");
			}
			if ("".equals(demo.getId()) || null == demo.getId()) {
				this.insertDbTableCol(demo);
			} else {
				this.updateDbTableCol(demo);
			}
		}
	}
	

	
	/**
	 * @description:根据tableid获取tablecollist
	 * @param tableName
	 * @return
	 * @throws Exception
	 */
	public List<DbTableColDTO> findDbTableColListByTableName(String tableName) {
		List<DbTableColDTO> dbTableColList = dbTableColDao.findDbTableColListByTableName(tableName);
		return dbTableColList;
	}
	
	/**
	 * @description:根据tableid获取tablecollist
	 * @param tableId
	 * @return
	 * @throws Exception
	 */
	public List<DbTableColDTO> findDbTableColListByTableId(String tableId) {
		List<DbTableColDTO> dbTableColList = dbTableColDao.findDbTableColListByTableId(tableId);
		return dbTableColList;
	}
	/**
	 * @description:根据tableid获取tablecollist
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public DbTableColDTO findDbTableColById(String id) {
		DbTableColDTO dbTableColList = dbTableColDao.findDbTableColById(id);
		return dbTableColList;
	}

	/**
	 * @description:新增对象
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	public String insertDbTableCol(DbTableColDTO dto) {
		try {
			String id = dto.getId();
			if (StringUtils.isEmpty(dto.getId())){
				id = CommonUtil.getId();
				dto.setId(id);
			}


			dto.setColName(dto.getColName().toUpperCase());
			PojoUtil.setSysProperties(dto, "insert");
			dbTableColDao.insertDbTableCol(dto);
			return id;
		} catch (Exception e) {
			LOGGER.error("insertDbTableCol出错：", e);
			throw new DaoException(e.getMessage(), e);
		}
	}
	
	public int deleteColByTableId(String tableId) throws DaoException{
		return dbTableColDao.deleteColByTableId(tableId);
	}

	/**
	 * @description:批量新增对象
	 * @param dtoList
	 * @return
	 * @throws Exception
	 */
	public int insertDbTableColList(List<DbTableColDTO> dtoList) {
		List<DbTableColDTO> demo = new ArrayList<DbTableColDTO>();
		for (DbTableColDTO dto : dtoList) {
			String id = CommonUtil.getId();
			dto.setId(id);
			PojoUtil.setSysProperties(dto, "insert");
			demo.add(dto);
		}
		try {
			return dbTableColDao.insertDbTableColList(demo);
		} catch (Exception e) {
			LOGGER.error("insertDbTableColList出错：", e);
			throw new DaoException(e.getMessage(), e);
		}
	}

	/**
	 * @description:修改对象全部字段
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	public int updateDbTableCol(DbTableColDTO dto) {
		// 记录日志
		DbTableColDTO old = findById(dto.getId());
		PojoUtil.setSysProperties(dto, "update");
		PojoUtil.copyProperties(old, dto, true);

		old.setColName(old.getColName().toUpperCase());
		int ret = dbTableColDao.updateDbTableColSensitive(old);
		if (ret == 0) {
			throw new DaoException("数据失效，请重新更新");
		}
		return ret;
	}

	/**
	 * @description:批量更新对象
	 * @param dtoList
	 * @return
	 * @throws Exception
	 */
	public int updateDbTableColList(List<DbTableColDTO> dtoList) {
		try {
			return dbTableColDao.updateDbTableColList(dtoList);
		} catch (Exception e) {
			LOGGER.error("updateDbTableColList出错：", e);
			throw new DaoException(e.getMessage(), e);
		}

	}

	/**
	 * @description:按主键单条删除
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public int deleteDbTableColById(String id) {
		if (StringUtils.isEmpty(id))
			return 0;
		try {
			return dbTableColDao.deleteDbTableColById(id);
		} catch (Exception e) {
			LOGGER.error("deleteDbTableColById出错：", e);
			throw new DaoException(e.getMessage(), e);
		}
	}

	/**
	 * @description:批量删除数据
	 * @param ids
	 *            id的数组
	 * @return
	 * @throws Exception
	 */
	public int deleteDbTableColByIds(String[] ids) {
		int result = 0;
		for (String id : ids) {
			deleteDbTableColById(id);
			result++;
		}
		return result;
	}

	/**
	 * @description:批量删除数据2
	 * @param idlist
	 *            id的List
	 * @return
	 * @throws Exception
	 */
	public int deleteDbTableColList(List<String> idlist) throws Exception {
		try {
			return dbTableColDao.deleteDbTableColList(idlist);
		} catch (Exception e) {
			LOGGER.error("deleteDbTableColList出错：", e);
			throw e;
		}
	}

	/**
	 * @description:日志专用，内部方法，不再记录日志
	 * @param id
	 * @return
	 * @throws Exception
	 */
	private DbTableColDTO findById(String id) {
		try {
			DbTableColDTO dto = dbTableColDao.findDbTableColById(id);
			return dto;
		} catch (Exception e) {
			LOGGER.error("findById出错：", e);
			throw new DaoException(e.getMessage(), e);
		}
	}

}
