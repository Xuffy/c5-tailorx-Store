var forget = {
		//step1 
		imgVCode : $("#v-img-code2"),
		vImg : $("#v-img2"),
		step1:$("#step1"),
		step2:$("#step2"),
		step3:$("#step3"),
		btnSendMassageCode:$("#btnSendMassageCode"),
		btnBind:$("#btnBind"),
		iptMobile:$("#iptMobile"),
		btnNext:$("#btnNext"),
		vCodeMsg:$("#vCodeMsg"),
		//step2
		newPwd:$("#newPwd"),
		reNewPwd:$("#reNewPwd"),
		btnSubmit:$("#btnSubmit"),
		pwdm:$(".pwdm")
};

var imgCodes = "";

var SERVICE_FORGET = {
	event : function(){
		SERVICE_FORGET.initStep1();
	},
	initStep1:function(){
		//点击验证码
		forget.vImg.click(function(){
			SERVICE_FORGET.getImgCode();
		});
		//手机号,限制输入数字
//		forget.iptMobile.on("keydown keypress",function(e){
//             var k = window.event ? e.keyCode : e.which;
//             if ( ((k >= 48) && (k <= 57)) || ((k >= 96) && (k <= 105)) ||  k == 8 || k == 9 || k == 0) {
//                 return true;
//             }else {
//                 e.preventDefault();
//             }
//		});
		//手机号，焦点移出
		forget.iptMobile.on("blur",function(){
			var mobile=$.trim(forget.iptMobile.val());
			if(Util.isEmpty(mobile)){
				SERVICE_FORGET.textError(forget.iptMobile, "请输入您的手机号码");
				return false;
			}
			
			if(!JsUtil.isCellphone(mobile)){
				SERVICE_FORGET.textError(forget.iptMobile, "请输入正确的手机号码");
				return false;
			}
			if(SERVICE_FORGET.checkUserName(mobile,undefined)){
				return true;
			}else{
				return false;
			}
		});
		//密码
		forget.newPwd.on("blur",function(){
			var v=forget.newPwd.val();
			if(v && JsUtil.isUtouuPassword(v)){
				SERVICE_FORGET.textSuccess(forget.newPwd);
				var lv=SERVICE_FORGET.passwordStrength(v);
				forget.pwdm.removeClass("checked");
				forget.pwdm.eq(lv).addClass("checked");
				forget.pwdm.css("visibility","visible");
			}else{
				SERVICE_FORGET.textError(forget.newPwd,"请输入6-18位数字、字母、-、_组成的密码");
				forget.pwdm.removeClass("checked");
				forget.pwdm.css("visibility","hidden");
			}
		});
		//图片验证码
		forget.imgVCode.on("blur",function(){
			var v=$.trim(forget.imgVCode.val());
			if(!v ||v.length!=4){
				SERVICE_FORGET.textError(forget.imgVCode, "请输入4位有效图片验证码");
			}else{
				SERVICE_FORGET.textSuccess(forget.imgVCode);
			}
		});
		//发送短信验证码
		forget.btnSendMassageCode.on("click",function(){
			if(forget.btnSendMassageCode.hasClass("sended")){
                return false;
            }
			
			if(!forget.iptMobile.validate){
				SERVICE_FORGET.textError(forget.iptMobile, "请输入您的手机号码");
				return false;
			}
			if(!forget.newPwd.validate){
				SERVICE_FORGET.textError(forget.newPwd, "请输入您的新密码");
				return false;
			}
			if(!forget.imgVCode.validate){
				SERVICE_FORGET.textError(forget.imgVCode, "图片验证码");
				return false;
			}
			var param={
					time:forget.key,
					code:forget.imgVCode.val(), //图片验证码
					username:forget.iptMobile.val()
			};
			forget.btnSendMassageCode.clickFlag=true;
            SERVICE_FORGET.request.sendMessage(param);
		});
		//短信验证码
		forget.vCodeMsg.on("blur",function(){
			var v=$.trim(forget.vCodeMsg.val());
			if(forget.btnSendMassageCode.clickFlag){
				if( v && v.length==6){
					SERVICE_FORGET.textSuccess(forget.vCodeMsg);
				}else{
					SERVICE_FORGET.textError(forget.vCodeMsg, "请输入6位短信验证码");
				}
			}else {
				SERVICE_FORGET.textError(forget.vCodeMsg, "请发送短信验证码");
			}
		})
		//下一步
		forget.btnNext.on("click",function(){
			if(forget.imgVCode.validate && forget.newPwd.validate && forget.iptMobile.validate && forget.vCodeMsg.validate){
				/*if(forget.imgVCode.val() != imgCodes){
					SERVICE_FORGET.textError(forget.imgVCode, "验证码错误");
					return false;
				}*/
				var param ={
						mobile:$.trim(forget.iptMobile.val()),
						code:$.trim(forget.vCodeMsg.val())
					};
//				SERVICE_FORGET.request.checkMsgCode(param,function(rs){
//					if(rs.success){
//						forget.idenKey=rs.code;
//						forget.mobile=$.trim(forget.iptMobile.val());
//						forget.step1.remove();
//						forget.step2.show();
//						SERVICE_FORGET.initStep2();
						if(forget.newPwd.validate &&param.code && param.mobile){
							var param={
								username:param.mobile,
								smsCode:param.code,
								code:forget.imgVCode.val(), //图片验证码
								password:$.trim(forget.newPwd.val()),
								time:forget.key
							}
							
							SERVICE_FORGET.request.updatePwd(param,function(rs){
								if(rs.success){
									layer.msg("修改成功,请登录!");
									$(".imgCode").click();
									 $(".resetPwd").css("left","507px");
								}else{
									$.alert(rs.msg ||"服务器睡着了，请稍后重试！1","error");
								}
							});
						}
						
//					}else{
//
//						$.alert(rs.msg ||"服务器睡着了，请稍后重试！2","error");
//					}
					forget.btnNext.lock=false;
//				});
			}else{
				forget.iptMobile.blur();
				forget.imgVCode.blur();
				forget.vCodeMsg.blur();
			}
		});
		

//		forget.btnSubmit.on("click",function(){
//			
//		})
		
	},
	
	getImgCode : function(){
		var key = SERVICE_FORGET.getImgCodeKey();
		forget.vImg.attr("codes", key);
		forget.vImg.attr("src", headUrl.headUrl+"/v2/store/user/getImgCode?time="+key);
		forget.key=key;
	},
	getImgCodeKey : function(){
		var imgCode = Date.parse(new Date()) + Math.random();
		return imgCode;
	},
	getIcon:function(state){
		if(state){
			return $("<div class='tip-ico success'>");
		}else{
			return $("<div class='tip-ico error'>");
		}
	},
	//服务器端检查用户手机号是否存在
	checkUserName:function(username,success){
				SERVICE_FORGET.textSuccess(forget.iptMobile);
		/*$.post(ajaxURL.url_checkUserName+getTimeMark(),{"username":username},function(data){
			if(data && data.success==false){
				success && success();
			}else{
				SERVICE_FORGET.textError(forget.iptMobile, "手机号不存在，请重新输入");
			}
		},"json");*/
	},
	//文本框错误
	textError : function(ipt,text){
		ipt.icon && ipt.icon.remove();
		ipt.icon=SERVICE_FORGET.getIcon(0);
		ipt.parent().append(ipt.icon);
		ipt.validate=false;
		JsUtil.artDialogTooltip(ipt, text,'right',function(){
			ipt.icon && ipt.icon.remove();
			ipt.icon=undefined;
		});
	},
	//文本款正确
	textSuccess : function(ipt){
		ipt.icon && ipt.icon.remove();
		ipt.icon=SERVICE_FORGET.getIcon(1);
		ipt.parent().append(ipt.icon);
		ipt.validate=true;
	},
	passwordStrength:function(pwd){
		var lv = 0; 
		var len=pwd.length;
		if(len<=8){
			return lv;
		}
		var f1=f2=false;
		for (var i = 0; i < len; i++) {
			var char =pwd.charAt(i);
			if(pwd.match(/^[a-zA-Z0-9]/g)){f1=true;}
			if(pwd.match(/[-_]/g)){f2=true;}
		}
		if(f1 && f2){
			lv=2;
		}else{
			lv=1;
		}
		return lv;
	},
	request:{
		updatePwd:function(param,success){
			$.ajax({
                type:"post",
                url:ajaxURL.mod,
                data:param,
                dataType:"json",
                timeout:20000,
                beforSend:function(){
                	forget.btnSubmit.lock=true;
                },
                success:success,
                error:function(){
					$.alert("服务器睡着了，请稍后重试！3","error");
                },
				complete:function(xhr,status){
					forget.btnSubmit.lock=false;
					if(status=="timeout"){
						$.alert("服务器睡着了，请稍后重试！4","error");
					}
				}
            });
		},
		sendMessage:function(param){
			$.post(ajaxURL.vcodeSendUrl,param,function(data){
                if(data.success == true){
                	imgCodes = param.imgVCode;
                	$.alert(data.msg,"success");
                	
                	var k=60;
                    forget.btnSendMassageCode.addClass("sended").text("("+k+"秒)后重新获取");
                    //60秒倒计时
                    var t2=setInterval(function(){
                    	forget.btnSendMassageCode.text("("+(--k)+"秒)后重新获取");
                        if(k<=0){     //重置
                        	forget.btnSendMassageCode.text("获取验证码");
                        	forget.btnSendMassageCode.removeClass("sended");
                            clearInterval(t2);
                        }
                    },1000);
                }else{
                	imgCodes = "";
            		forget.vImg.click();
                    $.alert(data.msg,"error");
                }
            },"json");
		}
		/*,
		checkMsgCode:function(param,success){
			$.ajax({
                type:"post",
                url:ajaxURL.checkMessageCode,
                data:param,
                dataType:"json",
                timeout:20000,
                beforSend:function(){
                	forget.btnNext.lock=true;
                },
                success:success,
                error:function(){
					$.alert("服务器睡着了，请稍后重试！5","error");
                },
				complete:function(xhr,status){
					forget.btnNext.lock=false;
					if(status=="timeout"){
						$.alert("服务器睡着了，请稍后重试！6","error");
					}
				}
            });
		}*/
	}
};
var ajaxURL = {
		/*url_getImgCode : headUrl.headUrl + "/v2/mng/user/forgetSmsCode",//图片验证码*/
		/*url_checkImgCode : "https://passport.utouu.com/register/checkImgCode?time=",*/
		/*url_checkUserName : "https://passport.utouu.com/register/checkUserName?time=",*/
		vcodeSendUrl:headUrl.headUrl + "/v2/store/user/forgetSmsCode",//短信验证码
		/*checkMessageCode:"https://passport.utouu.com/forget/check-sms-vcode",*/
		mod:headUrl.headUrl + "/v2/store/user/forget-pwd"
};
var Util = {
	//是否空
	isEmpty : function(str){
		return str == undefined || str.replace(" ","").length < 1;
	}
};

/**
 * 获取时间戳
 */
var getTimeMark = function(){
	return new Date().getTime();
};
/**弹出提示信息*/
function Tip(text){
    setTimeout(function(){
        var body=$(document.body);
        var pup=$("<div class='pup tip'></div>").append($("<div class='content'></div>").text(text));
        body.append(pup);
        pup.fadeIn(300);
        setTimeout(function(){
            pup.fadeOut(300);
            setTimeout(function(){pup.remove()},500);
        },2000)
    },0);
}

$(document).ready(function(){
	SERVICE_FORGET.event();
	SERVICE_FORGET.getImgCode();
});