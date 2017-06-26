/**
 *
 */
TransferDOM = {
    toTextBox: function (ele) {
        var obj = {};
        var eleattr = $(ele).attr("eleattr");
        if (eleattr) {
            var attrJson = $.parseJSON(eleattr);

            var labelContent = "";
            if (attrJson.colIsMust == "Y") {
                labelContent = '<span class="remind">*</span><strong>' + attrJson.colLabel + '</strong>';
            }
            else {
                labelContent = '<strong>' + attrJson.colLabel + '</strong>';
            }
            obj.label = labelContent;

            var domContent = '<input type="text" class="easyui-validatebox validatebox-text"';
            if (attrJson.colName != "") {
                domContent += ' id="' + attrJson.colName + '" name="' + attrJson.colName + '"';
            }
            if (attrJson.colLength != "") {
                domContent += ' data-options="validType:[\'length[0,' + attrJson.colLength + ']\']"';
            }
            if (attrJson.colIsMust == "Y") {
                domContent += ' required="true"';
            }
            if (attrJson.colDropdownType == "Y") {
                domContent += ' readonly="readonly"';
            }
            domContent += '>';
            obj.dom = domContent;

            return obj;
        } else {
            return obj;
        }
    },

    toNumberBox: function (ele) {
        var obj = {};
        var eleattr = $(ele).attr("eleattr");
        if (eleattr) {
            var attrJson = $.parseJSON(eleattr);

            var labelContent = "";
            if (attrJson.colIsMust == "Y") {
                labelContent = '<span class="remind">*</span><strong>' + attrJson.colLabel + '</strong>';
            }
            else {
                labelContent = '<strong>' + attrJson.colLabel + '</strong>';
            }
            obj.label = labelContent;

            var domContent = '<input type="text" class="easyui-numberbox numberbox-f numberBox_extend validatebox-text"';
            if (attrJson.colName != "") {
                domContent += ' id="' + attrJson.colName + '" name="' + attrJson.colName + '" numberboxname="' + attrJson.colName + '"';
            }
            if (attrJson.colLength != "" && attrJson.attribute02 != "") {
                var maxValue = "";
                var minValue = "";
                for(var i = 0; i < attrJson.colLength; i++) {
                    if(attrJson.attribute02 != "0" && attrJson.colLength - attrJson.attribute02 == i) {
                        maxValue += ".";
                    }
                    maxValue += "9";
                }
                minValue = "-" + maxValue;

                domContent += ' data-options="precision:'+attrJson.attribute02+',max:'+maxValue+',min:'+minValue+'"';
            }
            if (attrJson.colIsMust == "Y") {
                domContent += ' required="true"';
            }
            if (attrJson.colDropdownType == "Y") {
                domContent += ' readonly="readonly"';
            }
            domContent += '>';
            obj.dom = domContent;

            return obj;
        } else {
            return obj;
        }
    },

    toSelectBox: function (ele) {
        var obj = {};
        var $ele = $(ele).clone();
        var aa = $ele.attr("eleattr");
        if (aa) {
            var json = $.parseJSON(aa);
            $ele.find("select").eq(0).removeClass();
            $ele.find("select").eq(0).removeAttr("onchange");
            $ele.find("select").eq(0).addClass("easyui-combobox");
            $ele.find("select").eq(0).attr("data-options", "editable:false,panelHeight:'auto',onShowPanel:comboboxOnShowPanel");
            obj.dom = $ele.find(".drop-item").html();
            obj.label = json.colLabel;
        }
        return obj;
    },

    toRadioBox: function (ele) {
        var obj = {};
        var aa = $(ele).attr("eleattr");
        if (aa) {
            var json = $.parseJSON(aa);
            obj.dom = $(ele).find(".drop-item").html();
            obj.label = json.colLabel;
        }
        return obj;
    },

    toCheckBox: function (ele) {
        var obj = {};
        var aa = $(ele).attr("eleattr");
        if (aa) {
            var json = $.parseJSON(aa);
            obj.dom = $(ele).find(".drop-item").html();
            obj.label = json.colLabel;
        }
        return obj;
    },

    /**
     * arrayObj 为元素对象数组，包含domArray元素：用户实现的元素转换结果数组，为二维数组  colArray元素：横跨列数数组，其与domArray的纵坐标关联
     * minCol为最小列所占栅格
     */
    toHtml: function (arrayObj, minCol) {
        // var $table = $("<table>").addClass("form_commonTable").attr("width","100%");
        var html = "";
        var thwidth = ((minCol / 12) * 100 * 2 / 5).toFixed(2);
        if (thwidth>20){
        	thwidth = 20;
        }
        for (var i = 0; i < arrayObj.length; i++) {
            var $table = $("<table>").addClass("form_commonTable").attr("width", "100%");
            var domArray = arrayObj[i].domArray;
            for (var ni = 0; ni < domArray.length; ni++) {
                var $tr = $("<tr></tr>");
                for (var nj = 0; nj < domArray[ni].length; nj++) {
                    var obj = domArray[ni][nj];
                    if (obj) {
                        if (obj.label) {
                            var $th, $td;
                            $th = $("<th></th>").attr("width", "" + thwidth + "%");
                            var tdwidth = (100 / (12 / arrayObj[i].colArray[nj])).toFixed(2) - thwidth;
                            $td = $("<td></td>").attr("width", "" + tdwidth + "%");
                            /*if (arrayObj[i].colArray[nj] == minCol){
                             $td = $("<td></td>").attr("width",""+((arrayObj[i].colArray[nj]/12)*100*5/7).toFixed(2)+"%");
                             }else{
                             $td = $("<td></td>").attr("colspan",""+(arrayObj[i].colArray[nj]*2/minCol-1));
                             }*/
                            $th.append(obj.label+"：");
                            $td.append(obj.dom);
                            $th.appendTo($tr);
                            $td.appendTo($tr);
                        } else {
                            var tdwidth = (100 / (12 / arrayObj[i].colArray[nj])).toFixed(2);
                            var $td = $("<td></td>").attr("width", "" + tdwidth + "%").attr("colspan", "2");
                            //var $td = $("<td></td>").attr("colspan",""+(arrayObj[i].colArray[nj]*2/minCol));
                            $td.append(obj.dom);
                            $td.appendTo($tr);
                        }
                    } else {
                        var tdwidth = (100 / (12 / arrayObj[i].colArray[nj])).toFixed(2);
                        var $td = $("<td></td>").attr("width", "" + tdwidth + "%").attr("colspan", "2");
                        //var $td = $("<td></td>").attr("colspan",""+(arrayObj[i].colArray[nj]*2/minCol));
                        $td.appendTo($tr);
                    }
                }
                $tr.appendTo($table);
            }
            if (i != 0) {
                $table.attr("style", "margin-top: 0px;");
            }
            html += $table.prop('outerHTML');
        }
        // return $table.prop('outerHTML');
        return html;
    }
}