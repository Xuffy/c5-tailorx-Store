var wdId = sessionStorage.getItem('designerWorkId'); //添加  id为空      修改有id  
var wdType = sessionStorage.getItem('workShowEditIdType'); //判断入口  1为添加  2为修改
var worksDetail = {
	init: function() {
		this.AddWorkDetail(); //初始化
		this.addlineFun(); //添加面辅料
	},
	//初始化
	AddWorkDetail: function() {
		//获取初始数值
		if(wdType == 2 && wdId) {
			$.ajax({
				type: "post",
				url: headUrl.headUrl + "/v3/store/designerWork/detail",
				dataType: 'json',
				data: {
					designerWorkId: wdId
				},
				success: function(res) {
					var data = res.data;
					if(res.success) {
						//标题 价格   设计师评价
						$('#wdTitle').val(data.title);
						$('#wdPrice').val(data.price);
						$('#wdDesiVal').val(data.designerEvaluate);
						//参考图片
						if(res.data.referencePictures) {
							var referencePictures = res.data.referencePictures;
							var referencePicturesNum = referencePictures.split(";");
							worksDetail.referencePicturesFun(referencePicturesNum);
						}
						//设计师稿图片
						if(res.data.designUrl) {
							var designUrl = res.data.designUrl;
							var designUrl = designUrl.split(",");
							worksDetail.designMultUploadFun(designUrl);
						}
						//评价图片
						if(res.data.feedBackPictures) {
							var feedBackPictures = res.data.feedBackPictures;
							var feedBackPicturesNum = [];
							$.each(feedBackPictures,function(i,value){
								feedBackPicturesNum.push(value.picture);
							})
							worksDetail.feedBackPicturesFun(feedBackPicturesNum);
						}
						//设计师说明
						$('#bdText').text(data.description);
						//面料
						if(res.data.lining) {
							var liningArr = JSON.parse(res.data.lining);
							$('#tableLining').html('');
							var html = '';
							html += '<tr><th>编号</th><th>色号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
							$.each(liningArr, function(i, value) {
								html += '<tr class="uploadLing-div"><td><input type="text" class="line-material name1" style="" value="' + value.serialNumber + '"/>' +
									'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + value.colourNumber + '"/></td>' +
									'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传面料</p>';
								html += '<img class="name4" src="' + (!value.picture ? '' : value.picture) + '" alt="" />';
								html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="worksDetail.delorE(this)"></i>' + '</div></td>';
								html += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="worksDetail.addRemove(this)">删除</div></td></tr>';

							});
							$('#tableLining').html(html);
							worksDetail.uploadEvent(); //上传单张
						}
						//里料
						if(res.data.material) {
							$('#tableMaterial').html('');
							var tableMaterialHtml = '';
							tableMaterialHtml += '<tr><th>编号</th><th>色号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
							var material = JSON.parse(res.data.material);
							$.each(material, function(i, value) {
								tableMaterialHtml += '<tr class="uploadLing-div2"><td><input type="text" class="line-material name1" style="" value="' + value.serialNumber + '"/>' +
									'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + value.colourNumber + '"/></td>' +
									'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传里料</p>';
								tableMaterialHtml += '<img class="name4" src="' + (!value.picture ? '' : value.picture) + '" alt="" />';
								tableMaterialHtml += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="worksDetail.delorE(this)"></i>' + '</div></td>';
								tableMaterialHtml += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="worksDetail.addRemove(this)">删除</div></td></tr>';

							})
							$('#tableMaterial').html(tableMaterialHtml);
							worksDetail.uploadEvent(); //上传单张
						}
						//辅料信息
						if(res.data.accessory) {
							$('#tableAccessory').html('');
							var html = '';
							html += '<tr><th>名称</th><th>编号</th><th>图片</th><th>备注</th><th>操作</th></tr>';
							var accessory = JSON.parse(res.data.accessory);
							$.each(accessory, function(i, value) {
								html += '<tr class="uploadLing-div3"><td><input type="text" class="line-material name1" style="" value="' + value.rawMaterials + '"/>' +
									'</td>' + '<td><input type="text" class="line-material name2" style="" value="' + (!value.match ? '' : value.match) + '"/></td>' +
									'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p>';
								html += '<img class="name4" src="' + (!value.picture ? '' : value.picture) + '" alt="" />';
								html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="orderCreation.delorE(this)"></i>' + '</div></td>';
								html += '<td><input type="text" class="line-material name3" style="" value="' + (!value.remark ? '' : value.remark) + '"/></td>' + '<td><div class="ut-btn btn-3" onclick="orderCreation.addRemove(this)">删除</div></td></tr>';

							})

							$('#tableAccessory').html(html);
							worksDetail.uploadEvent(); //上传单张
						}
						//客户评价
						if(res.data.feedBack) {
							var feedBack = res.data.feedBack;
							//评价内容
							$('.wd-evaluate').text(feedBack.content);
							//综合
							for(var i = 1; i <= feedBack.factoryScore; i++) {
								$('.customerNum1 .cust-star' + i).addClass('cust-starActive');
							}
							//设计师
							for(var i = 1; i <= feedBack.designerScore; i++) {
								$('.customerNum2 .cust-star' + i).addClass('cust-starActive');
							}
							//工厂
							for(var i = 1; i <= feedBack.overallScore; i++) {
								$('.customerNum3 .cust-star' + i).addClass('cust-starActive');
							}
						}
						//系统标签
						worksDetail.stageStyleFun().then(function() {
								if(data.systemTags) {

									$.each($(data.systemTags), function(i, value) {
										if(value.type == 1) {
											$.each($("#firstAll .pic-border"), function(i, m) {
												if($(this).data('item-data') == value.id) {
													$(this).addClass('picBorder-active')
												}
											});
										} else if(value.type == 2) {
											$.each($("#secondAll .pic-border"), function(i, m) {
												if($(this).data('item-data') == value.id) {
													$(this).addClass('picBorder-active')
												}
											});
										} else if(value.type == 3) {
											$.each($("#thirdAll .pic-border"), function(i, m) {
												if($(this).data('item-data') == value.id) {
													$(this).addClass('picBorder-active')
												}
											});
										}
									})
								}
							})
							//已选标签
						if(data.commonTags) {
							var el = ""
							$('#picTab-Add').html('')
							$.each(data.commonTags, function(i, value) {
								el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>');
								el.append(value.tagName);
								el.data('item-data', value.id)
								$('#picTab-Add').append(el);
							})
						};
						//标签匹配
						//推荐标签匹配
						worksDetail.recommendStyleFun().then(function() {
							worksDetail.recommendFun(); //推荐标签选中
						})
						worksDetail.picCloseFun(); //删除标签
					}
				},
				error: function() {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			});
		} else {

			worksDetail.stageStyleFun();
			worksDetail.recommendStyleFun(); //推荐标签
			worksDetail.recommendFun(); //推荐标签选中
		}
		//获取系统标签
		worksDetail.addTableBtnFun(); //添加标签
		worksDetail.picCloseFun(); //删除标签
		worksDetail.multUploadPrm(); //批量上传
		worksDetail.multUploadPrmDis(); //批量上传
		worksDetail.multUpload(); //批量上传
		//保存
		$('#wdPicSave').unbind('click').on('click', function() {
			worksDetail.savabdPicNum();
		})
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
//			'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="worksDetail.curPhoto(this)"></span>' +
			'</label>' +
			'<input type="file" class="upload">' +
			'</div>' +
			'</div>' +
			'<div class="ut-inline-block accessory-del" onclick="worksDetail.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
			'</div>';
		$('#imgOuter-add').before(addImgOuter);
		worksDetail.uploadEvent();
		worksDetail.multUpload();
		$("#pictureNum").html(worksDetail.judgePictureNum());
		if($("#imgOuter .accessoryOnly").length >= 20) {
			$('#imgOuter-add').hide();
			return;
		}else{
			$('#imgOuter-add').show();
		}

	},
	//判断一共有多少张图片
	judgePictureNum: function() {
		return $("#imgOuter .accessoryOnly").length;

	},
	//删除设计师图稿
	imgOuterDel: function(obj) {
		$(obj).parent('.accessoryOnly').remove();
		$("#pictureNum").html(worksDetail.judgePictureNum());
		worksDetail.uploadEvent();
		worksDetail.multUpload();
	},
	//删除单张
	curPhoto: function(obj) {
		$(obj).parent('.portrait-upload').siblings('img').attr('src', '');
		worksDetail.uploadEvent();

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
	//参考图片 批量上传
	multUploadPrm: function() {
		uploadImg({
			ele: "#multUploadPrm",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 3 - worksDetail.judgePictureNumPrm(),
			callback: function(res) {
				worksDetail.referencePicturesFun(res.data);
			}
		});
	},
	//参考图片
	referencePicturesFun: function(data) {
		var str = '';
		$.each(data, function(i, value) {
			str += '<div class="ut-fl accessoryOnly" data-id="' + value + '">' +
				'<div class="ut-inline-block">' +
				'<div class="img-outer wd-refer-msg">' +
				'<img src="' + value + '" alt="" class="photo-msg1">' +
				'<label class="portrait-upload">' +
				'<span class="glyphicon glyphicon-cloud-upload ut-font12 cur"></span>' +
				'<span class="ut-font12 ut-pad-l10 cur"> 上传</span>' +
//				'<span class="glyphicon glyphicon-trash ut-font12 cur" style="top:18px;" onclick="worksDetail.curPhoto(this)"></span>' +
				'</label>' +
				'<input type="file" class="upload" style="left:0px;">' +
				'</div>' +
				'</div>' +
				'<div class="ut-inline-block accessory-del" onclick="worksDetail.imgOuterDelPrm(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
				'</div>';
		});
		$('#imgOuter-addPrm').before(str);
		worksDetail.uploadEvent();
		worksDetail.multUploadPrm(); //上传多张
		$("#pictureNumPrm").html(worksDetail.judgePictureNumPrm());
	},
	judgePictureNumPrm: function() {
		return $("#imgOuterPrm .accessoryOnly").length;
	},
	//删除设计师图稿
	imgOuterDelPrm: function(obj) {
		$(obj).parent('.accessoryOnly').remove();
		$("#pictureNumPrm").html(worksDetail.judgePictureNumPrm());
		worksDetail.uploadEvent();
		worksDetail.multUploadPrm();
	},
	//设计稿 批量上传
	multUpload: function() {
		uploadImg({
			ele: "#multUpload",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 20 - worksDetail.judgePictureNum(),
			callback: function(res) {
				worksDetail.designMultUploadFun(res.data);
			}
		});
	},
	designMultUploadFun: function(data) {
		var addImgOuter1 = '';
		$.each(data, function(i, value) {
			addImgOuter1 += '<div class="ut-fl accessoryOnly" data-id="' + value + '">' +
				'<div class="ut-inline-block">' +
				'<div class="img-outer">' +
				'<div class="back-imgPlus"></div>' +
				'<img src="' + value + '" alt="" class="photo-msg1">' +
				'<label class="portrait-upload">' +
				'<span class="glyphicon glyphicon-cloud-upload ut-font18 cur"></span>' +
				'<span class="ut-font18 ut-pad-l10 cur"> 上传</span>' +
//				'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="worksDetail.curPhoto(this)"></span>' +
				'</label>' +
				'<input type="file" class="upload">' +
				'</div>' +
				'</div>' +
				'<div class="ut-inline-block accessory-del" onclick="worksDetail.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
				'</div>';
		});
		$('#imgOuter-add').before(addImgOuter1);
		worksDetail.uploadEvent();
		worksDetail.multUpload(); //上传多张
		$("#pictureNum").html(worksDetail.judgePictureNum());
	},
	//获取系统标签
	stageStyleFun: function() {
		return $.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/tag/getSystemTags",
			async: true,
			dataType: 'json',
			success: function(res) {

				//性别
				var el = '';
				$('#firstAll').html('');
				$.each(res.data.sex, function(i, value) {
					el = $('<div class="pic-border ut-mar-r5">' + value.tagName + '</div>');
					el.text(value.tagName);
					el.data('item-data', value.id)
					$('#firstAll').append(el);
				});
				$('#firstAll').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active')
					})
					//style
				var st = '';
				$('#secondAll').html('');
				$.each(res.data.style, function(i, value) {
					st = $('<div class="pic-border ut-mar-r5">' + value.tagName + '</div>');
					st.text(value.tagName);
					st.data('item-data', value.id)
					$('#secondAll').append(st);
				});
				$('#secondAll').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active')
					})
					//season
				var se = '';
				$('#thirdAll').html('');
				$.each(res.data.season, function(i, value) {
					se = $('<div class="pic-border ut-mar-r5">' + value.tagName + '</div>');
					se.text(value.tagName);
					se.data('item-data', value.id)
					$('#thirdAll').append(se);
				})
				$('#thirdAll').on('click', '.pic-border', function() {
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
				$('#addTableInput').val('');
			}
		});
	},
	//添加标签
	addTableBtnFun: function() {
		$('#addTableBtn').on('click', function() {
			if($('#picTab-Add .pic-border').length > 4) {
				layer.msg('最多选择5个标签!', {
					offset: '50%'
				});
				return;
			}
			//添加选中
			var addTableInput = $('#addTableInput').val();

			if(!addTableInput) {
				layer.msg('请输入标签名字', {
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
			worksDetail.ajaxAddTableInput(addTableInput);

		})
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
	//模糊查询添加标签
	ajaxAddTableInput: function(data) {
		$.ajax({
			type: 'post',
			url: headUrl.headUrl + "/v3/store/tag/searchOrAddCommonTag",
			data: {
				tagName: data
			},
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					$("#picTab-search").html('');
					var str = "";
					str = $('<div class="pic-border ut-mar-r5"></div>');
					str.text(res.data.tagName);
					str.data('item-data', res.data.id)
					$("#picTab-search").append(str);
					worksDetail.clickAddTable();

					var el = '';
					el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>')
					el.append(data);
					el.data('item-data', res.data.id);
					$('#picTab-Add').append(el);
					$('#addTableInput').val("");
					$('#picTab-search').html('');

					$.each($('#picTab-recommend .pic-border'), function(i, value) {
						if($(this).data('item-data') == res.data.id) {
							$(this).addClass('picBorder-active');
							$('#picTab-search').html('');
							$('#eidtTableInput').val('');

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
	//选中查询标签
	clickAddTable: function() {
		$("#picTab-search .pic-border").off("click");
		$("#picTab-search .pic-border").click(function() {
			var _this = $(this);
			_this.addClass("picBorder-active").siblings().removeClass("picBorder-active");
			$("#addTableInput").val(_this.text());
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
	//添加  面料 里料 辅料
	addlineFun: function() {
		$('#addLine').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传面料</p>';
			html += '<img class="name4" src="" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="worksDetail.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="worksDetail.addRemove(this)">删除</div></td></tr>'
			$('#tableLining').append(html);
			worksDetail.uploadEvent(); //上传单张
		});
		$('#addMera').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div2"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传里料</p>';
			html += '<img class="name4" src="" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="worksDetail.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material class="name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="worksDetail.addRemove(this)">删除</div></td></tr>'
			$('#tableMaterial').append(html);
			worksDetail.uploadEvent(); //上传单张
		});
		$('#addAcce').on('click', function() {
			var html = "";
			html += '<tr class="uploadLing-div3"><td><input type="text" class="line-material name1" style="" value=""/>' +
				'</td>' + '<td><input type="text" class="line-material name2" style="" value=""/></td>' +
				'<td><div class="orderMes-msg ut-relative"><p class="orE-p">上传辅料</p>';
			html += '<img class="name4" src="" alt="" />';
			html += '<input type="file" class="upload" style="left:0px;top:0px"/><i class="fa fa-times-circle orE-close" onclick="worksDetail.delorE(this)"></i>' + '</div></td>' + '<td><input type="text" class="line-material name3" style="" value=""/></td>' + '<td><div class="ut-btn btn-3" onclick="worksDetail.addRemove(this)">删除</div></td></tr>'
			$('#tableAccessory').append(html);
			worksDetail.uploadEvent(); //上传单张
		});

	},
	//面料里料辅料删除
	addRemove: function(obj) {
		$(obj).parents('tr').remove();
	},
	//面料里料辅料图片删除
	delorE: function(obj) {
		$(obj).siblings('img').attr('src', '');

	},
	//评论图片 批量上传
	multUploadPrmDis: function() {
		uploadImg({
			ele: "#multUploadDis",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 3 - worksDetail.judgePictureNumDis(),
			callback: function(res) {
				worksDetail.feedBackPicturesFun(res.data);
			}
		});
	},
	//评论图片
	feedBackPicturesFun: function(data) {
		var str = '';
		$.each(data, function(i, value) {
			str += '<div class="ut-fl accessoryOnly" data-id="' + value + '">' +
				'<div class="ut-inline-block">' +
				'<div class="img-outer wd-refer-msg">' +
				'<img src="' + value + '" alt="" class="photo-msg1">' +
				'<label class="portrait-upload">' +
				'<span class="glyphicon glyphicon-cloud-upload ut-font12 cur"></span>' +
				'<span class="ut-font12 ut-pad-l10 cur"> 上传</span>' +
//				'<span class="glyphicon glyphicon-trash ut-font12 cur" style="top:18px;" onclick="worksDetail.curPhoto(this)"></span>' +
				'</label>' +
				'<input type="file" class="upload" style="left:0px;">' +
				'</div>' +
				'</div>' +
				'<div class="ut-inline-block accessory-del" onclick="worksDetail.imgOuterDelFeed(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
				'</div>';
		});
		$('#imgOuter-addDis').before(str);
		worksDetail.uploadEvent();
		worksDetail.multUploadPrmDis(); //上传多张
		$("#pictureNumDis").html(worksDetail.judgePictureNumDis());
	},
	judgePictureNumDis: function() {
		return $("#imgOuterDis .accessoryOnly").length;
	},
	imgOuterDelFeed:function(obj){
		$(obj).parent('.accessoryOnly').remove();
		$("#pictureNumDis").html(worksDetail.judgePictureNumDis());
		worksDetail.uploadEvent();
		worksDetail.multUploadPrmDis();
	},
	savabdPicNum: function() {
		//标题
		var wdTitle = $('#wdTitle').val();
		//价格
		var wdPrice = $('#wdPrice').val();
		//设计师评价
		var wdDesiVal = $('#wdDesiVal').val();
		//参考图片
		var imgOuterPrm = [];
		$.each($('#imgOuterPrm .accessoryOnly'), function(i, value) {
			var titleUrl = $(this).find('.photo-msg1').attr('src');
			imgOuterPrm.push(titleUrl);
		});
		var imgOuterPrmUrls = imgOuterPrm.join(";");
		//设计稿
		var imgOuter = [];
		$.each($('#imgOuter .accessoryOnly'), function(i, value) {
			var titleUrl = $(this).find('.photo-msg1').attr('src');
			imgOuter.push(titleUrl);
		});
		var urls = imgOuter.join(",");
		//用户评价 图片
		var imgOuterDis = [];
		$.each($('#imgOuterDis .accessoryOnly'), function(i, value) {
			var titleUrl = $(this).find('.photo-msg1').attr('src');
			imgOuterDis.push(titleUrl);
		});
		var imgOuterDisUrls = imgOuterDis.join(";");
//		return;
		//标签
		if(!$('#firstAll .picBorder-active').length) {
			return layer.msg('请选择性别标签！', {
				offset: '50%'
			});
		}
		if(!$('#secondAll .picBorder-active').length) {
			return layer.msg('请选择款式标签！', {
				offset: '50%'
			});
		}
		if(!$('#thirdAll .picBorder-active').length) {
			return layer.msg('请选择季节标签！', {
				offset: '50%'
			});
		}
		//		var systemTagArr = [];
		var sexTagId = ($('#firstAll .picBorder-active').data('item-data'));
		var styleTagId = ($('#secondAll .picBorder-active').data('item-data'));
		var seasonTagId = ($('#thirdAll .picBorder-active').data('item-data'));
		//		systemTagArrStr = systemTagArr.join(",");
		//已选择的标签
		var commonTagsArr = [];
		if(!$('#picTab-Add .pic-border').length) {
			return layer.msg('请选择标签！', {
				offset: '50%'
			});
		} else {
			$.each($('#picTab-Add .pic-border'), function() {
				commonTagsArr.push($(this).data('item-data'));
			})
		}
		commonTagsArrStr = commonTagsArr.join("||");
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
		var data = {
			workId: wdId,
			title: wdTitle,
			designerDescription: wdDesiVal,
			price: wdPrice,
			sexTagId: sexTagId,
			styleTagId: styleTagId,
			seasonTagId: seasonTagId,
			commonTags: commonTagsArrStr,
			referencePictures: imgOuterPrmUrls,
			linings: JSON.stringify(linings),
			materials: JSON.stringify(materials),
			accessory: JSON.stringify(ingreLinings),
			designUrl: urls,
			comment: '',
			overallScore: '',
			designerScore: '',
			factoryScore: '',
			feedBackPictures: imgOuterDisUrls
		}
		worksDetail.savabdPicClick(data)
	},
	//保存
	savabdPicClick: function(data) {
		var url = "/v3/store/designerWork/addOrUpdate";
		$.ajax({
			url: headUrl.headUrl + url,
			type: 'post',
			data: data, //
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					var designerWorkId = res.data;
					layer.msg('成功', {
						offset: '50%'
					});
					if(worksDetail.valwDType == 1){
          $.ajax({
            type: "post",
            url: headUrl.headUrl + "/v3/store/designerWork/updateStatus",
            async: true,
            dataType:'json',
            data: {
              designerWorkId: designerWorkId,
              status:2
            },
            success: function (res) {
              if (res.success) {
              	
                window.location.href = sessionStorage.getItem('workDetailUrl');
              } else {
                layer.msg(res.msg, {
                  offset: '50%'
                });
              }

            }
          });
        	}else{
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
	valwDType:'',
	wdOutFunction:function(){
		worksDetail.valwDType = 1;
		worksDetail.savabdPicNum();
	},
	//取消
	backFunction:function(){
		window.location.href = sessionStorage.getItem('workDetailUrl');
	},
}

$(function() {
	worksDetail.init();
})