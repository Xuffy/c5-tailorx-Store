var orderType = sessionStorage.getItem('tailorx-sampleOrder-type');
sessionStorage.setItem('sampleOrderEditUrl', window.location.href);
var orderEdit = {
	init: function() {
		var thisURL = document.URL;
		var getval = thisURL.split('?')[1];
		orderEdit.orderNo = getval.split("=")[1].split('&')[0];
		sessionStorage.setItem('orderNo', orderEdit.orderNo);
		orderEdit.flowCode = getval.split("=")[1].split('&')[1];
		this.initOrder();

		this.checkAcceptListFunUpload();
		this.checkAcceptListFun();

		this.checkRefuseListFunUpload();
		this.checkRefuseListFun();

		this.sendGoodNumFunUpload();
		this.sendGoodNumFun();
		this.checkBigPictureFun(); //点击查看大图
		initLocation({
			sheng_val: "",
			shi_val: "",
			xian_val: "",
			xiang_val: "<?php echo $v['street']?>"
		});

	},
	orderNo: '',
	flowCode: '',
	customerId: '',
	delivery: '',
	initOrder: function() {
		$.ajax({
			type: 'post',
			url: headUrl.headUrl + "/v3/store/sampleOrder/get",
			data: {
				id: orderEdit.orderNo
			}, //
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					$('.fasterEn-menu').addClass('de-active');
						orderEdit.orderCreationDetail(res.data.tacheId);
					//					快捷入口
					/*//资讯来源
					if(res.data.informationNo != 0) {
						$('.fasterEn-info').addClass('de-active');
						orderEdit.infoEnterFun(res.data.informationNo);
					}
					//客户上传图片
					if(res.data.pictures) {
						$('.fasterEn-photo').addClass('de-active');
						orderEdit.fasterEnPhotoFun(res.data.pictures, res.data.description);
					}
					//客户量体数据
					if(res.data.isCustomerBody == 1) {
						$('.fasterEn-body').addClass('de-active');
						orderEdit.measurebodyDetail();
					}
					//工艺单

						$('.fasterEn-menu').addClass('de-active');
						orderEdit.orderCreationDetail(res.data.orderWorkUpdateStatus);

					//客户评价
					if(res.data.isEvaluate) {
						$('.fasterEn-evaluate').addClass('de-active');
						orderEdit.customerEvaluateFun();
					}*/
					//物流信息
					if(res.data.expressNo) {
						$('.fasterEn-logistics').addClass('de-active');
						orderEdit.detailLogisticsFun();
					}
					orderEdit.customerId = res.data.customerId;
					$('#orderNo').text(res.data.sampleNo);
					$('#nikeName').text(res.data.customerName);
					$('#storeName').text(res.data.storeName);
					$('#appointment').text(res.data.appointmentTime);
					$('#totalAmount').text(res.data.price);
					/*$('#taskOrderNo').text((res.data.taskOrderNo == '' || taskOrderNo == undefined) ? '----' : res.data.taskOrderNo);*/

					orderEdit.delivery = res.data.delivery
					if(res.data.delivery == '2') {
						$('#deliveryName').text('第三方物流');
						$('.logistics').show();
						$('#logisticsCompany').text(!res.data.expressName ? '----' : res.data.expressName); //物流公司
						$('#consignee').text(!res.data.customerName ? '----' : res.data.consigneeName); //收货人
						$('#consigneeAddress').text(!res.data.expressAddress ? '----' : res.data.expressAddress); //收货地址
						$('#logisticsNum').text(!res.data.expressNo ? '----' : res.data.expressNo); //物流单号
						$('#consigneePhone').text(!res.data.customerPhone ? '----' : res.data.consigneePhone); //收货电话

					} else if(res.data.delivery == '1') {
						$('.logistics').hide();
						$('#deliveryName').text('上门自取');
					} else {
						$('#deliveryName').text('----');
						$('.logistics').hide();
					}
					//物流
					$('#customerPhone').text(res.data.customerPhone);
					$('#designerName').text(res.data.designerName);
					$('#createDateStr').text(res.data.createTimeStr);
					$('#deposit').text(res.data.deposit);
					$('#orderName').text((!res.data.genderName ? '--' : res.data.genderName) + (!res.data.styleName ? '--' : '--' + res.data.styleName) + (!res.data.seasonName ? '' : '--' + res.data.seasonName));
					$('#orderGrade').text(res.data.orderGrade);
					orderEdit.initOrderInfo(res.data.flowCode);
					for(var i = 1; i <= res.data.flowCode; i++) {
						$('.schedule-circle' + i).addClass('circle-active');
					}
					$('.schedule-circle' + res.data.flowCode).addClass('schedule-circle-active');
					var wh = 0.25 * (res.data.flowCode - 1) * 100;
					$('.active-bar').width(wh + "%");

				} else {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			}
		})
	},
	//获取日志列表
	initOrderInfo: function(flowCode) {
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/sampleOrder/getOrderSampleLog",
			data: {
				id: orderEdit.orderNo,
			},
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					$('#tableContList').html('');
					var html = "";
					html += '<tr><th></th><th>操作类型</th><th>操作人</th><th>执行结果</th><th>操作时间</th><th>备注</th><th>操作</th></tr>';
					$.each(res.data, function(i, value) {
						html += '<tr>';
						if(value.status == 0) {
							html += '<td class="ut-relative"><div class="orderLine-cir orderLine-orange"></div></td>' +
								'<td>' + value.tacheName + '</td>' + '<td>' + (!value.operatorName ? '' : value.operatorName) + '</td>' +
								'<td>' + (!value.statusName ? '' : '<div class="divCir orange"></div>' + value.statusName) + '</td>';
						}
						if(value.status == 1) {
							html += '<td class="ut-relative"><div class="orderLine-cir orderLine-green"></div></td>' +
								'<td>' + value.tacheName + '</td>' + '<td>' + (!value.operatorName ? '' : value.operatorName) + '</td>' +
								'<td>' + (!value.statusName ? '' : '<div class="divCir green"></div>' + value.statusName) + '</td>';
						}
						if(value.status == 2) {
							html += '<td class="ut-relative"><div class="orderLine-cir orderLine-red"></div></td>' +
								'<td>' + value.tacheName + '</td>' + '<td>' + (!value.operatorName ? '' : value.operatorName) + '</td>' +
								'<td>' + (!value.statusName ? '' : '<div class="divCir red"></div>' + value.statusName) + '</td>';
						}

						html += '<td>' + value.updateDateStr + '</td><td>';
						if(value.expressType) {
							if(value.expressType == 0) {
								html += '<p>物流信息:TX自物流<br/>' + (!value.storeRemark ? '' : '备注:' + value.storeRemark) + '';
								if(value.img) {
									var img = value.img
									var imgArr = img.split(',')

									$.each(imgArr, function(a, msg) {
										html += '<img class="checkbig" style=" width: 35px;height: 25px;margin-left: 10px;" src="' + msg + '"/>';
									})
								}
								html += '</p>';
							} else if(value.expressType == 1) {
								html += '<p>物流信息:第三方物流&emsp;物流公司:' + (!value.expressCompanyName ? '' : value.expressCompanyName) + '&emsp;物流单号:' + (!value.expressNo ? '' : value.expressNo) + '<br/>' + (!value.storeRemark ? '' : '备注:' + value.storeRemark) + '';
								if(value.img) {
									var img = value.img
									var imgArr = img.split(',')

									$.each(imgArr, function(a, msg) {
										html += '<img class="checkbig" style=" width: 35px;height: 25px;margin-left: 10px;" src="' + msg + '"/>';
									})
								}
								html += '</p>';
							}
						} else {
							html += '<p>' + (!value.storeRemark ? '' : '备注:' + value.storeRemark) + '';
							if(value.img) {
								var img = value.img
								var imgArr = img.split(',')

								$.each(imgArr, function(a, msg) {
									html += '<img class="checkbig" style=" width: 35px;height: 25px;margin-left: 10px;" src="' + msg + '"/>';
								})
							}
							html += '</p>'
						}
						html += '</td><td>';
						if(value.operation == 2 && value.status == 0) {
							switch(value.tacheId) {
								case 2:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.arriveStore()">' +
										'已到店' + '</a>' + '&nbsp' + '<a href="javascript:;" onclick="orderEdit.noArriveStore(' + value.tacheId + ')">' +
										'取消预约' + '</a></span>';
									}
									break;
								case 4:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.materialSelect(' + value.appointmentSourceType + ')">' +
										'选择面料' + '</a></span>';
									}
									break;
								case 7:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.measurebody()">' +
										'录入量体数据' + '</a></span>';
									}
									break;
								case 8:
									{
											html += '<span>' + '<a href="javascript:;" onclick="orderEdit.creatFun(' + value.tacheId + ')">' +
												'编辑工单' + '</a></span>';
									}
									break;
								case 23:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.creatFun(' + value.tacheId + ')">' +
										'编辑工单' + '</a></span>';

									}
									break;
								case 24:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.creatFun(' + value.tacheId + ')">' +
										'编辑工单' + '</a></span>';

									}
									break;
								case 25:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.sendFactory()">' +
										'工单发送工厂' + '</a></span>';

									}
									break;
									case 28:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.creatFun(' + value.tacheId + ')">' +
										'编辑工单' + '</a></span>';

									}
									break;
								case 9:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.sendFactory()">' +
										'发送工厂' + '</a></span>';
									}
									break;
								case 11:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.storeCheck()">' +
										'通过' + '</a>' +
										'<a href="javascript:;" class="ut-mar-l10" onclick="orderEdit.isStoreCheck()">' +
										'不通过' + '</a>' +
										'</span>';
									}
									break;
								case 12:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.sendStyle()">' +
										'门店发货' + '</a></span>';
									}
									break;
								case 20:
									{
										if(value.orderReceiptStatus == 1) {
											//半成品
											html += '<span>' + '<a href="javascript:;" onclick="orderEdit.goodsReceipt(1)">' +
												'收货并通知用户试衣' + '</a></span>';
										} else {
											//不含胚样试衣 以及 成品
											html += '<span>' + '<a href="javascript:;" onclick="orderEdit.goodsReceipt(0)">' +
												'收货' + '</a></span>';
										}
									}
									break;
								case 21:
									{
										html += '<span>' + '<a href="javascript:;" onclick="orderEdit.storeSendFactory()">' +
										'发货' + '</a></span>';
									}
									break;

								default:
									{

									}
									break;
							}

						}
						html += '</td>';
						//						}
						html += '</tr>';

					});
					$('#tableContList').html(html);
				} else {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}

			}

		})
	},
	//	进度条
	clickOrderTask: function(obj, num) {
		if(obj.classList.contains('circle-active')) {
			$(obj).addClass('schedule-circle-active');
			$(obj).siblings().removeClass('schedule-circle-active');

			orderEdit.initOrderInfo(num);
		} else {}

	},
	//已到门店
	arriveStore: function() {
		layer.confirm('确定用户已抵达门店？', {
				offset: "50%",
				title: '操作',
				btn: ['确定', '取消']
			},
			function() {
				orderEdit.customerToStoreAction(0, '')
			},
			function() {});
	},
	//未到,门店
	noArriveStore: function() {
		$('#noArriveStore').removeClass('ut-none');
	},
	//用户是否到店请求
	customerToStoreAction: function(type, reson) {
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/order/customerToStore",
			data: {
				orderNo: orderEdit.orderNo,
				type: type,
				reson: reson,
				customerId: orderEdit.customerId
			},
			dataType: 'json',
			success: function(res) {
				layer.msg(res.msg, {
					offset: '50%'
				});
				if(res.success) {
					if(type == 1) {
						$('#noArriveStore').addClass('ut-none');
					}
					orderEdit.initOrderInfo(orderEdit.flowCode);
				}
			}
		})
	},
	//确认用户未到店
	customerNotToStoreAction: function() {
		var reson = $('.noArriveStore2-textarea').val();
		if(reson.length > 0 && reson.length <= 200) {
			orderEdit.customerToStoreAction(1, reson);
		} else {
			layer.msg('必须填写取消预约原因且最多200字', {
				offset: '50%'
			});
			return;
		}

	},
	//面料选择materialSelect
	materialSelect: function(ShowType) {
		$('#orEshow').show();
		$('#materialSelect').removeClass('ut-none');
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/order/getOrderTagsByOrderNo",
			async: true,
			dataType: 'json',
			data: {
				orderNo: orderEdit.orderNo
			},
			success: function(res) {
				if(res.success) {
					orderEdit.stageStyleFun().then(function() {
						//标签对比

						if(res.data) {
							var el = ""
							$('#picTab-Add').html('')
							$.each(res.data, function(i, value) {
								if(value.tagType == 1) {
									$.each($("#picSex-str .pic-border"), function(i, m) {
										var dataId = $(this).data('item-data');
										if($(this).data('item-data') == value.tagId) {
											$(this).addClass('picBorder-active')
										}
									});
								} else if(value.tagType == 2) {
									$.each($("#picStyle-str .pic-border"), function(i, m) {
										var dataId = $(this).data('item-data');
										if($(this).data('item-data') == value.tagId) {
											$(this).addClass('picBorder-active')
										}
									});
								} else if(value.tagType == 3) {
									$.each($("#picSeason-str .pic-border"), function(i, m) {
										var dataId = $(this).data('item-data');
										if($(this).data('item-data') == value.tagId) {
											$(this).addClass('picBorder-active')
										}
									});
								} else if(value.tagType == 4) {

									el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>');
									el.append(value.tagName);
									el.data('item-data', value.tagId)
									$('#picTab-Add').append(el);
								}
							})
						}
						orderEdit.recommendStyleFun().then(function() {
							orderEdit.recommendFun(); //推荐标签选中
							//删除
						}); //推荐标签
						orderEdit.picCloseFun();
					})

					orderEdit.uploadEvent();
					$('.addFabric').on('click', function() {
						var str = '<div class="ut-inline-block ut-mar-t10 add-fa uploadLing-div">' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name1" placeholder="编号"/>' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name2" placeholder="色号"/>' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name3" placeholder="备注"/>' +
							'<div class="ut-inline-block orE-img">' +
							'<p class="orE-p">上传面料</p>' +
							'<img class="name4" src="" alt="" />' +
							'<input type="file" class="orE-file"/>' +
							'<i class="fa fa-times-circle orE-close" onclick="orderEdit.delorE(this)"></i>' +
							'</div>' +
							'<div class="ut-btn btn-3 ut-mar-r5" onclick="orderEdit.addRemove(this)">删除</div>' +
							'</div>';
						$('.addFabric').before(str);
						orderEdit.uploadEvent();
					});

					//里料选择
					$('.addLining').on('click', function() {
						var str = '<div class="ut-inline-block ut-mar-t10 add-fa uploadLing-div2">' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name1" placeholder="编号"/>' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name2" placeholder="色号"/>' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name3" placeholder="备注"/>' +
							'<div class="ut-inline-block orE-img">' +
							'<p class="orE-p">上传面料</p>' +
							'<img class="name4" src="" alt="" />' +
							'<input type="file" class="orE-file"/>' +
							'<i class="fa fa-times-circle orE-close" onclick="orderEdit.delorE(this)"></i>' +
							'</div>' +
							'<div class="ut-btn btn-3 ut-mar-r5" onclick="orderEdit.addRemove(this)">删除</div>' +
							'</div>';
						$('.addLining').before(str);
						orderEdit.uploadEvent();
					});
					//辅料选择
					$('.ingreLining').on('click', function() {
						var str = '<div class="ut-inline-block ut-mar-t10 add-fa uploadLing-div3">' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name1" placeholder="名称"/>' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name2" placeholder="编号"/>' +
							'<input type="text" class="ut-input w-120 ut-mar-r5 name3" placeholder="备注"/>' +
							'<div class="ut-inline-block orE-img">' +
							'<p class="orE-p">上传面料</p>' +
							'<img class="name4" src="" alt="" />' +
							'<input type="file" class="orE-file"/>' +
							'<i class="fa fa-times-circle orE-close" onclick="orderEdit.delorE(this)"></i>' +
							'</div>' +
							'<div class="ut-btn btn-3 ut-mar-r5" onclick="orderEdit.addRemove(this)">删除</div>' +
							'</div>';
						$('.ingreLining').before(str);
						orderEdit.uploadEvent();
					});
					//		if(ShowType == 3) {
					//系统标签
					//					orderEdit.stageStyleFun();
					//添加
					orderEdit.addTableBtnFun();
					//推荐标签选中

					//		orderEdit.recommendFun();
					//					//删除
					//					orderEdit.picCloseFun();
					//		}
					//级别
					$('#picGrade-str').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active')
					})
					$("#materialSelectCon").unbind('click').on('click', function() {
						orderEdit.materialSelectConfirm(ShowType);
					})

				}
			},
			error: function() {
				layer.msg('网络异常!', {
					offset: '50%'
				})
			}
		});

	},
	//系统标签推荐
	stageStyleFun: function() {
		return $.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/tag/getSystemTags",
			async: true,
			dataType: 'json',
			success: function(res) {

				//性别
				var el = '';
				$('#picSex-str').html('');
				$.each(res.data.sex, function(i, value) {
					el = $('<div class="pic-border ut-mar-r5">' + value.tagName + '</div>');
					el.text(value.tagName);
					el.data('item-data', value.id)
					$('#picSex-str').append(el);
				});
				$('#picSex-str').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active')
					})
					//style
				var st = '';
				$('#picStyle-str').html('');
				$.each(res.data.style, function(i, value) {
					st = $('<div class="pic-border ut-mar-r5">' + value.tagName + '</div>');
					st.text(value.tagName);
					st.data('item-data', value.id)
					$('#picStyle-str').append(st);
				});
				$('#picStyle-str').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active')
					})
					//season
				var se = '';
				$('#picSeason-str').html('');
				$.each(res.data.season, function(i, value) {
					se = $('<div class="pic-border ut-mar-r5">' + value.tagName + '</div>');
					se.text(value.tagName);
					se.data('item-data', value.id)
					$('#picSeason-str').append(se);
				})
				$('#picSeason-str').on('click', '.pic-border', function() {
					$(this).addClass('picBorder-active');
					$(this).siblings().removeClass('picBorder-active')
				})

			},
			error: function() {
				layer.msg(res.msg, {
					offset: '50%'
				})
			}
		});
	},
	//添加
	addTableBtnFun: function() {
		$('#addTableBtn').off();
		$('#addTableBtn').on('click', function() {
			if($('#picTab-Add .pic-border').length > 4) {
				layer.msg('最多选择5个标签!', {
					offset: '50%'
				});
				return;
			}
			//添加选中
			var addTableInput = $('#addTableInput').val();
			//			var itemData = $('#picTab-search .picBorder-active').eq(0).data('item-data');
			if(!addTableInput) {
				layer.msg('请填写标签', {
					offset: '50%'
				});
				return;
			}
			if(addTableInput.length > 5) {
				layer.msg('标签字数不能超过5个字符', {
					offset: '50%'
				});
				return;
			}
			var elLength = $('#picTab-Add .pic-border');
			for(var i = 0; i < elLength.length; i++) {
				if(elLength.eq(i).text() == addTableInput) {
					layer.msg('已存在', {
						offset: '50%'
					});
					return;
				}
			}
			orderEdit.ajaxFindDesigner(addTableInput);

		})
	},
	ajaxFindDesigner: function(data) {
		$.ajax({
			type: 'post',
			url: headUrl.headUrl + "/v3/store/tag/searchOrAddCommonTag",
			data: {
				tagName: data
			},
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					var el = '';
					el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>')
					el.append(data);
					el.data('item-data', res.data.id);
					$('#picTab-Add').append(el);
					$('#addTableInput').val("");

					$.each($('#picTab-recommend .pic-border'), function(i, value) {
						if($(this).data('item-data') == res.data.id) {
							$(this).addClass('picBorder-active');
							$('#addTableInput').val('');

						}

					});
				} else {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			}
		});
	},
	//推荐标签
	recommendStyleFun: function() {
		return $.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/tag/listDefaultCommonTags",
			async: true,
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					$('#picTab-recommend').html('');
					$.each(res.data, function(i, value) {
						var name = value.tagName
						var taArr = [];
						if($('#picTab-Add .pic-border').length) {

							for(var i = 0; i < $('#picTab-Add .pic-border').length; i++) {
								taArr.push($('#picTab-Add .pic-border').eq(i).text());
								var el = '';
								if(taArr.indexOf(name) == -1) {
									el = $('<div class="pic-border ut-mar-r5"></div>');
								} else {
									el = $('<div class="pic-border picBorder-active ut-mar-r5"></div>');
								}

								el.text(value.tagName);
								el.data('item-data', value.id);
							}
							$('#picTab-recommend').append(el);
						} else {
							var el = ''
							el = $('<div class="pic-border ut-mar-r5"></div>');
							el.text(value.tagName);
							el.data('item-data', value.id);
							$('#picTab-recommend').append(el);
						}
					});
				} else {
					layer.msg(res.msg, {
						offset: '50%'
					})
				}
			},
			error: function() {
				layer.msg(res.msg, {
					offset: '50%'
				})
			}
		});
	},
	recommendFun: function() {
		$('#picTab-recommend').off();
		$('#picTab-recommend').on('click', '.pic-border', function() {
			var rec = $(this).text();
			var itemData = $(this).data('item-data');
			if($('#picTab-Add .pic-border').length > 4) {
				layer.msg('最多选择5个标签!', {
					offset: '50%'
				});
				return;
			}
			if($(this).hasClass('picBorder-active')) {
				layer.msg('标签已选择', {
					offset: '50%'
				});
				return;
			}
			$(this).addClass('picBorder-active');
			var el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>');
			el.append(rec);
			el.data('item-data', itemData)
			$('#picTab-Add').append(el);
			$('#picTab-search').html('');
			$('#addTableInput').val('');

		});
	},
	//删除标签
	picCloseFun: function() {

		$('#picTab-Add').unbind('click').on('click', '.pic-close', function() {
			var dataId = $(this).parent('.pic-border').data('item-data');
			$.each($('#picTab-recommend .pic-border'), function(i, value) {
				if($(this).data('item-data') == dataId) {
					$(this).removeClass('picBorder-active');
					$('#picTab-search').html('');
					$('#addTableInput').val('');
				}
				//				return;
			});
			$(this).parent('.pic-border').remove();
		});
	},
	//确定 面料选择确定方法
	materialSelectConfirm: function(showType) {
		var madeNumber = $('#madeNumber').val();
		var checkNum = $('input:radio[name="num"]:checked').val();
		//		var styleNum = $('input:radio[name="num1"]:checked').val();
		var picGrade = $('#picGrade-str .picBorder-active').text();
		var orderPrice = $('#orderPrice').val();
		var unit = $('select[name=unit]').val();
		if(madeNumber.length == 0) {
			layer.msg('定制数量不能为空!', {
				offset: '50%'
			});
			return;
		}
		if(unit == undefined || unit == '') {
			layer.msg('请选择定制数量单位!', {
				offset: '50%'
			});
			return;
		}
		if(!$('#picSex-str .picBorder-active').length) {
			return layer.msg('请选择性别标签！', {
				offset: '50%'
			});
		}
		if(!$('#picStyle-str .picBorder-active').length) {
			return layer.msg('请选择款式标签！', {
				offset: '50%'
			});
		}
		if(!$('#picSeason-str .picBorder-active').length) {
			return layer.msg('请选择季节标签！', {
				offset: '50%'
			});
		}
		if(!$('#picTab-Add .picBorder-active').length) {
			return layer.msg('请选择标签！', {
				offset: '50%'
			});
		}
		if(!$('#picGrade-str .picBorder-active').length) {
			return layer.msg('请选择订单级别！', {
				offset: '50%'
			});
		}
		if(orderPrice.length == 0) {
			layer.msg('订单价格不能为空!', {
				offset: '50%'
			});
			return;
		}
		var uploadLingDiv = $('.uploadLing-div').length;
		//面料
		var linings = [];
		$.each($('.uploadLing-div'), function(i, value) {
			var prm = {};
			var name1 = $(this).children('.name1').val();
			var name2 = $(this).children('.name2').val();
			var name3 = $(this).children('.name3').val();
			var name4 = $(this).find('.name4').attr('src');
			prm.serialNumber = name1;
			prm.colourNumber = name2;
			prm.remark = name3;
			prm.picture = name4;
			linings.push(prm);
		});
		//里料
		var materials = [];
		$.each($('.uploadLing-div2'), function(i, value) {
			var prm = {};
			var name1 = $(this).children('.name1').val();
			var name2 = $(this).children('.name2').val();
			var name3 = $(this).children('.name3').val();
			var name4 = $(this).find('.name4').attr('src');
			prm.serialNumber = name1;
			prm.colourNumber = name2;
			prm.remark = name3;
			prm.picture = name4;
			materials.push(prm);
		});
		//辅料
		var ingreLinings = [];
		$.each($('.uploadLing-div3'), function(i, value) {
			var prm = {};
			var name1 = $(this).children('.name1').val();
			var name2 = $(this).children('.name2').val();
			var name3 = $(this).children('.name3').val();
			var name4 = $(this).find('.name4').attr('src');
			prm.rawMaterials = name1;
			prm.match = name2;
			prm.remark = name3;
			prm.picture = name4;
			ingreLinings.push(prm);
		});
		//标签
		var arr = [];
		$.each($('.picSys .picBorder-active'), function(i, value) {
			var prm = {};
			prm.tagId = $(this).data('item-data');
			prm.tagType = 1;
			arr.push(prm);
		});
		$.each($('#picTab-Add .picBorder-active'), function(i, value) {
			var prm = {};
			prm.tagId = $(this).data('item-data');
			prm.tagType = 2;
			arr.push(prm);
		});
		var data = {
			orderNo: orderEdit.orderNo,
			isFitting: checkNum,
			orderNum: madeNumber,
			orderQuantityType: unit,
			seasonType: 0,
			orderMoney: orderPrice,
			linings: JSON.stringify(linings),
			materials: JSON.stringify(materials),
			accessory: JSON.stringify(ingreLinings),
			orderGrade: picGrade,
			tags: JSON.stringify(arr)
		};
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/order/chooseFabric",
			data: data,
			dataType: 'json',
			success: function(res) {
				layer.msg(res.msg, {
					offset: '50%'
				});
				if(res.success) {
					window.location.reload();
				}
			}
		})
	},
	//	点击查看大图
	checkBigPictureFun: function() {
		$('#tableContList').on('click', '.checkbig ', function() {
			$('.dx-preview-box').removeClass('ut-none');
			$('#dx-preview-msg').attr('src', $(this).attr('src'));
		})
	},
	//快捷入口 资讯来源
	infoEnterFun: function(informationNo) {
		$('.fasterEn-info').on('click', function() {
			$('#infoEnter').removeClass('ut-none');
			$.ajax({
				type: "post",
				url: headUrl.headUrl + "/v2/store/news/getInformationDetailByNo",
				async: true,
				dataType: 'json',
				data: {
					informationNo: informationNo
				},
				success: function(res) {
					$('.serial-title').text(res.data.name);
					$('.serial-num ').html("资讯编号：" + res.data.informationNo);
					$('.serial-description ').html(res.data.description);
					$(".pic_container").html('')
					var html = '';
					$.each(res.data.desList, function(i, value) {
						html += '<img class="serial-img ut-mar-t20" src="' + value.infoPic + '"/>' +
							'<p class="serial-cnt ut-mar-t20 ut-font14">' + value.description + '</p>';
					})
					$(".pic_container").html(html)
				}
			});
		})
	},
	//快捷入口  客户上传图片
	fasterEnPhotoFun: function(pictures, description) {
		$('.fasterEn-photo').on('click', function() {
			$('#infoPhoto').removeClass('ut-none');
			var strs = new Array(); //定义一数组
			//
			strs = pictures.split(";"); //字符分割
			$('#swiper-picture').html('');
			$('#swiper-title').html(!description ? '' : description);
			var htmlPicture = ""
			for(i = 0; i < strs.length; i++) {
				htmlPicture += '<div class="swiper-slide wrapper-bg">' +
					' <div style="width: 600px;margin: 0 auto;">' +
					'<div style="width:100%;;padding-bottom: 50px;text-align: center;">' +
					'<img src="' + $.ossImage(strs[i],'resize,w_600') + '" style="max-width:100%;max-height: 80%"/> ' +
					/*'<div class="swiper-border">'+
						'</div>'+*/
					'</div>' +
					'</div>' +
					' </div>';
			}
			//灯箱插件 轮播执行
			$('#swiper-picture').append(htmlPicture);
			var swiper = new Swiper('.swiper-container', {
				slidesPerView: 1,
				paginationClickable: true,
				keyboardControl: true,
				width: 800,
				loop: true,
				autoHeight: true,
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
			});

		})
	},
	//快捷入口 客户评价
	customerEvaluateFun: function() {
		$('.fasterEn-evaluate').on('click', function() {
			$('#customerEvaluate').removeClass('ut-none');
			$.ajax({
				type: "post",
				url: headUrl.headUrl + "/v3/store/order/findOrderFeedBack",
				async: true,
				dataType: 'json',
				data: {
					orderNo: orderEdit.orderNo
				},
				success: function(res) {
					//综合
					//					if(){}
					for(var i = 1; i <= res.data.factoryScore; i++) {
						$('.customerNum1 .cust-star' + i).addClass('cust-starActive');
					}
					//设计师
					for(var i = 1; i <= res.data.designerScore; i++) {
						$('.customerNum2 .cust-star' + i).addClass('cust-starActive');
					}
					//工厂
					for(var i = 1; i <= res.data.overallScore; i++) {
						$('.customerNum3 .cust-star' + i).addClass('cust-starActive');
					}
					//评价
					$('.curt-text').text(res.data.content);
					//图片
					var html = "";
					$('.curt-photo').html('');
					$.each(res.data.pics, function(i, value) {
						html += '<div class="curt-photoOut">' +
							'<img src="' + value + '" alt="" />' +
							'</div>';
					})
					$('.curt-photo').html(html);
				}
			});
		})

	},
	//快捷入口 量体数据
	measurebodyDetail: function() {
		$('.fasterEn-body').on('click', function() {
			sessionStorage.setItem('tailorx-measurebody-enter', 1);
			sessionStorage.setItem('tailorx-measurebody-orderNo', orderEdit.orderNo);
			sessionStorage.setItem('tailorx-measurebody-customerId', orderEdit.customerId);
			window.location.href = 'orderMeasureDetail.html';
		})
	},
	//快捷入口  工艺单
	//只可查看
	orderCreationDetail: function(status) {
		$('.fasterEn-menu').on('click', function() {
			if(status == 8 || status == 23 || status == 24) {
				sessionStorage.setItem('tailorx-sampleMeasurebody-type', 0);
		sessionStorage.setItem('tailorx-sampleMeasurebody-menu', 0);
		sessionStorage.setItem('tailorx-sampleMeasurebody-orderNo', orderEdit.orderNo);
		sessionStorage.setItem('tailorx-sampleMeasurebody-tacheId', status);
		window.location.href = 'sampleOrderCreation.html';
			} else {
				sessionStorage.setItem('tailorx-sampleMeasurebody-menu', 1);
				sessionStorage.setItem('tailorx-sampleMeasurebody-type', 0);
		sessionStorage.setItem('tailorx-sampleMeasurebody-orderNo', orderEdit.orderNo);
		sessionStorage.setItem('tailorx-sampleMeasurebody-tacheId', 99);
		window.location.href = 'sampleOrderCreation.html';
			}
		})
	},
	//快捷入口物流信息
	detailLogisticsFun: function() {
		$('.fasterEn-logistics').on('click', function() {
			$('#detailLogistics').removeClass('ut-none');
			$.ajax({
				type: "post",
				url: headUrl.headUrl + "/v3/store/order/express",
				async: true,
				dataType: 'json',
				data: {
					orderNo: orderEdit.orderNo
				},
				success: function(res) {
					if(res.success) {
						$('.logistics-table').html('');
						var html = ""
						$.each(res.data.data, function(i, value) {
							html += '<tr>' +
								'<td  class="ut-relative logistics-parent">';
							if(i == 0) {
								html += '<div class="logistics-circle logistics-circle logistics-circleActive"></div>';
							} else {

								html += '<div class="logistics-circle logistics-circle"></div>';
							}
							html += '</td>' +
								'<td>' + value.context + '<br/>' + value.time + '</td>' +
								'</tr>';
						})
						$('.logistics-table').html(html);
					} else {
						layer.msg(res.msg);
					}
				}
			});

		})

	},
	//工艺单跳转
	creatFun: function(tacheId) {
		sessionStorage.setItem('tailorx-sampleMeasurebody-type', 0);
		sessionStorage.setItem('tailorx-sampleMeasurebody-menu', 0);
		sessionStorage.setItem('tailorx-sampleMeasurebody-orderNo', orderEdit.orderNo);
		sessionStorage.setItem('tailorx-sampleMeasurebody-tacheId', tacheId);
		window.location.href = 'sampleOrderCreation.html';
	},
	//量体数据
	measurebody: function() {
		sessionStorage.setItem('tailorx-measurebody-enter', 0);
		sessionStorage.setItem('tailorx-measurebody-orderNo', orderEdit.orderNo);
		sessionStorage.setItem('tailorx-measurebody-customerId', orderEdit.customerId);
		window.location.href = 'orderMeasurebody.html';
	},
	//上传单张图片
	uploadEvent: function() {
		uploadImg({
			ele: ".orE-file",
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
	//面料里料删除
	addRemove: function(obj) {
		$(obj).parent('.add-fa').remove();
	},
	//面料里料图片删除
	delorE: function(obj) {
		$(obj).siblings('img').attr('src', '');

	},
	//	弹框关闭
	closeFunction: function() {
		$('.ut-layer').addClass('ut-none');
	},
	previewClose: function() {
		$('.dx-preview-box').addClass('ut-none');
	},
	//发送工厂
	sendFactory: function() {
		$('#sendFactory').removeClass('ut-none');
	},
	//发送工厂确定
	sendFactorySubmit: function() {
		var remark = $('.noArriveStore1-textarea').val();
		if(remark.length > 200) {
			layer.msg('备注最多不超过200字！', {
				offset: '50%'
			})
			return;
		}
		$.ajax({
			type: "POST",
			url: headUrl.headUrl + "/v3/store/sampleOrder/sendToFactory",
			async: true,
			dataType: "json",
			data: {
				id: orderEdit.orderNo,
				remark: remark
			},
			success: function(res) {
				if(res.success) {
					$('#sendFactory').addClass('ut-none');
					orderEdit.initOrderInfo(3);
				}
			}
		});
	},
	//验收通过询问
	storeCheck: function() {
		$('#checkAccept').removeClass('ut-none');
		this.checkAcceptFun();
	},
	//验收确定
	checkAcceptFun: function() {
		$('#checkAcceptSubmit').on('click', function() {
			var passTextarea = $('.passTextarea').val();
			var strUrl = ""
			$.each($('#checkAcceptList .checkAccept-img-outer img'), function(i, value) {
				var url = $(this).attr('src');
				strUrl += url + ',';
			});
			strUrl = strUrl.substring(0, strUrl.length - 1);
			$.ajax({
				type: "POST",
				url: headUrl.headUrl + "/v3/store/sampleOrder/checkTaskOrder",
				dataType: 'json',
				data: {
					sampleId: orderEdit.orderNo,
					remark: passTextarea,
					img: strUrl,
					isPass: 1
				},
				success: function(res) {
					if(res.success) {
						$('.schedule-circle5').siblings().removeClass('schedule-circle-active');
						$('.schedule-circle5').addClass('circle-active schedule-circle-active');
						$('.active-bar').width("100%");
						$('#checkAccept').addClass('ut-none');
						orderEdit.initOrderInfo(5);

					} else {
						layer.msg("验收失败!", {
							offset: '50%'
						});
					}

				}
			});
		});
	},
	//验证通过 批量上传
	checkAcceptListFunUpload: function() {
		uploadImg({
			ele: "#passUpload",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 5 - orderEdit.checkAcceptListFun(),
			callback: function(res) {
				var checkAccept = '';
				$.each(res.data, function(i, value) {
					checkAccept += '<div class="checkAccept-img-outer ut-fl">' +
						'<div class="fa fa-upload checkAccept-msgUpload"></div>' +
						'<p class="ut-font12 checkAccept-p">上传图片</p>' +
						'<img src="' + value + '" alt="" class="checkAccept-photo-msg">' +
						'<input type="file" class="upload single-upload orE-file">' +
						'<i class="fa fa-times orE-close" onclick="orderEdit.delcheckAccept(this)"></i>' +
						'</div>	';
				});
				$('#checkAcceptList').append(checkAccept);
				orderEdit.uploadEvent(); //上传单张
				orderEdit.checkAcceptListFunUpload(); //上传多张

				$("#checkAcceptNum").html(orderEdit.checkAcceptListFun());
			}
		});
	},
	//判断一共有多少张图片 批量上传 验收通过
	checkAcceptListFun: function() {
		return $("#checkAcceptList .checkAccept-img-outer").length;

	},
	delcheckAccept: function(obj) {
		$(obj).parent('.checkAccept-img-outer').remove();
		$("#checkAcceptNum").html(orderEdit.checkAcceptListFun());
	},
	//验收bu通过询问
	isStoreCheck: function() {
		$('#checkrefuse').removeClass('ut-none');
		this.isCheckAcceptFun();
	},
	//验收不通过
	isCheckAcceptFun: function() {
		$("input[name='sendFac']").on('click', function() {
			if($(this).attr('data-id') == 0) {
				$('.sendGoodFac').hide();
				$('.orderSendFac').hide();
			} else {
				$('.sendGoodFac').show();
				$('.orderSendFac').show();
			}
		})
		$('#isCheckSubmit').on('click', function() {
			var sedFac = $("input[name='sendFac']:checked").attr('data-id'); //返工厂
			/*var sedFacOrder = '' //编辑工艺单*/
			var sedFacGoods = ''; //发货工厂
			if(!sedFac) {
				layer.msg(' 请选择是否发送工厂', {
					offset: '50%'
				});
				return;
			}
			if(sedFac == 1) {
				/*sedFacOrder = $("input[name='sendFac2']:checked").attr('data-id');
				if(!sedFacOrder) {
					layer.msg(' 请选择是否编辑工艺单', {
						offset: '50%'
					});
					return;
				}*/
				sedFacGoods = $("input[name='sendFac1']:checked").attr('data-id');
				if(!sedFacGoods) {
					layer.msg(' 请选择是否发货到工厂', {
						offset: '50%'
					});
					return;
				}
			}
			//			checkbox
			/*var sedFac = "0";
			if($('.checkbox-sendFac-yes').is(":checked")) {
				sedFac = "1";

			} else if($('.checkbox-sendFac-no').is(":checked")) {
				sedFac = "0";

			} else {
				layer.msg('请选择是否发送工厂', {
					offset: '50%'
				});
				return;
			}*/
			//			texta
			var isPassTextarea = $('.isPassTextarea').val();
			var strUrl = ""
				//			tupian
			$.each($('#checkRefuseList .checkAccept-img-outer img'), function(i, value) {
				var url = $(this).attr('src');
				strUrl += url + ',';
			});
			strUrl = strUrl.substring(0, strUrl.length - 1);

			$.ajax({
				type: "POST",
				url: headUrl.headUrl + "/v3/store/sampleOrder/checkTaskOrder",
				dataType: 'json',
				data: {
					sampleId: orderEdit.orderNo,
					remark: isPassTextarea,
					img: strUrl,
					isPass: 0,
					isToFactory: sedFac,
					/*updateWorkOrder: sedFacOrder,*/
					shipments: sedFacGoods
				},
				success: function(res) {
					if(res.success) {
						$('#checkrefuse').addClass("ut-none");
						if(sedFac == 0) { //不发送给工厂
							$('.schedule-circle5').siblings().removeClass('schedule-circle-active');
							$('.schedule-circle5').addClass('circle-active schedule-circle-active');
							$('.active-bar').width("100%");
							orderEdit.initOrderInfo(5);
						} else {
							orderEdit.initOrderInfo(4);
						}

						layer.msg("验收不通过成功!", {
							offset: '50%'
						});

					} else {
						layer.msg("验收不通过失败!", {
							offset: '50%'
						});
					}

				}
			});
		});
	},
	//验证不通过 批量上传
	checkRefuseListFunUpload: function() {
		uploadImg({
			ele: "#ispassUpload",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 5 - orderEdit.checkRefuseListFun(),
			callback: function(res) {
				var checkAccept = '';
				$.each(res.data, function(i, value) {
					checkAccept += '<div class="checkAccept-img-outer ut-fl">' +
						'<div class="fa fa-upload checkAccept-msgUpload"></div>' +
						'<p class="ut-font12 checkAccept-p">上传图片</p>' +
						'<img src="' + value + '" alt="" class="checkAccept-photo-msg">' +
						'<input type="file" class="upload single-upload orE-file">' +
						'<i class="fa fa-times orE-close accept-times" onclick="orderEdit.delcheckRefuse(this)"></i>' +
						'</div>	';
				});
				$('#checkRefuseList').append(checkAccept);
				orderEdit.uploadEvent(); //上传单张
				orderEdit.checkRefuseListFunUpload(); //上传多张
				$("#checkRefuseNum").html(orderEdit.checkRefuseListFun());
			}
		});
	},
	//判断一共有多少张图片 批量上传 验收不通过
	checkRefuseListFun: function() {
		return $("#checkRefuseList .checkAccept-img-outer").length;

	},
	delcheckRefuse: function(obj) {
		$(obj).parent('.checkAccept-img-outer').remove();
		$("#checkRefuseNum").html(orderEdit.checkRefuseListFun());
	},
	//商家发货到工厂  弹框
	storeSendFactory: function() {
		$('#storeSendFactory').removeClass('ut-none');
		$('#sendGoodsOption2 select[name="sendStyle"]').change(function() {
			//清空
			$('.sendStyle-name2 option[value=0]').attr('checked', 'true');
			$('.expressCompanyName').val('');
			var check = $('#sendGoodsOption2').find('option:selected').val();
			if(check == 1) {
				$('.select-style').removeClass('ut-none');
				$.ajax({
					type: "GET",
					url: headUrl.headUrl + "/v3/store/order/expressConpany",
					async: true,
					success: function(res) {
						var res = eval('(' + res + ')');
						var data = res.data;
						if(res.success) {
							$('.sendStyle-name2').html('');
							var html = '<option value="">请选择物流公司名称</option>';
							$.each(data, function(i, value) {
								html += '<option value="' + value.id + '">' + value.companyName + '</option>';
							})
							$('.sendStyle-name2').html(html);
						}
					}
				});
			} else {
				$('.select-style').addClass('ut-none');
			}
		});
		orderEdit.sendGoodNumFunUpload();
	},
	//	快递选择
	//	subInit:function(){
	//		var expressNum = null;
	//		var expressCompanyId = null;
	//		var expressCompanyName = null;
	//		var sendStyle = $('.sendStyle option:checked').val();
	//
	//		if(sendStyle == "") {
	//			layer.msg('请选择发货方式！')
	//			return;
	//		} else if(sendStyle == '0') {
	//			expressNum = $('.expressCompanyName').val(); //编号
	//			expressCompanyId = $('.sendStyle-name option:checked').val(); //快递公司
	//			expressCompanyName = $('.sendStyle-name option:checked').text(); //快递公司
	//			if(expressCompanyId == "") {
	//				layer.msg('请选择快递公司！');
	//				return;
	//			} else if(expressNum == "") {
	//				layer.msg('请填写快递单号！');
	//				return;
	//			}
	//		}
	//		return {expressCompanyId:expressCompanyId,expressNum:expressNum,expressCompanyName:expressCompanyName};
	//	},
	//商家发货到工厂  确定按钮
	storeSendFactorySubmit: function() {
		var expressNum = null;
		var expressCompanyId = null;
		var expressCompanyName = null;
		var sendStyle = $('.sendStyle2 option:checked').val();
		if(sendStyle == "") {
			layer.msg('请选择发货方式！', {
				offset: '50%'
			})
			return;
		} else if(sendStyle == '1') {
			expressNum = $('.expressCompanyName2').val(); //编号
			expressCompanyId = $('.sendStyle-name2 option:checked').val(); //快递公司
			expressCompanyName = $('.sendStyle-name2 option:checked').text(); //快递公司
			if(expressCompanyId == "") {
				layer.msg('请选择快递公司！', {
					offset: '50%'
				});
				return;
			} else if(expressNum == "") {
				layer.msg('请填写快递单号！', {
					offset: '50%'
				});
				return;
			}
		}
		var sendGoodTextarea = $('.sendGood-textarea').val();
		var strUrl = ""
		$.each($('#checkAccept-sendGoodList .checkAccept-img-outer img'), function(i, value) {
			var url = $(this).attr('src');
			strUrl += url + ',';
		});
		strUrl = strUrl.substring(0, strUrl.length - 1);
		$.ajax({
			type: "POST",
			url: headUrl.headUrl + "/v3/store/sampleOrder/storeDeliverFactory",
			dataType: 'json',
			data: {
				sampleId: orderEdit.orderNo,
				expressCompanyStatus: sendStyle,
				expressNo: expressNum,
				expressCompanyName: expressCompanyName,
				remark: sendGoodTextarea,
				img: strUrl
			},
			success: function(res) {
				if(res.success) {
					layer.msg("发货成功!", {
						offset: '50%'
					});
					window.location.reload();

				} else {
					layer.msg("发货失败!", {
						offset: '50%'
					});
				}

			}
		});
	},

	//发货批量上传
	sendGoodNumFunUpload: function() {
		uploadImg({
			ele: "#sendGoods-upload",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 5 - orderEdit.sendGoodNumFun(),
			callback: function(res) {
				var seh = "590"
				$('.orderEdit-sendGoodStore').height(seh);
				$('.upload-word').show();
				var checkAccept = '';
				$.each(res.data, function(i, value) {
					checkAccept += '<div class="checkAccept-img-outer ut-fl">' +
						'<div class="fa fa-upload checkAccept-msgUpload"></div>' +
						'<p class="ut-font12 checkAccept-p">上传图片</p>' +
						'<img src="' + value + '" alt="" class="checkAccept-photo-msg">' +
						'<input type="file" class="upload single-upload orE-file">' +
						'<i class="fa fa-times orE-close" onclick="orderEdit.delSendGood(this)"></i>' +
						'</div>	';
				});
				$('#checkAccept-sendGoodList').append(checkAccept);
				orderEdit.uploadEvent(); //上传单张
				//				orderEdit.sendGoodNumFunUpload(); //上传单张
				$("#sendGoodNum").html(orderEdit.sendGoodNumFun());
			}
		});
	},
	//判断一共有多少张图片 发货
	sendGoodNumFun: function() {
		return $("#checkAccept-sendGoodList .checkAccept-img-outer").length;

	},
	//delSendGood
	delSendGood: function(obj) {
		$(obj).parent('.checkAccept-img-outer').remove();
		$("#sendGoodNum").html(orderEdit.sendGoodNumFun());
	},
	//半成品 收货并通知用户试衣
	//不含胚样试衣 以及 成品 门店确定收货
	goodsReceipt: function(reStatus) {
		layer.confirm('确定收货？', {
			title: '提示',
			offset: "50%",
			btn: ['确定', '取消']
		}, function() {
			$.ajax({
				type: "POST",
				url: headUrl.headUrl + "/v3/store/sampleOrder/storeReceipt",
				async: true,
				data: {
					id: orderEdit.orderNo,
					isFitting: reStatus
				},
				dataType: 'json',
				success: function(res) {
					if(res.success) {
						layer.msg(res.msg, {
							offset: '50%'
						});
						orderEdit.initOrderInfo(4);
					} else {
						layer.msg(res.msg, {
							offset: '50%'
						});
					}
				}
			});
		}, function() {

		});
	},

	//发货给用户
	sendStyle: function() {

		$('#sendGoods').removeClass('ut-none');
		$('#sendGoodsOption select[name="sendStyle"]').change(function() {
			//清空
			$('.sendStyle-name1 option[value=0]').attr('checked', 'true');
			$('.expressCompanyName').val('');
			var check = $('#sendGoodsOption').find('option:selected').val();
			if(check == 0) {
				$('.select-style').removeClass('ut-none');
				$.ajax({
					type: "GET",
					url: headUrl.headUrl + "/v3/store/order/expressConpany",
					async: true,
					dataType: 'json',
					success: function(res) {
						var data = res.data;
						if(res.success) {
							if(orderEdit.delivery == 1) {
								$('#sendName').removeClass('ut-none');
							}
							$('.sendStyle-name1').html('');
							var html = '<option value="">请选择物流公司名称</option>';
							$.each(data, function(i, value) {
								html += '<option value="' + value.id + '">' + value.companyName + '</option>';
							})
							$('.sendStyle-name1').html(html);
						}
					}
				});
			} else {
				$('.select-style').addClass('ut-none');
				$('#sendName').addClass('ut-none');
			}
		});
		//发货给用户
		$('#sendStyleSubmit').on('click', function() {
			orderEdit.sendStyleSubmit();
		})
	},
	//	发货给用户提交
	sendStyleSubmit: function() {
		var expressNum = null;
		var expressCompanyId = null;
		var expressCompanyName = null;
		var sendStyle = $('.sendStyle1 option:checked').val();
		//收货人姓名
		var sendNameName = $('.sendName-name').val();
		var sendNamePhone = $('.sendName-phone').val();
		var sendNameAddress = $('.sendName-address').val();
		var province = $("#sheng").val();
		var city = $("#shi").val();
		var district = $("#xian").val();
		var street = $("#jiedao").val();

		if(sendStyle == "2") {
			layer.msg('请选择发货方式！', {
				offset: '50%'
			})
			return;
		} else if(sendStyle == '0') {
			expressNum = $('.expressCompanyName1').val(); //编号
			expressCompanyId = $('.sendStyle-name1 option:checked').val(); //快递公司
			expressCompanyName = $('.sendStyle-name1 option:checked').text(); //快递公司
			if(expressCompanyId == "") {
				layer.msg('请选择快递公司！', {
					offset: '50%'
				});
				return;
			} else if(expressNum == "") {
				layer.msg('请填写快递单号！', {
					offset: '50%'
				});
				return;
			}

			if(orderEdit.delivery == 1) {
				if(sendNameName == '') {
					layer.msg('请填写收货人姓名！', {
						offset: '50%'
					});
					return;
				}
				if(sendNamePhone == '') {
					layer.msg('请填写收货人电话！', {
						offset: '50%'
					});
					return;
				}
				if(province == '-1') {
					layer.msg('请选择省份！', {
						offset: '50%'
					});
					return;
				}
				if(city == '') {
					layer.msg('请选择城市！', {
						offset: '50%'
					});
					return;
				}
				if(district == '') {
					layer.msg('请选择区/县！', {
						offset: '50%'
					});
					return;
				}
				if(street == '') {
					layer.msg('请填写详细地址！', {
						offset: '50%'
					});
					return;
				}
			}

		}
		var data = {
			orderNo: orderEdit.orderNo,
			expressCompanyId: expressCompanyId,
			expressNo: expressNum,
			expressCompanyName: expressCompanyName,
		};
		if((orderEdit.delivery == 1) && (sendStyle === '0')) {
			data["receiver"] = sendNameName;
			data["phone"] = sendNamePhone;
			data["province"] = province;
			data["city"] = city;
			data["district"] = district;
			data["address"] = street;
		};
		$.ajax({
			type: "POST",
			url: headUrl.headUrl + "/v3/store/order/orderDelivery",
			dataType: 'json',
			data: data,
			success: function(res) {
				if(res.success) {
					layer.msg("发货成功!", {
						offset: '50%'
					});
					window.location.reload();

				} else {
					layer.msg("发货失败!", {
						offset: '50%'
					});
				}

			}
		});
	}
}
$(function() {
	orderEdit.init();
})
