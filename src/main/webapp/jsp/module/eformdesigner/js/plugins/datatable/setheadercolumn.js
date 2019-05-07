var dataJsonList = [];//多级表头数据
var curId = "";//当前层级id
var subTableColumnD = [];//子表列（包括外键）

//点击确定后调用
function submitJsonData(){
    $('#propertytable').jqGrid('endEditCell');
    updateJsonData(curId,$('#propertytable').jqGrid("getRowData"));
    var obj = {};
    if (!validSubmitData()){
        return false;
    }
    obj.dataList = dataJsonList;
    return obj;
}

//提交校验
function validSubmitData(){
    var s1 = 0;
    var curGridData = $('#propertytable').jqGrid("getRowData");
    var flag = true;
    $.each(dataJsonList,function(index,value){//校验空表提交，低级标题合并列数不能超过上级标题合并列数
        if (value.data.length == 0) {
            layer.msg("列明细列表不能为空，请检查！");
            flag =  false;
            return;
        }else{
            $('#propertytable').jqGrid("clearGridData");
            $("#propertytable").jqGrid('setGridParam',{
                datatype:'local',
                data: value.data
            }).trigger("reloadGrid");

            if (!$('#propertytable').validateJqGrid("validate")){//字段必填
                $('#list_area').trigger("click");
                flag =  false;
                return false;
            }

            var s2 =  $("#propertytable").getCol("numberOfColumns",false, 'sum');
            if(s2 > subTableColumnD.length -1){
                layer.msg("表头合并列数不能超过子表列数，请检查！");
                flag =  false;
                return false;
            }

            if(index == 0){
                s1 = s2;
            }else{
                if(s2 > s1){
                    layer.msg("低级表头合并列数不能超过上级表头合并列数，请检查！");
                    flag =  false;
                    return;
                }else{
                    s1 = s2
                }
            }
        }
    });

    //将表格复位
    $('#propertytable').jqGrid("clearGridData");
    $("#propertytable").jqGrid('setGridParam',{
        datatype:'local',
        data: curGridData
    }).trigger("reloadGrid");

    return flag;
}

function isEmpty(dataJsonList){
    if (dataJsonList.length>0){
        $(".empty-tip").hide();
        return false;
    }else{
        $(".empty-tip").show();
        $("#property_form").hide();
        return true;
    }
}

//删除层级
function removeItem(obj){
    var id = $(obj).parent().attr("id");
    delJsonData(id);
    drawListArea();
    if (!isEmpty(dataJsonList)){
        var fistId = dataJsonList[0].id;
        $("#"+fistId).click();
    }else{
        $('#propertytable').jqGrid("clearGridData");
    }
}

//根据id获取数据
function getJsonData(id){
    if (id){
        for (var i=0;i<dataJsonList.length;i++){
            if (dataJsonList[i].id == id){
                return dataJsonList[i].data;
            }
        }
    }
}

//列明细点击联动
function showColumnData(showId){
    $('#propertytable').jqGrid("endEditCell");
    updateJsonData(curId,$('#propertytable').jqGrid("getRowData"));
    for (var i=0;i<dataJsonList.length;i++) {
        var id = dataJsonList[i].id;
        if (id == showId) {
            $('#propertytable').jqGrid("clearGridData");
            $("#propertytable").jqGrid('setGridParam',{
                datatype:'local',
                data: dataJsonList[i].data
            }).trigger("reloadGrid");
        }
    }
    curId = showId;
}

//层级点击事件
function itemClick(obj){
    $("#list_area").find(".current").removeClass("current");
    $(obj).addClass("current");
    var id = $(obj).attr("id");
    showColumnData(id);
}

//画层级区域
function drawListArea(){
    $("#list_area").html("");

    if (!isEmpty(dataJsonList)){
        for (var i=0;i<dataJsonList.length;i++){
            var id = dataJsonList[i].id;
            var item = $('<li id="'+id+'" class="item-list" style="overflow: hidden"></li>');
            if (id == curId){
                item.addClass("current");
            }
            item.append('<span class="item-order" order="'+(i+1)+'">['+(i+1)+']</span>').append('<span class="item-title" style="font-size: 13px">第'+ (i + 1) +'级表头</span>');
            var removeButton = $('<a href="javascript:void(0)" class="remove"></a>');
            removeButton.append('<i class="fa fa-times"></i>');
            item.append(removeButton);
            removeButton.click(function(){
                removeItem(this);
            });

            item.click(function(){
                itemClick(this);
            }).hover(function(){
                $(this).addClass("hover");
            },function(){
                $(this).removeClass("hover");
            });
            $("#list_area").append(item);

        }
    }
}

function delJsonData(id){
    for (var i=0;i<dataJsonList.length;i++){
        if (dataJsonList[i].id == id){
            dataJsonList.splice(i, 1);
            break;
        }
    }
}

function updateJsonData(id,json){
    for (var j=0;j<dataJsonList.length;j++){
        if (dataJsonList[j].id == id){
            dataJsonList[j].data = json;
            break;
        }
    }
}

function putJsonData (id,json,index){
    if (index != undefined){
        dataJsonList.splice(index, 0, {id:id,data:json});
    }else{
        dataJsonList.push({
            id:id,
            data:json
        });
    }
}

//添加层级
function addItem(){
    if(subTableColumnD.length < 2 ){//子表只有外键列或者未维护列，不能设置多级表头
        layer.msg("子表列未维护，不能设置表头！");
        return false;
    }
    //添加新的层级
    var lastNum = dataJsonList.length+1;
    var id = GenNonDuplicateID();
    putJsonData(id);
    drawListArea();
    $("#"+id).click();
}


var newRowIndex = 0;
var newRowStart = "new_row";

//列明细添加数据
function insert(){
    if(dataJsonList.length == 0){
        layer.alert('请先维护层级信息！', {
                icon: 7,
                area: ['400px', ''], //宽高
                closeBtn: 0
        });
        return;
    }
    $("#propertytable").jqGrid('endEditCell');
    var newRowId = newRowStart + newRowIndex;
    var parameters = {
        rowID : newRowId,
        initdata : {},
        position :"last",
        useDefValues : true,
        useFormatter : true,
        addRowParams : {extraparam:{}}
    };
    $("#propertytable").jqGrid('addRow', parameters);
    newRowIndex++;
}

function del(){
    $("#propertytable").jqGrid('endEditCell');
    var rows = $("#propertytable").jqGrid('getGridParam','selarrrow');
    var ids = [];
    var l =rows.length;
    if(l>0){
        layer.confirm('确定要删除该数据吗？',{icon:2,title:"请确认：",area:['400px','']},function(index){
            for(var i=l-1;i>=0;i--){
                $("#propertytable").jqGrid('delRowData',rows[i]);
            }
            layer.close(index);
        });
    }else{
        layer.alert('请选择要删除的记录！', {
                icon: 7,
                area: ['400px', ''], //宽高
                closeBtn: 0
            }
        );
    }
}



function jqgridInit(jsonDatas, subTableColumns){
    subTableColumnD = subTableColumns;//子表列（包括外键）
   var datas = jsonDatas=="" ? [] : JSON.parse(jsonDatas);
   var jqGridData = {};
    if (datas.length>0) {
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var id = data.id;
            putJsonData(id, data.data);
        }
        curId = datas[0].id;
        jqGridData = datas[0].data;
    }
    var selectValue = {};
    var defaultvalue = "";
    for (var index in subTableColumnD){
        if (index == 0){
            defaultvalue = subTableColumnD[index].colName;
        }
        var colName =  subTableColumnD[index].colName;
        var label =  subTableColumnD[index].colLabel;
        selectValue[colName] = label;
    }

    function formatterName(value){
        if (value !=null && value!="" &&value !='undefined'){
            return value;
        }else{
            return defaultvalue;
        }
    }


   var dataGridColModel = [
        { label:'合并开始列', name:'startColumnNameName', editable:true,  width:75, align:"center",
            edittype: "select",
            editoptions: {
                value: selectValue,
                dataEvents: [
                    {
                        type: 'change',
                        fn: function (e) {
                            var rowid = $(e.target).closest("tr").attr("id");//通过事件获得行ID
                            $("#propertytable").jqGrid('setCell', rowid, 'startColumnName', $(this).val());
                        }
                    }

                ]
            }

        },
       { label:'合并开始列', name:'startColumnName',hidden:true, width:75, align:"center",formatter:formatterName},
        { label:'合并列数量', name:'numberOfColumns', editable:true,  width:75, align:"center"},
        { label:'表头名称', name:'titleText', editable:true,  width:75, align:"center"}
    ];

    $("#propertytable").jqGrid(
        {
            datatype: "local",
            data:jqGridData,
            toolbar: [false,'top'],//启用toolbar
            colModel: dataGridColModel,//表格列的属性
            height:$(window).height() - 100,//初始化表格高度
            scrollOffset: 20, //设置垂直滚动条宽度
            altRows:true,//斑马线
            styleUI : 'Bootstrap',
            viewrecords: true,
            multiselect: true,
            autowidth: true,
            responsive:true,
            cellEdit:true,
            cellsubmit: 'clientArray',
            forceFit:false,
            shrinkToFit:true,
            autoScroll: true
        });
    $('#propertytable').validateJqGrid("addValidate","startColumnName","required");//校验
    $('#propertytable').validateJqGrid("addValidate","numberOfColumns","required");//校验
    $('#propertytable').validateJqGrid("addValidate","titleText","required");//校验

    drawListArea();

}

$(document).ready(function () {
    //列明细表格初始化
    //jqgridInit();

    $('#jslist_insert').bind('click', function() {
        insert();
    });

    $("#jslist_del").bind('click',function(){
        del();
    });

    //层级初始化
    $("#item_add").click(function () {
        addItem();
    });

    $("#list_area").sortable({
        stop: function (e, t) {
            var $li = $(t.item);
            var id = $li.attr("id");
            var order = $li.prev().find(".item-order").attr("order") || "0";
            var data = getJsonData(id);
            delJsonData(id);
            putJsonData(id, data, parseInt(order));
            drawListArea();
            $("#" + curId).click();
        }
    });
});