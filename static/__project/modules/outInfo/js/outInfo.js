layer.close(loading);

var outInfo = {
	init:function(){
		this.bindEvent();
		this.pagination(0,10,0);
		this.initTable(0,10);
	},
	bindEvent:function(){
		
		/* 设计师 */
		$.ajax({
			type : "POST",
			url : headUrl.headUrl +"/v2/store/rank/selectDesign",
			data : {},
			dataType : "json",
			success : function(data) {
				if (!data.success) {
					layer.msg("网络故障,获取数据失败");
					return;
				}
				$(".Designer-select").empty();
				var htmltxt = "<option value='-1'>全部</option>";
				for (var i = 0; i < data.data.length; i++) {
					htmltxt = htmltxt+ "<option value='"+ data.data[i].id + "'>"+ data.data[i].name + "</option>";
				}
				$(".Designer-select").append(htmltxt);
			},
			error:function(){
				layer.close(loading);
				layer.msg("网络故障！");
			}
		});
		
		/* 获取所有分类*/
		$.ajax({
			type : "POST",
			url : headUrl.headUrl +"/v2/store/outsideInformation/findCategoryList",
			data : {},
			dataType : "json",
			success : function(data) {
				param=data.data;
                if (!data.success) {
                    layer.msg("网络故障,获取数据失败");
                    return;
                }
				$(".sex-select").empty();
				var htmlsex="<option value='-1'>全部</option>";
				//获取第一级
				for (var j = 0; j < data.data.length; j++) {
					htmlsex = htmlsex+ "<option value='"+ data.data[j].id + "'>"+ data.data[j].name + "</option>";
				}
				$(".sex-select").append(htmlsex);
			},
			error:function(){
				layer.close(loading);
				layer.msg("网络故障！");
			}
		});
		//封装查询出来的数据
		param:[];
		// 关键字搜索
		$(".themeNumber").blur(function() {
			outInfo.initTable(0,10);
		});
		
		//时间插件
		var start = { 
	      elem: '#startTime',
	      format: 'YYYY-MM-DD',
	      istime: false,
	      istoday: false,
	      
	      choose:function(datas){
		         end.min = datas; //开始日选好后，重置结束日的最小日期
		         end.start = datas //将结束日的初始值设定为开始日
		         outInfo.initTable(0,10);
	      },
	      clear: function(datas){
	    	  end.min =  '';
	    	  outInfo.initTable(0,10);
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
	         outInfo.initTable(0,10);
	      },
	      clear: function(datas){
	    	  start.max = '2099-06-16 23:59:59';
	    	  outInfo.initTable(0,10);
	        }
	    };
	    laydate(start);
	    laydate(end);
    
		//选择设计师
	    $(".designer2").on("change",".Designer-select",function(){
	    	outInfo.initTable(0,10);
	    });
	    
	    //状态
	    $(".issue").change(function(){
	    	outInfo.initTable(0,10);
	    });
	    
		//点击性别
		$(".sex").on("change",".sex-select",function(){
			var sexId = $(this).val();
			
			$(".second-select").empty();
			var htmlsec="<option value='-1'>全部</option>";
			if(sexId!=-1){
				//设置二级目录
				for (var i = 0; i < param.length; i++) {
					//选择一级分类的时候.加载二级分类
					if(sexId==param[i].id){
						for (var j = 0; j < param[i].childCategories.length; j++) {
							//加载二级分类
								htmlsec = htmlsec+ "<option value='"+ param[i].childCategories[j].id + "'>"+ param[i].childCategories[j].name + "</option>";
						}
					}
				}
			}else{
				$(".third-select").empty();
				$(".third-select").append(htmlsec);
			}
			$(".second-select").append(htmlsec);
			outInfo.initTable(0,10);
		});
		
		//点击二级分类
		$(".second").on("change",".second-select",function(){
			
			var secondId = $(this).val();
			$(".third-select").empty();
			var htmlth="<option value='-1'>全部</option>";
			if(secondId!=-1){
				//设置二级目录
				for (var i = 0; i < param.length; i++) {
						for (var j = 0; j < param[i].childCategories.length; j++) {
							if(param[i].childCategories[j].id==secondId){
								
								//设置三级目录
								for (var k = 0; k < param[i].childCategories[j].childCategories.length; k++) {
									htmlth = htmlth+ "<option value='"+ param[i].childCategories[j].childCategories[k].id + "'>"+ param[i].childCategories[j].childCategories[k].name + "</option>";
								}
							}
						}
				}
			}
			$(".third-select").append(htmlth);
			outInfo.initTable(0,10);
		});
		
		//三级目录
		 $(".third").on("change",".third-select",function(){
		    	outInfo.initTable(0,10);
		    });
		 
		//点击确认价格
		$("#minPrice").blur(function() {
			outInfo.initTable(0,10);
		});
		
		$("#maxPrice").blur(function() {
			var min = $("#minPrice").val();
			var max = $("#maxPrice").val();
			if(max){
				if(min>max){
					layer.msg("价格输入不合法");
					return ;
				}
			}
			outInfo.initTable(0,10);
		});
		//发布位置
		$('#issuePlace').on('change',function(){
			outInfo.initTable(0,10);
		})
		
	},
	
	initTable:function(page,pageLength){
		var prm=  {};
		//关键字搜索
		var searchTerm = $(".themeNumber").val();
		//设计师
		var designerId=$('.designer2 .Designer-select').val();
		//状态
		var status=$(".issue").val();
		//性别
		var firstCategory=$('.sex .sex-select').val();
		//品类
		var secondCategory=$('.second .second-select').val();
		//类型
		var thirdCategory=$('.third .third-select').val();
		//价格区间
		var minPrice=$('#minPrice').val();
		var maxPrice=$('#maxPrice').val();
		//发布位置
		var issuePlace = $('#issuePlace').val();
		//时间
		var startTime = $("#startTime").val();
		var assignEndDate = $("#endTime").val();
		prm={searchTerm:searchTerm,designerId:designerId,status:status,minPrice:minPrice,
				maxPrice:maxPrice,assignStartDate:startTime,assignEndDate:assignEndDate,
				firstCategory:firstCategory,secondCategory:secondCategory,thirdCategory:thirdCategory,
				page:page,pageLength:pageLength,issue:issuePlace};
		
		outInfo.getListAjax(prm);
	},
	
	getListAjax:function(data){
		loading = layer.load(2);
		$.ajax({
			url:headUrl.headUrl +"/v2/store/outsideInformation/findInformations",
			data:data,
			type:'post',
			dataType:'json',
			success:function(res){
				layer.close(loading);
				outInfo.pagination(res.data.totalSize,res.data.pageLength,res.data.page);
				$("#outInfoList").html('');
				var html='<tr><td>资讯编号</td><td>资讯主题</td><td>资讯封面</td><td>价格区间</td><td>设计师</td><td>审核状态</td><td>发布时间</td><td>操作</td></tr>';
				$.each(res.data.data,function(i,value){
					html+='<tr>'+
							'<td>'+value.informationNo+'</td>'+
							'<td style="max-width:280px;">'+value.name +'</td>'+
							'<td>'+
								'<div class="img-box dress-picture">'+
									'<img src="'+(!!value.coverPicture ? value.coverPicture : "/img/temp.png")+'" alt="">'+
								'</div>'+
							'</td>';
							/*if(value.firstCategoryName){
								html+='<td>'+(value.firstCategoryName ? value.firstCategoryName:"一 一" )+(value.secondCategoryName ? '-'+value.secondCategoryName:"")+(value.thirdCategoryName ? "-"+value.thirdCategoryName:"" )+'</td>';
							}*/
					if(value.minPrice==undefined||value.maxPrice==undefined){
						html+='<td>一 一</td>';
					}else{
						html+='<td>'+value.minPrice+'~'+value.maxPrice+'</td>';
					}
					html+='<td>'+
								'<p>'+value.designerName+'</p>'+
							'</td>';
					if(value.status==4){
						html+='<td>已发布</td>';
					}else if(value.status==0){
						html+='<td>已设精选</td>';
					}
					else{
						html+='<td>未发布</td>';
					}
//					发布官网
							/*if(value.issueWeb ==1 && value.issueApp == 1){
						html+='<td>'+(value.issueWeb==1?"tailorx官网":"")+','+(value.issueApp == 1?"app":"")+'</td>';
							}else{
								html+='<td>'+(value.issueWeb==1?"tailorx官网":"")+(value.issueApp == 1?"app":"")+'</td>';
							}*/
						html+='<td>'+value.createTime+'</td>';
						if(value.status==3){
							html+='<td>'+
									'<div class="ut-btn btn-4" onclick="outInfo.updateInfo(\''+value.informationNo+'\')">编辑</div>'+
									'<div class="ut-btn btn-1" onclick="outInfo.issueInfo(\''+value.informationNo+'\')">发布</div>'+
								   '</td>';
						}else if(value.status==2){
							html+='<td>'+
							'<div class="ut-btn btn-4" onclick="outInfo.updateInfo(\''+value.informationNo+'\')">编辑</div>'+
							'<div class="ut-btn btn-6" >发布</div>'+
						   '</td>';
						}else if(value.status==4){
							html+='<td>'+
							'<div class="ut-btn btn-4" onclick="outInfo.updateInfo(\''+value.informationNo+'\')">编辑</div>'+
							'<div class="ut-btn btn-3" onclick="outInfo.delInfo(\''+value.informationNo+'\')">删除</div>'+
						   '</td>';
						}else{
							html+='<td>'+
							'<div class="ut-btn btn-1" onclick="outInfo.detailInfo(\''+value.informationNo+'\')">查看</div>'+
							'</td>';
						}
						html+='</tr>';
						
					});

				
				$("#outInfoList").html(html);
				
			},
			error: function(){
				layer.close(loading);
				layer.alert('网络故障，操作失败！')
			}
		})
	},
	//删除
	delInfo:function(informationNo){
		if (confirm("确认要删除？")) {
			loading = layer.load(2);
            $.ajax({
				url:headUrl.headUrl +"/v2/store/outsideInformation/deleteInformation",
				data:{informationNo:informationNo},
				dataType:'json',
				type:'post',
				success:function(res){
					layer.close(loading);
					if(res.success){
						layer.msg('删除成功！');
						outInfo.initTable(0,10);
					}else{
						layer.msg(res.msg);
					}
				},
				error:function(){
					layer.close(loading);
					layer.msg("网络故障！");
				}
			})
	    }
	},

	/*编辑*/
	updateInfo:function(newsId){
		loading = layer.load(2);
        sessionStorage.setItem('store-outInfoId', newsId);
       location.href = "newsEdit.html";

	},
	//	查看
	detailInfo:function(newsId){
		sessionStorage.setItem('store-outInfoId', newsId);
		location.href="addNewsEdit.html"
	},
	/*发布*/
	issueInfo:function(informationNo){
		if (confirm("确认要发布？")) {
			loading = layer.load(2);
            $.ajax({
				url:headUrl.headUrl +"/v2/store/outsideInformation/publishInformation",
				data:{informationNo:informationNo},
				dataType:'json',
				type:'post',
				success:function(res){
					layer.close(loading);
					if(res.success){
						layer.msg('发布成功');
						outInfo.initTable(0,10);
					}else{
						layer.msg(res.msg);
					}
				},
				error:function(){
					layer.close(loading);
					layer.msg("网络故障！");
				}
			})
	    }
	},

	//分页
	pagination:function (total,pageLength,page){			
		$('#templatePage').pagination({
            totalData: total,//总条数
            showData:pageLength,//每页显示条数
            jump: true,//跳转
            current: page+1,//当前页
            coping: true,//首页和尾页
            count: 3,//当前页前后分页个数
            homePage: '首页',
            endPage: '末页',
            prevContent: '上页',
            nextContent: '下页',
            callback: function (index) {
            	outInfo.initTable(index.getCurrent()-1,10);
            }
		});
	}
	
};

$(function(){	
	outInfo.init();
});