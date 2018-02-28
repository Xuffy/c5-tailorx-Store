layer.close(loading);

//经度
var longitude ;
//纬度
var latitude  ;
$.ajax({
    type:"POST",
    url:headUrl.headUrl + "/v2/store/myStore/store",
    dataType:'json',
    data:{},
    async: false,
    success:function(res){
        if(res.success) {
            //三级联动
            initLocation({
                sheng_val: res.data.province,
                shi_val: res.data.city,
                xian_val: res.data.district,
                xiang_val: "<?php echo $v['street']?>"
            });
            $("#jiedao").val(res.data.street);
            $("#storeName").val(res.data.name);
            $("#phone").val(res.data.phone);
            $("#introduce").val(res.data.introduce);
            longitude = res.data.longitude;
            latitude = res.data.latitude;
            $("#storeid").val(res.data.id);
            $("#holidays").val(res.data.holidays);
            if (res.data.status == 1) {
                $("input[name='storeStatus']").get(0).checked = true;
            } else {
                $("input[name='storeStatus']").get(1).checked = true;
            }
        }else{
            layer.msg(res.msg);
        }

    },
    error:function(){
    layer.close(loading);
    layer.msg("服务器出错!");
    }
});

if(!longitude) longitude =121.436525;
if(!latitude) latitude =31.188523;
var holidays = $("#holidays").val();
var plus = [],minus=[];//新增的/减少的
var map;//地图
var lng,lat;

if (!!window.ActiveXObject || "ActiveXObject" in window){
    //如果是IE

}

function nextStep(){
    loading = layer.load(2);
    //$(".loadPage")[0].click();
    location.href = "../../modules/store/storeDecorate.html";
}
$(function(){
    //日历
    var calendarObj = {};
    var getObj = {};

    function calendar(date){
        var now = new Date();
        $(".multiple").pickmeup({
            flat:true,
            date:date,
            format:"20y-m-d",
            mode:"multiple",
            render:function(day){
//					if(day.getFullYear() != now.getFullYear() || day.getMonth() != now.getMonth()){
//						return {disabled:true}
//					}

                if(day.getFullYear() == now.getFullYear() && day.getMonth() == now.getMonth() && day.getDate() == now.getDate()){
                    return {disabled:true,class_name:"today"}
                }
                if(day < now){
                    return {disabled:true}
                }

            },
            change:function(e){
                if(e.length){
                    calendarObj[e[0].slice(0,7)] = e;
                }else{
                    calendarObj = {};
                }
            },
            showDate:function(e){
                var date = new Date(e);
                var year = date.getFullYear();
                var month = date.getMonth() + 1 + "";

                if(month.length == 1) month = "0"+ month;
                findHoliday({date:year+"-"+month+"-01"});
                return true;


            }
        });
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1 + "";

    if(month.length == 1) month = "0"+ month;
    findHoliday({date:year+"-"+month+"-01"});

    //查询某年某月假日 data : yyyy-MM-dd
    function findHoliday(data){
        $.ajax({
            url : headUrl.headUrl + "/v2/store/myStore/holiday",
            type : "post",
            data : data,
            dataType : "json",
            success : function(result) {
                if (result.success) {
                    $("#refresh").html('<div class="multiple"></div>');
                    var time = data.date.slice(0,7);
                    var timeArr = [];
                    if(result.data){
                        var arr = result.data.split(",");
                        //保存传过来的数组
                        saveData(arr);
                        if(calendarObj[time] && calendarObj[time].length){
                            timeArr = unique(calendarObj[time],arr);
                            calendarObj[time] = timeArr;
                        }else{
                            timeArr = arr;
                            calendarObj[time] = arr;
                        }

                        var newArr =[];
                        $.each(timeArr,function(i,value){
                            newArr.push(new Date(value));
                        });
                        calendar(newArr);
                    }else{
                        if(calendarObj[time] && calendarObj[time].length){

                            var newArr = [];
                            $.each(calendarObj[time],function(i,value){
                                newArr.push(new Date(value));
                            });
                            calendar(newArr);
                        }else{
                            calendar([new Date(data.date)]);
                            $(".multiple .pmu-selected").removeClass("pmu-disabled").click();
                        }

                    }

                } else {
                    layer.msg("查询该月假日失败"+result.errorMsg);
                }
            },
            error : function(xhr,textStatus) {

                if(xhr.status == 0) {
                    layer.msg("网络异常");
                }else {
                    layer.msg("服务器出错了");
                }
            }
        });
    }
    //保存传过来的数组
    function saveData(data){
        var time = data[0].slice(0,7);
        if(getObj[time] && getObj[time].length){

        }else{
            getObj[time] = data;
        }
    }
    //返回日历格式
    function format(date,num){
        var time = new Date(date);
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var arr = [year,month,day,"" + year+"-"+month+"-"+day];
        return arr[num];
    }
    //两个数组去重
    function unique(arr1,arr2){
        var newArr = arr1;
        for(var i = 0,len = arr2.length;i < len;i++){
            if(newArr.indexOf(arr2[i]) == -1) newArr.push(arr2[i]);
        }
        return newArr;
    }

    //地址输入框清空事件
    $("#sheng").change(function(){
        if($("#jiedao").val()) $("#jiedao").val("");
    });

    //编辑事件
    $("#editBtn").click(function(){

        $("#next-step").attr("disabled",true);
        $("#next-step").attr("class","grey ut-btn  w-160 next-step");
        $(".baseInfo").attr("disabled",false);
        $(this).hide();
        $("#saveBtn").show();
        $("#cancelBtn").show();
        $("#blank").hide();

    });
    //取消事件
    $("#cancelBtn").click(function(){
        // $("#store").load(headUrl.headUrl + "/v2/store/myStore/store");
        location.href = "../../modules/store/storeInfo.html";
        $(".next-step").attr("disabled",false);
        $(".next-step").css("backgroundColor","#2baf2b");
        $(".baseInfo").attr("disabled",true);
        $(this).hide();
        $("#saveBtn").hide();
        $("#editBtn").show();
        $("#blank").show();

    });

    //保存事件
    $("#saveBtn").click(function(){

        //数据校验
        if(!check()) return;
       /* var filt = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        if(!filt.test($("#phone").val())) return;*/
        

        //获取日历信息
        var newHoliday = "",oldHoliday = "";
        for(var key in calendarObj){
            $.each(calendarObj[key],function(i,value){
                newHoliday += value + ",";
            })
        }
        for(var key in getObj){
            $.each(getObj[key],function(i,value){
                oldHoliday += value + ",";
            })
        }

        longitude = !lng ? longitude : lng;
        latitude = !lat ? latitude : lat;

        $('#certain').click();

        //验证成功之后
        $(".next-step").attr("disabled",false);
        $(".baseInfo").attr("disabled",true);
        $(".next-step").css("backgroundColor","#2baf2b");
        $(this).hide();
        $("#saveBtn").hide();
        $("#cancelBtn").hide();
        $("#editBtn").show();
        $("#blank").show();
        //保存数据
        var data = {
            id:$("#storeid").val(),//门店id
            name:$("#storeName").val(),
            phone:$("#phone").val(),
            province:$("#sheng").val(),
            city:$("#shi").val(),
            district:$("#xian").val(),
            street:$("#jiedao").val(),
            introduce:$("#introduce").val().trim() ==""?"":$("#introduce").val().trim(),
            longitude:longitude,
            latitude:latitude,
            status:$('input:radio[name="storeStatus"]:checked').val(),
            newHoliday:newHoliday.substring(0,newHoliday.length-1),
            oldHoliday:oldHoliday.substring(0,oldHoliday.length-1)
        };
        loading = layer.load(2);
        saveInfo(data);
    });

    //生成地图
    map = new AMap.Map("mapBox",{
        resizeEnable:true,
        zoom:10,
        center:[longitude,latitude]
    });
    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
        function(){
            map.addControl(new AMap.ToolBar());

            map.addControl(new AMap.Scale());

            map.addControl(new AMap.OverView({isOpen:true}));
        });
    var marker =new AMap.Marker({
        map: map,
        position: [longitude, latitude]
    });
    var geocoder;
    AMap.service('AMap.Geocoder',function(){
        geocoder = new AMap.Geocoder();
    });
    //根据文本框输入动态选择城市 /获取输入城市经纬度
    AMap.event.addDomListener(document.getElementById('certain'), 'click', function() {
        var provinceName = document.getElementById('sheng').value;
        var cityName = document.getElementById('shi').value;
        var countryName = document.getElementById('xian').value;
        var street = document.getElementById('jiedao').value;

        var str = provinceName + cityName + countryName + street;
        geocoder.getLocation(str,function(status,result){
            var code = result.geocodes[0].adcode;
            //经度
            lng = result.geocodes[0].location.lng;
            //纬度
            lat = result.geocodes[0].location.lat;
            marker.setPosition([lng,lat]);



            //市没有选择就使用输入的地址进行定位，因为经纬度定位是使用的市区，如果没有选择会报错
            if($("#shi").val()==""){
                map.setCity(str);
            }else if(lng == undefined && lat == undefined){
                map.setCenter([longitude,latitude]);
            }else{
                map.setCenter([lng,lat]);
            }
        });

    });


    function Appendzero(obj)
    {
        if(obj<10) return "0" +""+ obj;
        else return obj;
    }





});


//保存功能
function saveInfo(data){
    $.ajax({
        url : headUrl.headUrl + "/v2/store/myStore/updateStore",
        type : "post",
        data : data,
        dataType : "json",
        success : function(result) {
            layer.close(loading);
            if (result.success) {
                layer.msg("保存成功");
                $(".next-step").attr("disabled",false);
            } else {
                layer.msg(result.msg);
            }
        },
        error : function(xhr,textStatus) {
            layer.close(loading);
            if(xhr.status == 0) {
                layer.msg("网络异常");
            }else {
                layer.msg("服务器出错了");
            }
        }
    });
}

//数据验证
function check(){
    if($("#sheng").val()==""){
        //省
        layer.msg("省份没有选择");
        return false;
    }
    if($("#shi").val()==""){
        //市
        layer.msg("市区没有选择");
        return false;
    }
    if($("#xian").val() == ""){
        //县
        layer.msg("县级没有选择");
        return false;
    }
    if($("#jiedao").val().trim() == ""){
        //街道
        layer.msg("街道没有输入");
        return false;
    }
    if($("#storeName").val()==null||$("#storeName").val().trim()==""){
        //门店名 需要正则验证
        layer.msg("门店名称不能为空");
        return false;
    }
    if($("#storeName").val().length>15){
        //门店名 需要正则验证
        layer.msg("门店名称不能超过15个字符");
        return false;
    }
    if(!(/^1\d{10}$/.test($("#phone").val().trim()) || /^0\d{2,3}-?\d{7,8}$/.test($("#phone").val().trim()))){
        //正则验证手机号和座机号
        layer.msg("输入电话号码不合法")
        return false;
    }
  
   /* if($("#phone").val().trim().length>11||$("#phone").val().trim().length<7){
        //电话号码 需要正则验证
        layer.msg("输入正确的电话号码");
        return false;
    }*/

    if(!$("#introduce").val().trim()){
        layer.msg("请输入门店介绍");
        return false;
    }
    return true;
}

