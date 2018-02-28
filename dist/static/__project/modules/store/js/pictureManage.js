var pictureManage = {
	init: function() {
		this.initList();
		this.picNoIssueFun(); //打开编辑图片弹框
		this.noPictureList(0, 8);
		this.outPictureList(0, 8);
		this.checkBigPictureFun(); //点击查看大图
		this.resetFn();
		this.resetFn1();

	},
	//	点击查看大图
	checkBigPictureFun: function() {
		$('#noPicList').on('click', '.checkbig', function() {
			$('.dx-preview-box').show('ut-none');
			$('#dx-preview-msg').attr('src', $(this).attr('src'));
		})
		$('#outPicList').on('click', '.checkbig', function() {
			$('.dx-preview-box').show('ut-none');
			$('#dx-preview-msg').attr('src', $(this).attr('src'));
		})
	},
	//初始化韩式
	initList: function() {
		$('#publishStyle .publishStyle-no').on('click', function() {
			$(this).addClass("pic-active");
			$(this).siblings().removeClass("pic-active");
			$('#picNo-issue').show();
			$('#picOut-issue').hide();
		});
		$('#publishStyle .publishStyle-yes').on('click', function() {
			$(this).addClass("pic-active");
			$(this).siblings().removeClass("pic-active");
			$('#picOut-issue').show();
			$('#picNo-issue').hide();
		});
		$('#noSearch').on('click', function() {
			pictureManage.noPictureList(0, 8);
		});

		$('#outSearch').on('click', function() {
			pictureManage.outPictureList(0, 8);
		});

	},
	//未发布
	noPictureList: function(page, pageLength) {
		//设计师
		var prm = {};
		prm.designerTerm = $('#noDesignerTerm').val();
		prm.searchKey = $('#noKey').val();
		prm.startTime = $('#startTime').val();
		prm.endTime = $('#endTime').val();
		prm.status = 1;
		prm.page = page;
		prm.pageLength = pageLength;
		pictureManage.initAjax(prm);

	},
	outPictureList: function(page, pageLength) {
		//设计师
		var prm = {};
		prm.designerTerm = $('#outDesignerTerm').val();
		prm.searchKey = $('#outKey').val();
		prm.startTime = $('#start').val();
		prm.endTime = $('#end').val();
		prm.status = 2;
		prm.page = page;
		prm.pageLength = pageLength;
		pictureManage.initAjax(prm);
	},
	initAjax: function(type) {

		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/picture/findPictures",
			async: true,
			dataType: 'json',
			data: type,
			success: function(res) {
				var data = res.data;
				if(res.success) {
					if(type.status == 1) {
						pictureManage.pagination(data.totalSize, data.page, data.pageLength);
						$('#noPicList').html('');
						var html = '';
						if(data.data) {

							$.each(data.data, function(i, value) {
								html = $('<div class="ut-inline-block picNo-picture">' +
									'<div class="ut-inline-block picNo-msg"><img src="' + value.imgUrl + '" alt="" class="checkbig"/></div>' +
									'<div class="ut-inline-block picNo-word">' +
									'<p>设计师：' + value.designerName + '</p>' +
									'<p>描述：<span class="picDec">' + value.description + '</span></p>' +
									'<p>标签：<span class="picTagsName">' + (!value.tagsName ? '' : value.tagsName) + '</span></p>' +
									'<p>分配时间：' + value.assignTimeString + '</p>' +
									'</div>' +
									'<div class="picNo-operate">' +
									'<span class="picNo-edit" data-id="' + value + '">编辑</span>' +
									'<span class="picNo-public" onclick="pictureManage.onPublicFun(\'' + value.id + '\',this)">发布</span>' +
									'<span class="picNo-del" onclick="pictureManage.onPublicDelFun(\'' + value.id + '\')">删除</span>' +
									'</div>' +
									'</div>');
								html.data('item-data', value.id);
								$('#noPicList').append(html);
							})
						}

					} else if(type.status == 2) {
						pictureManage.pagination2(data.totalSize, data.page, data.pageLength);
						$('#outPicList').html('');
						var html = '';
						if(data.data) {

							$.each(data.data, function(i, value) {
								html = $('<div class="ut-inline-block picNo-picture">' +
									'<div class="ut-inline-block picNo-msg"><img src="' + value.imgUrl + '" alt="" class="checkbig"/></div>' +
									'<div class="ut-inline-block picNo-word">' +
									'<p>设计师：' + value.designerName + '</p>' +
									'<p>描述：' + value.description + '</p>' +
									'<p>标签：' + (!value.tagsName ? '' : value.tagsName) + '</p>' +
									'<p>发布时间：' + value.publishTimeString + '</p>' +
									'</div>' +
									'<div class="picOut-operate">' +
									'<span class="picSoldOut" onclick="pictureManage.getDownPicFunction(\'' + value.id + '\')">下架</span>' +
									'<span class="picDel" onclick="pictureManage.onPublicDelFun(\'' + value.id + '\')">删除</span>' +
									'</div>' +
									'</div>');
								html.data('item-data', value.id);
								$('#outPicList').append(html);

							})
						}
					}
				} else {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			},
			error: function() {
				layer.msg('网络异常', {
					offset: '50%'
				});
			}
		});
	},
	//重置
	resetFn: function() {
		$('#res').on('click', function() {
			$('option[selected]').removeAttr('selected');
			$('#formTable')[0].reset();
			pictureManage.noPictureList(0, 8);
		});
	},
	resetFn1: function() {
		$('#res1').on('click', function() {
			$('option[selected]').removeAttr('selected');
			$('#formTable1')[0].reset();
			pictureManage.outPictureList(0, 8);
		});
	},
	picNoIssueFun: function() {
		//未发布 点击编辑
		$('#picNo-issue').on('click', '.picNo-edit', function() {
			var uId = $(this).parents('.picNo-picture').data('item-data');
			$.ajax({
				type: "post",
				url: headUrl.headUrl + "/v3/store/picture/editPicture",
				async: true,
				dataType: 'json',
				data: {
					pictureId: uId
				},
				success: function(res) {
					var data = res.data;
					$('#picNo-editPhoto').show();
					//上传
					pictureManage.settingUpload();
					//图片
					$('.picStyle-photo img').attr('src', data.pictureInfo.imgUrl)
						//设计师名称
					$('#picEdit-desName').text(data.pictureInfo.designerName);
					//描述
					$('.picEdit-desition').val(data.pictureInfo.description);
					//系统标签 性别
					var sexStr = '';
					$('#picSex-str').html('');
					$.each(data.systemTags.sex, function(i, value) {
						sexStr += '<div class="pic-border ut-mar-r5" data-id="' + value.id + '">' + value.tagName + '</div>';
					});
					$('#picSex-str').html(sexStr);
					//性别点击
					$('.picSex').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active');
					});
					//系统标签 款式
					var styleStr = '';
					$('#picStyle-str').html('');
					$.each(data.systemTags.style, function(i, value) {
						styleStr += '<div class="pic-border ut-mar-r5" data-id="' + value.id + '">' + value.tagName + '</div>';
					});
					$('#picStyle-str').html(styleStr);
					//款式点击
					$('.picStyle').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active');
					});

					//系统标签 季节
					var seasonStr = '';
					$('#picSeason-str').html('');
					$.each(data.systemTags.season, function(i, value) {
						seasonStr += '<div class="pic-border ut-mar-r5" data-id="' + value.id + '">' + value.tagName + '</div>';
					});
					$('#picSeason-str').html(seasonStr);
					//季节点击
					$('.picSeason').on('click', '.pic-border', function() {
						$(this).addClass('picBorder-active');
						$(this).siblings().removeClass('picBorder-active');
					});
					if(data.pictureInfo.tagsSystem) {
						$.each(data.pictureInfo.tagsSystem, function(i, value) {
							if(value.type == 1) {
								$('#picSex-str .pic-border[data-id="' + value.id + '"]').addClass('picBorder-active')
							} else if(value.type == 2) {
								$('#picStyle-str .pic-border[data-id="' + value.id + '"]').addClass('picBorder-active')
							} else if(value.type == 3) {
								$('#picSeason-str .pic-border[data-id="' + value.id + '"]').addClass('picBorder-active')
							}
						})
					}
					//添加标签选中后 添加
					pictureManage.addTableBtnFun();
					//已选标签
					$('#picTab-Add').html('');
					if(data.pictureInfo.tagsCommon) {

						$.each(data.pictureInfo.tagsCommon, function(i, value) {
							var al = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>')
							al.append(value.tagName);
							al.data('item-data', value.id);
							$('#picTab-Add').append(al);
						})
					}
					//推荐标签
					$('#picTab-recommend').html('');
					$.each(data.commonTags, function(i, value) {
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
					//推荐标签选中
					pictureManage.recommendFun();
					//选中
					pictureManage.picCloseFun();
					//保存
					$('#picSave').off();
					$('#picSave').on('click', function() {
							pictureManage.savePictureManFun(uId, 1);
						})
						//发布
					$('#publicOut').off();
					$('#publicOut').on('click', function() {
						pictureManage.savePictureManFun(uId, 2);
					})
				},
				error: function() {
					layer.msg('网络异常', {
						offset: '50%'
					});
				}

			});

		});

	},
	//图文设置单张上传
	settingUpload: function() {
		uploadImg({
			ele: ".msgUpload",
			format: ["png", "jpg"],
			size: 2,
			callback: function(res, ele) {
				ele.siblings("img").attr("src", res.data[0]);
			},
			type: 1,
		});
	},
	//onPublicDelFun 未发布 删除
	onPublicDelFun: function(id) {
		//已发布 删除
		layer.confirm('确定删除？', {
				offset: "50%",
				title: '操作',
				btn: ['确定', '取消']
			},
			function() {
				$.ajax({
					type: "post",
					url: headUrl.headUrl + "/v3/store/picture/deletePicture",
					async: true,
					dataType: 'json',
					data: {
						pictureId: id
					},
					success: function(res) {
						if(res.success) {
							pictureManage.outPictureList(0, 8);
							pictureManage.noPictureList(0, 8);
							layer.msg('删除成功', {
								offset: '50%'
							})
						} else {
							layer.msg(res.msg, {
								offset: '50%'
							})
						}
					},
					error: function() {
						layer.msg('网络异常', {
							offset: '80%'
						})
					}
				});
			},
			function() {});
	},
	//未发布 发布
	onPublicFun: function(id, _this) {
		var decL = $(_this).parents('.picNo-picture').find('.picDec').text().length;
		var tagN = $(_this).parents('.picNo-picture').find('.picTagsName').text().length;
		if(!decL) {
			layer.msg('请输入描述', {
				offset: '50%'
			});
			return;
		}
		if(!tagN) {
			layer.msg('请输入标签', {
				offset: '50%'
			});
			return;
		}
		layer.confirm('确定发布？', {
				offset: "50%",
				title: '操作',
				btn: ['确定', '取消']
			},
			function() {
				$.ajax({
					type: "post",
					url: headUrl.headUrl + "/v3/store/picture/publishPicture",
					async: true,
					dataType: 'json',
					data: {
						pictureId: id
					},
					success: function(res) {
						if(res.success) {
							pictureManage.noPictureList(0, 8);
							pictureManage.outPictureList(0, 8);
							$('#picNo-editPhoto').hide();
							layer.msg('发布成功', {
								offset: '50%'
							});
						} else {
							layer.msg(res.msg, {
								offset: '50%'
							});
						}
					},
					error: function() {
						layer.msg('网络异常', {
							offset: '80%'
						})
					}
				});
			},
			function() {});
	},
	//发布 下架
	getDownPicFunction: function(id) {
		//已发布 下架
		layer.confirm('确定下架？', {
				offset: "50%",
				title: '操作',
				btn: ['确定', '取消']
			},
			function() {
				$.ajax({
					type: "post",
					url: headUrl.headUrl + "/v3/store/picture/unShelvePicture",
					async: true,
					dataType: 'json',
					data: {
						pictureId: id
					},
					success: function(res) {
						if(res.success) {
							pictureManage.outPictureList(0, 8);
							pictureManage.noPictureList(0, 8);
							layer.msg('下架成功', {
								offset: '50%'
							});
						} else {
							layer.msg(res.msg, {
								offset: '50%'
							});
						}
					},
					error: function() {
						layer.msg('网络异常', {
							offset: '80%'
						})
					}
				});
			},
			function() {});

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
	//搜索标签选中
	/*clickDesigner: function() {
		$("#picTab-search .pic-border").off("click");
		$("#picTab-search .pic-border").click(function() {
			var _this = $(this);
			_this.addClass("picBorder-active").siblings().removeClass("picBorder-active");
			$("#addTableInput").val(_this.text());
		});
	},*/
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
			pictureManage.ajaxFindDesigner(addTableInput);

		})
	},
	//推荐标签
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
	//保存
	savePictureManFun: function(id, type) {
		var cover = $('#picEdit-coverpic').attr('src');
		var des = $('.picEdit-desition').val();
		var sex = $('#picSex-str .picBorder-active').attr('data-id');
		var style = $('#picStyle-str .picBorder-active').attr('data-id');
		var season = $('#picSeason-str .picBorder-active').attr('data-id');
		if(!cover) {
			layer.msg('请上传图片！'), {
				offset: '50%'
			}
			return;
		}
		if(!des) {
			layer.msg('请输入描述！'), {
				offset: '50%'
			}
			return;
		};
		if(!sex) {
			layer.msg('请选择性别标签！'), {
				offset: '50%'
			}
			return;
		};
		if(!style) {
			layer.msg('请选款式标签！'), {
				offset: '50%'
			}
			return;
		};
		if(!season) {
			layer.msg('请选择季节标签！'), {
				offset: '50%'
			}
			return;
		};
		var comAdd = ''
		$.each($('#picTab-Add .pic-border'), function(i, value) {
			comAdd += $(this).data('item-data');
			comAdd += '||';
		});
		if(!comAdd) {
			layer.msg('请选择标签', {
				offset: '50%'
			});
			return;
		}
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/picture/savePicture",
			async: true,
			dataType: 'json',
			data: {
				pictureId: id,
				picUrl: cover,
				description: des,
				sexTagId: sex,
				styleTagId: style,
				seasonTagId: season,
				commonTags: comAdd
			},
			success: function(res) {
				if(res.success) {
					if(type == 1) {
						$('#picNo-editPhoto').hide();
						pictureManage.noPictureList({
							status: 2,
							page: 0,
							pageLength: 30
						});
					} else if(type == 2) {
						layer.confirm('确定发布？', {
								offset: "50%",
								title: '操作',
								btn: ['确定', '取消']
							},
							function() {
								$.ajax({
									type: "post",
									url: headUrl.headUrl + "/v3/store/picture/publishPicture",
									async: true,
									dataType: 'json',
									data: {
										pictureId: id
									},
									success: function(res) {
										if(res.success) {
											pictureManage.noPictureList(0, 8);
											pictureManage.outPictureList(0, 8);
											$('#picNo-editPhoto').hide();
											layer.msg('发布成功', {
												offset: '50%'
											});
										} else {
											layer.msg(res.msg, {
												offset: '50%'
											});
										}
									},
									error: function() {
										layer.msg('网络异常', {
											offset: '80%'
										})
									}
								});
							},
							function() {});
					}
				} else {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			},
			error: function() {
				layer.msg("网络异常", {
					offset: '50%'
				})
			}
		});

	},
	//	弹框关闭
	closeFunction: function() {
		$('.ut-layer').hide();
	},
	previewClose: function() {
		$('.dx-preview-box').hide('ut-none');
	},
	//分页
	pagination: function(total, page, pageLength) {
		$('#templatePage').pagination({
			totalData: total, //总条数
			showData: pageLength, //每页显示条数
			jump: true, //跳转
			current: page + 1, //当前页
			coping: true, //首页和尾页
			count: 3, //当前页前后分页个数
			homePage: '首页',
			endPage: '末页',
			prevContent: '上页',
			nextContent: '下页',
			callback: function(index) {
				pictureManage.noPictureList(index.getCurrent() - 1, 8);
			}
		});
	},
	pagination2: function(total, page, pageLength) {
		$('#templatePage2').pagination({
			totalData: total, //总条数
			showData: pageLength, //每页显示条数
			jump: true, //跳转
			current: page + 1, //当前页
			coping: true, //首页和尾页
			count: 3, //当前页前后分页个数
			homePage: '首页',
			endPage: '末页',
			prevContent: '上页',
			nextContent: '下页',
			callback: function(index) {
				pictureManage.outPictureList(index.getCurrent() - 1, 8);
			}
		});
	},
}
$(function() {
	//时间插件
	var startTime = {
		elem: '#startTime',
		format: 'YYYY-MM-DD',
		istime: false,
		istoday: false,

		choose: function(datas) {
			endTime.min = datas; //开始日选好后，重置结束日的最小日期
			endTime.start = datas //将结束日的初始值设定为开始日
		},
		clear: function(datas) {
			endTime.min = '';
		}
	};
	var endTime = {
		elem: '#endTime',
		format: 'YYYY-MM-DD',
		istime: false,
		istoday: false,

		choose: function(datas) {
			startTime.max = datas; //开始日选好后，重置结束日的最小日期
			startTime.start = datas //将结束日的初始值设定为开始日
		},
		clear: function(datas) {
			startTime.max = '2099-06-16 23:59:59';
		}
	};
	laydate(startTime);
	laydate(endTime);

	//时间插件
	var start = {
		elem: '#start',
		format: 'YYYY-MM-DD',
		istime: false,
		istoday: false,

		choose: function(datas) {
			end.min = datas; //开始日选好后，重置结束日的最小日期
			end.start = datas //将结束日的初始值设定为开始日
		},
		clear: function(datas) {
			end.min = '';
		}
	};
	var end = {
		elem: '#end',
		format: 'YYYY-MM-DD',
		istime: false,
		istoday: false,

		choose: function(datas) {
			start.max = datas; //开始日选好后，重置结束日的最小日期
			start.start = datas //将结束日的初始值设定为开始日
		},
		clear: function(datas) {
			start.max = '2099-06-16 23:59:59';
		}
	};
	laydate(start);
	laydate(end);

})
$(function() {
	pictureManage.init();
})