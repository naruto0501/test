var calculator = {
    value : [],
    valuetext:[],
    collist:[],
    addCollist:function(value){
        for(var i = 0, len=this.collist.length; i < len; i++) {
            if (this.collist[i] == value){
                return;
            }
        }
        this.collist.push(value);
    },
    delCollist:function(value){
        for(var i = 0, len=this.collist.length; i < len; i++) {
            if (this.collist[i] == value){
                this.collist.splice(i, 1);
                return;
            }
        }
    }
};

function drawListArea(colName,targetDomId,doms) {
    $("#list_area").html("");
    var targetDomId = targetDomId || colName;
    for (var dom in doms) {
        if (dom != "clone") {
            var data = doms[dom];
            if (doms[dom].hasOwnProperty("data")){
                data = doms[dom].data;
            }
            if (data.colType != "NUMBER") {
                continue;
            }

                var domId = data.domId || data.colName;
                if (domId == targetDomId) {
                    continue;
                }
                var item = $('<li id="' + domId + '" title="' + data.colLabel + '" class="item-list"></li>');
                item.append('<span class="item-title">' + data.colLabel + "[" + domId + ']</span>');

                item.click(function () {
                    clickVar(this);
                }).hover(function () {
                    $(this).addClass("hover");
                }, function () {
                    $(this).removeClass("hover");
                });
                $("#list_area").append(item);
            }

        }

}

function clickCalculator(index){
    $("#sortable").find("li").click(function(){
        var value = $(this).attr("_value");
        if (value != "backspace") {
            var temp = calculator.value[calculator.value.length-1] || "";
            if(!validateClick(temp,value)){
                return false;
            }
            calculator.value.push(value);
            calculator.valuetext.push($(this).html());
        }else{
            var delvalue = calculator.value.pop();
            calculator.valuetext.pop();
            calculator.delCollist(delvalue);
        }
        drawResult();
    });
}

function clickVar(obj){
    var temp = calculator.value[calculator.value.length-1] || "";
    var domId = $(obj).attr("id");
    if(!validateClickVar(temp,domId)){
        return false;
    }
    var label = $(obj).attr("title");
    calculator.value.push(domId);
    calculator.valuetext.push(label);
    calculator.addCollist(domId);
    drawResult();
}

function drawResult(){
    $(".display-area").html("");
    for(var i = 0, len=calculator.valuetext.length; i < len; i++) {
        var item = $('<li index="'+i+'" contenteditable="false">'+calculator.valuetext[i]+'</li>');
        $(".display-area").append(item);
    }

}

function commitForm(){
    if (!validateCommit()){
        return false;
    }
    var obj = {
        calculateValue:JSON.stringify(calculator.value),
        calculateCol:JSON.stringify(calculator.collist),
        calculateText:JSON.stringify(calculator.valuetext)
    };

    return obj;
}


function validateCommit(){
    //规则1 最后一个值必须是数字、变量、右括号
    var lastValue = calculator.value[calculator.value.length-1]||"";
    var reg = new RegExp("^[0-9]*$");
    if (!reg.test(lastValue) && lastValue!=")"&& !isInArray(calculator.collist, lastValue)){
        layer.alert('结尾必须是数字、变量、右括号！', {
                icon: 7,
                area: ['400px', ''], //宽高
                closeBtn: 0
            }
        );
        return false;
    }

    //规则2 左括号和右括号数量需要相同
    var countleft=0,countright=0;
    for(var i = 0, len=calculator.value.length; i < len; i++) {
        if (calculator.value[i] == "("){
            countleft++;
        }
        if (calculator.value[i] == ")"){
            countright++;
        }
    }
    if (countleft!=countright){
        layer.alert('左右括号不匹配！', {
                icon: 7,
                area: ['400px', ''], //宽高
                closeBtn: 0
            }
        );
        return false;
    }
    return true;
}

function validateClick(prevalue, value) {
    //规则1 开头不能是运算符、小数点、右括号
    if (prevalue == ""){
        var reg = RegExp(/[\+\-\*\/\)\.]/);
        if (reg.test(value)) {
            return false;
        }
    }
    //规则2 不允许右括号后面直接接数字、小数点
    if (prevalue == ")") {
        var reg = new RegExp("^[0-9]*$");
        if (reg.test(value) || "." == value) {
            return false;
        }

    }
    //规则3 不允许运算符，小数点，左括号后面接运算符、小数点、右括号
    var prereg = RegExp(/[\+\-\*\/\(\.]/);
    if (prereg.test(prevalue)){
        var reg = new RegExp(/[\+\-\*\/\)\.]/);
        if (reg.test(value)) {
            return false;
        }
    }
    //规则4  左括号前面不能接右括号、数字、变量、小数点
    if (value == "(" && prevalue != ""){
        var reg = new RegExp("^[0-9]*$");
        if (reg.test(prevalue) || "." == prevalue || ")" == prevalue) {
            return false;
        }

        if (isInArray(calculator.collist, prevalue)) {
            return false;
        }
    }
    //规则5 变量后面不能接数字、小数点
    if (isInArray(calculator.collist, prevalue)){
        var reg = new RegExp("^[0-9]*$");
        if (reg.test(value) || "." == value) {
            return false;
        }
    }


    return true;

}

function validateClickVar(prevalue, value) {

    //规则1 不允许右括号后面直接接变量
    if (prevalue == ")") {

        if (isInArray(calculator.collist, value)) {
            return false;
        }
    }

    //规则2 变量后面不能接变量
    if (isInArray(calculator.collist, prevalue)){

        if (isInArray(calculator.collist, value)) {
            return false;
        }
    }

    //规则6 变量前面不能接数字、变量、小数点
    if (isInArray(calculator.collist, value)){
        var reg = new RegExp("^[0-9]*$");
        if (reg.test(prevalue) || "." == prevalue) {
            return false;
        }

        if (isInArray(calculator.collist, prevalue)) {
            return false;
        }
    }

    return true;

}

function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

function setCalculator(calculateValue,calculateCol,calculateText,colName,doms){
    if (calculateValue !=null && calculateValue!="" && calculateValue!=undefined){
        calculator.value = $.parseJSON(calculateValue);
    }
    if (calculateCol !=null && calculateCol!="" && calculateCol!=undefined){
        calculator.collist = $.parseJSON(calculateCol);
    }
    if (calculateText !=null && calculateText!="" && calculateText!=undefined){
        calculator.valuetext = $.parseJSON(calculateText);
    }
    drawListArea(colName,"",doms);
    drawResult();
}

$(document).ready(function(){
    var calculateValue = $('#calculateValue', window.parent.document).val();
    var calculateCol = $('#calculateCol', window.parent.document).val();
    var calculateText = $('#calculateText', window.parent.document).val();
    if (calculateValue !=null && calculateValue!="" && calculateValue!=undefined){
        calculator.value = $.parseJSON(calculateValue);
    }
    if (calculateCol !=null && calculateCol!="" && calculateCol!=undefined){
        calculator.collist = $.parseJSON(calculateCol);
    }
    if (calculateText !=null && calculateText!="" && calculateText!=undefined){
        calculator.valuetext = $.parseJSON(calculateText);
    }
    var colName = $('#colName', window.parent.document).val();
    var targetDomId = $('#domId', window.parent.document).val() || colName;
    var doms = parent.editorUtil.getTableDbDomAttr();
    drawListArea(colName,targetDomId,doms);
    clickCalculator();
    drawResult();
});