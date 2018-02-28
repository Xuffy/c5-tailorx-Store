var bkId = sessionStorage.getItem('bokeShowEditId'); //添加  id为空      修改有id  
var bkType = sessionStorage.getItem('bokeShowEditIdType'); //判断入口  1为添加  2为修改
var bokeDetail = {
	init: function() {
		this.addBokeFun();
	},
	addBokeFun: function() {
		//获取初始数值
		if(bkType == 2 && bkId) {
			$.ajax({
				type: "post",
				url: headUrl.headUrl + "/v3/store/plateType/getPlateTypeInfo",
				dataType: 'json',
				data: {
					id: bkId
				},
				success: function(res) {
					var data = res.data;
					if(res.success) {
						//设计稿
						var imgOuterHtml = "";
						$.each(data.plateTypePicList, function(i, value) {
							imgOuterHtml += '<div class="ut-fl accessoryOnly">' +
								'<div class="ut-inline-block">' +
								'<div class="img-outer">' +
								'<div class="back-imgPlus"></div>' +
								'<img src="' + value.url + '" alt="" class="photo-msg1">' +
								'<label class="portrait-upload">' +
								'<span class="glyphicon glyphicon-cloud-upload ut-font18 cur"></span>' +
								'<span class="ut-font18 ut-pad-l10 cur"> 上传</span>' +
//								'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="bokeDetail.curPhoto(this)"></span>' +
								'</label>' +
								'<input type="file" class="upload">' +
								'</div>' +
								'</div>' +
								'<div class="ut-inline-block accessory-del" onclick="bokeDetail.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
								'</div>';
						});
						$('#imgOuter-add').before(imgOuterHtml);
						$("#pictureNum").html(bokeDetail.judgePictureNum());
						bokeDetail.uploadEvent();
				bokeDetail.multUpload(); //上传多张
						//设计师说明
						$('#bdText').text(data.description);
						//系统标签
						bokeDetail.stageStyleFun().then(function() {
						if(data.tagSystems) {

							$.each($(data.tagSystems), function(i, value) {
								if(value.type == 1) {
									$.each($("#firstAll .pic-border"), function(i, m) {
										if($(this).data('item-data') == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}else if(value.type == 2){
									$.each($("#secondAll .pic-border"), function(i, m) {
										if($(this).data('item-data') == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}else if(value.type == 3){
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
						if(data.tagCommons) {
							var el = ""
							$('#picTab-Add').html('')
							$.each(data.tagCommons, function(i, value) {
								el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>');
								el.append(value.tagName);
								el.data('item-data', value.id)
								$('#picTab-Add').append(el);
							})
						};
						//标签匹配
						//推荐标签匹配
						bokeDetail.recommendStyleFun().then(function() {
								bokeDetail.recommendFun(); //推荐标签选中
							})
						bokeDetail.picCloseFun(); //删除标签
						//版式图
						if(data.plateTypeBokes){
							var str='';
							$.each(data.plateTypeBokes,function(i,value){
								str += '<div class="cadList-div"><span class="cadListVal" data-id="' + value.size + '">' + value.sizeStr + '码：</span>';
									str += 	'<span class="cadList-file" data-id="' + value.url + '" data-name="' + value.fileName + '">' + value.fileName + '</span><i class="fa fa-times ut-pointer" onclick="bokeDetail.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + value.url + '\'' + ')"></i></div>'
							})
							$('#cadList').append(str);
						bokeDetail.cadUpload();
						$("#cadNum").html(bokeDetail.judgePictureCad());
						}
					}
				},
				error: function() {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			});
		}else{
			
		bokeDetail.stageStyleFun();
		bokeDetail.recommendStyleFun(); //推荐标签
		bokeDetail.recommendFun(); //推荐标签选中
		}
		//获取系统标签
		bokeDetail.addTableBtnFun(); //添加标签
		bokeDetail.picCloseFun(); //删除标签
		bokeDetail.multUpload(); //批量上传
		bokeDetail.cadUpload(); //上传cad
		//点击添加版式图按钮
		$('#bdUploadFormatBtn').unbind('click').on('click', function() {
				$(".bdLabel input[name='size']").prop('checked', false)
				$('#clickOcrea').html('点击上传');
				$('#bdPopSize').show();
			})
			//保存
		$('#bdPicSave').unbind('click').on('click', function() {
			bokeDetail.savabdPicNum();
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
//			'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="bokeDetail.curPhoto(this)"></span>' +
			'</label>' +
			'<input type="file" class="upload">' +
			'</div>' +
			'</div>' +
			'<div class="ut-inline-block accessory-del" onclick="bokeDetail.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
			'</div>';
		$('#imgOuter-add').before(addImgOuter);
		bokeDetail.uploadEvent();
		bokeDetail.multUpload();
		$("#pictureNum").html(bokeDetail.judgePictureNum());
		if($("#imgOuter .accessoryOnly").length >= 20) {
			$('#imgOuter-add').hide();
			return;
		}

	},
	//判断一共有多少张图片
	judgePictureNum: function() {
		return $("#imgOuter .accessoryOnly").length;

	},
	//删除设计师图稿
	imgOuterDel: function(obj) {
		$(obj).parent('.accessoryOnly').remove();
		$("#pictureNum").html(bokeDetail.judgePictureNum());
		bokeDetail.uploadEvent();
	},
	//删除单张
	curPhoto: function(obj) {
		$(obj).parent('.portrait-upload').siblings('img').attr('src', '');
		bokeDetail.uploadEvent();

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
	//批量上传
	multUpload: function() {
		uploadImg({
			ele: "#multUpload",
			type: 1,
			format: ["jpg", "png", "bmp"],
			size: 2,
			num: 20 - bokeDetail.judgePictureNum(),
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
//						'<span class="glyphicon glyphicon-trash ut-font18 cur" onclick="bokeDetail.curPhoto(this)"></span>' +
						'</label>' +
						'<input type="file" class="upload">' +
						'</div>' +
						'</div>' +
						'<div class="ut-inline-block accessory-del" onclick="bokeDetail.imgOuterDel(this)"><i class="fa fa-times ut-color-e ut-font16 ut-pointer"></i></div>' +
						'</div>';
				});
				$('#imgOuter-add').before(addImgOuter1);
				//              bokeDetail.uploadEvent();//上传单张
				bokeDetail.multUpload(); //上传多张

				$("#pictureNum").html(bokeDetail.judgePictureNum());
			}
		});
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
			bokeDetail.ajaxAddTableInput(addTableInput);

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
					bokeDetail.clickAddTable();

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
	//上传文件
	cadUpload: function() {
		uploadImg({
			ele: "#cadUpload",
			isWait: true,
			father: "#cadListPop", //进度条出现的父级元素,
			data: {
				orderNo: 11111
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
						'<span class="cadList-file" data-id="' + value.link + '" data-name="' + value.srcName + '">' + value.srcName + '</span><i class="fa fa-times ut-pointer" onclick="bokeDetail.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + value.link + '\'' + ')"></i></div>'
					bokeDetail.stylePopFunction(value.link, value.srcName);
				});
				$('#clickOcrea').html(str);

			},
			size: 100,
			format: [],
			num: 5 - bokeDetail.judgePictureCad(),
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
		str += '<span class="cadList-file" data-id="' + link + '" data-name="' + desc + '">' + desc + '</span><i class="fa fa-times ut-pointer" onclick="bokeDetail.cadDel(this)"></i> <i class="fa fa-download ut-pointer" onclick="window.open(' + '\'' + link + '\'' + ')"></i></div>'
		$('#cadList').append(str);
		//		})

	},
	//判断一共有多少个文件
	judgePictureCad: function() {
		return $("#cadList .cadList-div").length;

	},
	//  cad删除
	cadDel: function(obj) {
		$(obj).parent('.cadList-div').remove();
		$("#cadNum").html(bokeDetail.judgePictureCad());
		//		bokeDetail.cadUpload();
	},
	//	弹框关闭
	closeFunction: function() {
		$('.ut-layer').hide();
	},
	//编辑取消
	backFunction:function(){
		window.location.href = sessionStorage.getItem('bokeDetailUrl');
	},
	//参数
	savabdPicNum: function() {
		//设计稿
		var imgOuter = [];
		$.each($('#imgOuter .accessoryOnly'), function(i, value) {
			var titleUrl = $(this).find('.photo-msg1').attr('src');
			imgOuter.push(titleUrl);
		});
		var urls = imgOuter.join(",");
		//描述
		var bdDec = $('#bdText').val();
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
		var systemTagArr = [];
		systemTagArr.push($('#firstAll .picBorder-active').data('item-data'));
		systemTagArr.push($('#secondAll .picBorder-active').data('item-data'));
		systemTagArr.push($('#thirdAll .picBorder-active').data('item-data'));
		systemTagArrStr = systemTagArr.join(",");
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
		commonTagsArrStr = commonTagsArr.join(",");
		//选择的尺寸
		var bokeArr = [];
		$.each($('#cadList .cadList-div'), function() {
			var prm = {};
			prm.size = $(this).find('.cadListVal').attr('data-id');
			var sizeName = $(this).find('.cadListVal').text();
			prm.sizeName = sizeName;
			prm.sizeStr = sizeName.substring(0, sizeName.length - 2);
			prm.url = $(this).find('.cadList-file').attr('data-id');
			prm.fileName = $(this).find('.cadList-file').attr('data-name');
			bokeArr.push(prm);

		});
		var data = {
			picUrls: urls,
			description: bdDec,
			tagCommons: commonTagsArrStr,
			tagSystems: systemTagArrStr,
			boke: JSON.stringify(bokeArr),
			type:bkType,
			id:bkId,
		}
		bokeDetail.savabdPicClick(data)
	},
	//保存
	savabdPicClick: function(data) {
		var url="/v3/store/plateType/add";
		if(data.type == 2){
			url="/v3/store/plateType/updatePlateType";
		}
		$.ajax({
			url: headUrl.headUrl + url,
			type: 'post',
			data: data, //
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					layer.msg('成功', {
						offset: '50%'
					});
					window.location.href = sessionStorage.getItem('bokeDetailUrl');
				} else {

					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			}
		})
	},
}
$(function() {
	bokeDetail.init();
})