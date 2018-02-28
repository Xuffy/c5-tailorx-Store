
$(function() {
	layer.close(loading);
	var queue = {
		init : function() {
			this.loadNav();
			this.bindEvent();
			

		},
		// 加载选择/分类数据
		loadNav : function() {
			// 衣物分类
			$.ajax({
				type : "POST",
				url : headUrl.headUrl + "/v2/store/rank/findClassify",
				data : {},
				dataType : "json",
				success : function(data) {
					if (data.success) {
						var ihtml = "<span class='checked'>所有</span>";
						for (var i = 0; i < data.data.length; i++) {
							ihtml = ihtml + "<span >" + data.data[i]
									+ "</span>";
						}
						$("#classify").empty();
						$("#classify").append(ihtml);
						return;
					}
					else{
						layer.msg("网络故障,获取数据失败");
						return;
					}
					
				},
                error:function(){
                    layer.msg("服务器出错!");
                    return;
                }
			});
			/* 设计师 */
			$.ajax({
				type : "POST",
				url : headUrl.headUrl + "/v2/store/rank/selectDesign",
				data : {

				},
				dataType : "json",
				success : function(data) {
					if (!data.success) {
						layer.msg("网络故障,获取数据失败");
						return;
					}
					var htmltxt = "<div class='designer-box checkbox none'>";
					for (var i = 0; i < data.data.length; i++) {
						htmltxt = htmltxt
								+ " <label><input type='checkbox' value='"
								+ data.data[i].userId + "'>"
								+ data.data[i].name + "</label>";

					}
					htmltxt = htmltxt
							+ " <div class='ut-text-center ut-mar-t10'>"
							+ " <span class='ut-btn btn-2 ut-mar-r20' id='certainBtn'>确定</span>"
							+ " <span class='ut-btn btn-5' id='cancelBtn'>取消</span></div></div>";
					$(".design > div").remove();
					$(".design").append(htmltxt);
					$(".designer-box").hide();
				},
                error:function(){
                    layer.msg("服务器出错!");
                    return;
                }
			});
		},
		bindEvent : function() {
			//时间插件
			var start = { 
		      elem: '#startTime',
		      format: 'YYYY-MM-DD',
		      istime: false,
		      istoday: false,
		      
		      choose:function(datas){
			         end.min = datas; //开始日选好后，重置结束日的最小日期
			         end.start = datas //将结束日的初始值设定为开始日
					loadData(getparam());
		      },
		      clear: function(datas){
		    	  end.min =  '';
		    	  loadData(getparam());
		        }
		};
	    var end = {
	      elem: '#endTime',
	      format: 'YYYY-MM-DD',
	      istime: false,
	      istoday: false,
	     
	      choose: function(datas){
	         start.max = datas; //开始日选好后，重置结束日的最小日期
	         start.start = datas //将结束日的初始值设定为开始日
	         loadData(getparam());
	      },
	      clear: function(datas){
	    	  start.max = '2099-06-16 23:59:59';
	    	  loadData(getparam());
	        }
	    };
	    laydate(start);
	    laydate(end);
	    
			// 点击条件变颜色
			$(".design  span").click(function() {
				$(".condition-box   .choiced-box ").remove();
				var $this = $(this);
				$this.siblings().removeClass("checked");
				$this.addClass("checked");
				if ($this.attr("type") == "custom") {
					$(".designer-box input").each(function() {
					this.checked = false;
				});
					$(".designer-box").show();

				} else if ($this.attr("type") == "all") {
					$(".designer-box").hide();
					$(".choiced-box").hide();
				}
			});

			$(".condition-box").on("click", ".all_s", function() {
				loadData(getparam());
			});

			// 开始生产
			$("#table_page").on('click', '.linklink', function() {
				var idid = $(this).attr("id");
				var sortNo = $(this).attr("data-id");
				$.ajax({
					type : "POST",
					url : headUrl.headUrl + "/v2/store/rank/startProduct",
					data : {
						rankId : idid,
						sortNo:sortNo
					},
					dataType : "json",
					success : function(data) {
						if (data.success) {
							loadData(getparam());
							return;
						}else{
							//判断是否在交易中
							if(data.code==505){
								layer.msg(data.msg);
								return;
							}
							layer.msg("网络故障，操作失败");
							return;
						}
					},
                    error:function(){
                        layer.msg("服务器出错!");
                        return;
                    }
				})
			});
			// 点击加载页面
			$("#table_page").on('click', '.bid', function() {
				loading = layer.load(2);
				var id = $(this).attr("id");
                sessionStorage.setItem('store-rankId', id);
                location.href = "../../modules/queue/queueManageV2.html";

			});

			// 获取请求参数
			function getparam(page) {
				// 获得设计师名称
				var param = {};

				var type = $(".design > span[class*='checked']").attr('type');
				var designIds="";
				if (type != 'all') {
					var kk = $(".design > .checkbox input[type='checkbox']:checked");
					$.each(kk, function(i, t) {
						designIds+=$(t).val()+",";
					});
				}
				if(designIds!=""){
					designIds=designIds.substring(0,designIds.length-1);
				}
				param.designIds=designIds;
				param.page = page;
				// 开始时间-结束时间
				param.startTime = $("#startTime").val();
				param.endTime = $("#endTime").val();
				param.keyword = $("#keyword").val();
				// 衣物分类
				param.classify = $(".cfy > .conditions > span[class='checked']").text();
				return param;
			}

			// 数据加载
			function loadData(param) {
				loading = layer.load(2);
				$.ajax({
					type : "POST",
                    url : headUrl.headUrl + "/v2/store/rank/queueManage",
					data : param,
					dataType : "json",
					success : function(data) {
						layer.close(loading);
						if (data.success) {
							var wrape = $("#table_page > tbody");
							wrape.empty();
							$("#tableId").hide();
							if(data.code==505){
								$("#templatePage").empty();
//								var aHtml="<td class='no-msg text-center no-user'  colspan='9' style='height: 300px'>暂无排号信息</td>";
//								wrape.append(aHtml);
								$("#tableId").show();
								return ;
							}
							pagination(data.data.total, data.data.totalPages,
									data.data.pageNo);
							var rowHtml = template("pageTabList", data.data);
							wrape.append(rowHtml);
							return;
						}else{
							layer.close(loading);
							layer.msg("网络故障，获取数据失败");
							return;
						}
					},
					error:function() {
						layer.close(loading);
						layer.alert('网络故障，操作失败');
					}
				});
			}
			// 初次加载
			loadData(getparam(0));
			// 分类选择
			$(".cfy > .conditions").on("click", "span", function() {
				$(this).addClass("checked").siblings().removeClass("checked");
				loadData(getparam());
			});

			// 确定选择设计师
			$(".condition-box ").on("click","div #certainBtn",function() {

								var kk = $(".design > .checkbox input[type='checkbox']:checked");
								if(kk.length == 0) {

									layer.msg("请至少选择一个设计师");
									return;
								}
								var chex = "<div class='choiced-box none ut-font12'>";
								$.each(kk,function(i, t) {
													var t = $(t).parent().text();
													var v = $(this).val();
													chex = chex+ "<span class='designdel'>"+ t+ " <i class='fa fa-remove remove-choose' data-id="+v+"></i></span>";
												});
								chex += "<i class='fa fa-caret-down'></i> <span class='ut-btn btn-2' id='removeBtn'>清除</span></div>";
								$(".condition-box #class-design").append(chex);
								$(".designer-box").hide();
								$(".choiced-box").show();
								// 清除选择设计师
								$("#removeBtn").click(function() {
									$(".design .choiced-box ").remove();
									$(".designer-box").show();
									$(".designer-box input").each(function() {
										this.checked = false;
									});
									loadData(getparam());
								});
								// 点击三角形
								$(".fa-caret-down").click(function() {
									$(".design .choiced-box ").remove();
									$(".designer-box").show();
								});
								//删除选择事件
								$('.remove-choose').on('click',function(){
									$(this).parents('.designdel').remove();
									var v = $(this).attr('data-id');
									$.each($(".design > .checkbox input[type='checkbox']"),function(){
										if($(this).val() == v){
											$(this).prop('checked',false)
										}
									})
									if($('.designdel').length == 0){
										$(".design .choiced-box ").remove();
										$('.designer-box.checkbox').show();
									}
									loadData(getparam());
								});
								loadData(getparam());
							});
			

			// 取消按钮
				$(".condition-box ").on("click","div #cancelBtn",function() {
				$(".designer-box input").each(function() {
					this.checked = false;
				});
			});

			// 关键字搜索
			$("#keyword").blur(function() {
				
				loadData(getparam());
				
			});

			// 时间范围选择
			$(".btn-time > input[type='text']").change(function() {
				loadData(getparam());
			});
			
			// 分页
			function pagination(total, pageLength, page) {
				$('#templatePage').pagination({
					totalData : total,// 总条数
					showData : pageLength,// 每页显示条数
					jump : true,// 跳转
					current : page+1,// 当前页
					coping : true,// 首页和尾页
					count : 4,// 当前页前后分页个数
					homePage : '首页',
					endPage : '末页',
					prevContent : '上页',
					nextContent : '下页',
					callback : function(index, jq) {
						var page = index.getCurrent();// 获取当前页
						loadData(getparam(page-1));
					}
				});
			}
		},
	};

	queue.init();
});
