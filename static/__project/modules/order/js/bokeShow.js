sessionStorage.setItem('bokeDetailUrl', window.location.href);
var bokeShowUrl = sessionStorage.getItem("tailorx-bokeShow-name");
var pageNum = 10;
var bokeShow = {
	init: function() {
		this.pramFun({
			page: 0,
			pageLength: pageNum
		});
		this.findSystemTages(); //获取标签
		this.resetFn();
	},
	//参数
	pramFun: function(page, pageLength) {
		var prm = {};
		pageLength = $('#pageNum option:checked').attr('value');
		//关键字
		var keyword = $('.keyword').val();
		//性别 品类 类别
		var sexSelect = $('#sex-select option:checked').val();
		var secondSelect = $('#second-select option:checked').val();
		var thirdSelect = $('#third-select option:checked').val();
		//		时间
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		prm = {
			keyWord: keyword,
			page: page,
			pageLength: pageLength,
			systemTagSexId: sexSelect,
			systemTagStyleId: secondSelect,
			systemTagSeasonId: thirdSelect,
			startTime: startTime,
			endTime: endTime
		}

		//页数
		$('#pageNum').on('change', function() {
			var pageNum = $('#pageNum option:checked').attr('value');
			bokeShow.pramFun(0, pageNum);
		})
		bokeShow.initShow(prm);
	},
	//点击确定
	searchFunction: function() {
		bokeShow.pramFun(0, pageNum);
	},
	//初始化
	initShow: function(prm) {
		sessionStorage.setItem("tailorx-bokeShow-name", JSON.stringify(prm));
		$.ajax({
			type: "POST",
			url: headUrl.headUrl + "/v3/store/plateType/list",
			async: true,
			dataType: 'json',
			data: prm,
			success: function(res) {
				var data = res.data;
				bokeShow.pagination(data.totalSize, data.pageLength, data.page);
				$('#totalSize').text(data.totalSize);
				if(res.success) {
					var str = '';
					$('#bokeList').html('');
					$.each(data.data, function(i, value) {
						var valPic = '';
						if(value.picUrls) {
							var pic = value.picUrls;
							var picSplit = pic.split(',')
							valPic = picSplit[0]
						}
						var plat = {};
						if(value.plateTypeBokes) {
							var platArr = value.plateTypeBokes;
							plat = platArr[0];

						}
						str += '<div class="ut-inline-block bokeList-content">' +
							'<div class="bokeSin ut-pointer" onclick="bokeShow.bkDetailFun(\'' + value.id + '\',\'' + value.owner + '\')">' + '<img src="' + valPic + '" alt="" />' +
							'</div>';
						if(value.owner) {
							str += '<i class="fa fa-pencil-square-o bokeSin-fa" onclick="bokeShow.bkEditFun(\'' + value.id + '\')"></i>';
						}

						str += '<div class="ut-mar-t10"><span>' + value.designerName + '</span><span class="ut-mar-l20">' + value.createTimeStr + '</span></div><div class="ut-mar-t10 ut-ellipsis">';
						if(value.plateTypeBokes[0]) {
							str += '<span>' + value.plateTypeBokes[0].sizeStr + '码：</span>';
						}
						if(plat) {
							str += '<a href="javascript:;"><span class="ut-pointer" onclick="window.open(' + '\'' + plat.url + '\'' + ')">' + plat.fileName + '</span> </a>';
						}
						str += '</div>' +
							'</div>';
					});
					$('#bokeList').html(str);
				}
			},
			error: function() {
				layer.msg('网络异常！', {
					offset: '50%'
				});
			}
		});
	},
	//查看系统标签
	findSystemTages: function() {
		$.ajax({
			type: "get",
			url: headUrl.headUrl + "/v3/store/tag/getSearchTagList",
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					var el = '';
					$.each(res.data, function(i, value) {
						if(value.tagType == 1) {
							el = '<option value="' + value.tagId + '">' + value.tagName + '</option>'
							$('#sex-select').append(el);
						} else if(value.tagType == 2) {
							el = '<option value="' + value.tagId + '">' + value.tagName + '</option>'
							$('#second-select').append(el);
						} else if(value.tagType == 3) {
							el = '<option value="' + value.tagId + '">' + value.tagName + '</option>'
							$('#third-select').append(el);
						}
					})
				}
			},
			error: function() {
				layer.msg(res.msg, {
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
			bokeShow.pramFun(0, pageNum);
		});
	},
	//查看
	bkDetailFun: function(id, own) {
		$('.bsEdit').click(function(event) {
			event.stopPropagation();
		})
		$.ajax({
			type: "post",
			url: headUrl.headUrl + "/v3/store/plateType/getPlateTypeInfo",
			dataType: 'json',
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data;
				if(res.success) {
					$('#bsEditPop').show();
					var st = "";
					if(own == 'true') {
						st += '<i class="fa fa-pencil-square-o bs-title-i ut-pointer" id="bsEditPopFo" onclick="bokeShow.bkEditFun(\'' + id + '\')"></i>'
						$('#bsEditPopTitle').append(st);
					} else {
						$('#bsEditPopTitle').find('#bsEditPopFo').remove();
					}
					$('#bsDesinName').text(data.designerName);
					$('#bsDesinTime').text(data.createTimeStr);
					$('#bsDesinDesc').text(data.description);
					//标签
					$('#bsDesinLabel').html('');
					var sysStr = '';
					var comStr = '';
					$.each(data.tagSystems, function(i, value) {
						sysStr += '<div class="pic-border ut-mar-r5 picBorder-active" data-id="\'' + value.id + '\'">' + value.tagName + '</div>'
					});
					$('#bsDesinLabel').append(sysStr);
					$.each(data.tagCommons, function(i, value) {
						comStr += '<div class="pic-border ut-mar-r5 picBorder-active" data-id="\'' + value.id + '\'">' + value.tagName + '</div>'
					});
					$('#bsDesinLabel').append(comStr);
					//尺寸
					$('#bsDesinSize').html('');
					var sizeStr = '';
					$.each(data.plateTypeBokes, function(i, value) {
						sizeStr += '<div class="ut-mar-t10"><span>' + value.sizeStr + '</span>码：<a href="javascript:;" onclick="window.open(' + '\'' + value.url + '\'' + ')">' + value.fileName + '</a></div>'
					});
					$('#bsDesinSize').html(sizeStr);
					//图片
					var strs = data.plateTypePicList;
					$('#swiper-picture').html('');
					var htmlPicture = ""
					$.each(data.plateTypePicList, function(i, value) {
						htmlPicture += '<div class="swiper-slide swiper-slide-active"><img src="' + value.url + '" alt="" /></div>'
					});
					$('#swiper-picture').html(htmlPicture);
					var swiper = new Swiper('.swiper-container', {
						slidesPerView: 1,
						paginationClickable: true,
						keyboardControl: true,
						width: 840,
						loop: true,
						autoHeight: true,
						nextButton: '.swiper-button-next',
						prevButton: '.swiper-button-prev',
					});
					//					var tag = $(this).siblings('.settingDiv');
					var flag = true;
					$(document).bind("click", function(e) { //点击空白处，设置的弹框消失
						var target = $(e.target);
						if(flag == true) {
							$('#bsEditPop').hide();
							flag = false;
						}
					});
				}
			},
			error: function() {
				layer.msg(res.msg, {
					offset: '50%'
				});
			}
		});
	},
	//添加
	bkDetailAddFun: function() {
		sessionStorage.setItem('bokeShowEditId', '');
		sessionStorage.setItem('bokeShowEditIdType', 1);
		window.location.href = 'bokeDetail.html';
	},
	//编辑
	bkEditFun: function(id) {
		sessionStorage.setItem('bokeShowEditId', id);
		sessionStorage.setItem('bokeShowEditIdType', 2);
		window.location.href = 'bokeDetail.html';
	},
	//	弹框关闭
	closeFunction: function() {
		$('.ut-layer').hide();
	},
	//分页
	pagination: function(total, pageLength, page) {
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
				bokeShow.pramFun(index.getCurrent() - 1, pageNum);
			}
		});
	},
}
$(function() {
	//时间插件
	var start = {
		elem: '#startTime',
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
		elem: '#endTime',
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
	bokeShow.init();
	if(bokeShowUrl) {
		var res = JSON.parse(bokeShowUrl);
		$('.keyword').val(res.keyWord);
		$('#sex-select option[val="' + res.systemTagSexId + '"]').attr('select', true);
		$('#second-select option[val="' + res.systemTagStyleId + '"]').attr('select', true);
		$('#third-select option[val="' + res.systemTagSeasonId + '"]').attr('select', true);
		//		时间
		$("#startTime").val(res.startDate);
		$("#endTime").val(res.endDate);
	}
})