layer.close(loading);
sessionStorage.setItem('newsEidt', false);
var news = {
	init:function(){
		this.bindEvent();
		this.pagination(0,10,0);
		this.initTable(0,10);
		this.findSystemTages();
	},
	
	
	bindEvent:function(){
		//选择设计师
		$(".designer>label>input").click(function(){
			var $this = $(this);
			if($this.attr("mark") == "define"){
				$this.parent().siblings(".designer-box").show();
				news.getDesignerList();
			}else{
				$this.parent().siblings(".designer-box").hide();
				$this.parent().siblings(".choiced-box").hide();
			}
		});
		
		/*//取消按钮
		this.callOff();
		
		//确定按钮
		this.certainClick();
		
		//点击性别
		$("#query_sex span").click(function(){
			news.getTypeData({categoryId:$(this).attr("value"),type:2});
		});*/
		$('#key-select').on('blur',function(){
			news.initTable(0,10);
		})
		$('#sex-select').on('change',function(){
			news.initTable(0,10);
		})
		$('#second-select').on('change',function(){
			news.initTable(0,10);
		})
		$('#third-select').on('change',function(){
			news.initTable(0,10);
		})
		//点击确认价格
		$("#priceBtn").click(function(){
			var min = $(minPrice).val();
			var max = $(maxPrice).val();
			if(max){
				if(min>max){
					layer.msg("价格输入不合法");
					return ;
				}
			}
			news.initTable(0,10);
		});
		
		/*//点击全部设计师
		$("#query_designer input:checked").click(function(){
			news.initTable(0,10);
		});
		
		//点击全部设计师
		$("#query_category input:checked").click(function(){
			news.initTable(0,10);
		});*/
		
		
		//条件点击变绿
		$(".condition span").click(function(){
			var $this = $(this);
			$this.siblings().removeClass("checked");
			$this.addClass("checked");
			if($this.attr("type") == "all"){
				$(".define").hide();
			}else if($this.attr("type") == "define"){
				$(".define").css("display","inline-block");
			}
			news.initTable(0,10);
		});
		
		//点击删除
		$('#deleteAll').click(function(){
			var length=$("#newList input:checked").length;
			if(length==0){
				return layer.msg('请选择需要删除的数据！');
			}
			var delNewsIds="";
			$("#newList input:checked").each(function(){
				delNewsIds+=$(this).attr("value")+",";
			});
			news.delDataAjax(delNewsIds);
		});
		//点击添加
		$('#addNewsBtn').click(function(){
			window.location.href = "addNews.html"
//			$("#store-content").load(headUrl.headUrl + "/v2/store/news/addNewsPage");
		});
			
	},
	/*caretClick:function(){
		//点击三角形
		$(".fa-caret-down").off("click");
		$(".fa-caret-down").click(function(){
			var $this = $(this);
			$this.parent().hide();
			$this.parent().siblings(".designer-box").show();
		});
	},
	clearDesigner:function(){
		//清除选择设计师
		$(".removeBtn").off("click");
		$(".removeBtn").click(function(){
			var $this = $(this);
			
			$this.parent().siblings(".designer-box").find("input").attr("checked",false);
			$this.parent().hide();
			
			$this.parent().siblings(".designer-box").show();
			$this.parent().html("");
		});
	},*/
	//点击叉叉 移除选中
/*	removeChoiced:function(){
		$(".fa-remove").off("click");
		$(".fa-remove").click(function(){
			var $this = $(this);
			
			
			//移除复选框选中；
			var val = $this.attr("id");
			var $check = $this.parent().parent().siblings(".designer-box");
			$check.find("input[value='"+val+"']").attr("checked",false);
			
			if($this.parent().parent().find(".fa-remove").length == 1){
				$this.parent().parent().hide();
				$check.show();
				
			}
			$this.parent().remove();
			news.initTable(0,10);
		});
	},*/
	//取消按钮
	/*callOff : function(){
		$(".cancelBtn").off("click");
		$(".cancelBtn").on("click",function(){
			$(this).parent().parent().find("input").each(function(){
				this.checked = false;
			});
		});
	},*/
	/*certainClick:function(){
		//确定选择设计师
		$(".certainBtn").off("click");
		$(".certainBtn").click(function(){
			var $this = $(this);
			var $check = $this.parent().parent();
			var $choice = $this.parent().parent().siblings(".choiced-box");	
			var str = "";
			
			if(!$check.find("input:checked").length){
				return layer.msg("请至少选择一个"+$this.attr("type"));
				
			}
			
			$check.find("input:checked").each(function(){
				str += '<span>'+$(this).attr("data")+' <i class="fa fa-remove" id="'+$(this).val()+'"></i></span>';
			});
			str += '<i class="fa fa-caret-down"></i>'+
	        '<span class="ut-btn btn-2 ut-fr removeBtn">清除</span>';
			
			$choice.html(str);
			
			//绑定数据后绑定事件
			news.caretClick();
			news.clearDesigner();
			news.removeChoiced();
			news.initTable(0,10);
			
			$check.hide();
			$choice.show();
			
		});
	},*/
	//全选框点击
/*	checkAll:function(){
		$("#checkAll").off("click");
		$("#checkAll").click(function(){
			var allInput = $("#newList input[data-id!=0]");
			
			allInput.prop("checked",$(this).prop("checked"));
			allInput.click(function(){
				if(allInput.length == $("#newList input:checked").length){
					$("#checkAll").prop("checked",true);
				}else{
					$("#checkAll").prop("checked",false);
				}
			});
		});
	},*/
	//查看系统标签
	findSystemTages:function(){
		$.ajax({
			type:"get",
			url:headUrl.headUrl + "/v3/store/tag/getSearchTagList",
			dataType:'json',
			success:function(res){
				if(res.success){
					var el='';
					$.each(res.data,function(i,value){
						if(value.tagType == 1){
							el='<option value="'+value.tagId+'">'+value.tagName+'</option>'
							$('#sex-select').append(el);
						}else if(value.tagType == 2){
							el='<option value="'+value.tagId+'">'+value.tagName+'</option>'
							$('#second-select').append(el);
						}else if(value.tagType == 3){
							el='<option value="'+value.tagId+'">'+value.tagName+'</option>'
							$('#third-select').append(el);
						}
					})
				}
			},error:function(){
				layer.msg(res.msg,{offset:'50%'});
			}
		});
	},
	initTable:function(page,pageLength){
		var prm=  new Object();
		prm.page=page;
		prm.pageLength=pageLength;
		/*var gender=$('#query_sex .checked').attr("value");
		if(gender!=null&&gender!=''){
		prm.firstCategoryId=gender;
		}
		
		var query_category=$('#query_category input:checked').attr("mark");
		if(query_category=='define'){
			var categorys="";
			$('#category').find("input:checked").each(function(){
				categorys+=$(this).attr("value")+",";
			});
			if(categorys!=""){
				prm.categorys=categorys;
			}
		}*/
		//关键字
		var keyWor = $('#key-select').val();
		//性别 品类 类别
		var sexSelect = $('#sex-select option:checked').val();
		var secondSelect = $('#second-select option:checked').val();
		var thirdSelect = $('#third-select option:checked').val();
		prm.tag = keyWor;
		prm.firstCategoryId = sexSelect;
		prm.secondCategoryId = secondSelect;
		prm.thirdCategoryId = thirdSelect;
		
		var query_Price=$('#query_Price .checked').attr("type");
		if(query_Price=='define'){
			var minPrice=$('#minPrice').val();
			var maxPrice=$('#maxPrice').val();
			
			if(minPrice!=null&&minPrice!=''){
				prm.minPrice=minPrice;
			}
			if(maxPrice!=null&&maxPrice!=''){
				prm.maxPrice=maxPrice;
			}
		}
		
		var query_status=$('#query_status .checked').attr("value");
		if(query_status!=null&&query_status!=''){
			prm.status=query_status;
		}
		
		/*var query_designer=$('#query_designer input:checked').attr("mark");
		if(query_designer=='define'){
			var designers="";
			$('#designerBox').find("input:checked").each(function(){
				designers += $(this).attr("value")+",";
			});
			if(designers!=""){
				prm.designers=designers;
			}
		}*/
		news.getListAjax(prm);
	},
	
	/*getTypeData:function(data){
		$.ajax({
			url:headUrl.headUrl + "/v2/store/news/findCategory",
			data:data,
			dataType:'json',
			success:function(res){
				var str="";
				$.each(res.data.data,function(i,value){
					 str+='<label><input type="checkbox" value='+value.id+' data='+value.name+'>'+value.name+'</label>';
				});
				str+='<div class="ut-text-center ut-mar-t10">';
				str+='<span class="ut-btn btn-2 ut-mar-r20 certainBtn" type="类别">确定</span>';
				str+='<span class="ut-btn btn-5 cancelBtn">取消</span></div>';
				$("#category").html(str);
				
				//绑定数据后绑定事件
				news.clearDesigner();
				news.certainClick();
				news.callOff();
				news.initTable(0,10);
			}
		})
	},*/
	/*getDesignerList:function(){
		$.ajax({
			url:headUrl.headUrl + "/v2/store/news/getDesignerList",
			data:{},
			dataType:'json',
			success:function(res){
				var str="";
				$.each(res.data,function(i,value){
					 str+='<label><input type="checkbox" value='+value.id+' data='+value.name+'>'+value.name+'</label>';
				});
				str+='<div class="ut-text-center ut-mar-t10">';
				str+='<span class="ut-btn btn-2 ut-mar-r20 certainBtn" type="设计师">确定</span>';
				str+='<span class="ut-btn btn-5 cancelBtn">取消</span></div>';
				$("#designerBox").html(str);
				
				//绑定数据后绑定事件
				news.certainClick();
				news.callOff();
				news.initTable(0,10);
			}
		})
	},*/
	
	getListAjax:function(data){
		loading = layer.load(2);
		$.ajax({
			url:headUrl.headUrl + "/v2/store/news/findNewsList",
			data:data,
			dataType:'json',
			success:function(res){
				layer.close(loading);
				if(res.success){
					
				news.pagination(res.data.totalSize,res.data.pageLength,res.data.page);
				$("#newList").html('');
				var html='<tr><td>资讯编号</td><td>名称</td><td>封面</td><td>价格区间</td><td>系统标签</td><td>自定义标签</td><td>状态</td><td>设计师</td><td>创建时间</td><td>操作</td></tr>';
				$.each(res.data.data,function(i,value){
					if(value.systemTags){
						var stStr = value.systemTags;
						var reg = new RegExp(",","g");//g,表示全部替换。
						var valsyStr = stStr.replace(reg,"/");
						}
						if(value.commonTags){
						var coStr = value.commonTags;
						var reg = new RegExp(",","g");//g,表示全部替换。
						var valcoStr = coStr.replace(reg,"/");
						}
					html+='<tr>'+
							'<td>'+
								'<div class="checkbox">'+
									'<label><input type="checkbox" data-id="'+value.status+'" name="newsId" class="checkbox-input" value='+value.id+'>'+value.informationNo+'</label>'+
								'</div>'+
							'</td>'+
							'<td>'+
							value.name +
							'</td>'+
							'<td>'+
								'<div class="img-box dress-picture">'+
									'<img src="'+(!!value.coverUrl ? value.coverUrl : "../../img/temp.png")+'" alt="">'+
								'</div>'+
							'</td>'+
							'<td>'+value.minPrice+'~'+value.maxPrice+'</td>'+
							/*'<td>'+value.firstCategoryName+'</td>'+*/
							'<td>'+(!value.systemTags? '':valsyStr)+'</td>'+
							'<td>'+(!value.commonTags? '':valcoStr)+'</td>'+
							'<td>'+value.statusStr+'</td>'+
							'<td>'+
								'<div class="img-box photo">'+
									'<img src="'+(!!value.designerPhoto ? value.designerPhoto : "../../img/temp.png")+'" alt="">'+
								'</div>'+
								'<p>'+value.designerName+'</p>'+
							'</td>'+
							'<td>'+(!value.createDateStr?'':value.createDateStr)+'</td>';
					if(value.status==0||value.status==1){
						html+='<td>'+
								'<a href="javascript:;" onclick="news.toDetailPage('+value.id+')">查看详情</a>'+
							   '</td>';
					}else if(value.status==2){
						html+='<td>'+
						'<a href="javascript:;" class="ut-mar-b10" onclick="news.delDataAjax('+value.id+')">删除</a><br>'+
						'<a href="javascript:;" onclick="news.toDetailPage('+value.id+')" >查看详情</a>'+
					   '</td>';
					}else if(value.status==3){
						html+='<td>'+
						'<a href="javascript:;" class="ut-mar-r10" onclick="news.toUpdatePage('+value.id+')">编辑</a>'+
						'<a href="javascript:;" class="ut-mar-b10" onclick="news.delDataAjax('+value.id+')">删除</a><br>'+
						'<a href="javascript:;" onclick="news.toDetailPage('+value.id+')" >查看详情</a><br>'+
						'<a href="javascript:;" onclick="news.toUpdateStatus(2,'+value.id+')">重新提交</a>'+
					   '</td>';
					}else{
						html+='<td>'+
						'<a href="javascript:;" class="ut-mar-r10" onclick="news.toUpdatePage('+value.id+')">编辑</a>'+
						'<a href="javascript:;" class="ut-mar-b10" onclick="news.delDataAjax('+value.id+')">删除</a><br>'+
						'<a href="javascript:;" onclick="news.toDetailPage('+value.id+')" >查看详情</a><br>'+
						'<a href="javascript:;" onclick="news.toUpdateStatus(1,'+value.id+')">提交审核</a>'+
					   '</td>';
					}
							
					html+='</tr>';
					
				});
				}else{
					layer.msg(res.msg,{offset:'50%'});
				}
				
				$("#newList").html(html);
//				news.checkAll();
				$('.checkbox-input').on('click',function() {
					$this = $(this);
					if($this.attr("data-id") == 0) {
						/*$this.css('disabled','true');*/
						$this.prop("checked", false);
						layer.msg('该资讯已设为精选，不能删除！');
					}
				})
			},
			error: function(){
				layer.close(loading);
				layer.alert('网络故障，操作失败！')
			}
		})
	},
	delDataAjax:function(delNewsIds){
		if (confirm("确认要删除？")) {
			loading = layer.load(2);
            $.ajax({
				url:headUrl.headUrl + "/v2/store/news/delNews",
				data:{delNewsIds:delNewsIds},
				dataType:'json',
				success:function(res){
					layer.close(loading);
					if(res.success){
						layer.msg('删除成功！');
						news.initTable(0,10);
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
	toAddNews:function(){
		loading = layer.load(2);
//		$("#store-content").load(headUrl.headUrl + "/v2/store/news/addNewsPage");
		window.location.href = "addNews.html"
	},
	/*编辑*/
	toUpdatePage:function(newsId){
		loading = layer.load(2);
		sessionStorage.setItem('store-infoId', newsId);
		sessionStorage.setItem('newsEidt', true);
		window.location.href = "newsEdit.html"
//		$("#store-content").load(headUrl.headUrl + "/v2/store/news/updateNewsPage?newsId="+newsId);
	},
	/*查看详情*/
	toDetailPage:function(newsId){
		sessionStorage.setItem('store-infoId', newsId);
		loading = layer.load(2);
		window.location.href = "newsDetail.html"
//		$("#store-content").load(headUrl.headUrl + "/v2/store/news/newsDetailPage?newsId="+newsId);
	},
	/*重新提交*/
	toUpdateStatus:function(type,newsId){
		var typeStr="确认";
		if(type==1){
			typeStr+="提交审核？";
		}else{
			typeStr+="重新提交？";
		}
		if (confirm(typeStr)) {
			loading = layer.load(2);
            $.ajax({
				url:headUrl.headUrl + "/v2/store/news/updateStatus",
				data:{newsId:newsId},
				dataType:'json',
				success:function(res){
					layer.close(loading);
					if(res.success){
						layer.msg('提交成功！');
						news.initTable(0,10);
					}else{
						layer.msg(res.msg);
					}
				},
				error:function(){
					layer.close(loading);
					layer.msg("网络故障！");
				}
			});
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
            	$("#checkAll").prop("checked",false);
            	news.initTable(index.getCurrent()-1,10);
            }
		});
	}
	
};

$(function(){	
	news.init();
});