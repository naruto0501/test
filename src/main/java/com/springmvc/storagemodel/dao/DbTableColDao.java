package com.springmvc.storagemodel.dao;

import com.core.page.Page;
import com.springmvc.storagemodel.model.DbTableColDTO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DbTableColDao {

	/**
	 * @description: 分页查询存储模型列信息表
	 * @param P_OrderBy
	 * @return
	 */
    Page<DbTableColDTO> searchDbTableColByPage(@Param("bean") DbTableColDTO dbTableColDTO,
											   @Param("P_OrderBy") String P_OrderBy, @Param("org") String orgIdentity);

	/**
	 * @description: 分页查询存储模型中非索引列
	 * @param dbTableColDTO
	 * @param P_OrderBy
	 * @param orgIdentity
	 * @return
	 */
    Page<DbTableColDTO> searchDbTableNotIndexColByPage(@Param("bean") DbTableColDTO dbTableColDTO,
                                                       @Param("P_OrderBy") String P_OrderBy, @Param("org") String orgIdentity);
	/**
	 * @description: 分页查询存储模型列信息表 Or
	 * @param P_OrderBy
	 * @return
	 */
    Page<DbTableColDTO> searchDbTableColByPageOr(@Param("bean") DbTableColDTO dbTableColDTO,
                                                 @Param("P_OrderBy") String P_OrderBy, @Param("org") String orgIdentity);

	/**
	 * @description:查询对象 存储模型列信息表
	 * @param id
	 * @return
	 */
    DbTableColDTO findDbTableColById(String id);

	/**
	 * @description:查询对象列表 存储模型列信息表
	 * @param id
	 * @return
	 */
    List<DbTableColDTO> findDbTableColListByTableId(String id);

	/**
	 * @description:查询对象列表 存储模型列信息表
	 * @param tablename
	 *            name
	 * @return
	 */
    List<DbTableColDTO> findDbTableColListByTableName(String tablename);

	/**
	 * @description: 新增对象存储模型列信息表
	 * @param dbTableColDTO
	 * @return
	 */
    int insertDbTableCol(DbTableColDTO dbTableColDTO);

	/**
	 * @description: 批量新增对象 存储模型列信息表
	 * @param dbTableColDTOList
	 * @return
	 */
    int insertDbTableColList(List<DbTableColDTO> dbTableColDTOList);

	/**
	 * @description: 更新对象存储模型列信息表
	 * @param dbTableColDTO
	 * @return
	 */
    int updateDbTableColSensitive(DbTableColDTO dbTableColDTO);

	/**
	 * @description: 更新对象存储模型列信息表
	 * @param dbTableColDTO
	 * @return
	 */
    int updateDbTableColAll(DbTableColDTO dbTableColDTO);

	/**
	 * @description: 批量更新对象 存储模型列信息表
	 * @param dtoList
	 * @return
	 */
    int updateDbTableColList(@Param("dtoList") List<DbTableColDTO> dtoList);

	/**
	 * @description: 按主键删除存储模型列信息表
	 * @param id
	 * @return
	 */
    int deleteDbTableColById(String id);

	/**
	 * @description: 按主键批量删除 存储模型列信息表
	 * @param idList
	 * @return
	 */
    int deleteDbTableColList(List<String> idList);

	/**
	 * @description: 通过外键批量删除
	 * @param tableId
	 * @return
	 */
    int deleteColByTableId(@Param("tableId") String tableId);

}
