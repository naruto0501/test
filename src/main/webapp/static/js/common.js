/**
 * 
 */

$.fn.serializeObject = function()    
{    
   var o = {};    
   var a = this.serializeArray();    
   $.each(a, function() {    
       if (o[this.name]) {    
           if (!o[this.name].push) {    
               o[this.name] = [o[this.name]];    
           }    
           o[this.name].push(this.value || '');    
       } else {    
           o[this.name] = this.value || '';    
       }    
   });    
   return o;    
};  

$.fn.setform = function (jsonValue) {
    var obj = this;
    $.each(jsonValue, function (name, ival) {
        var $oinput = obj.find("input[name='" + name + "']");
        if ($oinput.attr("type")== "radio" || $oinput.attr("type")== "checkbox") {
           $oinput.each(function(){
             if($(this).val()==ival)
                $(this).attr("checked", "checked");
           });
        }
        else
        {
          obj.find("[name="+name+"]").val(ival); 
         }
    });
};

function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
}  