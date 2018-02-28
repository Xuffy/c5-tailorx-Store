var loading;
var TICKET =null;

var checkMsg=true;
var loadNumber=0;
(function($){  
    //首先备份下jquery的ajax方法  
    var _ajax=$.ajax;  
       
    //重写jquery的ajax方法  
    $.ajax=function(opt){  
        //备份opt中error和success方法  
        var fn = {  
            error:function(XMLHttpRequest, textStatus, errorThrown){},  
            success:function(data, textStatus){}  
        }  
        if(opt.error){  
            fn.error=opt.error;  
        }  
        if(opt.success){  
            fn.success=opt.success;  
        }  
           
        //扩展增强处理  
        var _opt = $.extend(opt,{  
            error:function(XMLHttpRequest, textStatus, errorThrown){
            	layer.close(loading);
            	layer.msg("网络异常，请稍后再试！");
                //错误方法增强处理  
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },  
            success:function(data, textStatus){
            	if(typeof data!="object"&&isJson(data)){
            		data = JSON.parse(data); 
            	}
            	if(!data.success){
            		if(data.code=='501'||data.code=='417'){
            			loadNumber=0;
            			layer.close(loading);
            			if(checkMsg){
            				checkMsg=false;
            				layer.msg(data.msg);
            				sessionStorage.setItem('tailorx-location-herf', window.location.href);
            				setTimeout(function(){
								window.location.href="modules/tx-login/login.html";
							},500);
            			}
						return false;
            		}
            	}
            	loadNumber--;
            	if(loadNumber==0){
	            	layer.close(loading);
            	}
        		//成功回调方法增强处理  
            	fn.success(data, textStatus);
            	checkMsg=true;
            },  
            beforeSend:function(XHR){
            	if(loadNumber==0){
	            	loading = layer.load(2);
            	}
	            loadNumber++;
            	var TICKET=localStorage.getItem('tailorx-ticket');
				if(TICKET==null&&opt.url!=headUrl.headIp + headUrl.headPort + "/v2/mng/user/login"){
						if(checkMsg){
	            			checkMsg=false;
	            			layer.msg('请登录！');
	            			sessionStorage.setItem('tailorx-location-herf', window.location.href);
	            			setTimeout(function(){
									window.location.href="modules/tx-login/login.html";
							},500);
	            		}
						return false;
					}
				XHR.setRequestHeader('utouu-open-client-ticket',TICKET,true);
				
                //提交前回调方法  
//              $('body').append("<div id='ajaxInfo' style=''>正在加载,请稍后...</div>");  
            },  
            complete:function(XHR, TS){  
                //请求完成后回调函数 (请求成功或失败之后均调用)。  
//              $("#ajaxInfo").remove();
            }  
        });  
        return _ajax(_opt);  
    }; 
})(jQuery);
function isJson(obj){
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}
if(localStorage.getItem('tailorx-user')){
	var user= JSON.parse(localStorage.getItem('tailorx-user'));
	$('.tailorx-user-name').before("<div class='merchant-msg'><img src='"+(user.photo==null?"img/temp.png":user.photo)+"'/></div>");
	$(".tailorx-user-name").html(user.nickName+'<i class="fa fa-sort-desc ut-pointer" id="sort-name"></i>');
}
function replace(doc){
	doc.value=doc.value.replace(/\D/g,'');
}

$('#sort-name').on('click', function() {
	$('.merchant-userName').removeClass('ut-none');
});
$('.merchant-userName').on('mouseover', function() {
//	$(this).removeClass('ut-none');
});
$('.merchant-userName').on('mouseout', function() {
	$(this).addClass('ut-none');
});
$('#merchant-out').on('click',function(){
	$.ajax({
		type:"get",
		url:headUrl.headUrl + "/v2/mng/user/logout",
		dataType:'json',
		data:{},
		async:true,
		success:function(res){
			localStorage.removeItem('tailorx-ticket');
			window.location.href="modules/tx-login/login.html";
		}
	});
})
$('#merchant-PassAgain').on('click',function(){
	$('#layer-pass').load('modules/tx-login/indexAccount.html').css('display','block');
})
