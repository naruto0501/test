var EformEditor;
var DataArea;
var insertFlag = 1;
var subTableValue = 1;//子表控件名称后缀，维护自增
var dataAttrValue = 1;//元素控件字段名称后缀，维护自增

var editorUtil = new Object({

    setTableDomAttr: function (dbid, attr) {
        var obj = [];
        $('#tinymceArea_ifr').contents().find('table').each(function () {
            var table = $(this);
            if (table.hasClass("sub_table")) {
                return true;
            }
            if (table.parents("table").length > 0) {
                return true;
            }
            var text = $(this).attr("summary");
            var id = $(this).attr("id");
            if (!isEmptyObject(text)) {
                var json = $.parseJSON(text);
                if (json.datatype == "0") {
                    if (isEmptyObject(attr)) {
                        table.removeAttr("summary");
                    } else {
                        table.attr("summary", attr);
                    }
                }

            } else {
                if (dbid == tableId) {
                    if (isEmptyObject(attr)) {
                        table.removeAttr("summary");
                    } else {
                        table.attr("summary", attr);
                    }
                }
            }
        });

    },

    getAllDomAttr: function () {
        var obj = [];
        $('#tinymceArea_ifr').contents().find('.element').each(function () {

            $(this).find(".eleattr-span").find("br").remove();
            var text = $(this).find(".eleattr-span").html();
            var id = $(this).attr("id");
            var json = {};
            if (!isEmptyObject(text))
                json = $.parseJSON(text);
            obj[id] = json;
        });
        return obj;
    },
    getDom: function (id) {
        return $('#tinymceArea_ifr').contents().find('#' + id);
    },
    getAllTableAttr: function (escapeid) {
        escapeid = escapeid || "";
        var obj = [];
        $('#tinymceArea_ifr').contents().find('table[summary]').each(function () {
            var text = $(this).attr("summary");
            var id = $(this).attr("id");
            if (escapeid == id) {
                return true;
            }
            var json = {};
            if (!isEmptyObject(text)) {
                json = $.parseJSON(text);
                if (json.hasOwnProperty("dbid") && !isEmptyObject(json.dbid)) {
                    if (json.hasOwnProperty("paralist") && !isEmptyObject(json.paralist)) {
                        json.paralist = $.parseJSON(json.paralist);
                    }
                    obj[id] = json;
                } else {
                    if (json.hasOwnProperty("paralist") && !isEmptyObject(json.paralist)) {
                        json.paralist = $.parseJSON(json.paralist);
                        json.dataname = "主表" + tableName;
                        json.dbid = tableId;
                        json.datatype = "0";
                    }
                    obj["maintable"] = json;
                }
            }
        });
        if (!obj.hasOwnProperty("maintable")) {
            obj["maintable"] = {dataname: "主表" + tableName, dbid: tableId};
        }
        return obj;
    },
    getTableAttrByElement: function (ele) {
        var obj = {datatype: "0", dbid: tableId};
        var $table = ele.parents("table");
        //判断是否在table内，不在table内的控件一律所属主表
        if ($table.length > 0) {
            var summary = $($table[$table.length - 1]).attr("summary"), attrJson;
            if (!isEmptyObject(summary)) {//判断是否主表（无修改）
                obj = $.parseJSON(summary);
                obj.layoutid = $table.attr("id");
            }
        }
        return obj;
    },
    getMainTableDomAttr: function () {
        var obj = [];
        $('#tinymceArea_ifr').contents().find('.element').each(function () {
            var text = $(this).find(".eleattr-span").html();
            var id = $(this).attr("id");
            var json = {};
            var $table = $(this).parents("table");
            //判断是否在table内，不在table内的控件一律所属主表
            if ($table.length > 0) {
                var summary = $($table[$table.length - 1]).attr("summary"), attrJson;
                if (isEmptyObject(summary)) {//判断是否主表（无修改）
                    if (text) {
                        json = $.parseJSON(text);
                        if (json.hasOwnProperty("colName"))//判断是否为数据库对应控件
                            obj[id] = json;
                    }
                } else {
                    var sumobj = $.parseJSON(summary);
                    //判断是否主表（仅修改名称）
                    if (sumobj.hasOwnProperty("dbid") && !isEmptyObject(sumobj.dbid)) {

                    } else {
                        if (text) {
                            json = $.parseJSON(text);
                            if (json.hasOwnProperty("colName"))
                                obj[id] = json;
                        }
                    }
                }
            } else {
                if (text) {
                    json = $.parseJSON(text);
                    if (json.hasOwnProperty("colName"))
                        obj[id] = json;
                }
            }
        });
        return obj;
    },

    getTableDbDomAttr: function () {
        var obj = [];
        $('#tinymceArea_ifr').contents().find('.element').each(function () {
            var text = $(this).find(".eleattr-span").html();
            var id = $(this).attr("id");
            var json = {};
            var $table = $(this).parents("table");
            //判断是否在table内，不在table内的控件一律所属主表
            if ($table.length > 0) {
                var summary = $($table[$table.length - 1]).attr("summary"), attrJson;
                if (isEmptyObject(summary)) {//判断是否主表（无修改）
                    if (text) {
                        json = $.parseJSON(text);
                        if (json.hasOwnProperty("colName"))//判断是否为数据库对应控件
                            obj[id] = json;
                    }
                } else {
                    var sumobj = $.parseJSON(summary);
                    //判断是否主表（仅修改名称）
                    if (sumobj.hasOwnProperty("dbid") && !isEmptyObject(sumobj.dbid)) {
                        if (text) {
                            json = $.parseJSON(text);
                            if (json.hasOwnProperty("colName"))
                                json.colLabel = json.colLabel + "("+sumobj.dbname+")";
                                obj[id] = json;
                        }
                    } else {
                        if (text) {
                            json = $.parseJSON(text);
                            if (json.hasOwnProperty("colName"))
                                obj[id] = json;
                        }
                    }
                }
            } else {
                if (text) {
                    json = $.parseJSON(text);
                    if (json.hasOwnProperty("colName"))
                        obj[id] = json;
                }
            }
        });
        return obj;
    }
});

function FEformEditor(id) {
    this.editor = $("#" + id);
    this.element = [];
    this.eformFormInfoId = "";//电子表单信息ID
    this.tableName = "";//电子表单数据库表格名称
    this.nowDbid = tableId;//当前编辑表格对应存储模型id
    this.nowTableName = tableName;//当前编辑表格对应存储模型id
    this.isBpm = "";//电子表单是否走流程
    this.formCode = "";//电子表单编码
    this.tinymceContentStyle = "default";//当前选择的tinymce内容样式，也是初始化默认载入的内容样式
    this.templateName = "";//模板名称
    this.eformJs = "";//电子表单应用的JS
    EformEditor = this;

    this.addElement = function (name, ele) {
        this.element.push({elename: name, ele: ele});
    };
    this.getElement = function (name) {
        var _this = this;
        for (var i = 0; i < _this.element.length; i++) {
            var jsonobj = _this.element[i];
            if (jsonobj.elename == name) {
                return jsonobj.ele;
            }
        }
    };
    this.initEformEditor(id);
}

//当前选中元素
FEformEditor.prototype.nowElement = {};

FEformEditor.prototype.drawLeftArea = function (editor) {
    var _this = this;

    var $el = $('<div class="left-area"></div>');
    var $modules = $('<ul id="modules"  class="col-xs-12"></ul>');
    var newScripts = [];
    for (var i = 0; i < EformConfig.dropitems.length; i++) {
        newScripts.push(EformConfig.dropitems[i].name);
        for (var j = 0; j < EformConfig.dropitems[i].group.length; j++) {
            newScripts.push(EformConfig.formdesignPath + "/js/plugins/" + EformConfig.dropitems[i].group[j] + "/" + EformConfig.dropitems[i].group[j] + ".js");
        }
    }

    (function scriptRecurse(count, callback) {

        if (count == newScripts.length) {
            _this.loadScript(EformConfig.formdesignPath + "/js/plugins/attr-jsp/table-ext.js", function () {
                _this.addElement(MyElement.elecode, MyElement);
            });
            callback && callback();
        } else if ((newScripts[count] + "").indexOf(".js") < 0) {
            var elementcontent = $('<div class="domele-title"><span>' + newScripts[count] + '</span></div>');
            elementcontent.appendTo($modules);
            scriptRecurse(++count, callback);
        } else {
            var dragElement, dropElement;
            _this.loadScript(newScripts[count], function () {
                var elementcontent = $('<li class="ele-item"></li>');
                _this.addElement(MyElement.elecode, MyElement);
                dragElement = MyElement.dragElement();

                //子表控件多包一层table
                if (MyElement.elecode == "datatable") {
                    dropElement = $('<table class="sub_table" contenteditable="false"><tbody><tr><td style="text-align: center;"><span class="element ' + MyElement.elecode + '" contenteditable="false">' + MyElement.dropElement() + '</span></td></tr></tbody></table>');
                }
                else {
                    dropElement = $('<span class="element ' + MyElement.elecode + '" contenteditable="false">' + MyElement.dropElement() + '</span>');
                }
                dropElement.find("input").css("width", "95%");
                dropElement.find("select").css("width", "95%");
                dropElement.find("textarea").css("width", "95%");

                elementcontent.append('<div class="preview"><span>' + dragElement.name + '</span><span class="eleicon"><i class="' + dragElement.icon + '"></i></span></div>');
                var $view = $("<div></div>").addClass("view").attr("code", MyElement.elecode);
                $view.append(dropElement);
                elementcontent.append($view);
                elementcontent.appendTo($modules);
                //绑定事件
                bindDragEleEvent(elementcontent);
                scriptRecurse(++count, callback);
            });
        }
    })(0);

    $modules.appendTo($el);
    var $dataArea = $('<div id="data_area" class="col-xs-12" style="padding-left: 0px;padding-right: 0px;"></div>');
    $dataArea.appendTo($el);
    $el.appendTo(editor);
};


FEformEditor.prototype.drawRightArea = function (editor) {
    var _this = this;

    editor.append("<div id='rightArea' style='margin-left: 180px;margin-right: 195px;'></div>");
    $("#rightArea").append('<div class="col-sm-12 editorArea"><div id="dropzone" class="demo"><textarea id="tinymceArea"></textarea></div></div>');

    //初始化tinymce
    tinymce.init({
        selector: 'textarea#tinymceArea',
        // branding: false,
        height: $(window).height() - 170,
        language: 'zh_CN',
        skin: 'lightgray',
        theme: 'modern',
        table_responsive_width:true,
        verify_html: false,
        resize:false,
        disable_resize:false,
        plugins: [
            'advlist lists charmap print hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime table contextmenu directionality',
            'textcolor link colorpicker textpattern codesample toc'
        ],
        plugin_preview_width: 1000,
        plugin_preview_height: 550,
        auto_focus: 'tinymceArea',
        // toolbar_items_size: 'small',
        toolbar: 'fontselect fontsizeselect forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code fullscreen | sizeButton redStarButton',
        setup: function (editor) {
            editor.addButton('sizeButton', {
                type: 'menubutton',
                text: '版式',
                icon: false,
                menu: [{
                    text: 'A4',
                    onclick: function () {
                        $('#tinymceArea_ifr').contents().find('table').each(function (index, element) {
                            if ($(element).parents("table").length == 0) {
                                $(element).css("width", "210mm");

                                var dataMceStyle = $(element).attr("data-mce-style") == undefined ? "" : $(element).attr("data-mce-style");
                                if (dataMceStyle.indexOf("width") != "-1") {
                                    dataMceStyle = dataMceStyle.replace(/width:\s?\d+\w+;/, "width: 210mm;");
                                }
                                else {
                                    dataMceStyle += "width: 210mm;";
                                }
                                $(element).attr("data-mce-style", dataMceStyle);
                            }
                        });
                    }
                }, {
                    text: '全屏',
                    onclick: function () {
                        $('#tinymceArea_ifr').contents().find('table').each(function (index, element) {
                            if ($(element).parents("table").length == 0) {
                                $(element).css("width", "");

                                var dataMceStyle = $(element).attr("data-mce-style") == undefined ? "" : $(element).attr("data-mce-style");
                                if (dataMceStyle.indexOf("width") != "-1") {
                                    dataMceStyle = dataMceStyle.replace(/width:\s?\d+\w+;/, "");
                                }
                                $(element).attr("data-mce-style", dataMceStyle);
                            }
                        });
                    }
                }]
            });
            editor.addButton('redStarButton', {
                text: '红星',
                icon: false,
                onclick: function () {
                    editor.insertContent("<span style='color: red;'>*</span>");
                }
            });
        },
        init_instance_callback: function (editor) {
            //表格扩展属性，用于维护表格所对应的数据源
            editor.on('click keyup setContent ObjectResized', function (e) {

                if (e.type === 'setcontent' && !e.selection) {
                    return;
                }
                var node = editor.selection.getNode();
                var i, y, parentsAndSelf;

                parentsAndSelf = editor.$(node).parents().add(node);
                for (i = parentsAndSelf.length - 1; i >= 0; i--) {

                    var jqdom = $(parentsAndSelf[i]);
                    if (jqdom.is("table")) {
                        // 解决单元格点击困难的问题，重新在每个td里面加上空格，排除退格键事件
                        if (e.type !== 'keyup' || (e.type === 'keyup' && e.keyCode!=8)) {
                            var tds = $('#tinymceArea_ifr').contents().find('td');

                            tds.each(function () {
                                if (!$(this).html()) {
                                    tinymce.Env.ie && tinymce.Env.ie < 11 ? $(this).html('&nbsp;') : $(this).html('<br data-mce-bogus="1" />');

                                }


                            });
                        }

                        if (e.type === 'setcontent') {
                            jqdom.attr("id", GenNonDuplicateID());
                        }
                        if ($("#attrform").length > 0 && jqdom.hasClass("onchoose")) {
                            return;
                        }

                        if (jqdom.hasClass("sub_table")) {
                            return;
                        }
                        if (jqdom.parents("table").length > 0) {
                            return;
                        }


                        var ssd = $("#attrform").validate();
                        if (ssd && !ssd.checkForm()) {
                            ssd.showErrors();
                            return;
                        }
                        var domId = jqdom.attr("id");

                        var tablearray = editorUtil.getAllTableAttr();
                        var mainattr = tablearray["maintable"];
                        //新建table的时候默认配置出主表的数据源信息
                        if (mainattr.hasOwnProperty("paralist") &&mainattr.paralist!="" && !tablearray.hasOwnProperty(domId)) {
                            mainattr.dataname = "";
                            mainattr.dbid = "";
                            mainattr.datatype = "0";
                            mainattr.paralist = JSON.stringify(mainattr.paralist);
                            jqdom.attr("summary", JSON.stringify(mainattr));
                        }

                        $("#attrArea").html("");
                        EformEditor.nowElement = jqdom;
                        var form;
                        $.ajax({
                            url: EformConfig.formdesignPath + "/js/plugins/attr-jsp/table-ext.jsp",
                            async: false,
                            success: function (data) {
                                form = $(data);
                            }
                        });
                        var ele = EformEditor.getElement("table-ext");
                        for (var i = 0; i < form.length; i++) {
                            if (form[i].className == "form") {
                                $(form[i]).attr("id", "attrform");
                                $("#attrArea").append(form);
                                $('#tinymceArea_ifr').contents().find(".onchoose").removeClass("onchoose");
                                jqdom.addClass("onchoose");

                                var eleattr = jqdom.attr("summary"), dataAttr=jqdom.attr("data-attr"),attrJson;
                                //构造回调函数，为了顺序执行js方法
                                function sync(callback) {
                                    var elejson = null,dataattrjson=null;
                                    if (eleattr&&eleattr!=""){
                                        elejson = $.parseJSON(eleattr);
                                    }
                                    if (dataAttr&&dataAttr!=""){
                                        dataattrjson = $.parseJSON(dataAttr);
                                    }
                                    if (elejson) {
                                        $.extend(elejson, dataattrjson);
                                        eleattr = JSON.stringify(elejson);
                                    }else if(dataattrjson){
                                        $.extend(dataattrjson,elejson);
                                        eleattr = JSON.stringify(dataattrjson);
                                    }
                                    ele.initAttrForm(form, eleattr, EformEditor.nowElement);
                                    if (callback && typeof(callback) == "function")
                                        callback();
                                }

                                //在加载数据之前执行属性页面初始化js
                                sync(function () {
                                    if (!isEmptyObject(eleattr)) {
                                        var attrJson = $.parseJSON(eleattr);
                                        $("#attrform").setform(attrJson);
                                    }
                                });

                                $(form[i]).find("input,textarea,select").on("keyup change", function () {

                                    var jsondb = serializeObjectForEform($("#attrform"),true,'#collapsedb','accept');
                                    var jsonattr = serializeObjectForEform($("#attrform"),true,'#collapseattr','accept');
                                    var $ele = EformEditor.nowElement;
                                    //添加元素code，方便后台遍历
                                    jsondb.domType = "table-ext";
                                    //tinymce不支持自定义属性，所以将属性值存入一个隐藏span
                                    //  $ele.next(".eleattr-span").remove();

                                    $ele.attr("summary", JSON.stringify(jsondb));
                                    $ele.attr("data-attr", JSON.stringify(jsonattr));

                                    //  $ele.after($("<span class='eleattr-span' style='display: none;'>" + JSON.stringify(json) + "</span>"));
                                    if (ele.hasOwnProperty("update"))
                                        ele.update($("#attrform"), $ele);

                                });

                            }
                        }
                        return;
                    }
                }
            });

            //撤回操作后，重新绑定所有控件元素事件
            editor.on('Undo', function (e) {
                rebindAllContentEleEvent();
            });
            //重做操作后，重新绑定所有控件元素事件
            editor.on('Redo', function (e) {
                rebindAllContentEleEvent();
            });
            //插入内容后，执行相关操作
            editor.on('SetContent', function (e) {
                try{
                    var content = $(e.content);
                    //（1）移动控件元素情况下，重新绑定该控件元素事件
                    if (content.find(".element").length == 1 && content.attr("class") != null && content.attr("class").indexOf("element") != "-1") {
                        var eleViewId = content.attr("id");
                        var eleCode = content.attr("class").substr(8);
                        bindContentEleEvent(eleViewId, eleCode);
                    }
                    //（2）保存源代码、打开模板情况下，重新绑定所有控件元素事件
                    else if (insertFlag) {
                        rebindAllContentEleEvent();
                        //reMaintainDataTree();
                        reSetNumber();
                    }



                }catch(e){

                }

            });
            //键盘删除后，执行相关操作
            editor.on('KeyDown', function (e) {
                //e.key == "Backspace" || e.key == "Delete"
                //keyCode已被遗弃，考虑兼容性依旧使用
                if (e.keyCode == "8" || e.keyCode == "46") {
                    //reMaintainDataTree();
                }
            });
            //光标位置改变后，清空右侧属性页
            /*            editor.on('NodeChange', function (e) {
             $("#attrArea").html("");
             });*/

            //初始化tinymce后载入默认样式（不使用tinymce提供的content_css属性，否则后期载入的样式依然受到default干扰）
            _this.setContentStyle(_this.tinymceContentStyle);

            //加载表单设计代码
            _this.setContent();

            _this.setButtonArea();
        }
    });

    editor.append("<div id='rightattrArea' style='width: 195px; float: right;'></div>");
    var $el = $('<div class="attrArea"style="overflow-y:auto"><div id="attrArea" ></div></div>');
    $el.css("max-height", ($(window).height() - 55) + "px");
    $("#rightattrArea").append($el);
    
   /* var $el = $('<div class="attrArea"><div id="attrArea" style="overflow-y:auto"></div></div>');
    $el.css("max-height", ($(window).height() - 55) + "px");
    editor.append($el);*/
    
};

//加载表单设计代码
FEformEditor.prototype.setContent = function(){
    if (!verifyIsEmpty(tableName)) {
        //已经设计过的电子表单，回带表单内容
        if (verifyIsEmpty(columnsList)) {
            EformEditor.tableName = tableName;
            tinymce.activeEditor.setContent(formContent);
            EformEditor.setContentStyle(formContentCss);
            EformEditor.tinymceContentStyle = formContentCss;
            EformEditor.eformJs = formContentJs;
            //reMaintainDataTree();
        }
        //没有设计过并绑定数据源的表单，反向生成表单内容
        else {
            var columnsJsonArray = $.parseJSON(columnsList);

            var elementArray = [];
            for (var i = 0; i < columnsJsonArray.length; i++) {
                var columnsJson = columnsJsonArray[i];
                var colName = columnsJson.colName;
                var colType = columnsJson.colType;
                var colTypeName = columnsJson.colTypeName;
                var colLength = columnsJson.colLength;
                var colNullable = columnsJson.colNullable;
                var colDefault = columnsJson.colDefault;
                var colComments = columnsJson.colComments;
                var colIsPk = columnsJson.colIsPk;
                var colIsUnique = columnsJson.colIsUnique;

                var colIsMust;
                if (colNullable == 'Y') {
                    colIsMust = 'N';
                }
                else {
                    colIsMust = 'Y';
                }

                if (colIsPk == "Y"
                    || colName == "CREATION_DATE"
                    || colName == "CREATED_BY"
                    || colName == "LAST_UPDATE_DATE"
                    || colName == "LAST_UPDATED_BY"
                    || colName == "VERSION"
                    || colName == "LAST_UPDATE_IP"
                    || colName == "ORG_IDENTITY") {
                    continue;
                }

                var td1 = $("<td style='text-align: right; width: 100px;'></td>");
                td1.append(colComments);
                elementArray.push(td1);

                var td2 = $("<td></td>");
                var attr = $("");
                if (colType == 'VARCHAR2') {
                    attr = $('<span id="' + GenNonDuplicateID() + '" contenteditable="false" class="element text-box"><input style="width: 95%;" type="text" value="文本输入框"/><span class="eleattr-span" style="display: none;">{"elementType":"text","colName":"' + colName + '","colLabel":"' + colComments + '","colIsMust":"' + colIsMust + '","colDropdownType":"N","colLength":"' + colLength + '","domType":"text-box","colType":"VARCHAR2"}</span></span>');
                } else if (colType == 'NUMBER') {
                    attr = $('<span id="' + GenNonDuplicateID() + '" contenteditable="false" class="element number-box"><input style="width: 95%;" type="text" value="数字输入框"/><span class="eleattr-span" style="display: none;">{"elementType":"text","colName":"' + colName + '","colLabel":"' + colComments + '","colIsMust":"' + colIsMust + '","colDropdownType":"N","colLength":"' + colLength + '","attribute02":"0","domType":"number-box","colType":"NUMBER"}</span></span>');
                } else if (colType == 'DATE') {
                    attr = $('<span id="' + GenNonDuplicateID() + '" contenteditable="false" class="element date-box"><input style="width: 95%;" type="date"/><span class="eleattr-span" style="display: none;">{"elementType":"text","colName":"' + colName + '","colLabel":"' + colComments + '","colIsMust":"' + colIsMust + '","colDropdownType":"N","attribute03":"1","domType":"date-box","colType":"DATE"}</span></span>');
                } else if (colType == 'BLOB') {
                    attr = $('<span id="' + GenNonDuplicateID() + '" contenteditable="false" class="element text-box"><input style="width: 95%;" type="text" value="文本输入框"/><span class="eleattr-span" style="display: none;">{"elementType":"text","colName":"' + colName + '","colLabel":"' + colComments + '","colIsMust":"' + colIsMust + '","colDropdownType":"N","colLength":"' + colLength + '","domType":"text-box","colType":"VARCHAR2"}</span></span>');
                } else {
                    attr = $('<span id="' + GenNonDuplicateID() + '" contenteditable="false" class="element text-box"><input style="width: 95%;" type="text" value="文本输入框"/><span class="eleattr-span" style="display: none;">{"elementType":"text","colName":"' + colName + '","colLabel":"' + colComments + '","colIsMust":"' + colIsMust + '","colDropdownType":"N","colLength":"' + colLength + '","domType":"text-box","colType":"VARCHAR2"}</span></span>');
                }
                td2.append(attr);
                elementArray.push(td2);
            }

            var cols = 4;//布局列数
            var tdLength = elementArray.length;
            while (tdLength % cols != 0) {
                var td = $("<td>&nbsp;</td>");
                elementArray.push(td);

                tdLength++;
            }
            var content = $("<table><tbody></tbody></table>");
            var tr = $("<tr></tr>");
            var flag = 1;
            for (var i = 0; i < elementArray.length; i++) {
                var td = elementArray[i];

                if (flag != cols) {
                    tr.append(td.prop('outerHTML'));
                    flag++;
                }
                else {
                    tr.append(td.prop('outerHTML'));
                    content.append(tr.prop('outerHTML'));

                    tr = $("<tr></tr>");
                    flag = 1;
                }
            }

            EformEditor.tableName = tableName;
            tinymce.activeEditor.setContent(content.prop('outerHTML'));
            //reMaintainDataTree();
        }
    }
};

FEformEditor.prototype.setButtonArea = function(){
    var html = "<span style=\"color: #2fae95;\">\n" +
        "                    <i class=\"fa fa-tag\" title=\"保存表单\" onclick=\"EformEditor.save()\"></i>\n" +
        "                </span>\n";

    if (eformPublishStatus == 1){
        html = html +"<span style=\"color: #2fae95;\">\n" +
            "                    <i class=\"fa fa-tag\" title=\"新建版本\" onclick=\"EformEditor.saveNewVersion()\"></i>\n" +
            "                </span>\n";

    }else{
        html = html+ "<span style=\"color: #2fae95;\">\n" +
            "                    <i class=\"fa fa-tag\" title=\"保存并发布表单\" onclick=\"EformEditor.saveAndPublish()\"></i>\n" +
            "                </span>\n";
    }
    html = html +

        "                <span style=\"border-left: 1px solid #B5B5B5;padding-bottom: 0px;padding-top: 7px;\">\n" +
        "                </span>\n" +
        "                <span style=\"color: #B5B5B5;\">\n" +
        "                    <i class=\"fa fa-tag\" title=\"打开模板\" onclick=\"EformEditor.openTemplate()\"></i>\n" +
        "                </span>\n" +
        "                <span style=\"color: #B5B5B5;\">\n" +
        "                    <i class=\"fa fa-tag\" title=\"应用样式\" onclick=\"EformEditor.applyStyle()\"></i>\n" +
        "                </span>\n" +
        "                <span style=\"color:#B5B5B5;\">\n" +
        "                \t<i class=\"fa fa-tag\" title=\"JS文件扩展\" onclick=\"EformEditor.applyJs()\"></i>\n" +
        "                </span>\n" +
        "                <span style=\"color: #B5B5B5;\">\n" +
        "                    <i class=\"fa fa-tag\" title=\"预览表单\" onclick=\"EformEditor.preview(eformInfoStyle)\"></i>\n" +
        "                </span>\n" +
        "                <span style=\"color: #B5B5B5;\">\n" +
        "                    <i class=\"fa fa-tag\" title=\"保存模板\" onclick=\"EformEditor.saveAsTemplate()\"></i>\n" +
        "                </span>\n" +
        "                <span style=\"color: #B5B5B5;\">\n" +
        "                    <i class=\"fa fa-tag\" title=\"自定义按钮\" onclick=\"EformEditor.customButton()\"></i>\n" +
        "                </span>\n" +
        "                <span style=\"color: #B5B5B5;\">\n" +
        "                    <i class=\"fa fa-tag\" title=\"帮助\" onclick=\"EformEditor.helpDoc()\"></i>\n" +
        "                </span>";
    $("#buttonArea").html(html);
};


FEformEditor.prototype.drawTopContentStyle = function (editor) {
    var _this = this;

    for (var i = 0; i < EformConfig.tinymceContentStyle.length; i++) {
        var contentStyle = EformConfig.tinymceContentStyle[i];

        var showText = contentStyle.showText;
        if (showText.length > 5) {
            showText = showText.substring(0, 5);
        }

        var $styleList = $('<a href="javascript:;" title="' + contentStyle.showText + '" class="btn btn-info btn-app btn-sm no-radius" style="font-size: 14px;"><i class="' + contentStyle.showIcon + '"></i>' + showText + '</a>')
            .click({contentStyleName: contentStyle.styleName}, function (event) {
                _this.tinymceContentStyle = event.data.contentStyleName;
                _this.setContentStyle(event.data.contentStyleName);
            });

        $("#top-style").find("#styleList").append($styleList);
    }
};

/**
 * 通过给tinymce编辑区iframe添加link来自定义内容样式
 * @param contentStyleName
 */
FEformEditor.prototype.setContentStyle = function (contentStyleName) {
    var linkId = "tinymce-content-style-link";
    var linkHref = contextPath + "/" + EformConfig.contentCssPath + "/" + contentStyleName + ".css";

    var link = tinymce.activeEditor.dom.get(linkId);
    if (link == null) {
        tinymce.activeEditor.dom.add(tinymce.activeEditor.dom.select('head'), 'link', {
            rel: 'stylesheet',
            id: linkId,
            href: linkHref
        });
    }
    else {
        tinymce.activeEditor.dom.setAttrib(linkId, 'href', linkHref);
    }
};

FEformEditor.prototype.loadScript = function (url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof callback == "function")
    script.onload = function () {
        callback();
    };

    if (isIE8()) {
        if (typeof callback == "function")
        script.onreadystatechange = function () {
            var r = script.readyState;
            if (r === 'loaded' || r === 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};

/**
 * 保存模板
 */
FEformEditor.prototype.saveAsTemplate = function () {
    var _this = this;

    var tinymceContentStyle = _this.tinymceContentStyle;
    var sourceContent = tinymce.activeEditor.getContent();

    if (verifyIsEmpty(_this.templateName)) {
        saveTemplate(tinymceContentStyle, sourceContent);
    }
    else {
        layer.confirm('确定要更新当前模板吗？', {
            btn: ['确认', '取消']
        }, function (index, layero) {
            updateTemplate(_this.templateName, tinymceContentStyle, sourceContent);
        }, function (index) {
            saveTemplate(tinymceContentStyle, sourceContent);
        });
    }

    function saveTemplate(tinymceContentStyle, sourceContent) {
        $("#saveTemplate").modal("show");

        $("#saveTemplateButton").unbind("click");
        $("#saveTemplateButton").click(function () {
            var templateName = $("#templateName").val();

            if (verifyIsEmpty(templateName)) {
                layer.msg('模板名称不能为空！', {icon: 7});
            }
            else {
                $.post("platform/eform/bpmsClient/validateTemplateName.json", "templateName=" + templateName,
                    function (backData, status) {
                        if (backData.success == false) {
                            layer.msg('该模板名称已存在！', {icon: 7});
                        }
                        else {
                            $.ajax({
                                url: 'platform/eform/bpmsClient/createTemplate',
                                type: 'POST',
                                data: {
                                    templateName: templateName,
                                    tableCss: tinymceContentStyle,
                                    tableContent: sourceContent
                                },
                                dataType: 'json',
                                success: function (backData, status) {
                                    if (backData.success == true) {
                                        _this.templateName = templateName;

                                        $("#saveTemplate").modal("hide");
                                        $("#templateName").val("");

                                        layer.msg('操作成功！', {icon: 1});
                                    }
                                    else {
                                        layer.msg('操作失败！', {icon: 2});
                                    }
                                }
                            });
                        }
                    }
                );
            }
        });
    }

    function updateTemplate(templateName, tinymceContentStyle, sourceContent) {
        $.ajax({
            url: 'platform/eform/bpmsClient/updateTemplate',
            type: 'POST',
            data: {
                templateName: templateName,
                tableCss: tinymceContentStyle,
                tableContent: sourceContent
            },
            dataType: 'json',
            success: function (backData, status) {
                if (backData.success == true) {
                    layer.msg('操作成功！', {icon: 1});
                }
                else {
                    layer.msg('操作失败！', {icon: 2});
                }
            }
        });
    }
};

/**
 * 打开模板
 */
FEformEditor.prototype.openTemplate = function () {
    var _this = this;

    $("#top-template").find("#templateList").empty();
    $.ajax({
        url: "platform/eform/bpmsClient/getTemplateList.json",
        async: false,
        success: function (backData) {
            var templateList = $.parseJSON(backData.msg);

            for (var i = 0; i < templateList.length; i++) {
                var deleteTemplateSpan = $('<span class="label"><i class="ace-icon fa fa-times"></i></span>').click({
                    templateId: templateList[i].id
                }, function (event) {
                    var templateId = event.data.templateId;
                    _this.deleteTemplate(templateId);

                    return false;
                });

                var templateNameShow = templateList[i].templateName;
                if (templateNameShow.length > 5) {
                    templateNameShow = templateNameShow.substring(0, 5);
                }

                var theTemplate = $('<a id="' + templateList[i].id + '" href="javascript:;" title="' + templateList[i].templateName + '" class="btn btn-info btn-app btn-sm no-radius" style="font-size: 14px;"><i class="ace-icon fa fa-file-code-o bigger-200"></i>' + templateNameShow + '</a>');
                theTemplate.append(deleteTemplateSpan);
                theTemplate.click({
                    formContentStr: templateList[i].formContentStr,
                    tableCss: templateList[i].tableCss
                }, function (event) {
                    var sourceContent = event.data.formContentStr;
                    var tinymceContentStyle = event.data.tableCss;

                    tinymce.activeEditor.setContent(sourceContent);
                    _this.setContentStyle(tinymceContentStyle);

                    return false;
                });

                $("#top-template").find("#templateList").append(theTemplate);
            }

            $('#top-template').modal('show');
        }
    });
};

/**
 * 删除模板
 */
FEformEditor.prototype.deleteTemplate = function (templateId) {
    var _this = this;

    layer.confirm('确认要删除该模板吗', function (index) {
        $.post("platform/eform/bpmsClient/deleteTemplate.json", "id=" + templateId,
            function (backData, status) {
                if (backData.success == true) {
                    layer.msg('操作成功！', {icon: 1});

                    $("#" + templateId).remove();
                }
                else {
                    layer.msg('操作失败！', {icon: 2});
                }
            }
        );
    });
};

/**
 * 应用样式
 */
FEformEditor.prototype.applyStyle = function () {
    $('#top-style').modal('show');
};

/**
 * 应用JS文件
 */
FEformEditor.prototype.applyJs = function () {
    var _this = this;
    layer.open({
        type: 2,
        title: 'JS文件扩展',
        skin: 'bs-modal',
        area: ['50%', '50%'],
        maxmin: false,
        content: "avicit/platform6/eform/formdesign/applyJs.jsp"
    });
};

/**
 * 预览表单
 */
FEformEditor.prototype.preview = function (style) {
    var _this = this;
    var tinymceContentStyle = _this.tinymceContentStyle;
    var sourceContent = tinymce.activeEditor.getContent();

    //源代码外包一层
    var showContent = $('<div class="mce-content-body"></div>');
    showContent.append(sourceContent);
    window.tinymceContentStyle = tinymceContentStyle;
    window.showContent = showContent.prop('outerHTML');
    layer.open({
        type: 2,
        title: '电子表单预览',
        skin: 'bs-modal',
        area: ['100%', '100%'],
        maxmin: false,
        content: "platform/eform/bpmsClient/topreview/" + style
    });
};

/**
 * 保存表单
 */
FEformEditor.prototype.save = function (publish) {
    var _this = this;

    var ifPublish;
    if (publish === "1") {
        ifPublish = true;
    }
    else {
        ifPublish = false;
    }

    var eformFormInfoId = _this.eformFormInfoId;
    var tableName = _this.tableName;
    var tinymceContentStyle = _this.tinymceContentStyle;
    var eformJs = _this.eformJs;


    //源代码外包一层
    $('#tinymceArea_ifr').contents().find('.onchoose').removeClass("onchoose");

    var sourceContent = tinymce.activeEditor.getContent();


    var showContent = $('<div class="mce-content-body"></div>');
    showContent.append(sourceContent);

    if (!verifySaveForm(showContent))
        return;

    


    if (verifyIsEmpty(tableName)) {
        saveForm(eformFormInfoId, tinymceContentStyle, eformJs, showContent);
    }
    else {
        var confirmMsg = "";
        if (publish == "1"){
            confirmMsg = "确定要更新并发布当前表单吗？";
        }else if (publish == "2"){
            confirmMsg = "确定要保存为新版本吗？";
        }else{
            confirmMsg = "确定要更新当前表单吗？";
        }
        layer.confirm(confirmMsg,
            {
                icon: 3,
                title: '提示',
                area: ['400px', ''],
                closeBtn: 0
            },
            function (index) {
                layer.close(index);
                if (publish == "2"){
                    saveNewVersion(eformFormInfoId, tableName, tinymceContentStyle, eformJs, showContent);
                }else {
                    updateForm(eformFormInfoId, tableName, tinymceContentStyle, eformJs, showContent);
                }
            });
    }

    //验证表单数据完整性
    function verifySaveForm(sourceContent) {
        var verifyStatus = true;

        var eleViewId = "";
        var eleCode = "";
        var colNameList = [];
        var domIdList = [];
        var tableColList = [];
        var ssd = $("#attrform").validate();
        if (ssd && !ssd.checkForm()) {
            ssd.showErrors();
            return false;
        }
        var tables = $('#tinymceArea_ifr').contents().find('table');
        for (var co = 0; co < tables.length; co++) {
            var tabledomid = tables.eq(co).attr("id");
            if (!isEmptyObject(tabledomid)) {
                tableColList[tabledomid] = [];
            }
        }
        var datatableEleViewIdArray = [];
        $(sourceContent).find('.element').each(function (index, element) {
            eleViewId = $(element).attr("id");
            eleCode = $(element).attr("class").substr(8);
            var tableattr = editorUtil.getTableAttrByElement($(this));
            var tabletype = tableattr.datatype;


            var eleattr = $(element).find(".eleattr-span").prop("innerHTML");
            var attrJson;
            try {
                attrJson = $.parseJSON(eleattr);
            }
            catch (error) {
                console.log(error);
                layer.msg('该控件源码格式有误！', {icon: 2});
                verifyStatus = false;

                return false;
            }
            var ele = EformEditor.getElement(eleCode);

            if (ele.validateForm && typeof(ele.validateForm) == "function"){
                if (!ele.validateForm(attrJson)){
                    verifyStatus = false;
                    return false;
                }
            }

            if (eleCode == "datatable") {
                datatableEleViewIdArray.push(eleViewId);
                return true;
            }

            if (ele.colType == "NOT_DB_COL_ELE") {
                return true;
            }

            //控件属性
            var colName = attrJson.colName.toUpperCase();//字段名称(英文)
            var colLabel = attrJson.colLabel;//字段描述(备注)
            var colLength = attrJson.colLength;//字段长度
            var defaultValue = attrJson.defaultValue;//默认值
            var attribute02 = attrJson.attribute02;//小数位数
            var rows = attrJson.rows;//行数
            var domId = attrJson.domId || colName;
            var rtfHeight=attrJson.rtfHeight;//富文本高度
            var userSelectDomain = attrJson.selectDomain;//用户选人框选择维度
            var allowSecret = attrJson.allowSecret;//是否关联密级
            var formSecret = attrJson.formSecret;//表单密级字段
			var xml = attrJson.xml;
            //1.验证必填属性与格式
            if (verifyIsEmpty(colName)) {
                layer.msg('字段名称(英文)[' + colName + ']不能为空！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            if (verifyIsSpecial(colName) || verifyIsChinese(colName) || verifyIsNumStart(colName)) {
                layer.msg('字段名称(英文)[' + colName + ']不能包含特殊字符、空格、中文或以数字开头！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            if (verifyIsEmpty(colLabel)) {
                layer.msg('字段描述(备注)[' + colName + ']不能为空！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            //验证页面元素ID格式
            if (domId!=null && (verifyIsSpecial(domId) || verifyIsChinese(domId))) {
                layer.msg('页面元素ID[' + colName + ']不能为特殊字符或中文！', {icon: 7});
                verifyStatus = false;
                return false;
            }

            if (colLength != null && verifyIsEmpty(colLength)) {
                layer.msg('字段长度[' + colName + ']不能为空！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            if (colLength != null && (!verifyIsInteger(colLength) || colLength <= 0 || colLength > 4000)) {
                layer.msg('字段长度[' + colName + ']必须为正整数，且值区间为[1, 4000]！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            if (attribute02 != null && verifyIsEmpty(attribute02)) {
                layer.msg('数字输入框[' + colName + ']小数位数不能为空！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            if (attribute02 != null && (!verifyIsInteger(attribute02) || attribute02 < 0 || attribute02 > 10)) {
                layer.msg('数字输入框[' + colName + ']小数位数必须为正整数，且值区间为[0, 10]！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            if (rows != null && verifyIsEmpty(rows)) {
                layer.msg('多行文本框[' + colName + ']行数不能为空！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            if (rows != null && (!verifyIsInteger(rows) || rows <= 0 || rows > 20)) {
                layer.msg('多行文本框行数必须为正整数，且值区间为[1, 20]！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            
            if (rtfHeight != null && rtfHeight!=""&& (!verifyIsInteger(rtfHeight) || rtfHeight <= 0)) {
                layer.msg('富文本高度必须为正整数', {icon: 7});
                verifyStatus = false;

                return false;
            }
            
            if(eleCode == "user-box"){
            	if((!userSelectDomain)||(userSelectDomain=="")){
            		layer.msg('选用户控件选择维度不能为空', {icon: 7});
                    verifyStatus = false;
                    return false;
            	}
            }

/*            //判断关联密级后是否填写了密级--文件上传、选人
            if(allowSecret=='true'){
                if((!formSecret)||(formSecret=="请选择")){
                    layer.msg(colLabel+'关联的密级字段不能为空', {icon: 7});
                    verifyStatus = false;
                    return false;
                }
            }*/

			if (verifyIsEmpty(xml)) {
                layer.msg('字段名称(英文)[引入XML]不能为空！', {icon: 7});
                verifyStatus = false;

                return false;
            }
            //2.验证字段名称(英文)不能重复
            if (tabletype == "0") {
                colNameList.push(colName);
                var uniqueArray = getUniqueArray(colNameList);
                if (colNameList.length != uniqueArray.length) {
                    layer.msg('字段名称(英文)[' + colName + ']不能重复！', {icon: 7});
                    verifyStatus = false;

                    return false;
                }
            } else {
                var tablelayoutid = tableattr.layoutid;
                tableColList[tablelayoutid].push(colName);
                var uniqueArray = getUniqueArray(tableColList[tablelayoutid]);
                if (tableColList[tablelayoutid].length != uniqueArray.length) {
                    layer.msg('字段名称(英文)[' + colName + ']不能重复！', {icon: 7});
                    verifyStatus = false;

                    return false;
                }
            }

            domIdList.push(domId);
            var uniqueDomArray = getUniqueArray(domIdList);
            if (domIdList.length != uniqueDomArray.length) {
                layer.msg('页面元素ID[' + colName + ']不能重复！', {icon: 7});
                verifyStatus = false;

                return false;
            }

            if (defaultValue != null && defaultValue.length > colLength) {
                layer.msg('字段默认值长度为' + defaultValue.length + '已超出字段长度' + colLength + '！', {icon: 7});
                verifyStatus = false;

                return false;
            }
        });

        //如果验证失败，则模拟点击该控件
        if (verifyStatus == false) {
            $('#tinymceArea_ifr').contents().find('#' + eleViewId).click();
            $('#tinymceArea_ifr').contents().find('#' + eleViewId).attr("data-mce-selected","1");
        }
        //以下子表名称单独验证
        else {
            var ajaxStatus = false;
            for (var i = 0; i < datatableEleViewIdArray.length; i++) {
                var eleViewId = datatableEleViewIdArray[i];

                var eleattr = $('#tinymceArea_ifr').contents().find('#' + eleViewId).find(".eleattr-span").prop("innerHTML");
                var attrJson = $.parseJSON(eleattr);
                var subTableName = attrJson.subTableName;
                var fkColName = attrJson.fkColName;
                if (fkColName=="请选择"||verifyIsEmpty(fkColName)){
                    layer.msg('子表外键不能为空！', {icon: 7});
                    verifyStatus = false;
                    return false;
                }

				if (verifyIsEmpty(attrJson.xml)) {
                	layer.msg('字段名称(英文)[引入XML]不能为空！', {icon: 7});
                	verifyStatus = false;

                	return false;
            	}
                //子表类型：0自定义、1数据源
                if (attrJson.subTableType == "0") {
                    if (verifyIsEmpty(subTableName)) {
                        layer.msg('子表名称不能为空！', {icon: 7});
                        verifyStatus = false;

                        break;
                    }
                    else {
                        $.ajax({
                            url: 'platform/eform/bpmsClient/validateTableName',
                            type: 'POST',
                            data: {
                                tableName: subTableName
                            },
                            async: false,
                            dataType: 'json',
                            success: function (backData, status) {
                                if (backData.success == false) {
                                    layer.msg('子表名称已存在！', {icon: 7});

                                    ajaxStatus = true;
                                    $('#tinymceArea_ifr').contents().find('#' + eleViewId).click();
                                    $('#tinymceArea_ifr').contents().find('#' + eleViewId).find("input, select, textarea").focus();

                                    verifyStatus = false;
                                    return verifyStatus;
                                }
                                else {
                                    if (verifyIsEmpty(attrJson.colList)) {
                                        layer.msg('子表字段不能为空！', {icon: 7});

                                        ajaxStatus = true;
                                        $('#tinymceArea_ifr').contents().find('#' + eleViewId).click();
                                        $('#tinymceArea_ifr').contents().find('#' + eleViewId).find("input, select, textarea").focus();

                                        verifyStatus = false;
                                        return verifyStatus;
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    if (verifyIsEmpty(subTableName)) {
                        layer.msg('子表请选择数据源！', {icon: 7});
                        verifyStatus = false;

                        break;
                    }
                }
            }

            if (verifyStatus == false && ajaxStatus == false) {
                $('#tinymceArea_ifr').contents().find('#' + eleViewId).click();
                $('#tinymceArea_ifr').contents().find('#' + eleViewId).find("input, select, textarea").focus();
            }
        }

        return verifyStatus;
    }

    //保存表单
    function saveForm(eformFormInfoId, tinymceContentStyle, eformJs, showContent) {
        var restUrl = "platform/eform/bpmsClient/createtable";

            $("#saveEform").modal("show");

            $("#saveEformButton").unbind("click");
            $("#saveEformButton").click(function () {
                var form_tableName = $("#form_tableName").val();
                var form_tableLabel = $("#form_tableLabel").val();
                var dbTypeId = $("#dbTypeId").val();

                if (verifyIsEmpty(form_tableName)) {
                    $("#form_tableName").focus();
                    layer.msg('数据库表名称不能为空！', {icon: 7});
                }else if(/.*[\u4e00-\u9fa5]+.*$/.test(form_tableName)){
                	 layer.msg('数据库表名称不能包含中文！', {icon: 7});
                }else if(form_tableName.length > 14){
                	 layer.msg('数据库表名称超长！', {icon: 7});
                }
                else if (verifyIsEmpty(dbTypeId)) {
                    $("#dbTypeName").focus();
                    layer.msg('请选择存储模型分类！', {icon: 7});
                }
                else {
                    form_tableName = "DYN_" + form_tableName;
                    $.post("platform/eform/bpmsClient/validateTableName.json", "tableName=" + form_tableName,
                        function (backData, status) {
                            if (backData.success == false) {
                                layer.msg('该数据库表名称已存在！', {icon: 7});
                            }
                            else {
                                $.ajax({
                                    url: restUrl,
                                    type: 'POST',
                                    data: {
                                        eformFormInfoId: eformFormInfoId,
                                        dbTypeId: dbTypeId,
                                        tableName: form_tableName,
                                        tableLabel: form_tableLabel,
                                        tableCss: EformConfig.contentCssPath + "/" + tinymceContentStyle + ".css",
                                        tableJs: eformJs,
                                        tableContent: showContent.prop('outerHTML'),
                                        dbarray: "{}",
                                        version:version
                                    },
                                    dataType: 'json',
                                    success: function (backData, status) {
                                        if (backData.success == true) {
                                            _this.tableName = form_tableName;
//                                        var tableNode = dataTree.getNodeByParam("id", "-1", null);
//                                        tableNode.name = "主表：" + form_tableName;
//                                        dataTree.updateNode(tableNode);

                                            $("#saveEform").modal("hide");
                                            $("#form_tableName").val("");

                                            if (!ifPublish) {
                                                refreshContent(eformFormInfoId);
                                                layer.msg('保存表单成功！', {icon: 1});
                                            }
                                            else {
                                                _this.doPublish('保存并发布表单成功！');
                                            }
                                        }
                                        else {
                                            if(backData.msg != null && backData.msg!="") {
                                                layer.msg(backData.msg, {icon: 2});
                                            }
                                            else
                                                layer.msg('保存表单失败！', {icon: 2});
                                        }
                                    }
                                });
                            }
                        }
                    );
                }
            });

    }

    //更新表单
    function updateForm(eformFormInfoId, tableName, tinymceContentStyle, eformJs, showContent) {
        var restUrl = "platform/eform/bpmsClient/updateForm";

        $.ajax({
            url: restUrl,
            type: 'POST',
            data: {
                eformFormInfoId: eformFormInfoId,
                tableName: tableName,
                tableCss: EformConfig.contentCssPath + "/" + tinymceContentStyle + ".css",
                tableJs: eformJs,
                tableContent: showContent.prop('outerHTML'),
                version:version
            },
            dataType: 'json',
            success: function (backData, status) {
                if (backData.success == true) {
                    if (!ifPublish) {
                        refreshContent(eformFormInfoId);
                        _this.doPublish('更新表单成功！',false);
                    }
                    else {
                        _this.doPublish('更新并发布表单成功！');
                    }
                }
                else {
                    layer.msg(backData.msg, {icon: 2});
                }
            }
        });
    }

    //保存成新版本
    function saveNewVersion(eformFormInfoId, tableName, tinymceContentStyle, eformJs, showContent) {
        var restUrl = "platform/eform/bpmsClient/saveNewVersion";

        $.ajax({
            url: restUrl,
            type: 'POST',
            data: {
                eformFormInfoId: eformFormInfoId,
                tableName: tableName,
                tableCss: EformConfig.contentCssPath + "/" + tinymceContentStyle + ".css",
                tableJs: eformJs,
                tableContent: showContent.prop('outerHTML'),
                version:version
            },
            dataType: 'json',
            success: function (backData, status) {
                if (backData.success == true) {
                    version = backData.id;
                    _this.doPublish('保存新版本成功！');
                }
                else {
                    layer.msg(backData.msg, {icon: 2});
                }
            }
        });
    }
};

/**
 * 保存并发布表单
 */
FEformEditor.prototype.saveAndPublish = function () {
    var _this = this;

    _this.save("1");
};

/**
 * 新建版本
 */
FEformEditor.prototype.saveNewVersion = function () {
    var _this = this;

    _this.save("2");
};

/**
 * 发布表单
 */
FEformEditor.prototype.doPublish = function (msg,isclose) {
    var _this = this;
    var _close = true;
    if (isclose != undefined){
        _close = isclose;
    }
    $.ajax({
        url: "platform/eform/bpmsManageController/publishEformFormInfo",
        data: "id=" + _this.eformFormInfoId+"&version="+version,
        type: "post",
        async: false,
        dataType: "json",
        success: function (backData) {
            if (backData.result == "1") {
                layer.msg(msg, {icon: 1});
                if (_close) {
                    // var formInfo = window.opener.$('#formInfoDiv').find("#" + _this.eformFormInfoId);
                    // formInfo.remove();

                    window.opener.eformComponent.clickTitle(window.opener.eformComponent.selectedEformComponentId);
                   // window.opener.eformFormInfo.setFormInfo(backData.data);

                    setTimeout(function () {
                        window.close();
                    }, 1000);
                }
            }
            else {
                layer.msg('发布表单失败！', {icon: 2});
            }
        }
    });
};

//初始化设计器
FEformEditor.prototype.initEformEditor = function (id) {
    // this.setButtonArea();
    this.drawLeftArea(this.editor);
    this.drawRightArea(this.editor);
    this.drawTopContentStyle(this.editor);
};

function loadExtraJs(){
    if (typeof EformConfig.extraJs == "undefined")
        return;
    var jsArray = EformConfig.extraJs;
    for (var i=0;i<jsArray.length;i++){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = jsArray[i];
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}
/**
 * 重新读取后台内容，刷新设计器内容界面
 */
function refreshContent(eformFormInfoId) {
    var _this = this;

    $.ajax({
        url: "platform/eform/bpmsManageController/getEformFormInfoContent/" + eformFormInfoId+"/"+version,
        type: "post",
        async: false,
        dataType: "json",
        success: function (backData) {
            if (backData.result == "1") {
                $("#attrArea").html("");
                tinymce.activeEditor.setContent(backData.data);
            }
        }
    });
}

/**
 * 绑定左侧控件按钮事件
 * @param eleItemObj
 */
function bindDragEleEvent(eleItemObj) {
    eleItemObj.click(function () {
        insertFlag--;
        var eleView = eleItemObj.find(".view");
        var eleCode = eleView.attr("code");

        var eleViewContent;
        var eleViewId = GenNonDuplicateID();

        //子表控件单独判断
        if (eleCode == "datatable") {
            eleViewContent = eleView.find("table").clone();
            eleViewContent.find(".element").attr("id", eleViewId);
        }
        else {
            eleViewContent = eleView.find(".element").clone();
            eleViewContent.attr("id", eleViewId);
        }
        var bm = tinymce.activeEditor.selection.getBookmark();
        tinymce.activeEditor.selection.moveToBookmark(bm);

        //将该控件代码插入设计区tinymce光标处
        tinymce.activeEditor.execCommand('mceInsertContent', false, eleViewContent.prop('outerHTML'));

        if (eleCode == "datatable") {
            var td = $('#tinymceArea_ifr').contents().find('#' + eleViewId).parent().parent().parent().parent().parent();
            if (td) {
                var html = td.html();
                html = html.replace(/&nbsp;/ig, '');
                td.html(html);
            }
        } else {

            var td = $('#tinymceArea_ifr').contents().find('#' + eleViewId).parent();
            if (td) {
                var html = td.html();
                html = html.replace(/&nbsp;/ig, '');
                td.html(html);
            }
        }

        //绑定控件元素点击事件
        bindContentEleEvent(eleViewId, eleCode);
        //模拟点击该控件元素
        $('#tinymceArea_ifr').contents().find('#' + eleViewId).click();
        insertFlag++;
    });
}

/**
 * 绑定设计区控件元素事件
 * @param eleViewId
 * @param eleCode
 */
function bindContentEleEvent(eleViewId, eleCode) {
    //先解除绑定click事件，避免重复绑定
    $('#tinymceArea_ifr').contents().find('#' + eleViewId+",[for='"+eleViewId+"']").unbind("click");
    $('#tinymceArea_ifr').contents().find('#' + eleViewId+",[for='"+eleViewId+"']").click(function () {
        var ssd = $("#attrform").validate();
        if (ssd && !ssd.checkForm()) {
            ssd.showErrors();
            return false;
        }


        var ele = EformEditor.getElement(eleCode);
        if ($(this).hasClass("onchoose") && $("#attrform").length > 0) {
            return false;
        }
        EformEditor.nowElement = $(this);
        var $table = $(this).parents("table");
        if ($table.length > 0) {
            var summary = $($table[$table.length - 1]).attr("summary"), attrJson;
            if (!isEmptyObject(summary)) {
                attrJson = $.parseJSON(summary);
                if (attrJson.hasOwnProperty("dbid")) {
                    if (isEmptyObject(attrJson.dbid)) {
                        EformEditor.nowDbid = tableId;
                        EformEditor.nowTableName = tableName;
                    } else {
                        EformEditor.nowDbid = attrJson.dbid;
                        EformEditor.nowTableName = attrJson.dbname;
                    }
                } else {
                    EformEditor.nowDbid = tableId;
                    EformEditor.nowTableName = tableName;
                }
            } else {
                EformEditor.nowDbid = tableId;
                EformEditor.nowTableName = tableName;
            }
        } else {
            EformEditor.nowDbid = tableId;
            EformEditor.nowTableName = tableName;
        }
        $("#attrArea").html("");
        var form;
        $.ajax({
            url: EformConfig.formdesignPath + "/js/plugins/" + eleCode + "/" + eleCode + ".jsp",
            async: false,
            success: function (data) {
                form = $(data);
            }
        });

        for (var i = 0; i < form.length; i++) {
            if (form[i].className == "form") {
                $(form[i]).attr("id", "attrform");
                $("#attrArea").append(form);
                $('#tinymceArea_ifr').contents().find(".onchoose").removeClass("onchoose");
                $(this).addClass("onchoose");
                var eleattr = $(this).find(".eleattr-span").prop("innerHTML");

                //如果有initAttrForm则执行属性页初始化方法
                if (ele.initAttrForm && typeof(ele.initAttrForm) == "function") {

                    //构造回调函数，为了顺序执行js方法
                    function sync(callback) {
                        ele.initAttrForm(form, eleattr, EformEditor.nowElement);
                        if (callback && typeof(callback) == "function")
                            callback();
                    }

                    //在加载数据之前执行属性页面初始化js
                    sync(function () {
                        if (!isEmptyObject(eleattr)) {
                            eleattr = eleattr.replace(/&lt;/g, "<");
                            eleattr = eleattr.replace(/&gt;/g, ">");
                            eleattr = eleattr.replace(/&amp;/g, "&");
                            var attrJson = $.parseJSON(eleattr);
                            $("#attrform").setform(attrJson);
                        }
                    });


                } else {
                    if (!isEmptyObject(eleattr)) {
                        eleattr = eleattr.replace(/&lt;/g, "<");
                        eleattr = eleattr.replace(/&gt;/g, ">");
                        eleattr = eleattr.replace(/&amp;/g, "&");
                        var attrJson = $.parseJSON(eleattr);
                        $("#attrform").setform(attrJson);
                    }
                }

                $(form[i]).find("input,textarea,select").on("keyup change", function () {
                    var $ele = EformEditor.nowElement;
                    //字段名称(英文)、子表名称自动转为大写
                    if (this.id == 'colName') {
                        var value = this.value.toUpperCase();
                        $(this).val(value);
                        /* if (EformEditor.nowDbid != "" && EformEditor.nowDbid != tableId){
                             $("#domId").val(EformEditor.nowDbid + "_"+this.value.toUpperCase());
                             DataArea.putColData(EformEditor.nowDbid, value, json);
                         }else{
                             $("#domId").val(this.value.toUpperCase());
                             if (EformEditor.nowDbid == tableId && tableId!=""){
                                 DataArea.putColData(EformEditor.nowDbid, value, json);
                             }else{
                                 DataArea.putColData("new", value, json);
                             }

                         }*/
                       $("#title").val(value);
                    }


                    if (this.id == 'subTableName') {
                        $(this).val(this.value.toUpperCase());
                    }
                    var json = $("#attrform").serializeObject();
                    //添加元素code，方便后台遍历
                    json.domType = ele.elecode;
                    if (ele.colType) {
                        json.colType = ele.colType;
                    }
                    if (ele.hasOwnProperty("allowType")){
                        json.allowType = ele.allowType;
                    }
                    //tinymce不支持自定义属性，所以将属性值存入一个隐藏span
                    $ele.find(".eleattr-span").remove();
                    var $span = $("<span class='eleattr-span' style='display: none;'></span>");
                    $span.text(JSON.stringify(json));
                    if ($ele.find(".element").length>0){
                        $ele.find(".element").append($span);
                    }else {
                        $ele.append($span);
                    }

                    if (ele.hasOwnProperty("update"))
                        ele.update($("#attrform"), $ele);

                    //维护数据源树
                    /*if (eleCode != "datatable") {
                        if (json.colType != "NOT_DB_COL_ELE") {
                            var tableEleNode = dataTree.getNodeByParam("id", eleViewId, null);
                            if (tableEleNode == null) {
                                tableEleNode = {"id": eleViewId, "name": $("#colName").val()};
                                dataTree.addNodes(dataTree.getNodeByParam("id", "-1", null), tableEleNode);
                            }
                            else {
                                tableEleNode.name = $("#colName").val();
                                dataTree.updateNode(tableEleNode);
                            }
                        }
                    }
                    else {
                        //更新树子表节点
                        var subTableNode = dataTree.getNodeByParam("id", eleViewId, null);
                        if (subTableNode == null) {
                            subTableNode = {
                                "id": eleViewId,
                                "name": "子表：" + $("#subTableName").val(),
                                "icon": "static/h5/jquery-ztree/3.5.12/css/zTreeStyle/img/diy/3.png"
                            };
                            dataTree.addNodes(null, subTableNode);
                        }
                        else {
                            subTableNode.name = "子表：" + $("#subTableName").val();
                            dataTree.updateNode(subTableNode);
                        }
                    }*/

                });
                $(form[i]).find("select").on("change", function () {
                    var json = $("#attrform").serializeObject();
                    var $ele = EformEditor.nowElement;
                    //添加元素code，方便后台遍历
                    json.domType = ele.elecode;
                    if (ele.colType) {
                        json.colType = ele.colType;
                    }
                    if (ele.hasOwnProperty("allowType")){
                        json.allowType = ele.allowType;
                    }
                    //tinymce不支持自定义属性，所以将属性值存入一个隐藏span
                    $ele.find(".eleattr-span").remove();
                    var $span = $("<span class='eleattr-span' style='display: none;'></span>");
                    $span.text(JSON.stringify(json));
                    if ($ele.find(".element").length>0){
                        $ele.find(".element").append($span);
                    }else {
                        $ele.append($span);
                    }


                    if (ele.hasOwnProperty("update"))
                        ele.update($("#attrform"), $ele);
                });

                var json = $("#attrform").serializeObject();
                var $ele = EformEditor.nowElement;
                //添加元素code，方便后台遍历
                json.domType = ele.elecode;
                if (ele.colType) {
                    json.colType = ele.colType;
                }
                if (ele.hasOwnProperty("allowType")){
                    json.allowType = ele.allowType;
                }
                //tinymce不支持自定义属性，所以将属性值存入一个隐藏span
                $ele.find(".eleattr-span").remove();
                var $span = $("<span class='eleattr-span' style='display: none;'></span>");
                $span.text(JSON.stringify(json));
                if ($ele.find(".element").length>0){
                    $ele.find(".element").append($span);
                }else {
                    $ele.append($span);
                }

                var tableattr = editorUtil.getTableAttrByElement($ele);
                //判断是否是流程变量
                if (json.bpmVar == "Y") {
                    $("input[name='colIsMust'][value='Y']").prop("checked", true);
                    $("input[name='colIsMust'][value='N']").prop('disabled', true);
                }
                //判断附件是否显示密级
                if(json.allowSecret == "false"){
                    $("#formSecret").val("");
                    $("#formSecretDiv").css("display","none");
                    $("input[name='allowEncry'][value='false']").prop("checked",true)


                }

                if (tableattr.datatype == "1" && isEmptyObject(tableattr.issave)) {

                    $("input[name='colIsMust'][value='N']").prop('checked', true);
                    $("input[name='colIsMust'][value='Y']").prop('disabled', true);
                    $("input[name='colDropdownType'][value='Y']").prop('checked', true);
                    $("input[name='colDropdownType'][value='N']").prop('disabled', true);
                } else {
                    $("input[name='colIsMust'][value='Y']").prop('disabled', false);
                    $("input[name='colDropdownType'][value='N']").prop('disabled', false);
                }

                //自动生成数据库字段名称，用户可修改
                if (eleCode != "datatable" && $("#colName").val() == "" && $("#colLabel").val() == "" && tableattr.datatype == "0") {

                        $("#colName").val("DATA_" + dataAttrValue).trigger("keyup");
                        $("#colLabel").val("字段_" + dataAttrValue).trigger("keyup");
                        dataAttrValue += 1;

                }
                $("#tableName").val(EformEditor.nowTableName);//增加数据库表名称显示
                if (tableattr.datatype != "0") {
                    $("#colName").attr("readonly", "readonly");
                    $("#colLabel").attr("readonly", "readonly");
                }
                if (eleCode == "datatable" && $("#subTableName").val() == "" && $("#attrform").serializeObject().subTableType == "") {
                    $("#subTableName").val("DYN_SUB_" + EformEditor.formCode + "_" + subTableValue).trigger("keyup");

                    subTableValue += 1;
                }

                //选择主表列
                if (!verifyIsEmpty(EformEditor.nowDbid)) {
                    $("#colNameBtn").click(function () {
                        var selectDbColumnName = new SelectDbColumnName(EformEditor.nowDbid);
                        selectDbColumnName.init(function (data) {
                            if (data.hasOwnProperty("colLength") && data.colLength!=""){
                                $("#colLength").val(data.colLength);
                            }
                            $("#colName").val(data.colName).trigger("keyup");
                            $("#colLabel").val(data.colComments).trigger("keyup");
                        });
                    });
                }

                //子表类型：0自定义、1数据源
                if (eleCode == "datatable") {
                    if ($("#attrform").serializeObject().subTableType == "" || $("#attrform").serializeObject().subTableType == "0") {
                        $("input[type='radio'][name='subTableType'][value='0']").attr("checked", "checked").trigger("keyup");
                    }
                    else {
                        $("input[type='radio'][name='subTableType'][value='1']").attr("checked", "checked").trigger("keyup");
                        bindSubTableNameEvent();
                    }

                    $(":radio[name=subTableType]").unbind("click");
                    $(":radio[name=subTableType]").click(function () {
                        $("#attrform").find("#subTableName + input[id='dataSourceId']").remove();
                        $("#attrform").find("#subTableName").unbind("click");
                        $("#attrform").find("#subTableName").css("cursor", "auto");
                        $("#attrform").find("#subTableName").attr("readonly", false);
                        $("#attrform").find("#colArea").empty();
                        $("#attrform").find("#subTableName").val("").trigger("keyup");
                        $("#attrform").find("#fkColName").val("").trigger("keyup");
                        $("#attrform").find("#colList").val("");
                        ele.update($("#attrform"), EformEditor.nowElement);

                        var type = this.value;
                        if (type == 1) {
                            bindSubTableNameEvent();
                        }
                        else {
                            //隐藏外键
                            $("#attrform").find("#fkColName").parents(".form-group:first").css("display", "none");
                        }
                    });

                    function bindSubTableNameEvent() {
                        $("#attrform").find("#subTableName").after('<input type="hidden" id="dataSourceId" name="dataSourceId">');
                        $("#attrform").find("#subTableName").attr("readonly", true);

                        selectCreatedDbTable = new SelectCreatedDbTable("dataSourceId", "subTableName");
                        selectCreatedDbTable.init(function (treeNode) {
                            var id = treeNode.id;
                            var name = treeNode.name;
                            var tablename = treeNode.tablename;

                            $("#attrform").find("#subTableName").val(tablename);
                            $("#attrform").find("#subTableName").trigger("keyup");

                            var dbTableId = $("#attrform").find("#dataSourceId").val();
                            $.ajax({
                                url: 'platform/eform/bpmsManageController/getColumnsBytableId',
                                type: 'POST',
                                data: {
                                    dbTableId: dbTableId
                                },
                                dataType: 'json',
                                success: function (backData, status) {
                                    if (backData.result == "1") {
                                        var rs = [];
                                        var columnsList = backData.data;
                                        var subTableType = $('input[name="subTableType"]:checked').val();
                                        $("#attrform").find("#colArea").empty();
                                        //子表外键
                                        $("#fkColName").find("option").remove();
                                        var fkColNameSelect = $("#fkColName")[0];
                                        var op = new Option("请选择");
                                        fkColNameSelect.options[0] = op;
                                        var index = 1;
                                        for (var i = 0; i < columnsList.length; i++) {
                                            var column = columnsList[i];
                                            //列属性
                                            var colName = column.colName;
                                            var colType = column.colType;
                                            var colTypeName = column.colTypeName;
                                            var colLength = column.colLength;
                                            var colNullable = column.colNullable;
                                            var colDefault = column.colDefault;
                                            var colComments = column.colComments;
                                            var colIsPk = column.colIsPk;
                                            var colIsUnique = column.colIsUnique;
                                            var attribute02 = column.attribute02;//小数位数
                                            var fkCol = $("#fkColName").val();
                                            if (colIsPk == "Y"
                                                || colName == "CREATION_DATE"
                                                || colName == "CREATED_BY"
                                                || colName == "LAST_UPDATE_DATE"
                                                || colName == "LAST_UPDATED_BY"
                                                || colName == "VERSION"
                                                || colName == "LAST_UPDATE_IP"
                                                || colName == "ORG_IDENTITY") {
                                                //||((subTableType=="0"&&colName == "FK_SUB_COL_ID"))
                                                //|| colName == fkCol) {
                                                continue;
                                            }
                                            var op = new Option(colComments, column.colName);
                                            fkColNameSelect.options[index] = op;
                                            index = index + 1 ;

                                            //显示实体表字段
                                            if(((subTableType=="0"&&colName == "FK_SUB_COL_ID"))||colName == fkCol){
                                                continue;
                                            }else{
                                                var li = $('<li class="item-red clearfix"></li>');
                                                var coltypediv = $('<div class="col-xs-3"></div>');
                                                if (colType == 'DATE') {
                                                    coltypediv.append('<i class="ace-icon fa fa-calendar"></i>');
                                                }else if(colType == 'NUMBER'){
                                                    coltypediv.append('<i class="ace-icon fa fa-sort-numeric-asc"></i>');
                                                } else {
                                                    coltypediv.append('<i class="ace-icon fa fa-bars"></i>');
                                                }
                                                var colLabeldiv = $('<div class="col-xs-9"></div>');
                                                colLabeldiv.append('<span class="lbl">' + colComments + '</span>');
                                                li.append(coltypediv).append(colLabeldiv);
                                                $("#attrform").find("#colArea").append(li);
                                            }

                                            //添加设计器属性
                                            var theColumn = {};
                                            theColumn.colName = colName;
                                            theColumn.attribute01 = "";
                                            theColumn.attribute02 = attribute02;
                                            theColumn.colType = colType;
                                            theColumn.colLabel = colComments;
                                            if (colType == "DATE") {
                                                theColumn.elementType = "date";
                                                theColumn.attribute03 = "1";
                                            }else if(colType == 'NUMBER'){
                                                theColumn.elementType = "number";
                                                theColumn.defaultValue = colDefault;
                                            }else {
                                                theColumn.elementType = "text";
                                            }
                                            theColumn.colLength = colLength;
                                            theColumn.width = "50";
                                            theColumn.colIsMust = "";
                                            theColumn.colIsVisible = "Y";
                                            rs.push(theColumn);
                                        }

                                        $("#attrform").find("#colList").val(JSON.stringify(rs)).trigger("keyup");
                                    }
                                    else {
                                        layer.msg('获取表数据失败！', {icon: 2});
                                    }
                                }
                            });
                        });

                        //显示外键
                        $("#attrform").find("#fkColName").parents(".form-group:first").css("display", "");
                    }
                }

            }
        }

        return false;
    });
}

/**
 * 重新绑定设计区所有控件元素事件
 */
function rebindAllContentEleEvent() {
    $('#tinymceArea_ifr').contents().find('.element').each(function (index, element) {
        var eleViewId = $(element).attr("id");
        var eleCode = $(element).attr("class").substr(8);
        bindContentEleEvent(eleViewId, eleCode);
        //模拟点击该控件元素
       // $('#tinymceArea_ifr').contents().find('#' + eleViewId).click();
    });
}

/**
 * 重新维护数据源树结构
 */
function reMaintainDataTree() {
    //清空原有数据
    var allRootNodes = dataTree.getNodes();
    for (var i = 0; i < allRootNodes.length; i++) {
        var rootNode = allRootNodes[i];

        if (rootNode.id == "-1") {
            dataTree.removeChildNodes(rootNode);

            rootNode.name = "主表：" + EformEditor.tableName;
            dataTree.updateNode(rootNode);
        }
        else {
            dataTree.removeNode(rootNode);
        }
    }

    //重新添加树内容
    $('#tinymceArea_ifr').contents().find('.element').each(function (index, element) {
        var eleViewId = $(element).attr("id");
        var eleCode = $(element).attr("class").substr(8);

        var eleattr = $(element).find(".eleattr-span").prop("innerHTML");
        var attrJson = $.parseJSON(eleattr);

        if (eleCode != "datatable") {
            if (EformEditor.getElement(eleCode) != undefined && EformEditor.getElement(eleCode).colType != "NOT_DB_COL_ELE") {
                var tableEleNode = dataTree.getNodeByParam("id", eleViewId, null);
                if (tableEleNode == null) {
                    tableEleNode = {"id": eleViewId, "name": attrJson.colName};
                    dataTree.addNodes(dataTree.getNodeByParam("id", "-1", null), tableEleNode);
                }
                else {
                    tableEleNode.name = attrJson.colName;
                    dataTree.updateNode(tableEleNode);
                }
            }
        }
        else {
            //更新树子表节点
            var subTableNode = dataTree.getNodeByParam("id", eleViewId, null);
            if (subTableNode == null) {
                subTableNode = {
                    "id": eleViewId,
                    "name": "子表：" + attrJson.subTableName,
                    "icon": "static/h5/jquery-ztree/3.5.12/css/zTreeStyle/img/diy/3.png"
                };
                dataTree.addNodes(null, subTableNode);
            }
            else {
                subTableNode.name = "子表：" + attrJson.subTableName;
                dataTree.updateNode(subTableNode);
            }

            //更新树子表字段节点
            dataTree.removeChildNodes(dataTree.getNodeByParam("id", eleViewId, null));
            if (attrJson.colList != "") {
                var colList = $.parseJSON(attrJson.colList);

                for (var i = 0; i < colList.length; i++) {
                    var colAttr = colList[i];
                    var colName = colAttr.colName;

                    var subTableCol = {"name": colName, "id": colName};

                    if (i != colList.length - 1) {
                        dataTree.addNodes(dataTree.getNodeByParam("id", eleViewId, null), subTableCol);
                    }
                }
            }
        }

    });
}

/**
 * 自动维护元素控件字段名称后缀、子表控件名称后缀编号，以免重新开始编号
 */
function reSetNumber() {
    $('#tinymceArea_ifr').contents().find('.element').each(function (index, element) {
        var eleViewId = $(element).attr("id");
        var eleCode = $(element).attr("class").substr(8);

        var eleattr = $(element).find(".eleattr-span").prop("innerHTML");

        var attrJson;
        try {
            attrJson = $.parseJSON(eleattr);
        } catch (error) {
            return;
        }

        if (eleCode != "datatable") {
            if(attrJson.colName != undefined) {
                var colName = attrJson.colName.toUpperCase();
                var regex = /DATA_\d+$/;
                if (regex.test(colName)) {
                    var number = parseInt(colName.substring(5));
                    if (number >= dataAttrValue) {
                        dataAttrValue = number + 1;
                    }
                }
            }
        }
        else {
            var subTableName = attrJson.subTableName.toUpperCase();
            var subTableNamePrefix = "DYN_SUB_" + EformEditor.formCode.toUpperCase() + "_";
            var regexVariable = "/" + subTableNamePrefix + "\\d+$/";
            var regex = eval(regexVariable);
            if (regex.test(subTableName)) {
                var number = parseInt(subTableName.substring(subTableNamePrefix.length));
                if (number >= subTableValue) {
                    subTableValue = number + 1;
                }
            }

        }
    });
}

/**
 * 表单自定义按钮
 */
FEformEditor.prototype.customButton = function () {
    var customButtonDialog = layer.open({
        type: 2,
        title: '表单自定义按钮',
        skin: 'bs-modal',
        area: ['100%', '100%'],
        maxmin: false,
        content: "avicit/platform6/eform/formdesign/button/buttonManage.jsp"
    });
};

/**
 * 表单帮助
 */
FEformEditor.prototype.helpDoc = function () {
    var helpDocDialog = layer.open({
        type: 2,
        title: '表单帮助',
        skin: 'bs-modal',
        area: ['70%', '80%'],
        maxmin: false,
        content: "avicit/platform6/eform/formdesign/help.jsp"
    });
};

function isIE8() {
    if (!+[1,]) return true;
    else return false;
}

/**
 * 验证是否为空
 * @param value
 * @returns {boolean}
 */
function verifyIsEmpty(value) {
    var regExp = /[\S+]/i;
    if (regExp.test(value)) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 验证是否正整数
 * @returns {boolean}
 */
function verifyIsInteger(value) {
    var regExp = /^(0|([1-9]\d*))$/;
    if (regExp.test(value)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 验证是否特殊字符
 * @returns {boolean}
 */
function verifyIsSpecial(value) {
    var regEn = /[`~!@#$%^&*()+<>?:{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,regblank = /^\S*$/;;
    if(regEn.test(value) || regCn.test(value) ||!regblank.test(value)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 验证是否是中文
 * @returns {boolean}
 */
function verifyIsChinese(value) {
    var reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if(reg.test(value)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 验证是否数字开头
 * @returns {boolean}
 */
function verifyIsNumStart(value) {
    var reg = /^\d+/;
    if(reg.test(value)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 将array数组去重，并返回不重复元素数组
 * @returns {Array}
 */
function getUniqueArray(originArray) {
    var uniqueArray = [];
    $.each(originArray, function (i, el) {
        if ($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
    });

    return uniqueArray;
}