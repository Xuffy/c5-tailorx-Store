var orderNo = sessionStorage.getItem('orderNo');
var orderMenu = sessionStorage.getItem('tailorx-measurebody-menu');
var orderTacheId = sessionStorage.getItem('tailorx-measurebody-tacheId');
orderWorkNo = "";
var orderCreation = {
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
				$(".bdLabel input[name='size']").prop('checked', false)
				$('#clickOcrea').html('点击上传');
				$('#bdPopSize').show();
			})
			//保存
		$.ajax({
			type: 'post',
			url: headUrl.headUrl + "/v3/store/order/findTaskOrder",
			data: {
				orderNo: orderNo
			}, //
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					//基本信息
					$('#madeNumber').text(res.data.orderQuantity + (res.data.orderQuantityType == 0 ? '件' : '套'));
					$('#isFitting').text((res.data.fitting == 0 || res.data.fitting == 2) ? '否' : '是');
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
								/*str += '<span class="cadList-file" data-id="' + link + '" data-name="' + desc + '">' + desc + '</span><i class="fa fa-times ut-pointer" onclick="orderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + link + '\'' + ')"></i></div>'*/
//									'<div class="cadList-div">' +
									str += 	'<span class="cadList-file" data-id="' + value.url + '" data-name="' + value.name + '">' + value.name + '</span><i class="fa fa-times ut-pointer" onclick="orderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + value.url + '\'' + ')"></i></div>'
							});
						}
						$('#cadList').append(str);
						orderCreation.cadUpload();
						$("#cadNum").html(orderCreation.judgePictureCad());
					}
					//设计稿以及说明
					//					orderCreation.uploadEvent();
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
//									'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="orderCreation.curPhoto(this)"></span>' +
									'</label>' +
									'<input type="file" class="upload">' +
									'</div>' +
									'</div>' +
									'<div class="ut-inline-block accessory-del" onclick="orderCreation.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
									'</div>';
							});
						}
						$('#imgOuter-add').before(imgOuterHtml);
						$("#pictureNum").html(orderCreation.judgePictureNum());
					}
					orderCreation.uploadEvent();
					orderCreation.multUpload();
					//设计师要求
					var des = !res.data.designDescription ? '' : res.data.designDescription;

					des = des.replace(/<br\/>/g, "\n").replace(/&nbsp;/g, " ");
					$('#designDescription').text(des);

					//电子量体数据
					if(res.data.orderBady) {
						var orderBady = JSON.parse(res.data.orderBady),
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
					//真实量体数据
					if(res.data.storeCustomerBodyList) {
						$('#trueMes').html('');
						var bodyStr = "";
						$.each(res.data.storeCustomerBodyList, function(i, value) {
							if(i % 2 == 0) {
								bodyStr += '<tr>';
							}
							if(orderMenu == 1) {
								bodyStr += '<td>' + value.labelName + '</td><td><input type="text" data-id="' + value.labelId + '" value="' + value.strSize + '" readonly /></td>';
							} else {
								bodyStr += '<td>' + value.labelName + '</td><td><input type="text" data-id="' + value.labelId + '" value="' + value.strSize + '" /></td>';
							}
							if(i % 2 != 0) {
								bodyStr += '</tr>';
							}
						})
						$('#trueMes').html(bodyStr);
					}
					//客户照片
					if(res.data.customerBodyPicList) {
						$.each(res.data.customerBodyPicList, function(i, value) {
							if(value.type == 1) {
								$('.back-imgAdd-front').attr('src', value.pictureUrl);
							}
							if(value.type == 2) {
								$('.back-imgAdd-side').attr('src', value.pictureUrl);
							}
							if(value.type == 3) {
								$('.back-imgAdd-back').attr('src', value.pictureUrl);
							}
						});
					}
					//客户需求
					$('.customerRequest').text(res.data.description);
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
								html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="orderCreation.delorE(this)"></i>' + '</div></td>';
								html += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="orderCreation.addRemove(this)">删除</div></td></tr>';
							}

						})

						$('#tableLining').html(html);
						orderCreation.uploadEvent(); //上传单张
					}
					//里料
					orderCreation.customerId = res.data.customerLabel.customerId; //customerId
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
								tableMaterialHtml += '</td>' + '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark  ? '' : value.remark) + '" readonly /></td>' + '<td><div class="ut-btn btn-5">删除</div></td></tr>';
							} else {
								tableMaterialHtml += '<tr class="uploadLing-div2"><td><input type="text" class="line-material name1" style="" value="' + value.serialNumber + '"/>' +
									'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + value.colourNumber + '"/></td>' +
									'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传里料</p>';
								tableMaterialHtml += '<img class="name4" src="' + (!value.picture  ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" />';
								tableMaterialHtml += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="orderCreation.delorE(this)"></i>' + '</div></td>';
								tableMaterialHtml += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="orderCreation.addRemove(this)">删除</div></td></tr>';
							}

						})
						$('#tableMaterial').html(tableMaterialHtml);
						orderCreation.uploadEvent(); //上传单张
						orderCreation.orderWorkNo = res.data.orderWorkNo;
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
									'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + (!value.match? '':value.match) + '" readonly /></td>' +
									'<td>';
								if(value.picture) {
									html += '<div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p><img class="name4" src="' + (!value.picture? '../../img/zhanwei.jpg' : value.picture) + '" alt="" /></div><i class="fa fa-search-plus ut-pointer ut-mar-l5 checkbig">';
								}
								html += '</td>' + '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '" readonly /></td>' + '<td><div class="ut-btn btn-5">删除</div></td></tr>';
							} else {

								html += '<tr class="uploadLing-div3"><td><input type="text" class="line-material name1" style="" value="' + value.rawMaterials + '"/>' +
									'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + (!value.match? '':value.match) + '"/></td>' +
									'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p>';
								html += '<img class="name4" src="' + (!value.picture ? '../../img/zhanwei.jpg' : value.picture) + '" alt="" />';
								html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="orderCreation.delorE(this)"></i>' + '</div></td>';
								html += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="orderCreation.addRemove(this)">删除</div></td></tr>';
							}

						})

						$('#tableAccessory').html(html);
						orderCreation.uploadEvent(); //上传单张
					}
				} else {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			}
		})
	},
	//	弹框关闭
	closeFunction: function() {
		$('.ut-layer').hide();
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
		str += '<span class="cadList-file" data-id="' + link + '" data-name="' + desc + '">' + desc + '</span><i class="fa fa-times ut-pointer" onclick="orderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + link + '\'' + ')"></i></div>'
		$('#cadList').append(str);
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
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="orderCreation.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="orderCreation.addRemove(this)">删除</div></td></tr>'
			$('#tableLining').append(html);
			orderCreation.uploadEvent(); //上传单张
		});
		$('#addMera').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div2"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传里料</p>';
			html += '<img class="name4" src="../../img/zhanwei.jpg" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="orderCreation.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material class="name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="orderCreation.addRemove(this)">删除</div></td></tr>'
			$('#tableMaterial').append(html);
			orderCreation.uploadEvent(); //上传单张
		});
		$('#addAcce').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div3"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p>';
			html += '<img class="name4" src="../../img/zhanwei.jpg" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="orderCreation.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="orderCreation.addRemove(this)">删除</div></td></tr>'
			$('#tableAccessory').append(html);
			orderCreation.uploadEvent(); //上传单张
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
	topCode: function() {
		document.onkeydown = function(e) {
			e = e || window.event;
			var num = 0;
			$.each($(".trName"), function(index) {
				if($(".trName").eq(index).hasClass("trNameDisplay")) {} else {
					$(".trName").eq(index).addClass("trNameBlock");
				}
			});
			$.each($(".trNameBlock"), function(index) {
				$(".trNameBlock").eq(index).find(".designerSize").is(":focus") ? num = index : '';
			});
			switch(e.keyCode) {
				case 38:
					if(num == 0) {
						$(".trNameBlock").eq(0).find(".designerSize").focus();
					} else {
						num--;
						$(".trNameBlock").eq(num).find(".designerSize").focus();
					}
					break; //上

				case 40:
					/*设置焦点代码*/
					if(num == $(".trNameBlock").length - 1) {
						$(".trNameBlock").eq($(".trNameBlock").length - 1).find(".designerSize").focus();
					} else {
						num++;
						$(".trNameBlock").eq(num).find(".designerSize").focus();
					}
					break; //下
			}
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
//			'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="orderCreation.curPhoto(this)"></span>' +
			'</label>' +
			'<input type="file" class="upload">' +
			'</div>' +
			'</div>' +
			'<div class="ut-inline-block accessory-del" onclick="orderCreation.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
			'</div>';
		$('#imgOuter-add').before(addImgOuter);
		orderCreation.uploadEvent();
		orderCreation.multUpload();
		$("#pictureNum").html(orderCreation.judgePictureNum());
		if($("#imgOuter .accessoryOnly").length >= 20) {
			$('#imgOuter-add').hide();
			return;
		}

	},
	//删除设计师图稿
	imgOuterDel: function(obj) {
		$(obj).parent('.accessoryOnly').remove();
		$("#pictureNum").html(orderCreation.judgePictureNum());
		orderCreation.uploadEvent();
	},
	//返回
	comeBack: function() {
		window.location.href = sessionStorage.getItem('orderEditUrl');
	},
	//保存
	savaOrderClick: function(type) {
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
		var checkValues = [];
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
			taskorderNo: orderCreation.orderWorkNo,
			designUrl: urls,
			designDescription: des,
			orderType: JSON.stringify(checkValues),
			orderBady: JSON.stringify(customerBodyData),
			//			cadSize: cadListValArrStr,
			cadUrlSize: cadUrl,
			orderNo: orderNo,
			customerId: orderCreation.customerId,
			//面料里料辅料
			linings: JSON.stringify(linings),
			materials: JSON.stringify(materials),
			accessory: JSON.stringify(ingreLinings),
			bodyList: JSON.stringify(arr), //身高数据
			//正面背面侧面
			bodyFront: $('.back-imgAdd-front').attr('src'),
			bodyLateral: $('.back-imgAdd-side').attr('src'),
			bodyRear: $('.back-imgAdd-back').attr('src')
		}
		$.ajax({
			type: 'post',
			url: headUrl.headUrl + "/v3/store/order/updateTaskOrder",
			data: data, //
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					if(type == 1 && (orderTacheId ==8 || orderTacheId ==28)) {
						$.ajax({
							type: "post",
							url: headUrl.headUrl + "/v3/store/order/saveTaskOrder",
							async: true,
							dataType: 'json',
							data: {
								taskorderNo: orderCreation.orderWorkNo,
								orderNo: orderNo
							},
							success: function(res) {
								if(res.success) {

									window.location.href = sessionStorage.getItem('orderEditUrl');
								} else {
									layer.msg(res.msg, {
										offset: '50%'
									});
								}

							}
						});
					} else if(type == 1 && (orderTacheId ==23 || orderTacheId ==24)) {
						$.ajax({
							type: "post",
							url: headUrl.headUrl + "/v3/store/order/enteringWorkOrder",
							async: true,
							dataType: 'json',
							data: {
								taskorderNo: orderCreation.orderWorkNo,
								orderNo: orderNo,
							},
							success: function(res) {
								if(res.success) {

									window.location.href = sessionStorage.getItem('orderEditUrl');
								} else {
									layer.msg(res.msg, {
										offset: '50%'
									});
								}

							}
						});
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
			orderCreation.savaOrderClick(1); //1 提交

		});

	},
	//批量上传
	multUpload: function() {
		uploadImg({
			ele: "#multUpload",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 20 - orderCreation.judgePictureNum(),
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
//						'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="orderCreation.curPhoto(this)"></span>' +
						'</label>' +
						'<input type="file" class="upload">' +
						'</div>' +
						'</div>' +
						'<div class="ut-inline-block accessory-del" onclick="orderCreation.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
						'</div>';
				});
				$('#imgOuter-add').before(addImgOuter1);
				//              orderCreation.uploadEvent();//上传单张
				orderCreation.multUpload(); //上传多张

				$("#pictureNum").html(orderCreation.judgePictureNum());
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
			data: {
				orderNo: orderNo
			},
			type: 1,
			apiUrl: '/v2/store/file/uploadFilesUrl',
			before: function() {
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
						'<span class="cadList-file" data-id="' + value.link + '" data-name="' + value.description + '">' + value.description + '</span><i class="fa fa-times ut-pointer" onclick="orderCreation.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + value.link + '\'' + ')"></i></div>'
					orderCreation.stylePopFunction(value.link, value.description);
				});
				$('#clickOcrea').html(str);

			},
			size: 100,
			format: [],
			num: 5 - orderCreation.judgePictureCad(),
		});

	},
	//判断一共有多少个文件
	judgePictureCad: function() {
		return $("#cadList .cadList-div").length;

	},
	//  cad删除
	cadDel: function(obj) {
		$(obj).parent('.cadList-div').remove();
		$("#cadNum").html(orderCreation.judgePictureCad());
		//		orderCreation.cadUpload();
	},

	curPhoto: function(obj) {
		$(obj).parent('.portrait-upload').siblings('img').attr('src', '');
		orderCreation.uploadEvent();

	},
}
$(function() {
	orderCreation.init();
})