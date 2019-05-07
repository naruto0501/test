(function($){

    $.fn.validateJqGrid = function(method){
        var _arguments = arguments;
        var _this = this;
        if (typeof method == 'string') {
            var flag = true;
            this.each(function () {
                if ($.fn.validateJqGrid.methods[method]($(this), _arguments)==false){
                    flag = false;
                    return false;
                }
            });
            return flag;
        }
    };

    $.fn.validateJqGrid.methods = {
        /**
         * 添加校验方法
         * @param target
         * @param param 传参为colname,rules，其中rule可以为以逗号隔开的校验名称，或者数组
         */
        addValidate:function(target,param){
            var colname = param[1],rules = param[2],rulepara=param[3]||"";
            if (rules == null || rules == "" || rules == "undefined"){
                return;
            }
            var ruleparaArray = null;
            if (typeof rulepara == 'string') {
                ruleparaArray = rulepara.split(",");
            }else if (typeof rulepara == 'object'){
                ruleparaArray = rulepara;
            }else{
                ruleparaArray = [];
            }
            var ruleArray = [];
            if (typeof rules=='string'){
                ruleArray = rules.split(",");
            }else if (isArray(rules)){
                ruleArray = rules;
            }else{
                return;
            }
            if (ruleparaArray!="" && ruleArray.length>1){
                console.error("jqgrid添加校验方法错误，如果校验包含自定参数，只能逐条添加！");
                return;
            }
            var validateCols = target.data('validateCol');
            var col = {};
            for (var i=ruleArray.length;i>0;i--){
                var ruleobj = {};
                var ruleName = ruleArray[i-1];
                ruleobj[ruleName]= {func:$.fn.validateJqGrid.rules[ruleName],param:ruleparaArray};
                col[colname] = ruleobj;
                if ($.fn.validateJqGrid.validtorinit.hasOwnProperty(ruleName)){
                    $.fn.validateJqGrid.validtorinit[ruleName](target,colname,"add");
                }
            }

            if (validateCols) {
                if (validateCols[colname]){
                    $.extend(validateCols[colname], col[colname]);
                }else{
                    validateCols[colname] = col[colname];
                }

            }else{
                target.data('validateCol',col);
            }
        },

        /**
         * 清除校验
         * @param target
         * @param param 传参为colname,rules，其中rule可以为以逗号隔开的校验名称，或者数组
         */
        deleteValidate:function(target,param){
            var colname = param[1],rules = param[2];
            if (rules == null || rules == "" || rules == "undefined"){
                return;
            }
            var ruleArray = [];
            if (typeof rules=='string'){
                ruleArray = rules.split(",");
            }else if (isArray(rules)){
                ruleArray = rules;
            }else{
                return;
            }
            var validateCols = target.data('validateCol');
            if (validateCols && validateCols.hasOwnProperty(colname)){
                for (var i=0;i<ruleArray.length;i++){
                    delete validateCols[colname][ruleArray[i]];
                    if ($.fn.validateJqGrid.validtorinit.hasOwnProperty(ruleArray[i])){
                        $.fn.validateJqGrid.validtorinit[ruleArray[i]](target,colname,"delete");
                    }
                }

            }
        },

        /**
         * 验证调用
         * @param target
         * @returns {boolean}
         */
        validate:function(target){
            var datas = target.jqGrid('getRowData');
            var validateCols = target.data('validateCol');
            var countCols = 0;
            for (var col in validateCols) {
                if (validateCols[col]['required']) {
                    countCols++;
                }
            }
            if (datas.length ==0 && countCols>0){
                layer.msg("子表数据必填，请检查！");
                return false;
            }
            for (var i=0;i<datas.length;i++){
                var data = datas[i];
                for (var col in validateCols) {
                    if (data.hasOwnProperty(col)){
                        var value = data[col];
                        var name = target.getColProp(col).label;
                        for (var valid in validateCols[col]){
                            if (typeof validateCols[col][valid].func == 'function'){
                                var validvalue = validateCols[col][valid].func(name,value,validateCols[col][valid].param);
                                if (!validvalue[0]){
                                    layer.msg(validvalue[1]);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

        }
    };

    /**
     * 定义的校验方法，用户可以通过 $.extend($.fn.validateJqGrid.rules, {})来进行扩展
     * 检验方法最后返回数组[校验结果,提示信息]
     */
    $.fn.validateJqGrid.rules = {
        required: function(name,value,param){
            value = CHBlank(value).trim();
            if (value==null||value==""||value=="undefined"){
                return [false,"["+name+"]不能为空！"];
            }else{
                return [true,''];
            }
        },

        maxlength: function(name,value,param){
            value = value||"";
            var maxlength = param.maxlength;
            var length = getLength(CHBlank(value).trim());
            if (length>maxlength){
                return [false,"["+name+"]中信息过长，最大长度为"+maxlength+"！"];
            }else{
                return [true,''];
            }
        }
    };

    $.fn.validateJqGrid.validtorinit = {
        required: function(target,colname,type){
            var col = target.getColProp(colname);
            var colVisible = target.getColProp(colname+"Name");
            if (type == "add"){
                target.setLabel(colname,"<font color='red'>*</font>"+col.label);
                if (colVisible.hasOwnProperty("label")){
                    target.setLabel(colname+"Name","<font color='red'>*</font>"+colVisible.label);
                }

            }else if(type == "delete"){
                if (colVisible.hasOwnProperty("label")){
                    target.setLabel(colname+"Name",colVisible.label.replace("<font color='red'>*</font>",""));
                }
                target.setLabel(colname,col.label.replace("<font color='red'>*</font>",""));

            }
        }
    };

    function CHBlank(value) {
        return value.replace("/(\s|\ \;|　|\xc2\xa0)/","");
    }
    function isArray(obj) {
        return typeof obj == 'object' && obj.constructor == Array;
    }
    function getLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，再计算长度
    }
})(jQuery);