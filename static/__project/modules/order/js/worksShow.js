sessionStorage.setItem('workDetailUrl', window.location.href)
var workShowParam = sessionStorage.getItem("workShow-param")
var pageNum = 10;
var workShow = {
	init: function() {
		this.initShow({
			page: 0,
			pageLength: pageNum
		});
		this.findSystemTages(); //获取标签
		this.resetFn();
	},
	//参数
	initShow: function(page, pageLength) {
		var prm = {},
			pageLength = $('#pageNum option:checked').attr('value');
		//关键字
		var keyword = $('.keyword').val();
		//性别 品类 类别
		var sexSelect = $('#sex-select option:checked').val();
		var secondSelect = $('#second-select option:checked').val();
		var thirdSelect = $('#third-select option:checked').val();
		//状态   作品来源
		var handleStatu = $('#handleStatu option:checked').val();
		var workFrom = $('#workFrom option:checked').val();
		//		时间
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		prm = {
				searchTerm: keyword,
				page: page,
				pageLength: pageLength,
				sexTagId: sexSelect,
				styleTagId: secondSelect,
				seasonTagId: thirdSelect,
				startTime: startTime,
				endTime: endTime,
				status: handleStatu,
				sourceType: workFrom
			}
			//页数
		$('#pageNum').on('change', function() {
			var pageNum = $('#pageNum option:checked').attr('value');
			workShow.pramFun(0, pageNum);
		})
		workShow.initShowClickFun(prm);
	},
	//点击确定
	searchFunction: function() {
		workShow.initShow(0, pageNum);
	},
	//重置
	resetFn: function() {
		$('#res').on('click', function() {
			$('option[selected]').removeAttr('selected');
			$('#formTable')[0].reset();
			workShow.initShow(0, pageNum);
		});
	},
	//初始化
	initShowClickFun: function(prm) {
		sessionStorage.setItem("workShow-param", JSON.stringify(prm));
		$.ajax({
			type: "POST",
			url: headUrl.headUrl + "/v3/store/designerWork/findList",
			async: true,
			dataType: 'json',
			data: prm,
			success: function(res) {
				var data = res.data;
				workShow.pagination(data.totalSize, data.pageLength, data.page);
				$('#totalSize').text(data.totalSize);
				if(res.success) {
					$('#workFrom-tableContList').html('');
					var str = '';
					str += '<tr><th>序号</th><th>来源</th><th>设计师</th><th>标题</th><th>参考照片</th><th>设计稿</th><th>系统标签</th><th>标签</th><th>创建时间</th><th>价格</th><th>状态</th><th>操作</th></tr>';
					$.each(data.data, function(i, value) {
						//设计稿
						var designUrl = '';
						if(value.designUrl) {
							var pic = value.designUrl;
							var picSplit = pic.split(',')
							designUrl = picSplit[0]
						}
						//参考图片
						var referencePicUrl = '';
						if(value.referencePictures) {
							var pic = value.referencePictures;
							var picSplit = pic.split(';')
							referencePicUrl = picSplit[0]
						}
						//系统标签
						if(value.styleName) {
							var stStr = value.styleName;
							var reg = new RegExp(",", "g"); //g,表示全部替换。
							var valsyStr = stStr.replace(reg, "/");
						}
						//标签
						if(value.commonName) {
							var coStr = value.commonName;
							var reg = new RegExp(",", "g"); //g,表示全部替换。
							var valcoStr = coStr.replace(reg, "、");
						}
						//状态
						var sta = '';
						switch (value.sourceType){
							case 1 :
							sta = '上传'; break;
							case 2 :
							sta = '资讯'; break;
							case 3 :
							sta = '图库'; break;
						}
						str += '<tr>' +
							'<td>'+(i+1+data.pageLength*data.page)+'</td>' +
							'<td>'+sta+'</td>' +
							'<td>' + (!value.designerName ? '----' : value.designerName )+ '</td>' +
							'<td>' + (!value.title?'----' : value.title) + '</td>';
						if(referencePicUrl) {
							str += '<td><div class="refe"><img src="' + referencePicUrl + '" alt="" /></div></td>';
						} else {
							str += '<td>----</td>';
						}
						if(designUrl) {

							str += '<td><div class="refe"><img src="' + designUrl + '" alt="" /></div></td>';
						} else {
							str += '<td>----</td>';
						}
						str += '<td>' + (!value.genderName ? '--' : value.genderName) + (!value.styleName ? '--' : '/' + value.styleName) + (!value.seasonName ? '' : '/' + value.seasonName) + '</td>' +
							'<td>' + (!value.commonName ? '----' : valcoStr) + '</td>' +
							'<td>'+value.createDateStr+'</td>' +
							'<td>' + value.price + '</td>' +
							'<td>'+(value.status == 1 ? '未发布':'已发布')+'</td>' +
							'<td>' ;
							if(value.status == 1){
							str +='<span class="ut-color-b ut-mar-r5 ut-pointer" onclick="workShow.getEditPicFunction(\'' + value.id + '\')">编辑</span>'+
									'<span class="ut-color-b ut-pointer" onclick="workShow.onPublicFun(\'' + value.id + '\',2)">发布</span>';
							}else{
									str +='<span class="picSoldOut ut-color-b ut-pointer" onclick="workShow.onPublicFun(\'' + value.id + '\',1)">下架</span>';
							}
							
							str +='</td>' +
							'</tr>';
					});
					$('#workFrom-tableContList').html(str);
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
	//添加
	wsDetailAddFun: function() {
		sessionStorage.setItem('designerWorkId', '');
		sessionStorage.setItem('workShowEditIdType', 1);
		window.location.href = 'worksDetail.html';
	},
	//编辑getEditPicFunction
	getEditPicFunction:function(id){
		sessionStorage.setItem('designerWorkId',id);
		sessionStorage.setItem('workShowEditIdType',2);
		window.location.href = 'worksDetail.html';
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
							bokeShow.initShow(0, pageNum);
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
	//发布
	onPublicFun: function(id,status) {
		var strStatus = '';
		if(status == 1){
			strStatus = '下架 ';
		}else{
			strStatus = '发布 ';
		}
		layer.confirm('确定'+strStatus+'？', {
				offset: "50%",
				title: '操作',
				btn: ['确定', '取消']
			},
			function() {
				$.ajax({
					type: "post",
					url: headUrl.headUrl + "/v3/store/designerWork/updateStatus",
					async: true,
					dataType: 'json',
					data: {
						designerWorkId: id,
						status:status
					},
					success: function(res) {
						if(res.success) {
							workShow.initShow(0, pageNum);
							layer.msg(''+strStatus+'成功', {
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
				workShow.initShow(index.getCurrent() - 1, pageNum);
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
	workShow.init();
	if(workShowParam) {
		var res = JSON.parse(workShowParam);
		$('.keyword').val(res.searchTerm);
		$('#sex-select option[val="' + res.sexTagId + '"]').attr('select', true);
		$('#second-select option[val="' + res.styleTagId + '"]').attr('select', true);
		$('#third-select option[val="' + res.seasonTagId + '"]').attr('select', true);
		//发布状态哦
		$('#handleStatu option[val="' + res.status + '"]').attr('select', true);
		//作品来源
		$('#workFrom option[val="' + res.sourceType + '"]').attr('select', true);

		//		时间
		$("#startTime").val(res.startDate);
		$("#endTime").val(res.endDate);
	}
})