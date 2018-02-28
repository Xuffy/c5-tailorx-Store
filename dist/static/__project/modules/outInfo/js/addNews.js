var addNews = {
	init: function() {
		this.initPage();
		this.bindEvent();
		//显示当前图片个数
		$("#pictureNum").html(addNews.judgePictureNum());

	},
	timer: null,
	newoutInfoId: null,
	newoutInfoNo: sessionStorage.getItem('store-outInfoId'),
	secondCategoryId: null,
	thirdCategoryId: null,
	checkUpdate: false,
	initPage: function() {
		var newoutInfoNo = sessionStorage.getItem('store-outInfoId');
		$.ajax({
			url: headUrl.headUrl + "/v2/store/outsideInformation/getInformationDetail?informationNo=" + newoutInfoNo,
			type: 'POST',
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					var data = res.data;
					if(data.issueApp == 1){
						$(".outApp").attr("checked",'true');
					}
					if(data.issueWeb == 1){
						$(".outWeb").attr("checked",'true');
					}
					addNews.newoutInfoId = data.id;
					$("#informationNo").text(data.informationNo);
					$("#newsName").val(data.name);
					$("#newsDescription").val(data.description);
					$("#searchDesigner").val(data.designerName);
					$("#searchDesignerId").val(data.designerId);
					$("#coverImg").attr("src", data.coverPicture);
					$("#bannerImg").attr("src", data.bannerPicture);
					if(data.firstCategoryId != null) {

						addNews.thirdCategoryId = data.thirdCategoryId;
						addNews.secondCategoryId = data.secondCategoryId;
						$("#firstCategory").val(data.firstCategoryId);
						$("#firstCategory").trigger("change");
					}

					var str = "";
					$.each(data.pictures, function(i, value) {
						str += '<div class="picture-setting" >' +
							'<input type="checkbox" class="picture-checkbox" name="picture">' +
							'<div class="img-box">' +
							'<i class="fa fa-upload"></i>' +
							'<p class="title-tips ut-mar-t5" id="title-tips1">点击上传</p>' +
							'<img src="' + value.picture + '" alt="">' +
							'<input type="file" class="upload"/>' +
							'</div>' +
							'<div class="bar">' +
							'<span class="name">价格区间：</span>' +
							'<input type="text"  class="ut-input w-80 minprice" placeholder="价格下限" onkeyup="replace(this)"' +
							'onblur="replace(this)"  value="' + (value.minPrice == null ? '' : value.minPrice) + '"> ~' +
							'<input type="text"  class="ut-input w-80 maxprice" placeholder="价格上限" onkeyup="replace(this)" ' +
							'onblur="replace(this)" value="' + (value.maxPrice == null ? '' : value.maxPrice) + '">' +
							'</div>' +
							'<textarea class="ut-input" placeholder="这里是文字描述/可选不填">' + value.description + '</textarea>' +
							'</div>';
					});
					$('#descriptions').html(str);
					addNews.settingUpload();
				}
				layer.close(loading);
			},
			error: function() {
				layer.close(loading);
				layer.msg("网络故障！",{offset:"50%"});
			}
		})
	},
	bindEvent: function() {
		//设置封面
		this.setCover();
		this.judgeCover();
		//图文设置上传
		this.settingUpload();
		//修改单张图片
		this.uploadSingleImg();

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

		//选择性别
		$("#firstCategory").change(function() {
			addNews.ajaxFindCategory('secondCategory', 2, $("#firstCategory option:checked").attr("value"));
		});
		$("#secondCategory").change(function() {

			addNews.ajaxFindCategory('thirdCategory', 3, $("#secondCategory option:checked").attr("value"));
		});
		//点击添加保存
		$("#addNewsBtn").click(function() {
			addNews.checkData("add", false);
		});
		//点击修改保存
		$("#updateNewsBtn").click(function() {
			addNews.checkData("update", false);
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
		$("#pictureBox2").click(function() {
			addNews.settingUpload();
		});

		$("#publishNewsBtn").click(function() {
			addNews.checkData("update", true);
		});
		$("#backNewsBtn").click(function() {
			loading = layer.load(2);
			//$("#store-content").load("/v2/store/outsideInformation/index");
			location.href = "../../modules/outInfo/outInfo.html";
		});

		//批量上传
		this.multUpload();
	},

	publish: function() {
		loading = layer.load(2);
		var newoutInfoNo = sessionStorage.getItem('store-outInfoId');
		$.ajax({
			url: headUrl.headUrl + "/v2/store/outsideInformation/publishInformation?informationNo=" + newoutInfoNo,
			type: 'POST',
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					layer.msg("发布成功！",{offset:"50%"});
					loading = layer.load(2);
					// $("#store-content").load("/v2/store/outsideInformation/index");
					location.href = "../../modules/outInfo/outInfo.html";
				} else {
					layer.msg(res.msg,{offset:"50%"});
				}
				layer.close(loading);
			},
			error: function() {
				layer.close(loading);
				layer.msg("网络故障！",{offset:"50%"});
			}
		})
	},
	//设置封面
	setCover: function() {
		var $cover = $(".cover-box");
		$cover.off("click");
		$cover.click(function() {
			var $this = $(this);
			var $before = $("#pictureBox .checked");
			$before.find(".cover-box img").attr("src", "../../../img/cover.png");
			$before.removeClass("checked");
			$this.parent().addClass("checked");
			$this.find("img").attr("src", "../../../img/cover_check.png");
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

	//修改单张图片
	uploadSingleImg: function() {
		uploadImg({
			ele: "#pictureBox .upload",
			type: 1,
			format: ["png", "jpg"],
			size: 2,
			callback: function(res, ele) {
				ele.parent().parent().siblings("img").attr("src", res.data[0]);
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
	//查询分类信息
	ajaxFindCategory: function(selectId, type, data) {

		var dataValue = new Object();
		dataValue.categoryId = data;
		dataValue.type = type;
		$.ajax({
			url: headUrl.headUrl + "/v2/store/news/findCategory",
			data: dataValue,
			dataType: 'json',
			async: false,
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
					if(selectId == "secondCategory" && addNews.secondCategoryId != null) {

						str += '<option value="' + value.id + '" ' + (addNews.secondCategoryId == value.id ? 'selected="selected"' : '') + '>' + value.name + '</option>';
					} else if(selectId == "thirdCategory" && addNews.thirdCategoryId != null) {
						str += '<option value="' + value.id + '" ' + (addNews.thirdCategoryId == value.id ? 'selected="selected"' : '') + '>' + value.name + '</option>';
					} else {
						str += '<option value="' + value.id + '" >' + value.name + '</option>';
					}
				});
				$("#" + selectId).append(str);
			}
		});
		if(selectId == "secondCategory" && addNews.secondCategoryId != null) {
			$("#secondCategory").trigger("change");
		}
	},
	//模糊查询设计师
	ajaxFindDesigner: function(data) {
		$.ajax({
			url: headUrl.headUrl + "/v2/store/news/findDesignerList",
			data: data,
			dataType: 'json',
			success: function(res) {
				$("#designerList").html('');
				var str = "";
				$.each(res, function(i, value) {
					str += '<li ' + (i == 0 ? "class=checked" : "") + '>' +
						'<div class="img-box photo">' +
						'<img src="' + (!!value.photo ? value.photo : "/img/temp.png") + '" type="' + value.id + '" alt="">' +
						'</div>' +
						'<p type="' + value.id + '">' + value.name + '</p>' +
						'</li>';
				});
				$("#designerList").html(str);

				addNews.clickDesigner();
			}
		});
	},
	//验证参数
	checkData: function(type, loop) {
		//资讯基础信息
		var newsName = $("#newsName").val();
		if(newsName == null || newsName == '') {
			return layer.msg('请输入资讯名称！',{offset:"50%"});
		} else if(newsName.length > 30) {
			return layer.msg('资讯名称不能大于30个字！',{offset:"50%"});
		}
		var newDescription = $("#newsDescription").val();
		if(newDescription == null || newDescription == '') {
			return layer.msg('请输入资讯描述！',{offset:"50%"});
		} else if(newsName.length > 1000) {
			return layer.msg('资讯描述不能大于1000个字！',{offset:"50%"});
		}
		var searchDesignerId = $("#searchDesignerId").val();

		var firstCategory = $("#firstCategory  option:selected");
		if(firstCategory.length == 0 || firstCategory.attr("value") == '') {
			return layer.msg('请选择性别！',{offset:"50%"});
		}
		var secondCategory = $("#secondCategory  option:selected");
		if(secondCategory.length == 0 || secondCategory.attr("value") == '') {
			return layer.msg('请选择品类！',{offset:"50%"});
		}
		var thirdCategory = $("#thirdCategory  option:selected");
		if(thirdCategory.length == 0 || thirdCategory.attr("value") == '') {
			return layer.msg('请选择类别！',{offset:"50%"});
		}

		var ajaxData = {
			descriptions: [],
			information: {}
		};
		//资讯图片
		var descriptions = new Array();
		var pic = $('#pictureBox .img-box').children('img').attr('src');
		if(pic == null || pic == '') {
			return layer.msg('请上传封面图片！',{offset:"50%"});
		} else {
			var des = {};
			des.minPrice = '';
			des.maxPrice = '';
			des.description = '';
			des.picture = pic;
			des.width = $('#pictureBox .img-box').children('img')[0].naturalWidth;
			des.height = $('#pictureBox .img-box').children('img')[0].naturalHeight;
			//			descriptions.push(des);
			ajaxData.descriptions.push(des);
		}

		var pic2 = $('#pictureBox2 .img-box').children('img').attr('src');
		if(pic2 == null || pic2 == '') {
			return layer.msg('请上传Banner图片！',{offset:"50%"});
		} else {
			var des = {};
			des.minPrice = '';
			des.maxPrice = '';
			des.description = '';
			des.picture = pic2;
			des.width = $('#pictureBox2 .img-box').children('img')[0].naturalWidth;
			des.height = $('#pictureBox2 .img-box').children('img')[0].naturalHeight;
			//			descriptions.push(des);
			ajaxData.descriptions.push(des);
		}
		//资讯描述
		var desTemp = true;
		var minPrice = 999999999;
		var maxPrice = -1;
		$("#descriptions .picture-setting").each(function(index, element) {
			var des = new Object();
			des.picture = $(this).children('.img-box').children('img').attr('src');
			var desMinPrice = $(this).children('.bar').children('.minprice').val();
			var desMaxPrice = $(this).children('.bar').children('.maxprice').val();
			if(desMinPrice.length == 0 && desMaxPrice.length != 0) {
				desTemp = false;
				return layer.msg('定制价格的最小价格不能为空',{offset:"50%"});
			}
			if(desMaxPrice.length == 0 && desMinPrice.length != 0) {
				desTemp = false;
				return layer.msg('定制价格的最大价格不能为空',{offset:"50%"});
			}
			if(desMinPrice.length != 0 && desMaxPrice.length != 0 && Number(desMinPrice) >= Number(desMaxPrice)) {
				desTemp = false;
				return layer.msg('定制价格的最大价格不能小于或等于最小价格！',{offset:"50%"});
			}
			if(desMaxPrice.length != 0 && Number(desMaxPrice) > maxPrice) {
				maxPrice = Number(desMaxPrice);
			}
			if(desMinPrice.length != 0 && Number(desMinPrice) < minPrice) {
				minPrice = Number(desMinPrice);
			}

			//			else if(Number(desMinPrice)>Number(minPrice)){
			//				desTemp=false;
			//				return layer.msg('定制价格的最小价格不能大于价格区间的最小价格！');
			//			}else if(Number(desMaxPrice)>Number(maxPrice)){
			//				desTemp=false;
			//				return layer.msg('定制价格的最大价格不能大于价格区间的最大价格！');
			//			}

			des.minPrice = desMinPrice;
			des.maxPrice = desMaxPrice;
			des.width = $(this).children('.img-box').children('img')[0].naturalWidth;
			des.height = $(this).children('.img-box').children('img')[0].naturalHeight;
			des.description = $(this).children('textarea').val();
			if((des.description != null && des.description != '') && (des.picture == null || des.picture == '')) {
				desTemp = false;
				return layer.msg("请添加描述对应的图片！",{offset:"50%"});
			}
			des.order = index;
			//			descriptions.push(des);

			ajaxData.descriptions.push(des);
		});
		if(!desTemp) {
			return;
		}

		var check = $('.out-styleCheck[type="checkbox"]:checked');
		if(check.length == 0) {
			layer.msg("请选择至少一个发布位置！",{offset:"50%"});
			return;
		}
		if(minPrice == 999999999 && maxPrice == -1) {
			layer.msg("请至少输入一个价格区间！",{offset:"50%"});
			return;
		}
		var issue_web = 0;
		var issue_app = 0;
		if($('.outWeb').is(':checked')) {
			issue_web = 1;
		}
		if($('.outApp').is(':checked')) {
			issue_app = 1;
		}

		//设置资讯对象属性值
		var information = {};
		information.name = newsName;
		information.description = newDescription;
		information.informationNo = sessionStorage.getItem('store-outInfoId');
		information.designerId = searchDesignerId;
		information.firstCategoryId = $("#firstCategory  option:selected").attr("value");
		information.secondCategoryId = $("#secondCategory  option:selected").attr("value");
		information.thirdCategoryId = $("#thirdCategory  option:selected").attr("value");
		information.minPrice = minPrice;
		information.maxPrice = maxPrice;
		information.issueWeb=issue_web;
		 information.issueApp=issue_app;

		ajaxData.information = information;
		loading = layer.load(2);
		var newsInfo = JSON.stringify(ajaxData);
		if(loop){
			if(!confirm("确认发布数据？")) {
				return;
			}
		}
		addNews.ajaxUpdateNews(newsInfo, addNews.newoutInfoId,loop);

	},

	//修改资讯
	ajaxUpdateNews: function(newsInfo, newsId,loop) {

		$.ajax({
			type: "post",
			dataType: "json",
			url: headUrl.headUrl + "/v2/store/outsideInformation/updateNews?newsId=" + newsId,
			data: {
				newsInfo: newsInfo
			},
			success: function(res) {
				layer.close(loading);

				if(res.success) {
					if(loop){
						addNews.publish();
					}else{
						addNews.checkUpdate = true;
						layer.msg('操作成功！',{offset:"50%"});
					}
				} else {
					layer.msg(res.msg);
				}
			},
			error: function() {
				layer.close(loading);
				layer.alert('网络故障，操作失败！',{offset:"50%"});
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
