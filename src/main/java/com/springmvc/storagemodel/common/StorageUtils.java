package com.springmvc.storagemodel.common;

import com.springmvc.storagemodel.model.DbTableColDTO;

import java.util.ArrayList;
import java.util.List;

public class StorageUtils {
    public  static List<DbTableColDTO> setBaseCol(String tableId, boolean type){
        List<DbTableColDTO> list = new ArrayList<DbTableColDTO>();

        if (type){
            DbTableColDTO id = new DbTableColDTO();
            id.setColComments("ID");
            id.setColIsPk("Y");
            id.setColIsUnique("Y");
            id.setColNullable("N");
            id.setColName("ID");
            id.setColType("VARCHAR2");
            id.setColLength("50");
            id.setTableId(tableId);
            id.setColIsSys("Y");
            list.add(id);
        }

        DbTableColDTO lastUpdate = new DbTableColDTO();
        lastUpdate.setColComments("最后更新时间");
        lastUpdate.setColIsPk("N");
        lastUpdate.setColIsUnique("N");
        lastUpdate.setColNullable("N");
        lastUpdate.setColName("LAST_UPDATE_DATE");
        lastUpdate.setColType("DATE");
        lastUpdate.setColLength("0");
        lastUpdate.setTableId(tableId);
        lastUpdate.setColIsSys("Y");
        list.add(lastUpdate);

        DbTableColDTO lastUpdateBy = new DbTableColDTO();
        lastUpdateBy.setColComments("最后更新人ID");
        lastUpdateBy.setColIsPk("N");
        lastUpdateBy.setColIsUnique("N");
        lastUpdateBy.setColNullable("N");
        lastUpdateBy.setColName("LAST_UPDATED_BY");
        lastUpdateBy.setColType("VARCHAR2");
        lastUpdateBy.setColLength("32");
        lastUpdateBy.setTableId(tableId);
        lastUpdateBy.setColIsSys("Y");
        list.add(lastUpdateBy);

        DbTableColDTO version = new DbTableColDTO();
        version.setColComments("版本");
        version.setColIsPk("N");
        version.setColIsUnique("N");
        version.setColNullable("N");
        version.setColName("VERSION");
        version.setColType("NUMBER");
        version.setColLength("16");
        version.setTableId(tableId);
        version.setColIsSys("Y");
        list.add(version);

        DbTableColDTO createDate = new DbTableColDTO();
        createDate.setColComments("创建时间");
        createDate.setColIsPk("N");
        createDate.setColIsUnique("N");
        createDate.setColNullable("N");
        createDate.setColName("CREATION_DATE");
        createDate.setColType("DATE");
        createDate.setColLength("0");
        createDate.setTableId(tableId);
        createDate.setColIsSys("Y");
        list.add(createDate);

        DbTableColDTO createBy = new DbTableColDTO();
        createBy.setColComments("创建人ID");
        createBy.setColIsPk("N");
        createBy.setColIsUnique("N");
        createBy.setColNullable("N");
        createBy.setColName("CREATED_BY");
        createBy.setColType("VARCHAR2");
        createBy.setColLength("32");
        createBy.setTableId(tableId);
        createBy.setColIsSys("Y");
        list.add(createBy);

        DbTableColDTO lastupdateIp = new DbTableColDTO();
        lastupdateIp.setColComments("创建人IP");
        lastupdateIp.setColIsPk("N");
        lastupdateIp.setColIsUnique("N");
        lastupdateIp.setColNullable("N");
        lastupdateIp.setColName("LAST_UPDATE_IP");
        lastupdateIp.setColType("VARCHAR2");
        lastupdateIp.setColLength("32");
        lastupdateIp.setTableId(tableId);
        lastupdateIp.setColIsSys("Y");
        list.add(lastupdateIp);

        DbTableColDTO orgId = new DbTableColDTO();
        orgId.setColComments("组织ID");
        orgId.setColIsPk("N");
        orgId.setColIsUnique("N");
        orgId.setColNullable("N");
        orgId.setColName("ORG_IDENTITY");
        orgId.setColType("VARCHAR2");
        orgId.setColLength("32");
        orgId.setTableId(tableId);
        orgId.setColIsSys("Y");
        list.add(orgId);

        return list;
    }
}
