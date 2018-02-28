var account = {
	time: 60,
	timer: null,
	init: function() {
		account.cancel();
		if(localStorage.getItem('tailorx-user')) {
			var user = JSON.parse(localStorage.getItem('tailorx-user'));
			$("#account-username").val(user.userName);
		}
		account.loading();
		account.accountSub();
	},
//	加载
    loading:function(){
    	/*$('#index-loading').before("<div id='layer-pass' class='ut-none'></div>")*/
    },
	cancel: function() {
		$('#cancel-layerBtn').off("click");
		$('#cancel-layerBtn').on('click', function() {
			$('#layer-pass').css('display', 'none');
		})
	},
	//重置密码 获取验证码
	verificatio: function() {
		$('.getCode').off('click');
		account.msgAjax();
	},
	msgAjax: function() {
		//		var time = 60;
		//		var timer = null;
		$('.getCode').html(account.time + 's后重新获取');
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v2/store/user/sendSmsCode",
			dataType: "json",
			async: true,
			success: function(res) {
				if(res.success) {
					account.timer = setInterval(function() {
						account.time--;
						$('.getCode').html(account.time + 's后冲重新获取');
						if(account.time <= 0) {
							$('.getCode').click(function() {
								$('.getCode').off('click');
								account.msgAjax();
							});
							$('.getCode').html('获取验证码');
							clearInterval(account.timer);
							account.time = 60;
						}
					}, 1000);
					layer.msg(res.msg);
				} else {
					$('.getCode').click(function() {
						$('.getCode').off("click");
						account.msgAjax();
					});
					account.time = 60;
					$('.getCode').html('获取验证码')
					layer.msg(res.msg);
				}
			},error:function(){
				account.time = 60;
				alert(1);
			}
		});
	},
	//	确认修改
	accountSub: function() {
		$('#account-submit').on('click', function() {
			var phone = $("#account-username").val();
			var once = $("#oncePassWord").val();
			var second = $("#secondPassWord").val();
			var downCode = $("#downCode").val();
			if(!once) {
				return layer.msg('请输入密码');
			}
			if(!second) {
				return layer.msg('请输入确认密码');
			}
			if(once != second) {
				return layer.msg('密码不一致');
			}
			if(!downCode || downCode.length != 6) {
				return layer.msg('验证码必须为六位');
			}
			var data = {};
			data.username = phone;
			data.password = second;
			data.smsCode = downCode;
			$.ajax({
				url: headUrl.headUrl + "/v2/store/user/updatePassword",
				data: data,
				type: "post",
				dataType: 'json',
				success: function(res) {
					if(res.success) {
						layer.msg("修改成功！");
						$("#oncePassWord").val('');
						$("#secondPassWord").val('');
						$("#downCode").val('');
						$('#layer-pass').css('display', 'none');
						$('.getCode').html('获取验证码');
						clearInterval(account.timer);
						time = 60;
					} else {
						layer.msg(res.msg);
					}
				}
			});
		});
	}
}
