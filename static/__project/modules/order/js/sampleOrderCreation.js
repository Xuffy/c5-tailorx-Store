var sampleType = sessionStorage.getItem('tailorx-sampleMeasurebody-type');
var sampleNo='';
var orderNo = '';
var orderMenu = '';
var orderTacheId = '';
if(sampleType == 0) {// 0修改  1添加
	 orderNo = sessionStorage.getItem('tailorx-sampleMeasurebody-orderNo');
	 orderMenu = sessionStorage.getItem('tailorx-sampleMeasurebody-menu');
	orderTacheId = sessionStorage.getItem('tailorx-sampleMeasurebody-tacheId');
	if(orderTacheId == 99){
		$('input').attr('disabled',true);
		$('textarea').attr('disabled',true);

		$('.hideStatus').hide();
	}
} else if(sampleType == 1){
	orderNo = '';
	orderMenu = '';
	orderTacheId = '';
}
orderWorkNo = "";
var sampleOrderCreation = {
	init: function() {
		this.getOrderInfo();
		//		this.uploadEvent();
		//		批量上传
		//		this.multUpload();
		//		删除
		this.judgePictureNum();
		this.cadUpload(); //上传cad
		this.topCode();
		this.addlineFun();
		this.checkBigPictureFun(); //放大图
	},
	customerId: '',
	//获取工单信息
	getOrderInfo: function() {
		$('#bdUploadFormatBtn').unbind('click').on('click', function() {
			if(!orderNo){
					return  layer.msg('请先保存后再上传CAD文件！', {
						offset: '50%'
					});
				}
				$(".bdLabel input[name='size']").prop('checked', false)
				$('#clickOcrea').html('<div class="ut-btn btn-1">点击上传</div>');
				$('#bdPopSize').show();
			})
			//定制数量
		$('.sampleNum').on('click', function() {
			var num = $(this).siblings('.sizeNum').text();
			var dataId = $(this).attr('data-id');
			if($(this).prop("checked")) {
				/*$(this).siblings('.sampleNumUnit').show();
				$(this).css('margin-top', '10px')*/
				var html ="";
			html+='<div class="ut-mar-t10">'+
									'<span class="ut-va-middle" data-id="'+dataId+'">'+num+'</span>：'+
								'<span class="sampleNumUnit">'+
									'<input type="text" class="ut-input w-35" style="width:140px"/>&ensp;件'+
								'</span>'+
								'</div>';
						$('#selectSampleList').append(html);
			} else {
				$('#selectSampleList .ut-va-middle[data-id="'+dataId+'"]').parents('.ut-mar-t10').remove();
				/*$(this).siblings('.sampleNumUnit').hide();
				$(this).css('margin-top', '3px')*/
			}
		})
		if(sampleType == 1) {
			$('#comeBack').hide();
			$('#comeBackNext').show();
			sampleOrderCreation.stageStyleFun();
			sampleOrderCreation.recommendStyleFun().then(function() {
				sampleOrderCreation.recommendFun(); //推荐标签选中
			});
			sampleOrderCreation.addTableBtnFun(); //添加标签
			sampleOrderCreation.picCloseFun(); //删除标签
			sampleOrderCreation.cadUpload(); //上传版式图
			sampleOrderCreation.uploadEvent(); //上传单张图片
			sampleOrderCreation.multUpload(); //版式图批量上传
			//面料 里料 辅料
			$('#tableLining').html('');
			var html = '';
			html += '<tr><th>编号</th><th>色号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
			$('#tableLining').html(html);
			sampleOrderCreation.uploadEvent(); //上传单张
			$('#tableMaterial').html('');
			var tableMaterialHtml = '';
			tableMaterialHtml += '<tr><th>编号</th><th>色号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
			$('#tableMaterial').html(tableMaterialHtml);
			$('#tableAccessory').html('');
			var html2 = '';
			html2 += '<tr><th>名称</th><th>编号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
			$('#tableAccessory').html(html2);
			//电子量体数据
			$.each($('.trName'), function(i, value) {
				$(this).find('input').val('');
			});
		} else {
			$('#comeBack').show();
			$('#comeBackNext').hide();
			orderNo = sessionStorage.getItem('tailorx-sampleMeasurebody-orderNo');
			//保存
			$.ajax({
				type: 'post',
				url: headUrl.headUrl + "/v3/store/sampleOrder/edit",
				data: {
					id: orderNo
				}, //
				dataType: 'json',
				success: function(res) {
					if(res.success) {
						sampleNo = res.data.sampleNo;
						var data = res.data;
						//基本信息

						$.each(data.sampleSizeCount,function(i,value){
							var selectHtml='';
							$('.sampleNum[data-id="'+value.size+'"]').attr('checked', true);
							var num = $('.sampleNum[data-id="'+value.size+'"]').siblings('.sizeNum').text()
							selectHtml ='<div class="ut-mar-t10">'+
									'<span class="ut-va-middle" data-id="'+value.size+'">'+num+'</span>：'+
								'<span class="sampleNumUnit">'+
									'<input type="text" class="ut-input w-35" style="width:140px" value="'+value.count+'"/>&ensp;件'+
								'</span>'+
								'</div>';
						$('#selectSampleList').append(selectHtml);

						})
						//订单价格
						$('#samplePrice').val(data.price);
						//基本信息 标签
						//待修改
						//性别  款式季节
						sampleOrderCreation.stageStyleFun().then(function() {
						if(res.data.tagsSystem) {
							$.each(res.data.tagsSystem, function(i, value) {
								if(value.type == 1) {
									$.each($("#picSex-str .pic-border"), function(i, m) {
										if($(this).data('item-data') == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}else if(value.type == 2){
									$.each($("#picStyle-str .pic-border"), function(i, m) {
										if($(this).data('item-data') == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}else if(value.type == 3){
									$.each($("#picSeason-str .pic-border"), function(i, m) {
										if($(this).data('item-data') == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}
							})
						}
								//已选标签
								if(res.data.tagsCommon) {
									var el = ""
									$('#picTab-Add').html('')
									$.each(res.data.tagsCommon, function(i, value) {
										el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>');
										el.append(value.tagName);
										el.data('item-data', value.id)
										$('#picTab-Add').append(el);
									})
								};
							})
							//推荐标签匹配
						sampleOrderCreation.recommendStyleFun().then(function() {
							sampleOrderCreation.recommendFun(); //推荐标签选中

						})
						sampleOrderCreation.addTableBtnFun(); //添加标签
						sampleOrderCreation.picCloseFun(); //删除标签
						//版式图
						if(res.data.cadUrlSize != undefined && res.data.cadUrlSize != "") {
							var data = eval("(" + res.data.cadUrlSize + ")");
							var str = "";
							if(orderMenu == 1) {
								$.each(data, function(i, value) {
									str += '<div class="cadList-div"><span class="cadListVal" data-id="' + value.val + '">' + value.sizeStr + '</span>' +
										'<span class="cadList-file" data-id="' + value.url + '" data-name="' + value.name + '">' + value.name + '</span><i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + value.url + '\'' + ')"></i></div>'
								});
							} else {
								$.each(data, function(i, value) {
									str += '<div class="cadList-div"><span class="cadListVal" data-id="' + value.val + '">' + value.sizeStr + '</span>';
									/*str += '<span class="cadList-file" data-id="' + link + '" data-name="' + desc + '">' + desc + '</span><i class="fa fa-times ut-pointer" onclick="sampleOrderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + link + '\'' + ')"></i></div>'*/
									//									'<div class="cadList-div">' +
									str += '<span class="cadList-file" data-id="' + value.url + '" data-name="' + value.name + '">' + value.name + '</span><i class="fa fa-times ut-pointer" onclick="sampleOrderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + value.url + '\'' + ')"></i></div>'
								});
							}
							$('#cadList').append(str);
							sampleOrderCreation.cadUpload();
							$("#cadNum").html(sampleOrderCreation.judgePictureCad());
						}
						//设计稿以及说明
						//					sampleOrderCreation.uploadEvent();
						//设计师稿图片
						if(res.data.designUrl) {
							var imgOuterHtml = '';
							var designUrl = res.data.designUrl;
							//					var data = eval("(" + res.data.designUrl + ")");
							var designUrlNum = designUrl.split(",");
							if(orderMenu == 1) {
								$.each(designUrlNum, function(i, value) {
									imgOuterHtml += '<div class="ut-fl accessoryOnly">' +
										'<div class="ut-inline-block">' +
										'<div class="img-outer">' +
										'<img src="' + value + '" alt="" class="photo-msg1">' +
										'</div>' +
										'</div>' +
										'</div>';
								});
							} else {
								$.each(designUrlNum, function(i, value) {
									imgOuterHtml += '<div class="ut-fl accessoryOnly">' +
										'<div class="ut-inline-block">' +
										'<div class="img-outer">' +
										'<div class="back-imgPlus"></div>' +
										'<img src="' + value + '" alt="" class="photo-msg1">' +
										'<label class="portrait-upload">' +
										'<span class="glyphicon glyphicon-cloud-upload ut-font18 cur"></span>' +
										'<span class="ut-font18 ut-pad-l10 cur"> 上传</span>' +
										//									'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="sampleOrderCreation.curPhoto(this)"></span>' +
										'</label>' +
										'<input type="file" class="upload">' +
										'</div>' +
										'</div>' +
										'<div class="ut-inline-block accessory-del" onclick="sampleOrderCreation.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
										'</div>';
								});
							}
							$('#imgOuter-add').before(imgOuterHtml);
							$("#pictureNum").html(sampleOrderCreation.judgePictureNum());
						}
						sampleOrderCreation.uploadEvent();
						sampleOrderCreation.multUpload();
						//设计师要求
						var des = !res.data.designerIntroduction ? '' : res.data.designerIntroduction;

						des = des.replace(/<br\/>/g, "\n").replace(/&nbsp;/g, " ");
						$('#designDescription').text(des);

						//设计师尺寸表
						if(res.data.designBody) {
							var orderBady = JSON.parse(res.data.designBody),
								tname = $('.trName');

							$.each(tname, function(i) {
								var isHave = false,
									curEl = tname.eq(i);
								$.each(orderBady, function(n, nVal) {
									if(curEl.find('td').first().attr('class') === nVal.id) {
										curEl.find('td input[type="text"]').val(nVal.designerSize);
										isHave = true;
									}
								});

								if(!isHave) {
									curEl.css({
										display: 'none'
									});
								}
							});
							if(orderMenu == 1) {
								$('.trName input[type="text"]').attr('readonly', true)
							}

						}
						//客户净寸表
						if(res.data.customerBody) {
							var customerBody = JSON.parse(res.data.customerBody);
							$('#trueMes').html('');
							var bodyStr = "";
							$.each(customerBody, function(i, value) {
								if(i % 2 == 0) {
									bodyStr += '<tr>';
								}
								if(orderMenu == 1) {
									bodyStr += '<td>' + value.labelName + '</td><td><input type="text" data-id="' + value.labelId + '" value="' + value.size + '" readonly /></td>';
								} else {
									bodyStr += '<td>' + value.labelName + '</td><td><input type="text" data-id="' + value.labelId + '" value="' + value.size + '" /></td>';
								}
								if(i % 2 != 0) {
									bodyStr += '</tr>';
								}
							})
							$('#trueMes').html(bodyStr);
						}
						//面料 里料
						if(res.data.lining) {
							$('#tableLining').html('');
							var html = '';
							html += '<tr><th>编号</th><th>色号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
							var lining = eval("(" + res.data.lining + ")");
							$.each(lining, function(i, value) {
								if(orderMenu == 1) {
									html += '<tr class="uploadLing-div"><td><input type="text" class="line-material name1" style="" value="' + value.serialNumber + '" readonly />' +
										'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + value.colourNumber + '" readonly/></td>' +
										'<td>';
									if(value.picture) {
										html += '<div class="orderMes-msg ut-relative"><p class="orE-p">上传面料</p><img class="name4" src="' + (!value.picture ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" /></div><i class="fa fa-search-plus ut-pointer ut-mar-l5 checkbig">';
									}
									/*html += '<div class="orderMes-msg ut-relative"><p class="orE-p">上传面料</p><img class="name4" src="' + (value.picture == undefined || value.picture == '' ? '' : value.picture) + '" alt="" /></div>';*/
									html += '</i></td>' + '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '" readonly /></td>' + '<td><div class="ut-btn btn-5 readonly">删除</div></td></tr>';
								} else {
									html += '<tr class="uploadLing-div"><td><input type="text" class="line-material name1" style="" value="' + value.serialNumber + '"/>' +
										'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + value.colourNumber + '"/></td>' +
										'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传面料</p>';
									html += '<img class="name4" src="' + (!value.picture ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" />';
									html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="sampleOrderCreation.delorE(this)"></i>' + '</div></td>';
									html += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="sampleOrderCreation.addRemove(this)">删除</div></td></tr>';
								}

							})

							$('#tableLining').html(html);
							sampleOrderCreation.uploadEvent(); //上传单张
						}
						//里料
//						sampleOrderCreation.customerId = res.data.customerLabel.customerId; //customerId
						if(res.data.material) {
							$('#tableMaterial').html('');
							var tableMaterialHtml = '';
							tableMaterialHtml += '<tr><th>编号</th><th>色号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
							var material = eval("(" + res.data.material + ")");
							$.each(material, function(i, value) {
								if(orderMenu == 1) {
									tableMaterialHtml += '<tr class="uploadLing-div2"><td><input type="text" class="line-material name1" style="" value="' + value.serialNumber + '" readonly />' +
										'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + value.colourNumber + '" readonly /></td>' +
										'<td>';
									if(value.picture) {
										tableMaterialHtml += '<div class="orderMes-msg ut-relative"><p class="orE-p">上传里料</p><img class="name4" src="' + (!value.picture ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" /></div><i class="fa fa-search-plus ut-pointer ut-mar-l5 checkbig">';
									}
									tableMaterialHtml += '</td>' + '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '" readonly /></td>' + '<td><div class="ut-btn btn-5">删除</div></td></tr>';
								} else {
									tableMaterialHtml += '<tr class="uploadLing-div2"><td><input type="text" class="line-material name1" style="" value="' + value.serialNumber + '"/>' +
										'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + value.colourNumber + '"/></td>' +
										'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传里料</p>';
									tableMaterialHtml += '<img class="name4" src="' + (!value.picture ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" />';
									tableMaterialHtml += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="sampleOrderCreation.delorE(this)"></i>' + '</div></td>';
									tableMaterialHtml += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="sampleOrderCreation.addRemove(this)">删除</div></td></tr>';
								}

							})
							$('#tableMaterial').html(tableMaterialHtml);
							sampleOrderCreation.uploadEvent(); //上传单张
							sampleOrderCreation.orderWorkNo = res.data.orderWorkNo;
						}
						//辅料信息
						if(res.data.accessory) {
							$('#tableAccessory').html('');
							var html = '';
							html += '<tr><th>名称</th><th>编号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
							var accessory = eval("(" + res.data.accessory + ")");
							$.each(accessory, function(i, value) {
								if(orderMenu == 1) {
									html += '<tr class="uploadLing-div3"><td><input type="text" class="line-material name1" style="" value="' + value.rawMaterials + '" readonly />' +
										'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + (!value.match ? '' : value.match) + '" readonly /></td>' +
										'<td>';
									if(value.picture) {
										html += '<div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p><img class="name4" src="' + (!value.picture ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" /></div><i class="fa fa-search-plus ut-pointer ut-mar-l5 checkbig">';
									}
									html += '</td>' + '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '" readonly /></td>' + '<td><div class="ut-btn btn-5">删除</div></td></tr>';
								} else {

									html += '<tr class="uploadLing-div3"><td><input type="text" class="line-material name1" style="" value="' + value.rawMaterials + '"/>' +
										'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + (!value.match ? '' : value.match) + '"/></td>' +
										'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p>';
									html += '<img class="name4" src="' + (!value.picture ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" />';
									html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="sampleOrderCreation.delorE(this)"></i>' + '</div></td>';
									html += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="sampleOrderCreation.addRemove(this)">删除</div></td></tr>';
								}

							})

							$('#tableAccessory').html(html);
							sampleOrderCreation.uploadEvent(); //上传单张
						}
					} else {
						layer.msg(res.msg, {
							offset: '50%'
						});
					}
				}
			})
		}
	},
	//	弹框关闭
	closeFunction: function() {
		$('.ut-layer').hide();
	},
	//基本信息 标签获取
	//添加标签
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
			sampleOrderCreation.ajaxFindDesigner(addTableInput);

		})
	},
	// 添加标签
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
	//分类
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
	//推荐标签  选中
	//推荐标签选中
	recommendFun: function() {
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
			} else {
				$(this).addClass('picBorder-active');
				var el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>');
				el.append(rec);
				el.data('item-data', itemData)
				$('#picTab-Add').append(el);
				$('#picTab-search').html('');
				$('#eidtTableInput').val('');
			}
		});
	},
	//删除标签
	picCloseFun: function() {
		$('#picTab-Add').on('click', '.pic-close', function() {
			var dataId = $(this).parent('.pic-border').data('item-data');

			$.each($('#picTab-recommend .pic-border'), function(i, value) {
				if($(this).data('item-data') == dataId) {
					$(this).removeClass('picBorder-active');
					$('#picTab-search').html('');
					$('#addTableInput').val('');

				}

			});
			$(this).parent('.pic-border').remove();
		});
	},
	//版式图弹框
	stylePopFunction: function(link, desc) {
		//		$('#orderCrePopBtn').on('click',function(){

		var le = $(".bdLabel input[name='size']:checked").length;
		var arr = [];
		var nameArr = [];
		var valArr = [];
		$.each($(".bdLabel input[name='size']:checked"), function() {
			var prm = {};
			prm.val = $(this).val();
			prm.name = $(this).parent('label').text();
			arr.push(prm);
			nameArr.push($(this).parent('label').text());
			valArr.push($(this).val());
		})
		var nameArrStr = nameArr.join('/');
		var valArrStr = valArr.join(',')
		var name = $('#clickOcrea').text();
		$('#bdPopSize').hide();
		var str = '';
		str += '<div class="cadList-div"><span class="cadListVal" data-id="' + valArrStr + '">' + nameArrStr + '码：</span>';
		str += '<span class="cadList-file" data-id="' + link + '" data-name="' + desc + '">' + desc + '</span><i class="fa fa-times ut-pointer" onclick="sampleOrderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + link + '\'' + ')"></i></div>'
		$('#cadList').append(str);
		$("#cadNum").html(sampleOrderCreation.judgePictureCad());
		//		})

	},
	//	点击查看大图
	checkBigPictureFun: function() {
		$('.showPhoto').on('click', '.checkbig', function() {
			$('.dx-preview-box').removeClass('ut-none');
			$('#dx-preview-msg').attr('src', $(this).siblings('.orderMes-msg').children('.name4').attr('src'));
		})
	},
	previewClose: function() {
		$('.dx-preview-box').addClass('ut-none');
	},
	//添加  面料 里料 辅料
	addlineFun: function() {
		$('#addLine').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传面料</p>';
			html += '<img class="name4" src="../../img/zhanwei.jpg" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="sampleOrderCreation.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="sampleOrderCreation.addRemove(this)">删除</div></td></tr>'
			$('#tableLining').append(html);
			sampleOrderCreation.uploadEvent(); //上传单张
		});
		$('#addMera').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div2"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传里料</p>';
			html += '<img class="name4" src="../../img/zhanwei.jpg" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="sampleOrderCreation.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material class="name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="sampleOrderCreation.addRemove(this)">删除</div></td></tr>'
			$('#tableMaterial').append(html);
			sampleOrderCreation.uploadEvent(); //上传单张
		});
		$('#addAcce').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div3"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p>';
			html += '<img class="name4" src="../../img/zhanwei.jpg" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="sampleOrderCreation.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="sampleOrderCreation.addRemove(this)">删除</div></td></tr>'
			$('#tableAccessory').append(html);
			sampleOrderCreation.uploadEvent(); //上传单张
		});

	},
	//面料里料辅料删除
	addRemove: function(obj) {
		$(obj).parents('tr').remove();
	},
	//面料里料辅料图片删除
	delorE: function(obj) {
		$(obj).siblings('img').attr('src', '../../img/zhanwei.jpg');

	},
	//电子量体数据 上下移动
	topCode: function() {
		document.onkeydown = function(e) {
			e = e || window.event;
			var num = 0;
			$('.mes-cont table tr.trNameDisplay').remove();
			var inEl = $('.mes-cont table input:focus'),
				trIndex = inEl.parents('tr').index(),

				tdIndex = inEl.parents('td').index(),
				boxEl = inEl.parents('table');

			if(e.keyCode === 38) {
				trIndex--;
			} else if(e.keyCode === 40) {
				trIndex++;
			} else {
				return;
			}
			boxEl.find('tr:eq(' + trIndex + ')').find('td:eq(' + tdIndex + ') input').focus();
		}
	},
	//	添加设计师稿
	imgOuterAdd: function() {
		var addImgOuter = '';
		addImgOuter += '<div class="ut-fl accessoryOnly">' +
			'<div class="ut-inline-block">' +
			'<div class="img-outer">' +
			'<div class="back-imgPlus"></div>' +
			'<img src="" alt="" class="photo-msg1">' +
			'<label class="portrait-upload">' +
			'<span class="glyphicon glyphicon-cloud-upload ut-font18 cur"></span>' +
			'<span class="ut-font18 ut-pad-l10 cur"> 上传</span>' +
			//			'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="sampleOrderCreation.curPhoto(this)"></span>' +
			'</label>' +
			'<input type="file" class="upload">' +
			'</div>' +
			'</div>' +
			'<div class="ut-inline-block accessory-del" onclick="sampleOrderCreation.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
			'</div>';
		$('#imgOuter-add').before(addImgOuter);
		sampleOrderCreation.uploadEvent();
		sampleOrderCreation.multUpload();
		$("#pictureNum").html(sampleOrderCreation.judgePictureNum());
		if($("#imgOuter .accessoryOnly").length >= 20) {
			$('#imgOuter-add').hide();
			return;
		}

	},
	//删除设计师图稿
	imgOuterDel: function(obj) {
		$(obj).parent('.accessoryOnly').remove();
		$("#pictureNum").html(sampleOrderCreation.judgePictureNum());
		sampleOrderCreation.uploadEvent();
	},
	//修改返回
	comeBack: function() {
		window.location.href = "sampleOrderEdit.html?orderNo=" + orderNo;
		/*window.location.href = 'sampleOrderEdit.html';*/
//		window.location.href = sessionStorage.getItem('orderEditUrl');
	},
	//添加返回
	comeBackNext: function() {
		window.location.href = 'sampleOrder.html';
	},
	//保存
	savaOrderClick: function(type) {
		//基本信息
		if(!$('.sampleNum:checked').length){
			return layer.msg('选择定制数量！', {
						offset: '50%'
					});
		}
		var creationNumArr = [];
		var flag = true;
		$.each($('#selectSampleList .ut-mar-t10'), function() {
			var creationNumPrm = {};
//			if($(this).prop('checked')) {
				var num = $(this).children('.sampleNumUnit').find('input').val();
				if(!num) {
					layer.msg('请填写定制数量！', {
						offset: '50%'
					});
					flag = false;
				} else {
					creationNumPrm.size = $(this).children('.ut-va-middle').attr('data-id');
					creationNumPrm.count = num;

				}
				creationNumArr.push(creationNumPrm)
//			}
		});
		if(!flag) return flag=true;
		//价格
		var samplePrice = $('#samplePrice').val();
		if(!samplePrice){
			return layer.msg('请填写订单价格！', {
				offset: '50%'
			});
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
		//性别 款式 季节 标签选择
		var sexTagId = $('#picSex-str .picBorder-active').data('item-data');
		var styleTagId = $('#picStyle-str .picBorder-active').data('item-data');
		var seasonTagId = $('#picSeason-str .picBorder-active').data('item-data');
		//已选择的标签
		var comAdd = '';
		if(!$('#picTab-Add .pic-border').length) {
			return layer.msg('请选择标签！', {
				offset: '50%'
			});
		} else {
			$.each($('#picTab-Add .pic-border'), function() {
//				commonTagsArr.push($(this).data('item-data'));
				comAdd += $(this).data('item-data');
			comAdd += '||';
			})
		}
//		var samCommonTags = commonTagsArr.join("|");
		//板式图
		var cadList = [];

		$.each($('#cadList .cadList-div'), function() {
			var prm = {};
			prm.val = $(this).find('.cadListVal').attr('data-id');
			var sizeName = $(this).find('.cadListVal').text();
			prm.sizeName = sizeName;
			prm.sizeStr = sizeName.substring(0, sizeName.length - 2);
			prm.url = $(this).find('.cadList-file').attr('data-id');
			prm.name = $(this).find('.cadList-file').attr('data-name');
			cadList.push(prm);

		});
		var cadUrl = JSON.stringify(cadList);

		//设计师管理
		var des = $('#designDescription').val();
		des = des.replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;");
		var desArray = des.split('&nbsp;'),
			new_des = '',
			des_num = 0;

		$.each(desArray, function(index, val) {
			if(val) {
				new_des += val;
				des_num = 0;
			} else if(des_num < 4) {
				des_num++;
				new_des += '&nbsp;';
			}
		});

		des = new_des;

		//电子信息
		var customerBodyData = [];
		for(i = 0; i < $('.trName').length; i++) {
			var td = $('.trName').eq(i);
			if(!td.hasClass('trNameDisplay')) {

				var prm = {};
				var firstTd = (td.children()).get(0);
				var designerSize = td.find(".designerSize").val();

				prm.id = firstTd.className;
				prm.designerSize = designerSize;
				customerBodyData.push(prm);
			}
		}

		//辅料信息
		/*var accessories = [];
		 $.each($('#accessory .accessoryOnly'), function(i, value) {
		 var titleName = $(this).find('.msg-titleName-input').val();
		 var titleUrl = $(this).find('.photo-msg1').attr('src');
		 var accessoriesPrm = {};
		 accessoriesPrm.rawMaterials = titleName;
		 accessoriesPrm.picture = titleUrl;

		 accessories.push(accessoriesPrm);
		 });*/
		//面料
		var linings = [];
		$.each($('#tableLining .uploadLing-div'), function(i, value) {
			var prm = {};
			var name1 = $(this).find('.name1').val();
			var name2 = $(this).find('.name2').val();
			var name3 = $(this).find('.name3').val();
			var name4 = $(this).find('.name4').attr('src');
			prm.serialNumber = name1;
			prm.colourNumber = name2;
			prm.remark = name3;
			prm.picture = name4;
			linings.push(prm);
		});
		//里料
		var materials = [];
		$.each($('#tableMaterial .uploadLing-div2'), function(i, value) {
			var prm = {};
			var name1 = $(this).find('.name1').val();
			var name2 = $(this).find('.name2').val();
			var name3 = $(this).find('.name3').val();
			var name4 = $(this).find('.name4').attr('src');
			prm.serialNumber = name1;
			prm.colourNumber = name2;
			prm.remark = name3;
			prm.picture = name4;
			materials.push(prm);
		});
		//辅料
		var ingreLinings = [];
		$.each($('#tableAccessory .uploadLing-div3'), function(i, value) {
			var prm = {};
			var name1 = $(this).find('.name1').val();
			var name2 = $(this).find('.name2').val();
			var name3 = $(this).find('.name3').val();
			var name4 = $(this).find('.name4').attr('src');
			prm.rawMaterials = name1;
			prm.match = name2;
			prm.remark = name3;
			prm.picture = name4;
			ingreLinings.push(prm);
		});
		//身高数据
		var arr = [];
		$.each($('#trueMes input[type="text"]'), function(i, value) {
			var prm = {};
			prm.labelId = $(this).attr('data-id');
			prm.labelName = $(this).parents('td').prev('td').text();
			prm.size = $(this).val();
			arr.push(prm);
		});
		//设计稿
		var imgOuter = [];
		$.each($('#imgOuter .accessoryOnly'), function(i, value) {
			var titleUrl = $(this).find('.photo-msg1').attr('src');
			imgOuter.push(titleUrl);
		});
		var urls = imgOuter.join(",");

		var data = {
			id: orderNo,//id  订单编号
			/*taskorderNo: sampleOrderCreation.orderWorkNo,  //工艺单编号*/
			sizeCount:JSON.stringify(creationNumArr), //样衣尺寸和数量
			price:samplePrice,//订单价格
			//性别款式季节
			sexTagId:sexTagId,
			styleTagId:styleTagId,
			seasonTagId:seasonTagId,
			commonTags : comAdd, //普通的标签
			designUrl: urls,//设计稿图片
			designDescription: des, //设计说明
			designBody: JSON.stringify(customerBodyData), //设计师尺寸表
			customerBody: JSON.stringify(arr), //客户净寸表
			//面料里料辅料
			linings: JSON.stringify(linings),
			materials: JSON.stringify(materials),
			accessory: JSON.stringify(ingreLinings),
			//			cadSize: cadListValArrStr,
			cadUrlSize: cadUrl, //版式图

		}
			sampleOrderCreation.savaOrderClickAjax(type, data);

	},
	//修改保存ajax
	savaOrderClickAjax: function(type, data) {
		$.ajax({
			type: 'post',
			url: headUrl.headUrl + "/v3/store/sampleOrder/addOrUpdate",
			data: data, //
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					var dataId = res.data;
					if(!dataId){
						dataId = orderNo
					}
					if(type == 1) {
						$.ajax({
							type: "post",
							url: headUrl.headUrl + "/v3/store/sampleOrder/commit",
							async: true,
							dataType: 'json',
							data: {
								id: dataId
							},
							success: function(resTwo) {
								if(resTwo.success) {
									window.location.href = "sampleOrderEdit.html?orderNo=" + dataId;
								} else {
									layer.msg(resTwo.msg, {
										offset: '50%'
									});
								}

							}
						});
					} else if(type == 2){
						sampleType = 0;
						sessionStorage.setItem('tailorx-sampleMeasurebody-type',0);
						sessionStorage.setItem('tailorx-sampleMeasurebody-orderNo', res.data.sampleId);
						sampleOrderCreation.getOrderInfo()
						/*window.location.href = 'sampleOrder.html'
						layer.msg('保存成功！', {
							offset: '50%'
						});*/
					}else {
						layer.msg(res.msg, {
							offset: '50%'
						});
					}
				} else {

					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			}
		})
	},
	//提交
	confirmOrderClick: function() {
		layer.confirm('确定提交？', {
			title: '提示',
			offset: '42%',
		}, function() {
			sampleOrderCreation.savaOrderClick(1); //1 提交

		});

	},
	//批量上传
	multUpload: function() {
		uploadImg({
			ele: "#multUpload",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 20 - sampleOrderCreation.judgePictureNum(),
			callback: function(res) {
				var addImgOuter1 = '';
				$.each(res.data, function(i, value) {

					addImgOuter1 += '<div class="ut-fl accessoryOnly" data-id="' + value + '">' +
						'<div class="ut-inline-block">' +
						'<div class="img-outer">' +
						'<div class="back-imgPlus"></div>' +
						'<img src="' + value + '" alt="" class="photo-msg1">' +
						'<label class="portrait-upload">' +
						'<span class="glyphicon glyphicon-cloud-upload ut-font18 cur"></span>' +
						'<span class="ut-font18 ut-pad-l10 cur"> 上传</span>' +
						//						'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="sampleOrderCreation.curPhoto(this)"></span>' +
						'</label>' +
						'<input type="file" class="upload">' +
						'</div>' +
						'</div>' +
						'<div class="ut-inline-block accessory-del" onclick="sampleOrderCreation.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
						'</div>';
				});
				$('#imgOuter-add').before(addImgOuter1);
				//              sampleOrderCreation.uploadEvent();//上传单张
				sampleOrderCreation.multUpload(); //上传多张

				$("#pictureNum").html(sampleOrderCreation.judgePictureNum());
			}
		});
	},
	//判断一共有多少张图片
	judgePictureNum: function() {
		return $("#imgOuter .accessoryOnly").length;

	},
	//上传单张图片
	uploadEvent: function() {
		uploadImg({
			ele: ".upload",
			type: 1,
			callback: function(res, $ele) {
				var $img = $ele.siblings("img");
				$img.attr("src", res.data[0]).css("display", "block");

			},
			format: ["jpg", "png", "bmp"],
			size: 2
		});
	},
	//上传文件
	cadUpload: function() {
		uploadImg({
			ele: "#cadUpload",
			father: "#cadListPop", //进度条出现的父级元素,
			num: 5 - sampleOrderCreation.judgePictureCad(),
			data: {
				orderNo: sampleNo
			},
			type: 1,
			apiUrl: '/v2/store/file/uploadFilesUrl',
			before: function() {

				if($("#cadList .cadList-div").length>=5) {
					layer.msg('文件个数超出数量限制!', {
						offset: '50%'
					});
					return false;
				}
				var le = $(".bdLabel input[name='size']:checked").length;
				if(!le) {
					layer.msg('请选择尺码!', {
						offset: '50%'
					});
					return false;
				}
				return true;
			},
			callback: function(res, $ele) {
				$('#clickOcrea').html('');
				var str = "";
				$.each(res.data, function(i, value) {
					str += '<div class="cadList-div">' +
						'<span class="cadList-file" data-id="' + value.link + '" data-name="' + value.description + '">' + value.description + '</span><i class="fa fa-times ut-pointer" onclick="sampleOrderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + value.link + '\'' + ')"></i></div>'
					sampleOrderCreation.stylePopFunction(value.link, value.description);
				});
				$('#clickOcrea').html(str);
			},
			size: 100,
			format: [],

		});

	},
	//判断一共有多少个文件
	judgePictureCad: function() {
		return $("#cadList .cadList-div").length;

	},
	//  cad删除
	cadDel: function(obj) {
		$(obj).parent('.cadList-div').remove();
		$("#cadNum").html(sampleOrderCreation.judgePictureCad());
		//		sampleOrderCreation.cadUpload();
	},

	curPhoto: function(obj) {
		$(obj).parent('.portrait-upload').siblings('img').attr('src', '');
		sampleOrderCreation.uploadEvent();

	},
}
$(function() {
	sampleOrderCreation.init();
})
