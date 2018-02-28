var tailorxOrderUrl = sessionStorage.getItem("tailorx-order-name");
var orderpage = localStorage.getItem('tailorx-order-page');
//页数显示
//var pageNum = $('#pageNum option:checked').attr('value');
var pageNum =10;
//检测账号 显示状态操作
var sampleOrder = {
	init: function() {
		this.search(
			 (!orderpage ? 0 : orderpage),
			pageNum
		);
		//		this.initcategory(); //查询类别
		this.initLinkage(); //联动
		this.resetFn();
		//		this.search(0, 30); //获取参数搜索
		this.findSystemTages(); //获取标签
	},
	initOrder: function(prm) {
		sessionStorage.setItem("tailorx-sampleOrder-name", JSON.stringify(prm));

		$.ajax({
			type: 'POST',
			url: headUrl.headUrl + "/v3/store/sampleOrder/findList",
			data: prm,
			dataType: 'json',
			success: function(res) {
				if(res.success) {
					var data = res.data;
					sampleOrder.pagination(data.totalSize, data.pageLength, data.page);
					$('#tableContList').html('');
					var html = '<tr><th>订单编号</th><th>设计师</th><th>系统标签</th><th>标签</th><th>订单金额</th><th>订单级别</th><th>订单创建时间</th><th>处理状态</th><th>操作</th></tr>';
					if(data.data){
					$.each(data.data, function(i, value) {
						if(value.tagsName) {
							var coStr = value.tagsName;
							var reg = new RegExp(",", "g"); //g,表示全部替换。
							var valcoStr = coStr.replace(reg, "/");
						}
						html += '<tr>' +
							'<td>' + value.sampleNo + '</td>' +
							'<td>' + (!value.designerName ? '----' : value.designerName) + '</td>' +
							'<td>' + (!value.genderName ? '--' : value.genderName) + (!value.styleName ? '--' : '/' + value.styleName) + (!value.seasonName ? '' : '/' + value.seasonName) + '</td>' +
							//							'<td></td>' +
							'<td>' + (!value.tagsName ? '----' : valcoStr) + '</td>' +
							/*'<td>' + (!value.sortNo ? '----' : value.sortNo) + '</td>' +*/
							'<td>' + (!value.price ? '----' : value.price) + '</td>' +
//							'<td>' + (!value.deposit ? '----' : value.deposit) + '</td>' +
							'<td>D</td>' +
							'<td>' + value.createTimeStr + '</td>';
						if(value.operation == 2) {
							if((user.userType == 1 || user.userType == 3) && value.tacheId == 2 &&  !value.designerId) {
								html += '<td>待分配</td>';
							} else {
								html += '<td>待处理</td>';
							}
						} else {
							if((user.userType == 1 || user.userType == 3) && value.tacheId == 2 && !value.designerId) {
								html += '<td>待分配</td>';
							} else {
								html += '<td>----</td>';
							}
						}
//						html +='<td>' + value.flowName + '--' + value.tacheName + '</td>';
						html += '<td>';
						if(value.operation == 2) {
							if(value.designerId) {
								html += '<a href="javascript:;" onclick="sampleOrder.orderEdit(\'' + value.id + '&' + 0+ ',' +data.page+'\')">处理</a>';
							}
							/*if((user.userType == 1 || user.userType == 3) && value.tacheId == 2) {
								html += '<a href="javascript:;" onclick="order.allocationEdit(\'' + value.orderNo +',' +data.page+  '\')">分配</a>';
							}*/

						} else {
							html += '<a href="javascript:;" onclick="sampleOrder.orderDetail(\'' + value.id + '&'  +0+ '\',\'' +data.page+'\')">查看</a>';
							/*if((user.userType == 1 || user.userType == 3) && value.tacheId == 2) {
								html += '<a href="javascript:;" onclick="order.allocationEdit(\'' + value.orderNo + ',' +data.page+ '\')">分配</a>';
							}*/
						}

						html += '</td></tr>'
					});
					}
					$('#tableContList').html(html);
					$('#totalSize').html(data.totalSize)
//					order.clearOrderAll();
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
		})
	},
	//操作
	orderEdit: function(orderno) {
		sessionStorage.setItem('tailorx-sampleOrder-type', 2);
		window.location.href = "sampleOrderEdit.html?orderNo=" + orderno;
	},
	//添加样衣单
	addsampleFunction:function(){
		sessionStorage.setItem('tailorx-sampleMeasurebody-type', 1);
		window.location.href = "sampleOrderCreation.html";
	},
	//查看
	orderDetail: function(orderno,page) {
		sessionStorage.setItem('tailorx-sampleOrder-type', 1);
		localStorage.setItem('tailorx-sampleOrder-page', page);
		window.location.href = "sampleOrderEdit.html?orderNo=" + orderno;
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
	initLinkage: function() {
		/*//点击性别
		$("#sex-select").on("change", order.sexChangeFn.fisrt);

		//点击二级分类
		$("#second-select").on("change", order.sexChangeFn.last);
		//三级目录
		$("#third-select").on("change", function() {
			order.search(0, 30);
		});*/
		//订单级别 系统标签
		$('#order-grade').on('change', function() {
			sampleOrder.search(0, pageNum);
		})
		$('#sex-select').on('change', function() {
			sampleOrder.search(0, pageNum);
		})
		$('#second-select').on('change', function() {
			sampleOrder.search(0, pageNum);
		})
		$('#third-select').on('change', function() {
			sampleOrder.search(0, pageNum);
		})
		$('#pageNum').on('change', function() {
			var pageNum = $('#pageNum option:checked').attr('value');
			sampleOrder.search(0, pageNum);
		})

		//处理状态
		$('#handleStatu').on('change', function() {
			sampleOrder.search(0, pageNum);
		});
		//节点flowCode
		$('#flowCode').on('change', function() {
			sampleOrder.search(0, pageNum);
		});
		//关键字失去焦点keyword
		$('.keyword').on('blur', function() {
			sampleOrder.search(0, pageNum);
		});
	},
	searchFunction: function() {
		sampleOrder.search(0, pageNum);
	},
	resetFn: function() {
		$('#res').on('click', function() {
			$('option[selected]').removeAttr('selected');
			$('#formTable')[0].reset();
			sampleOrder.search(0, pageNum);
		});
	},
	//	搜索
	search: function(page, pageLength) {
		var prm = {};
		/*if(orderpage){
		page = orderpage;
		}*/
		pageLength = $('#pageNum option:checked').attr('value');
//		var orderGrade = $('#order-grade option:checked').val();
		//关键字
		var keyword = $('.keyword').val();
		//		处理状态
		var handleStatu = $('#handleStatu option:checked').attr('value');
		//性别 品类 类别
		var sexSelect = $('#sex-select option:checked').val();
		var secondSelect = $('#second-select option:checked').val();
		var thirdSelect = $('#third-select option:checked').val();
		//流程节点
		var flowCode = $('#flowCode option:checked').attr('value');
		//		价格
		var minPrice = $('#minPrice').val();
		var maxPrice = $('#maxPrice').val();
		//		时间
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		prm = {
			searchTerm: keyword,
			sexTagId: sexSelect,
			styleTagId: secondSelect,
			seasonTagId: thirdSelect,
			minPrice: minPrice,
			maxPrice: maxPrice,
			startTime: startTime,
			endTime: endTime,
			page: page,
			pageLength: pageLength,
			status: handleStatu

			/*orderGrade: orderGrade,
			node: flowCode,
			*/
		};
		sampleOrder.initOrder(prm);
	},
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
			sampleOrder.ajaxFindDesigner(addTableInput);

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
	//查询设计师之后的html
	designerListHtml: function(data) {
		$("#designerList").html('');
		var str = "";
		$.each(data, function(i, value) {
			if(value.type == 2) {
				str += '<li class="checked">' +
					'<div class="img-box orderAllPhoto">' +
					'<img id="edit-designerPhoto" src="' + value.photo + '" data-id="'+value.id+'" alt="">' +
					'</div>' +
					'<p data-id="' + value.id + '" id="edit-designerName">' + value.name + '</p>' +
					'</li>'
			} else {

				str += '<li ' + (i == 0 ? "class=checked" : "") + '>' +
					'<div class="img-box orderAllPhoto">' +
					'<img src="' + (!!value.photo ? value.photo : "../../img/temp.png") + '"data-id="' + value.id + '" alt="">' +
					'</div>' +
					'<p data-id="' + value.id + '">' + value.name + '</p>' +
					'</li>';
			}
		});
		$("#designerList").html(str);
	},
	//模糊查询设计师
	ajaxEditDesigner: function(data) {
		var that = this;
		$.ajax({
			url: headUrl.headUrl + "/v2/store/news/findDesignerList",
			data: data,
			dataType: 'json',
			success: function(res) {
				if(res.success) {

					that.designerListHtml(res.data);
					sampleOrder.clickEditDesigner();
				}

			}
		});
	},
	//选中设计师
	clickEditDesigner: function() {
		$("#designerList li").off("click");
		$("#designerList li").click(function() {
			var $this = $(this);
			$this.addClass("checked").siblings().removeClass("checked");
			$("#searchDesigner").val($this.find("p").html());
		});
	},
	//保存
	orderAllSaveFun: function(orderNo) {
		$('#orderAllEdit').unbind('click').on('click', function() {
			var sex = $('#picSex-str .picBorder-active').attr('data-id');
			var style = $('#picStyle-str .picBorder-active').attr('data-id');
			var season = $('#picSeason-str .picBorder-active').attr('data-id');
			var assignComment = $('#orderAll-remark').val();
			var designerId = $("#designerList .checked img").attr("data-id");
			if($("#designerList .img-box img").length == 0) {
				return layer.msg('请输入设计师！', {
					offset: '50%'
				});
			} else if($("#designerList .checked").length > 1) {
				return layer.msg('设计师只能选一个！', {
					offset: '50%'
				});
			}
			if(!designerId) {
				return layer.msg('请选择设计师！'), {
					offset: '50%'
				}

			};
			var comAdd = ''
			$.each($('#picTab-Add .pic-border'), function(i, value) {
				comAdd += $(this).data('item-data');
				comAdd += '||';
			});
			$.ajax({
				type: "post",
				url: headUrl.headUrl + "/v3/store/order/assignOrder",
				async: true,
				dataType: 'json',
				data: {
					orderNo: orderNo,
					designerId: designerId,
					sexTagId: sex,
					styleTagId: style,
					seasonTagId: season,
					commonTags: comAdd,
					assignComment: assignComment
				},
				success: function(res) {
					if(res.success) {
						$('#orderAll').hide();
						sampleOrder.search(0, pageNum);
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

		})
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
				sampleOrder.search(index.getCurrent() - 1, pageNum);
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
	sampleOrder.init();
	if(tailorxOrderUrl) {
		var res = JSON.parse(tailorxOrderUrl)
		$('.keyword').val(res.keyWord);
		//		处理状态
		$('#handleStatu option[value="' + res.stutas + '"]').attr('selected', true);
		//性别 品类 类别firstCategoryId

		//流程节点node
		$('#flowCode option[value="' + res.node + '"]').attr('selected', true);
		//		价格
		$('#minPrice').val(res.minPrice);
		$('#maxPrice').val(res.maxPrice);
		//		时间
		$("#startTime").val(res.startDate);
		$("#endTime").val(res.endDate);
		//		order.initOrder(res);
	}
})
