var newsId = sessionStorage.getItem('store-infoId');
var newsEidt = sessionStorage.getItem('newsEidt');
var informationNo;
var newDetail = {
	//查看详情
	timer:null,
	initNew: function() {
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v2/store/news/newsDetailPage",
			data: {
				newsId: newsId
			},

			success: function(res) {
				var res = eval('(' + res + ')');
				if(res.success) {
					var data = res.data;
//					newDetail.stageStyleFun().then(function() {
						$('#message-informationNo').text(data.information.informationNo);

						$('#message-name').text(data.information.name);
						$('#message-description').text(data.information.description);
						$('#message-designerName').text(data.information.designerName);
						if(data.information.designerPhoto == '') {
							$('#message-designerPhoto').attr("src", "../../img/temp.png");
						} else {

							$('#message-designerPhoto').attr("src", data.information.designerPhoto);
						};
						$('.message-firstCategoryId').text(data.information.firstCategoryName);
						$('.message-secondCategoryId').text(data.information.secondCategoryName);
						$('.message-thirdCategoryId').text(data.information.thirdCategoryName);
						$('#message-minPrice').text(data.information.minPrice);
						$('#message-maxPrice').text(data.information.maxPrice);
						//				拒绝
						if(data.information.status != null) {
							$('.detail-box').removeClass('ut-none')
							var status = data.information.status;
							if(status == 0) {
								$('#message-classAc').text('已设精选');
							} else if(status == 1) {
								$('#message-classAc').text('审核中');
							} else if(status == 2) {
								$('#message-classAc').text('已通过');
							} else if(status == 3) {
								$('#message-classAc').text('未通过');
								$('.datail-refuse').removeClass('ut-none');
								if(data.information.rejectReason != null && data.information.rejectReason != "") {
									$('.message-rejectReason').text(data.information.rejectReason);
								}
							}
						}
						//分类
						if(data.information.systemList) {

							$.each($(data.information.systemList), function(i, value) {
								 if(value.type == 1) {
                	$('#firstAll').html('');
                	var ht = '<div class="pic-border ut-mar-r5 picBorder-active">'+(!value.tagName?'':value.tagName)+'</div>';
                	$('#firstAll').html(ht);
                } else if(value.type == 2) {
                	$('#secondAll').html('');
                	var ht = '<div class="pic-border ut-mar-r5 picBorder-active">'+(!value.tagName?'':value.tagName)+'</div>';
                	$('#secondAll').html(ht);
                } else if(value.type == 3) {
                	$('#thirdAll').html('');
                	var ht = '<div class="pic-border ut-mar-r5 picBorder-active">'+(!value.tagName?'':value.tagName)+'</div>';
                	$('#thirdAll').html(ht);
                }
							})
						}
						//已选标签
						if(data.information.commonList) {
							var el = ""
							$('#picTab-Add').html('')
							$.each(data.information.commonList, function(i, value) {
								el = $('<div class="pic-border ut-mar-r5 picBorder-active"></div>');
								el.append(value.tagName);
								el.data('item-data', value)
								$('#picTab-Add').append(el);
							})
						};
						//封面
						$('#message-coverUrl').attr('src', data.information.coverUrl);
						//banner
						/*$('#message-picBox').html('');
						var html = "";
						$.each(data.information.picList, function(i, value) {
							html += '<div class="img-box"><img src="' + value.infoPic + '" alt=""></div>';
						});
						$('#message-picBox').html(html);*/
						//图文设置
						$('#message-picBanner').html('');
						var html1 = "";
						$.each(data.information.desList, function(i, value) {
							html1 += '<div class="picture-setting">' +
								'<div class="img-box ">' +
								'<img src="' + value.infoPic + '" alt="">' +
								'</div>' +
								'<div class="bar">' +
								'<span>价格区间：</span>' +
								'<input type="text" value="' + value.minPrice + '"  readonly class="ut-input w-80 minprice" placeholder="价格下限" onkeyup="this.value=this.value.replace(/\D/g,\'\')" onblur="this.value=this.value.replace(/\D/g,\'\')"> ~' +
								'<input type="text" value="' + value.maxPrice + '"  readonly class="ut-input w-80 maxprice" placeholder="价格上限" onkeyup="this.value=this.value.replace(/\D/g,\'\')" onblur="this.value=this.value.replace(/\D/g,\'\')">' +
								'</div>' +
								'<textarea class="ut-input" readonly placeholder="这里是文字描述/可选不填" disabled>' + value.description + '</textarea>' +
								'</div>';
						});
						$('#message-picBanner').html(html1);
//					});

				} else {
					layer.msg(res.msg);
				}
			}
		})
	},
	//	编辑
	initEdit: function() {
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v2/store/news/updateNewsPage",
			data: {
				newsId: newsId
			},
			success: function(res) {
				var res = eval('(' + res + ')');
				if(res.success) {
					var data = res.data;
					//系统标签
					newDetail.stageStyleFun().then(function() {

						$('#message-informationNo').text(data.information.informationNo);
						newDetail.informationNo = data.information.informationNo;
						$('#newsName').attr('value', data.information.name);
						$('#newsDescription').text(data.information.description);
						$('#searchDesigner').attr('value', data.information.designerName);
						if(data.information.designerPhoto == "") {
							$('#edit-designerPhoto').attr('src', '../../img/temp.png');
						} else {
							$('#edit-designerPhoto').attr('src', data.information.designerPhoto);
						};
						$('#edit-designerName').text(data.information.designerName);
						$("#searchDesigner").keyup(function(){
			clearTimeout(newDetail.timer);
			var $this = $(this);
			var value = $this.val();
			newDetail.timer = setTimeout(function(){
				newDetail.ajaxEditDesigner({designerName:value});
			},1000);
		});
//图文设置上传
		newDetail.settingUpload();
		//修改单张图片
		newDetail.uploadSingleImg();
						/*//下拉 已不用
						if(data.information.firstCategoryId == 1) {
							$("#firstCategory option[value=1]").attr("selected", "selected");
						} else if(data.information.firstCategoryId == 2) {
							$("#firstCategory option[value=2]").attr("selected", "selected");
						} else {
							$("#firstCategory option[value='']").attr("selected", "selected");
						};
						//下拉菜单二级 已不用
						$('#secondCategory').html('');
						$.each(data.secondlist, function(i, value) {
							var html3 = '<option value="' + value.id + '">' + value.name + '</option>'
							$('#secondCategory').append(html3);
							if(data.information.secondCategoryId == value.id) {
								$("#secondCategory option[value=" + value.id + "]").attr("selected", true);
							}
						});
						//下拉菜单三级 已不用
						$('#thirdCategory').html('');
						$.each(data.thirdlist, function(i, value) {
							var html4 = '<option value="' + value.id + '">' + value.name + '</option>'
							$('#thirdCategory').append(html4);
							if(data.information.thirdCategoryId == value.id) {
								$("#thirdCategoryId option[value=" + value.id + "]").attr("selected", true);
							}
						});
						//				价格区间 已不用
						$('#minPrice').attr('value', data.information.minPrice);
						$('#maxPrice').attr('value', data.information.maxPrice);
						//				拒绝
						if(data.information.status != null) {
							$('.detail-box').removeClass('ut-none')
							var status = data.information.status
							if(status == 0) {
								$('#message-classAc').text('已设精选');
							} else if(status == 1) {
								$('#message-classAc').text('审核中');
							} else if(status == 2) {
								$('#message-classAc').text('已通过');
							} else if(status == 3) {
								$('#message-classAc').text('未通过');
								$('.datail-refuse').removeClass('ut-none');
								if(data.information.rejectReason != null && data.information.rejectReason != "") {
									$('.message-rejectReason').text(data.information.rejectReason);
								}
							}
						};*/
						//分类
						//性别
						if(data.information.systemList) {
							$.each(data.information.systemList, function(i, value) {
								if(value.type == 1) {
									$.each($("#firstAll .pic-border"), function(i, m) {
										var dataId = $(this).data('item-data').id;
										if($(this).data('item-data').id == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}else if(value.type == 2){
									$.each($("#secondAll .pic-border"), function(i, m) {
										var dataId = $(this).data('item-data').id;
										if($(this).data('item-data').id == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}else if(value.type == 3){
									$.each($("#thirdAll .pic-border"), function(i, m) {
										var dataId = $(this).data('item-data').id;
										if($(this).data('item-data').id == value.id) {
											$(this).addClass('picBorder-active')
										}
									});
								}
							})
						}
						//已选标签
						if(data.information.commonList) {
							var el = ""
							$('#picTab-Add').html('')
							$.each(data.information.commonList, function(i, value) {
								el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>');
								el.append(value.tagName);
								el.data('item-data', value)
								$('#picTab-Add').append(el);
							})
						};
						//推荐标签匹配
						newDetail.recommendStyleFun().then(function() {
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
											el.data('item-data', value);
										}
										$('#picTab-recommend').append(el);
									} else {
										var el = ''
										el = $('<div class="pic-border ut-mar-r5"></div>');
										el.text(value.tagName);
										el.data('item-data', value);
										$('#picTab-recommend').append(el);
									}
								});
								newDetail.recommendFun(); //推荐标签选中
							})
							//封面
						$('#edit-coverUrl').attr('src', data.information.coverUrl);
						//banner
						/*$('#pictureBox2').html('');
						var html = "";
						$.each(data.information.picList, function(i, value) {
							html += '<div class="img-box">' +
								'<i class="fa fa-upload"></i>' +
								'<p class="title-tips ut-mar-t5" id="title-tips1">点击上传</p>' +
								'<img src="' + value.infoPic + '" alt="">' +
								'<input type="file" class="upload" />' +
								'</div>';
						});
						$('#pictureBox2').html(html);*/
						//图文设置
						$('#descriptions').html('');
						var html1 = "";
						$.each(data.information.desList, function(i, value) {
							html1 += '<div class="picture-setting">' +
								'<input type="checkbox" class="picture-checkbox" name="picture">' +
								'<div class="img-box">' +
								'<i class="fa fa-upload"></i>' +
								'<p class="title-tips ut-mar-t5" id="title-tips1">点击上传</p>' +
								'<img src="' + value.infoPic + '" alt="">' +
								'<input type="file" class="upload" />' +
								'</div>' +
								'<div class="bar">' +
								'<span class="name">定制价格：</span>' +
								'<input type="text" value="' + value.minPrice + '" class="ut-input w-80 minprice" placeholder="价格下限" onkeyup="this.value=this.value.replace(/\D/g,\'\')" onblur="this.value=this.value.replace(/\D/g,\'\')"> ~' +
								'<input type="text" value="' + value.maxPrice + '" class="ut-input w-80 maxprice" placeholder="价格上限" onkeyup="this.value=this.value.replace(/\D/g,\'\')" onblur="this.value=this.value.replace(/\D/g,\'\')">' +
								'</div>' +
								'<textarea class="ut-input" placeholder="这里是文字描述/可选不填">' + value.description + '</textarea>' +
								'</div>';
						});
						$('#descriptions').html(html1);
						//点击添加描述列表
		$("#addDescriptions").click(function(){
			newDetail.addDescriptions();
		});
		$("#pictureCover").click(function(){
			newDetail.settingUpload();
		});
		$("#pictureBox").click(function(){
			newDetail.settingUpload();
		});
		//取消
		$("#removeBtn").click(function(){
			$("#descriptions input:checked").each(function(){
				var $this=$(this);
				$this.parent().remove();
			});
			if($("#descriptions .picture-setting").length==0){
				addNews.addDescriptions();
			}
		});

					});
				} else {
					layer.msg(res.msg);
				}

				//添加标签
				//				$("#addTableInput").on('blur', function() {
				//					if(newsEidt=='true'){
				//					var $this = $(this);
				//					var value = $this.val();
				//					if(value) {
				//						newDetail.ajaxFindDesigner(value);
				//					} else {
				//						layer.msg('请输入标签', {
				//							offset: '50%'
				//						})
				//					}
				//					}
				//				});

				$("#updateNewsBtn").click(function() {
					newDetail.checkData("update", $(this).attr("data-id"));
				});

				newDetail.addTableBtnFun(); //添加标签
				newDetail.picCloseFun(); //删除标签

			}
		})
	},
	//图文设置单张上传
	settingUpload:function(){
		uploadImg({
			ele:".descriptionsShow .upload",
			format:["png","jpg"],
			size:2,
			callback:function(res,ele){
				ele.siblings("img").attr("src",res.data[0]).show();
				ele.parent().removeClass("ut-border-dashed");
			},
			type:1,
		});
	},
	//添加描述框
	addDescriptions:function(){
		var str='<div class="picture-setting" >'+
			'<input type="checkbox" class="picture-checkbox" name="picture">'+
			'<div class="img-box ut-border-dashed">'+
				'<i class="fa fa-upload"></i>'+
	            '<p class="title-tips ut-mar-t5" id="title-tips1">点击上传</p>'+
				'<img src="" alt="" class="ut-none">'+
				'<input type="file" class="upload"/>'+
			'</div>'+
			'<div class="bar">'+
				'<span class="name">价格区间：</span>'+
				'<input type="text"  class="ut-input w-80 minprice" placeholder="价格下限" onkeyup="replace(this)"'+
				'onblur="replace(this)" > ~'+
				'<input type="text"  class="ut-input w-80 maxprice" placeholder="价格上限" onkeyup="replace(this)" '+
					'onblur="replace(this)">'+
			'</div>'+
			'<textarea class="ut-input" placeholder="这里是文字描述/可选不填"></textarea>'+
		'</div>';
		$("#descriptions").append(str);
		
		newDetail.settingUpload();
	},
	//修改单张图片
	uploadSingleImg:function(){
		uploadImg({
			ele:"#pictureBox .upload",
			type:1,
			format:["png","jpg"],
			size:2,
			callback:function(res,ele){
				ele.siblings("img").attr("src",res.data[0]);
			}
		});
	},
	
	//模糊查询设计师
	ajaxEditDesigner:function(data){
		$.ajax({
			url:headUrl.headUrl +"/v2/store/news/findDesignerList",
			data:data,
			dataType:'json',
			success:function(res){
				if(res.success){
					$("#designerList").html('');
				var str="";
				$.each(res.data,function(i,value){
					 str+='<li '+(i==0 ? "class=checked" : "")+'>'+
						'<div class="img-box photo">'+
						'<img src="'+(!!value.photo ? value.photo : "../../img/temp.png")+'" type="'+value.id+'" alt="">'+
					'</div>'+
					'<p type="'+value.id+'">'+value.name+'</p>'+
				'</li>';
				});
				$("#designerList").html(str);
				
				newDetail.clickEditDesigner();
				}
				
			}
		});
	},
	//选中设计师
	clickEditDesigner:function(){
		$("#designerList li").off("click");
		$("#designerList li").click(function(){
			var $this = $(this);
			$this.addClass("checked").siblings().removeClass("checked");
			$("#searchDesigner").val($this.find("p").html());
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
				$('#firstAll').html('');
				$.each(res.data.sex, function(i, value) {
					el = $('<div class="pic-border ut-mar-r5">' + value.tagName + '</div>');
					el.text(value.tagName);
					el.data('item-data', value)
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
					st.data('item-data', value)
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
					se.data('item-data', value)
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
	//添加标签
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
					$("#picTab-search").html('');
					var str = "";
					str = $('<div class="pic-border ut-mar-r5"></div>');
					str.text(res.data.tagName);
					str.data('item-data', res.data);
					$("#picTab-search").append(str);
					newDetail.clickDesigner();

					var el = '';
					el = $('<div class="pic-border ut-mar-r5 picBorder-active"><i class="fa fa-times pic-close"></i></div>')
					el.append(data);
					el.data('item-data', res.data);
					$('#picTab-Add').append(el);
					$('#eidtTableInput').val("");
					$('#picTab-search').html('');

					$.each($('#picTab-recommend .pic-border'), function(i, value) {
						if($(this).data('item-data').id == res.data.id) {
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
	//推荐标签
	recommendStyleFun: function() {
		return $.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/tag/listDefaultCommonTags",
			async: true,
			dataType: 'json',
			success: function(res) {

				var re = ""
				$('#picTab-recommend').html('')
				$.each(res.data, function(i, value) {
						re = $('<div class="pic-border ut-mar-r5"></div>');
						re.append(value.tagName);
						re.data('item-data', value.id)
						$('#picTab-recommend').append(re);
					})
					/*newDetail.recommendFun(); //推荐标签选中*/
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
				$('#eidtTableInput').val('');
			}
		});
	},
	//添加标签选中
	clickDesigner: function() {
		$("#picTab-search .pic-border").off("click");
		$("#picTab-search .pic-border").click(function() {
			var _this = $(this);
			_this.addClass("picBorder-active").siblings().removeClass("picBorder-active");
			$("#eidtTableInput").val(_this.text());
		});
	},
	//添加标签
	addTableBtnFun: function() {
		$('#eidtTableBtn').off();
		$('#eidtTableBtn').on('click', function() {
			if($('#picTab-Add .pic-border').length > 4) {
				layer.msg('最多选择5个标签!', {
					offset: '50%'
				});
				return;
			}
			//添加选中
			var eidtTableInput = $('#eidtTableInput').val();
			var itemData = $('#picTab-search .picBorder-active').eq(0).data('item-data');
			if(!eidtTableInput) {
				layer.msg('请填写标签', {
					offset: '50%'
				});
				return;
			}
			if(eidtTableInput.length > 5) {
				layer.msg('标签字数不能超过5个字符', {
					offset: '50%'
				});
				return;
			}

			var elLength = $('#picTab-Add .pic-border');
			for(var i = 0; i < elLength.length; i++) {
				if(elLength.eq(i).text() == eidtTableInput) {
					layer.msg('已存在', {
						offset: '50%'
					});
					return;
				}
			}
			newDetail.ajaxFindDesigner(eidtTableInput);

		})
	},
	//删除标签
	picCloseFun: function() {
		$('#picTab-Add').on('click', '.pic-close', function() {
			var dataId = $(this).parent('.pic-border').data('item-data');
			$.each($('#picTab-recommend .pic-border'), function(i, value) {
				if($(this).data('item-data').id == dataId.id) {
					$(this).removeClass('picBorder-active');
					$('#picTab-search').html('');
					$('#eidtTableInput').val('');

				}

			});
			$(this).parent('.pic-border').remove();
		});
	},

	//验证参数
	checkData: function(type, newsId) {
		//资讯基础信息
		var newsName = $("#newsName").val();
		if(newsName == null || newsName == '') {
			return layer.msg('请输入资讯名称！', {
				offset: '50%'
			});
		} else if(newsName.length > 30) {
			return layer.msg('资讯名称不能大于30个字！', {
				offset: '50%'
			});
		}
		/*var newDescription = $("#newsDescription").val();
		if(newDescription == null || newDescription == '') {
			return layer.msg('请输入资讯描述！', {
				offset: '50%'
			});
		} else if(newsName.length > 1000) {
			return layer.msg('资讯描述不能大于1000个字！', {
				offset: '50%'
			});
		}*/

		if($("#designerList .img-box img").length == 0) {
			return layer.msg('请输入设计师！', {
				offset: '50%'
			});
		} else if($("#designerList .checked").length > 1) {
			return layer.msg('设计师只能选一个！', {
				offset: '50%'
			});
		}
		if(!$('#firstAll .picBorder-active').length){
			return layer.msg('请选择性别标签！',{offset:'50%'});
		}
		if(!$('#secondAll .picBorder-active').length){
			return layer.msg('请选择款式标签！',{offset:'50%'});
		}
		if(!$('#thirdAll .picBorder-active').length){
			return layer.msg('请选择季节标签！',{offset:'50%'});
		}
		var systemTagArr = [];
		systemTagArr.push($('#firstAll .picBorder-active').data('item-data').id);
		systemTagArr.push($('#secondAll .picBorder-active').data('item-data').id);
		systemTagArr.push($('#thirdAll .picBorder-active').data('item-data').id);
		//已选择的标签
		var commonTagsArr = [];
		if(!$('#picTab-Add .pic-border').length) {
			return layer.msg('请选择标签！', {
				offset: '50%'
			});
		} else {
			$.each($('#picTab-Add .pic-border'), function() {
				commonTagsArr.push($(this).data('item-data').id);
			})
		}

		var ajaxData = {
			pic: {},
			banner: {},
			descriptions: [],
			information: {}
		};
		var object = {};
		var pic = $('#pictureBox .img-box').children('img').attr('src');
		if(pic == null || pic == '') {
			return layer.msg('请上传封面图片！', {
				offset: '50%'
			});
		} else {
			var object = {};
			object.infoPic = pic;
			object.isFirst = 1;
			object.width = $('#pictureBox .img-box').children('img')[0].naturalWidth;
			object.height = $('#pictureBox .img-box').children('img')[0].naturalHeight;
			ajaxData.pic = object;
		}

		/*var pic2=$('#pictureBox2 .img-box').children('img').attr('src');
		if(pic2==null||pic2==''){
			return layer.msg('请上传Banner图片！',{offset:'50%'});
		}else{
			var object={};
			object.infoPic =pic2;
			object.isFirst = 1;
			object.width=$('#pictureBox2 .img-box').children('img')[0].naturalWidth;
			object.height=$('#pictureBox2 .img-box').children('img')[0].naturalHeight;
			ajaxData.banner=object;
		}*/
		//资讯描述
		var descriptions = new Array();
		var desTemp = true;
		var minPrice = 999999999;
		var maxPrice = -1;
		$("#descriptions .picture-setting").each(function(index, element) {
			var des = new Object();
			des.infoPic = $(this).children('.img-box').children('img').attr('src');
			var desMinPrice = $(this).children('.bar').children('.minprice').val();
			var desMaxPrice = $(this).children('.bar').children('.maxprice').val();

			if(desMinPrice.length == 0 && desMaxPrice.length != 0) {
				desTemp = false;
				return layer.msg('定制价格的最小价格不能为空', {
					offset: '50%'
				});
			}
			if(desMaxPrice.length == 0 && desMinPrice.length != 0) {
				desTemp = false;
				return layer.msg('定制价格的最大价格不能为空', {
					offset: '50%'
				});
			}
			if(desMinPrice.length != 0 && desMaxPrice.length != 0 && Number(desMinPrice) >= Number(desMaxPrice)) {
				desTemp = false;
				return layer.msg('定制价格的最大价格不能小于或等于最小价格！', {
					offset: '50%'
				});
			}
			if(desMaxPrice.length != 0 && Number(desMaxPrice) > maxPrice) {
				maxPrice = Number(desMaxPrice);
			}
			if(desMinPrice.length != 0 && Number(desMinPrice) < minPrice) {
				minPrice = Number(desMinPrice);
			}
			des.minPrice = desMinPrice;
			des.maxPrice = desMaxPrice;
			des.width = $(this).children('.img-box').children('img')[0].naturalWidth;
			des.height = $(this).children('.img-box').children('img')[0].naturalHeight;
			des.description = $(this).children('textarea').val();
			if((des.description != null && des.description != '') && (des.infoPic == null || des.infoPic == '')) {
				desTemp = false;
				return layer.msg("请添加描述对应的图片！", {
					offset: '50%'
				});
			}
			des.order = index;
			//			descriptions.push(des);
			ajaxData.descriptions.push(des);
		});
		if(!desTemp) {
			return;
		}
		//设置资讯对象属性值
		var information = {};
		information.name = newsName;
//		information.description = newDescription;
		information.commonTags = commonTagsArr; //普通的标签
		information.systemTags = systemTagArr; //putong择的标签
		information.designerId = $("#designerList .checked img").attr("type");
		information.firstCategoryId = $("#firstCategory  option:selected").attr("value");
		information.secondCategoryId = $("#secondCategory  option:selected").attr("value");
		information.thirdCategoryId = $("#thirdCategory  option:selected").attr("value");
		information.minPrice = minPrice;
		information.maxPrice = maxPrice;
		information.informationNo = newDetail.informationNo;
		ajaxData.information = information;
		loading = layer.load(2);
		var newsInfo = JSON.stringify(ajaxData);
		var newsId = sessionStorage.getItem('store-infoId');
		newDetail.ajaxUpdateNews(newsInfo, newsId);

	},
	//修改资讯
	ajaxUpdateNews: function(newsInfo, newsId) {
		$.ajax({
			type: "post",
			dataType: "json",
			url: headUrl.headUrl + "/v2/store/news/updateNews?newsId=" + newsId,
			data: {
				newsInfo: newsInfo
			},
			success: function(res) {
				layer.close(loading);
				if(res.success) {
					layer.msg('修改成功！', {
						offset: '50%'
					});
					//					addNews.toNewsList();
					window.location.href = "new.html";
				} else {
					layer.msg(res.msg, {
						offset: '50%'
					});
				}
			},
			error: function() {
				layer.close(loading);
				layer.alert('网络故障，操作失败！', {
					offset: '50%'
				});
			}
		});
	}

}