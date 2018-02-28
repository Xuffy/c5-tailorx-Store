var orderNo = sessionStorage.getItem('tailorx-measurebody-orderNo');
var customerId = sessionStorage.getItem('tailorx-measurebody-customerId');
var enter = sessionStorage.getItem('tailorx-measurebody-enter');
sessionStorage.setItem('orderEditBody', window.location.href);
var orderMeasurebody = {
	init: function() {
		this.initOrderMes();
	},
	//初始化查询
	customerLabelId: '',
	initOrderMes: function() {
		if(enter == 1) {
			$.ajax({
				type: "POST",
				url: headUrl.headUrl + "/v3/store/order/getCustomerBodyQuickEntry",
				dataType: "json",
				data: {
					customerId: customerId,
					orderNo:orderNo
				},
				success: function(res) {
					if(res.success) {
						orderMeasurebody.successAjax(res);
					} else {
						layer.msg(res.msg, {
							offset: '50%'
						})
					}
				}
			});
		} else {
			$.ajax({
				type: "POST",
				url: headUrl.headUrl + "/v3/store/order/findCustomerBodyData",
				dataType: "json",
				data: {
					customerId: customerId
				},
				success: function(res) {
					if(res.success) {
						orderMeasurebody.successAjax(res);
					} else {
						layer.msg(res.msg, {
							offset: '50%'
						})
					}
				}
			});
		}
	},
	successAjax: function(res) {
		orderMeasurebody.uploadEvent();
		var data = res.data;
		$('.num-body').html('');
		var html = "";
		$.each(data.customerBodyList, function(i, value) {
			if(i % 2 == 0) {
				html += '<tr>';
			}
			if(enter == 1) {
				html += '<td>' + value.labelName + '</td><td><input type="text" data-id="' + value.labelId + '" value="' + value.strSize + '" readonly/></td>';
			} else {

				html += '<td>' + value.labelName + '</td><td><input type="text" data-id="' + value.labelId + '" value="' + value.strSize + '" /></td>';
			}
			if(i % 2 != 0) {
				html += '</tr>';
			}
			//					}
		})
		$('.num-body').html(html);
		//单选
		if(data.customerLabel.tightness != 0) {
			var str = data.customerLabel.tightness;
			var tightnessStr = '';
			var tightnessArr = [];
			for(var i = 2; i >= 0; i--) {
				tightnessStr = str >> i & 1
				tightnessArr.push(tightnessStr);
			}
			$.each(tightnessArr, function(i, value) {
				if(value == 1) {
					$('#mesTable-top input[name="type1"][value="' + i + '"]').attr('checked', true);

				} else if(value == 0) {
					$('#mesTable-top input[name="type1"][value="' + i + '"]').attr('checked', false);

				}
			})
		}
		if(data.customerLabel.chestType != 0) {
			var str = data.customerLabel.chestType;
			var tightnessStr = '';
			var tightnessArr = [];
			for(var i = 1; i >= 0; i--) {
				tightnessStr = str >> i & 1
				tightnessArr.push(tightnessStr);
			}
			$.each(tightnessArr, function(i, value) {
					if(value == 1) {
						$('#mesTable-top input[name="type2"][value="' + i + '"]').attr('checked', true);

					} else if(value == 0) {
						$('#mesTable-top input[name="type2"][value="' + i + '"]').attr('checked', false);

					}
				})
				//						$('#mesTable-top input[name="type2"][value="' + data.customerLabel.chestType + '"]').attr('checked', 'true');
		}
		if(data.customerLabel.shoulderType != 0) {
			var str = data.customerLabel.shoulderType;
			var tightnessStr = '';
			var tightnessArr = [];
			for(var i = 2; i >= 0; i--) {
				tightnessStr = str >> i & 1
				tightnessArr.push(tightnessStr);
			}
			$.each(tightnessArr, function(i, value) {
					if(value == 1) {
						$('#mesTable-top input[name="type3"][value="' + i + '"]').attr('checked', true);

					} else if(value == 0) {
						$('#mesTable-top input[name="type3"][value="' + i + '"]').attr('checked', false);

					}
				})
				//						$('#mesTable-top input[name="type3"][value="' + data.customerLabel.shoulderType + '"]').attr('checked', 'true');
		}
		if(data.customerLabel.posteriorCircumference != 0) {
			var str = data.customerLabel.posteriorCircumference;
			var tightnessStr = '';
			var tightnessArr = [];
			for(var i = 1; i >= 0; i--) {
				tightnessStr = str >> i & 1
				tightnessArr.push(tightnessStr);
			}
			$.each(tightnessArr, function(i, value) {
					if(value == 1) {
						$('#mesTable-top input[name="type4"][value="' + i + '"]').attr('checked', true);

					} else if(value == 0) {
						$('#mesTable-top input[name="type4"][value="' + i + '"]').attr('checked', false);

					}
				})
				//						$('#mesTable-top input[name="type4"][value="' + data.customerLabel.posteriorCircumference + '"]').attr('checked', 'true');
		}
		//客户提醒
		$('.type-text').val(data.customerLabel.bodyDescription == undefined ? '' : data.customerLabel.bodyDescription);
		orderMeasurebody.customerLabelId = data.customerLabel.id;
		//客户图片
		$.each(data.customerBodyPicList, function(i, value) {
			$('.photo-msg' + value.type).attr('src', value.pictureUrl);
		})

	},
	//上传单张图片
	uploadEvent: function() {
		uploadImg({
			ele: ".upload",
			type: 1,
			callback: function(res, $ele) {
				//				layer.msg("上传成功");
				var $img = $ele.siblings("img");
				$img.attr("src", res.data[0]).css("display", "block");
			},
			format: ["jpg", "png", "bmp"],
			size: 2
		});
	},
	//删除上传图片
	curPhoto: function(obj) {
		$(obj).parent('.portrait-upload').siblings('img').attr('src', '');
		orderMeasurebody.uploadEvent();
	},
	//返回
	comeBack: function() {
		window.history.go(-1);
	},
	//保存
	submitMes: function(type) {
		var data = {};
		data.orderNo = orderNo;
		data.customerId = customerId;
		//身高数据
		var arr = [];
		$.each($('.num-body input[type="text"]'), function(i, value) {
			var prm = {};
			prm.labelId = $(this).attr('data-id');
			prm.size = $(this).val();
			arr.push(prm);
		});
		//体态数据集合1
		var tightnessArr1 = '';
		$.each($('#mesTable-top input[name="type1"]'), function(i, value) {
			if($('#mesTable-top input[name="type1"][value="' + i + '"]').is(':checked')) {
				tightnessArr1 += 1;
			} else {
				tightnessArr1 += 0;
			}
		})
		var tightnessArr1Str = parseInt(tightnessArr1, 2); //转成十进制
		//		2
		var tightnessArr2 = '';
		$.each($('#mesTable-top input[name="type2"]'), function(i, value) {
			if($('#mesTable-top input[name="type2"][value="' + i + '"]').is(':checked')) {
				tightnessArr2 += 1;
			} else {
				tightnessArr2 += 0;
			}
		})
		var tightnessArr2Str = parseInt(tightnessArr2, 2); //转成十进制
		//		3
		var tightnessArr3 = '';
		$.each($('#mesTable-top input[name="type3"]'), function(i, value) {
			if($('#mesTable-top input[name="type3"][value="' + i + '"]').is(':checked')) {
				tightnessArr3 += 1;
			} else {
				tightnessArr3 += 0;
			}
		})
		var tightnessArr3Str = parseInt(tightnessArr3, 2); //转成十进制
		//		4
		var tightnessArr4 = '';
		$.each($('#mesTable-top input[name="type4"]'), function(i, value) {
			if($('#mesTable-top input[name="type4"][value="' + i + '"]').is(':checked')) {
				tightnessArr4 += 1;
			} else {
				tightnessArr4 += 0;
			}
		})
		var tightnessArr4Str = parseInt(tightnessArr4, 2); //转成十进制
		//客户体型
		var typeText = $('.type-text').val();
		if(typeText.length > 200) {

			layer.msg('填写客户体型最多200字', {
				offset: '50%'
			});
			return;
		}

		var parm = {

			tightness: tightnessArr1Str,
			chestType: tightnessArr2Str,
			shoulderType: tightnessArr3Str,
			isHumpback: 0,
			isBigBelly: 0,
			id: orderMeasurebody.customerLabelId,
			store_id: null,
			userId: null,
			posteriorCircumference: tightnessArr4Str,
			bodyDescription: $('.type-text').val()
		};

		//参数
		data.bodyList = JSON.stringify(arr);
		//体态
		data.customerLabel = JSON.stringify(parm);
		//客户照片
		data.bodyFront = $('.photo-msg1').attr('src')
		data.bodyLateral = $('.photo-msg2').attr('src')
		data.bodyRear = $('.photo-msg3').attr('src')
		$.ajax({
			type: "POST",
			url: headUrl.headUrl + "/v3/store/order/addCustomerBodyData",
			async: true,
			data: data,
			dataType: 'json',
			success: function(res) {
				if(res.success && type == 1) {
					$.ajax({
						type: "post",
						url: headUrl.headUrl + "/v3/store/order/saveCustomerBodyData",
						async: true,
						data: {
							orderNo: orderNo
						},
						dataType: 'json',
						success: function(res) {
							if(res.success) {
								window.location.href = sessionStorage.getItem('orderEditUrl');
							} else {
								layer.msg(res.msg,{offset:'50%'});

							}
							//							window.history.go(-1);

						},error: function(){
							layer.msg('网络异常！',{offset:'50%'});
						}
					});
				} else {
					layer.msg(res.msg);
				}
			},error: function(){
				layer.msg('网络异常！',{offset:'50%'});
			}
		});
	},
	//提交
	shareOut: function() {
		layer.confirm('确定提交？', {
			title: '提示',
			offset: '42%'
		}, function() {
			orderMeasurebody.submitMes(1);
		});
	}
}

$(function() {
	orderMeasurebody.init();
})