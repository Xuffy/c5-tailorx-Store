layer.close(loading);
var newsEidt = sessionStorage.getItem('newsEidt');
var addNews = {
	init: function() {
		this.bindEvent();
		//显示当前图片个数
		$("#pictureNum").html(addNews.judgePictureNum());
	},
	timer: null,
	bindEvent: function() {
		//设置封面
		this.setCover();
		this.judgeCover();
		//图文设置上传
		this.settingUpload();
		//选择设计师
		this.clickDesigner();
		//修改单张图片
		this.uploadSingleImg();
		//模糊查询设计师
		$("#searchDesigner").keyup(function() {
			clearTimeout(addNews.timer);
			var $this = $(this);
			var value = $this.val();
			addNews.timer = setTimeout(function() {
				addNews.ajaxFindDesigner({
					designerName: value
				});
			}, 1000);
		});
		addNews.recommendStyleFun(); //推荐标签
		addNews.addTableBtnFun(); //添加标签
		addNews.picCloseFun(); //删除标签
		//取消
		$("#removeBtn").click(function() {
			$("#descriptions input:checked").each(function() {
				var $this = $(this);
				$this.parent().remove();
			});
			if($("#descriptions .picture-setting").length == 0) {
				addNews.addDescriptions();
			}
		});
		//系统标签
		addNews.stageStyleFun();

		//选择性别
		$("#firstCategory").change(function() {
			addNews.ajaxFindCategory('secondCategory', 2, $("#firstCategory option:checked").attr("value"));
		});
		$("#secondCategory").change(function() {
			addNews.ajaxFindCategory('thirdCategory', 3, $("#secondCategory option:checked").attr("value"));
		});
		$("#thirdCategory").change(function() {});
		//点击添加保存
		$("#addNewsBtn").click(function() {
			addNews.checkData("add", '');
		});
		//点击修改保存
		$("#updateNewsBtn").click(function() {
			addNews.checkData("update", $(this).attr("data-id"));
		});

		//点击添加描述列表
		$("#addDescriptions").click(function() {
			addNews.addDescriptions();
		});
		$("#pictureCover").click(function() {
			addNews.settingUpload();
		});
		$("#pictureBox").click(function() {
			addNews.settingUpload();
		});
		/*$("#pictureBox2").click(function(){
			addNews.settingUpload();
		});*/

		//批量上传
		this.multUpload();
	},
	//设置封面
	setCover: function() {
		var $cover = $(".cover-box");
		$cover.off("click");
		$cover.click(function() {
			var $this = $(this);
			var $before = $("#pictureBox .checked");
			$before.find(".cover-box img").attr("src", "../img/cover.png");
			$before.removeClass("checked");
			$this.parent().addClass("checked");
			$this.find("img").attr("src", "../../img/cover_check.png");
		});
	},
	//判断是否有封面
	judgeCover: function() {
		if(!$(".cover-box.checked").length) $(".cover-box:first").click();
	},
	//判断一共有多少张图片
	judgePictureNum: function() {
		return $("#pictureBox .img-box").length;
	},
	//选择设计师
	clickDesigner: function() {
		$("#designerList li").off("click");
		$("#designerList li").click(function() {
			var $this = $(this);
			$this.addClass("checked").siblings().removeClass("checked");
			$("#searchDesigner").val($this.find("p").html());
		});
	},
	//添加描述框
	addDescriptions: function() {
		var str = '<div class="picture-setting" >' +
			'<input type="checkbox" class="picture-checkbox" name="picture">' +
			'<div class="img-box ut-border-dashed">' +
			'<i class="fa fa-upload"></i>' +
			'<p class="title-tips ut-mar-t5" id="title-tips1">点击上传</p>' +
			'<img src="" alt="" class="ut-none">' +
			'<input type="file" class="upload"/>' +
			'</div>' +
			'<div class="bar">' +
			'<span class="name">价格区间：</span>' +
			'<input type="text"  class="ut-input w-80 minprice" placeholder="价格下限" onkeyup="replace(this)"' +
			'onblur="replace(this)" > ~' +
			'<input type="text"  class="ut-input w-80 maxprice" placeholder="价格上限" onkeyup="replace(this)" ' +
			'onblur="replace(this)">' +
			'</div>' +
			'<textarea class="ut-input" placeholder="这里是文字描述/可选不填"></textarea>' +
			'</div>';
		$("#descriptions").append(str);

		addNews.settingUpload();
	},
	//返回列表页面
	/*toNewsList:function(skip){
		if(skip==null||skip==0){
			$("#store-content").load(headUrl.headUrl +"/v2/store/news/index");
		}else{
			loading = layer.load(2);
			$("#news").removeClass();
			$("#appointment").attr("class","active");
			$("#store-content").load(headUrl.headUrl +"/v2/store/appointment/makeOrder?appointmentId="+skip);
		}
	},*/
	//修改单张图片
	uploadSingleImg: function() {
		uploadImg({
			ele: "#pictureBox .upload",
			type: 1,
			format: ["png", "jpg"],
			size: 2,
			callback: function(res, ele) {
				ele.siblings("img").attr("src", res.data[0]);
			}
		});
		$("#pictureBox .fa-trash-o").off("click");
		$("#pictureBox .fa-trash-o").click(function() {
			if(!confirm("请问是否删除？")) return;
			$(this).parent().parent().parent().remove();

			//当前图片个数
			$("#pictureNum").html(addNews.judgePictureNum());
			//批量上事件
			addNews.multUpload();
			addNews.judgeCover();
		});

		$("#pictureCover .fa-trash-o").off("click");
		$("#pictureCover .fa-trash-o").click(function() {
			if(!confirm("请问是否删除？")) return;
			$(this).parent().parent().parent().remove();
		});

	},
	//批量上传
	multUpload: function() {
		uploadImg({
			ele: "#multUpload",
			type: 1,
			format: ["png", "jpg"],
			size: 2,
			num: 5 - addNews.judgePictureNum(),
			father: "#pictureBox",
			callback: function(res) {
				$("#multUpload").val("");
				var str = $("#pictureBox").html();
				$.each(res.data, function(i, value) {
					str += '<div class="img-box">' +
						'<img src="' + value + '" alt="" />' +
						'<div class="attachment">' +
						'<span class="ut-font12 upload-box">' +
						'上传' +
						'<input type="file" class="upload">' +
						'</span>' +
						'<span class="ut-font18">' +
						'<i class="fa fa-trash-o pointer"></i>' +
						'</span>' +
						'</div>' +
						'<div class="cover-box"><img src="../../../img/cover.png" /></div>' +
						'</div>';
				});

				$("#pictureBox").html(str);

				//当前图片个数
				$("#pictureNum").html(addNews.judgePictureNum());
				//修改单张图片
				addNews.uploadSingleImg();
				//批量上事件
				addNews.multUpload();
				//设置封面
				addNews.setCover();
				addNews.judgeCover();
			}
		});
	},
	//图文设置单张上传
	settingUpload: function() {
		uploadImg({
			ele: ".descriptionsShow .upload",
			format: ["png", "jpg"],
			size: 2,
			callback: function(res, ele) {
				ele.siblings("img").attr("src", res.data[0]).show();
				ele.parent().removeClass("ut-border-dashed");
			},
			type: 1,
		});
	},
	//查询分类信息 已下架
	ajaxFindCategory: function(selectId, type, data) {
		var dataValue = new Object();
		dataValue.categoryId = data;
		dataValue.type = type;
		$.ajax({
			url: headUrl.headUrl + "/v2/store/news/findCategory",
			data: dataValue,
			dataType: 'json',
			success: function(res) {
				var str = "";
				$("#" + selectId).html('');
				if(selectId == "secondCategory") {
					str = '<option value="">请选择品类</option>';
					$("#thirdCategory").html('<option value="">请选择类型</option>');
				} else if(selectId == "thirdCategory") {
					str = '<option value="">请选择类型</option>';
				}
				$("#" + selectId).html(str);
				str = "";
				$.each(res.data.data, function(i, value) {
					str += '<option value="' + value.id + '">' + value.name + '</option>';
				});
				$("#" + selectId).append(str);
			}
		});
	},
	//模糊查询设计师
	ajaxFindDesigner: function(data) {
		$.ajax({
			url: headUrl.headUrl + "/v2/store/news/findDesignerList",
			data: data,
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					$("#designerList").html('');
					var str = "";
					$.each(res.data, function(i, value) {
						str += '<li ' + (i == 0 ? "class=checked" : "") + '>' +
							'<div class="img-box photo">' +
							'<img src="' + (!!value.photo ? value.photo : "../../img/temp.png") + '" type="' + value.id + '" alt="">' +
							'</div>' +
							'<p type="' + value.id + '">' + value.name + '</p>' +
							'</li>';
					});
					$("#designerList").html(str);

					addNews.clickDesigner();
				}

			}
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
					addNews.clickAddTable();

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
		$.ajax({
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
				addNews.recommendFun(); //推荐标签选中
			},
			error: function() {
				layer.msg(res.msg, {
					offset: '50%'
				})
			}
		});
	},
	stageStyleFun: function() {
		$.ajax({
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
			addNews.ajaxAddTableInput(addTableInput);

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
	/*picCloseFun: function() {
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
	},*/
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
		/*var newDescription=$("#newsDescription").val();
		if(newDescription==null||newDescription==''){
			return layer.msg('请输入资讯描述！',{offset:'50%'});
		}else if(newsName.length>1000){
			return layer.msg('资讯描述不能大于1000个字！',{offset:'50%'});
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

		/*var firstCategory=$("#firstCategory  option:selected");
		if(firstCategory.length==0||firstCategory.attr("value")==''){
			return layer.msg('请选择性别！');
		}
		var secondCategory=$("#secondCategory  option:selected");
		if(secondCategory.length==0||secondCategory.attr("value")==''){
			return layer.msg('请选择品类！');
		}
		var thirdCategory=$("#thirdCategory  option:selected");
		if(thirdCategory.length==0||thirdCategory.attr("value")==''){
			return layer.msg('请选择类别！');
		}*/
		/*var minPrice=$("#minPrice").val();
		if(minPrice==null||minPrice==''){
			return layer.msg('请填写最小价格！');
		}
		var maxPrice=$("#maxPrice").val();
		if(maxPrice==null||maxPrice==''){
			return layer.msg('请填写最大价格！');
		}
		
		if(Number(minPrice)>=Number(maxPrice)){
			return layer.msg('最大价格不能小于或等于最小价格！');
		}*/
		var ajaxData = {
			pic: {},
			banner: {},
			descriptions: [],
			information: {}
		};
		//资讯图片
		/*var pic = [];
		$("#pictureBox .img-box>img").each(function(){
			var object={};
			var $this = $(this);
			object.infoPic=$this.attr("src");
			if($this.parent().hasClass("checked")){
				object.isFirst = 1;
			}else{
				object.isFirst = 0;
			}
			pic.push(object);
		});
		
		if(pic.length==0){
			return layer.msg('请上传图片！');
		}
		ajaxData.pic=pic;*/
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
			/*	if(Number(desMinPrice)>=Number(desMaxPrice)){
					desTemp=false;
					return layer.msg('定制价格的最大价格不能小于或等于最小价格！');
				}else if(Number(desMinPrice)>Number(minPrice)){
					desTemp=false;
					return layer.msg('定制价格的最小价格不能大于价格区间的最小价格！');
				}else if(Number(desMaxPrice)>Number(maxPrice)){
					desTemp=false;
					return layer.msg('定制价格的最大价格不能大于价格区间的最大价格！');
				}*/
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
		//		information.description=newDescription;
		information.commonTags = commonTagsArr; //普通的标签
		information.systemTags = systemTagArr; //putong择的标签
		information.designerId = $("#designerList .checked img").attr("type");
		information.firstCategoryId = $("#firstCategory  option:selected").attr("value");
		information.secondCategoryId = $("#secondCategory  option:selected").attr("value");
		information.thirdCategoryId = $("#thirdCategory  option:selected").attr("value");
		information.minPrice = minPrice;
		information.maxPrice = maxPrice;
		ajaxData.information = information;
		loading = layer.load(2);
		var newsInfo = JSON.stringify(ajaxData);
		if(type == "add") {
			addNews.ajaxAddNews(newsInfo);
		} else {
			var newsId = sessionStorage.getItem('store-infoId');
			addNews.ajaxUpdateNews(newsInfo, newsId);
		}

	},
	//保存资讯
	ajaxAddNews: function(newsInfo) {
		$.ajax({
			type: "post",
			dataType: "json",
			url: headUrl.headUrl + "/v2/store/news/addNews",
			data: {
				newsInfo: newsInfo
			},
			success: function(res) {
				layer.close(loading);
				if(res.success) {
					layer.msg('新增成功！', {
						offset: '50%'
					});
					window.location.href = "new.html";
				} else {
					layer.msg(res.msg);
				}
			},
			error: function() {
				layer.close(loading);
				layer.alert('网络故障，操作失败！', {
					offset: '50%'
				});
			}
		});
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
};

$(function() {
	addNews.init();
});

function replace(doc) {
	doc.value = doc.value.replace(/\D/g, '');
}