var decoration ={
	init : function(){
		this.initIndexBanner("#indexBannerBox",headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/findIndexBanners",function(){
			$("#homeNum").html($("#indexBannerBox>div").length - 1);
			layer.close(loading);
		});
		this.initIndexBanner("#infoBannerBox",headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/findInfoBanners",function(){
			layer.close(loading);
			$("#infoNum").html($("#infoBannerBox>div").length - 1);
		});
		
		this.initDesigner();
		this.bindEvent();
	},
	timer:null,
	timer2:null,
	starDesigner:{},
	starArr:[],
	allStarArr:[],
	confirmBtn:true,
	bindEvent: function(){
		 //切换的active 
	    $('.header li').on('click',function(){
	        $(this).addClass('active').siblings('li').removeClass('active');
	    });
	    
	    //批量删除明星设计师
	    this.removeMultipleStar();
	    
	    //点击确定添加明星设计师
	    $("#addStar").click(function(){
	    	var mark = $(this).attr("mark")
	    	if(!decoration.starDesigner.id) return layer.msg("请先查询设计师");
	    	
	    	if(mark){
	    		decoration.updateStarAjax({oldId:decoration.allStarArr[mark].id,newId:decoration.starDesigner.id});
	    	}else{
	    		decoration.addStarAjax({id:decoration.starDesigner.id});
	    	}
    		    	
	    });
	    
	    //添加精品设计师-搜索设计师
	    $("#searchByName").keyup(function(){
	    	clearTimeout(decoration.timer2);
			var $this = $(this);
			var value = $this.val();
			decoration.timer2 = setTimeout(function(){
				decoration.ajaxFindDesigner({stylistName:value},function(res){
					var data = res.data;
					if(data.length){
						var str = "";
						for(var i = 0,len = data.length;i < len; i++){
							str+= '<li>'+data[i].name+'</li>';
						}
						$("#designerBoxUl").html(str);
						$("#designerBoxUl").show();
						decoration.selectDesigner(data);
					}
				});
			},1000);
	    });
	    //设计师弹窗取消
	    $('.close-designer').on('click',function(){
	        $('.designer-layer').addClass('ut-none');
	        $("#infoDetail").html("");
	        $("#searchByName").val("");
	        decoration.starDesigner = {};
	    });
	    
	  //banner弹窗内部事件
	    $('.interlinkage-btn').on('click',function(){
	        $('.banner_select .interlinkage-b').removeClass('ut-none').siblings().addClass('ut-none');
	        $("#certainBtn").attr("method-type","0");
	        $(this).addClass("active");
	        $(".designer-btn").removeClass("active");
	        $(".information-btn").removeClass("active");
	    });
	    $('.designer-btn').on('click',function(){
	        $('.banner_select .designer-b').removeClass('ut-none').siblings().addClass('ut-none')
	        $("#certainBtn").attr("method-type","1");
	        
	        $(this).addClass("active");
	        $(".interlinkage-btn").removeClass("active");
	        $(".information-btn").removeClass("active");
	        if(!$("#certainBtn").attr("data-id")) $("#searchDesigner").keyup();
	    });
	    $('.information-btn').on('click',function(){
	        $('.banner_select .information-b').removeClass('ut-none').siblings().addClass('ut-none');
	        $("#certainBtn").attr("method-type","2");
	        $(this).addClass("active");
	        $(".designer-btn").removeClass("active");
	        $(".interlinkage-btn").removeClass("active");
	    });
	    
	    //banner弹窗取消
	    $('.close-add-banner').on('click',function(){
	    	//清除弹框内容
    		decoration.clearLayer();
    		
	        $('.add-banner').addClass('ut-none');
	    });
	    
	    //banner图片上传事件
	   uploadImg({
	    	ele:"#addBanner",
	    	type:1,
	    	format:["jpg","png"],
	    	father:".decorate_modal",
	    	callback:function(res,$ele){
	    		var $img = $ele.siblings("img");
	    		$img.attr("src",res.data[0]+"?x-oss-process=image/resize,m_mfit,h_98,w_98");
	    		$img.css("display","block");
	    	}
	    });
	    
	    //点击确定
	    $("#certainBtn").click(function(){
	    	if(!decoration.confirmBtn) return;
	    	decoration.confirmBtn = false;
	    	//获取参数
	    	var $this = $(this);
	    	var url = $(".upload-img").attr("src");
	    	var temp=url.indexOf("?");
	    	if(temp!=-1){
	    	 url=url.substring(0,url.indexOf("?"));
	    	}
	    	var id = $this.attr("data-id");
	    	var bannerType = $this.attr("type");
	    	var methodType = $this.attr("method-type");
	    	var input,type;
	    	var father = bannerType == 0 ? "#indexBannerBox" : "#infoBannerBox";
	    	var ajaxUrl = bannerType == 0 ? headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/findIndexBanners" : headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/findInfoBanners";
	    	if(bannerType == 0){
	    		function callback(){
					$("#homeNum").html($("#indexBannerBox>div").length - 1);
				}
	    	}else{
	    		function callback(){
					$("#infoNum").html($("#infoBannerBox>div").length - 1);
				}
	    	}
	    	if(!url){
	    		decoration.confirmBtn = true;
	    		return layer.msg("请上传图片");
	    	}
	    	
	    	if($(".interlinkage-b").css("display") == 'block'){
	    		input = $(".interlinkage-b input").val();
	    		if(!input){
	    			decoration.confirmBtn = true;
	    			return layer.msg("请输入链接");
	    		}else if(input.substring(0,7) != "http://" && input.substring(0,8) != "https://"){
	    			decoration.confirmBtn = true;
	    			return layer.msg("请输入链接格式不正确");
	    		}
	    		type = 0;
	    	}else if($(".designer-b").css("display") == 'block'){
	    		input = $(".designer-b input").val();
	    		if(!$("#designerBox .checked").attr("id")){
	    			decoration.confirmBtn = true;
	    			return layer.msg("请先选择设计师");
	    		}
	    		type = 1;
	    	}else if($(".information-b").css("display") == 'block'){
	    		input = $(".information-b input").val();
	    		if(!input){
	    			decoration.confirmBtn = true;
	    			return layer.msg("请先输入资讯编号");
	    		}
	    		type = 2;
	    	}
	    	
	    	var data = {
	    		bannerType:bannerType,
	    		input:input,
	    		type:type,
	    		banner:url
	    	};
	    	//如果是增加图片
	    	if(!id){
		    	if(methodType == 1){
		    		data.input = $("#designerBox .checked").attr("id");
		    	}
	    		decoration.addPictureAjax(data,function(success){
	    			decoration.confirmBtn = true;
	    			if(success){
			    		$('.add-banner').addClass('ut-none');
			    		//清除弹框内容
			    		decoration.clearLayer();
			    		//获取数据
			    		decoration.initIndexBanner(father,ajaxUrl,callback);
	    			}
		    	});
	    	}
	    		    	
	    	//如果是修改图片
	    	if(id){
	    		data = {
	    			id:id,
	    			input:input,
	    			type:methodType,
	    			banner:url
	    		}
	    		if(methodType == 1){
		    		data.input = $("#designerBox .checked").attr("id");
		    	}
	    		decoration.updatePictureAjax(data,function(success){
	    			decoration.confirmBtn = true;
	    			if(success){
		    			$('.add-banner').addClass('ut-none');
			    		//清除弹框内容
			    		decoration.clearLayer();
			    		//获取数据
			    		decoration.initIndexBanner(father,ajaxUrl,callback);
	    			}
	    		});
	    	}
	    	
	    });
	    
		//模糊查询设计师
		$("#searchDesigner").keyup(function(){
			clearTimeout(decoration.timer);
			var $this = $(this);
			var value = $this.val();
			decoration.timer = setTimeout(function(){
				decoration.ajaxFindDesigner({stylistName:value},function(res){
					var str = "",data = res.data;
					for(var i = 0,len = data.length;i < len;i++){
						str +=  '<div class="ut-fl ut-mar-r10 ut-mar-b10 ut-mar-t10 ut-pointer '+(i==0?"checked":"")+'" id="'+data[i].id+'">'+
			                        '<div class="add-por-outer">'+
			                        '<img src="'+(!!data[i].photo ? data[i].photo : "img/temp.png")+'" alt="">'+
			                    '</div>'+
			                    '<div class="ut-pad-t10 text-center">'+data[i].name+'</div>'+
			                '</div>';
					}
					$("#designerBox").html(str);
					
					decoration.checkDesigner();
				});
			},1000);
		});
	 
	},
	//模糊查询之后选择设计师
	checkDesigner:function(){
		$("#designerBox .ut-pointer").click(function(){
			var $this = $(this);
			$this.siblings().removeClass("checked");
			$this.addClass("checked");
			var str = $this.find(".text-center").html();
			$("#searchDesigner").val(str);
		});
	},
	
	//点击批量删除明星设计师事件
	removeMultipleStar:function(){
		$("#removeMultiple").click(function(){
			var ids = "";
			var checkIds=$("input[name=delete]:checked").val();
			if(checkIds==undefined || checkIds==null){
				layer.msg("请选择要删除的设计师");
				return;
				
			}
			$("input[name=delete]:checked").each(function(){
				
				ids+=$(this).attr("data-id")+",";
			});
			ids = ids.slice(0,ids.length-1);
			if(!confirm("确认删除该明星设计师？")) return;		
			decoration.removeStarAjax({ids:ids});
		});	
	},
	//删除明星设计师
	removeStar:function(){
		$(".remove-star").off("click");
		$(".remove-star").click(function(){
			var id = $(this).attr("data-id");
			if(!id) return ;
			
			if(!confirm("确认删除该明星设计师？")) return;			
			decoration.removeStarAjax({ids:id});
		});
	},
    //添加明星设计师
	openDesignerLayer:function(){
		$('.open-designer').off("click");
	    $('.open-designer').on('click',function(){
	        $('.designer-layer').removeClass('ut-none');
	        var index = $(this).attr("mark");
	        $("#addStar").attr("mark","");
	        if(!index) return;
	        var data = decoration.allStarArr[index];
	        $("#addStar").attr("mark",index);
	       
	        
	        $("#infoDetail").html(decoration.designerStr(data));
	    });
	},
	//精品设计师-选中设计师
	selectDesigner:function(res){
		$("#designerBoxUl li").off("click");
		$("#designerBoxUl li").click(function(){
			$("#designerBoxUl").hide();
			var index = $(this).index();
			var data = res[index];
			
			$("#infoDetail").html(decoration.designerStr(data));
		});
	},
	//设计师弹窗的内容
	designerStr:function(data){
		if(!data) return "";
		$("#searchByName").val(data.name);
		decoration.starDesigner = data;
		var styleArr = data.goodStyle.split("/");
		var styleStr = "",starStr = "";
		for(var i = 0,len =styleArr.length;i<len;i++){
			styleStr +='<span>'+styleArr[i]+'</span>'
		}
		for(var j = 0;j<5;j++){
			if(j < data.score){
				starStr +='<span class="fa fa-star"></span>';
			}else{
				starStr +='<span class="fa fa-star grey"></span>';
			}
			
		}
        
		var str = "";
		str += '<div class="ut-fl add-designer-outer">'+
            	'<img src="'+(!!data.photo ? data.photo : "img/temp.png")+'" alt="">'+
            '</div>'+
            '<div class="ut-fl">'+
        '<div class="ut-overflow">'+
            '<div class="add-d-des">'+
                '<div class="ut-fl ut-mar-l20">'+
                    '<div>'+data.name+'('+data.id+')</div>'+
                    '<div>'+data.level+'</div>'+
                '</div>'+
                '<div class="ut-fl ut-mar-l20">'+
                    '<div>'+
                        '<span>擅长风格：</span>'+
                        styleStr+
                    '</div>'+
                    '<div>'+
                        '<span>星级评价：</span>'+
                        starStr+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<div class="ut-mar-l20">'+
            '<div class="ut-mar-b10 ut-mar-t20">工作成绩：</div>'+
            '<div class="ut-mar-b10">'+
                '<span class="fa fa-hand-o-left"></span>'+
                '<span>成交量：</span>'+
                '<span>'+data.order_count+'</span>'+
            '</div>'+
            '<div class="ut-mar-b10">'+
                '<span class="fa fa-phone"></span>'+
                '<span>预约量：</span>'+
                '<span>'+data.appointmentAmount+'</span>'+
            '</div>'+
            '<div class="ut-mar-b10">'+
                '<span class="fa fa-dollar"></span>'+
                '<span>收益金额：</span>'+
                '<span>￥'+data.deal_count+'</span>'+
            '</div>'+
        '</div>'+
    '</div>';
		
		return str;
	},
	//清除弹框内容
	clearLayer:function(){
		$(".interlinkage-b input").val("");
		$(".designer-b input").val("");
		$(".information-b input").val("");
		$(".upload-img").hide().attr("src","");
		$("#certainBtn").attr("type","");
		$("#certainBtn").attr("method-type","");
		$("#certainBtn").attr("data-id","");
		$(".interlinkage-btn").click();
		$("#designerBox").html("");
	},
	
	bannerLayerEvent:function(){
		//点击编辑出现banner弹窗
		$(".open-banner").off("click");
	    $('.open-banner').on('click',function(){
	    	var $this = $(this);
	    	var type = $this.attr("type");
	    	var methodType = $this.attr("methodType");
	    	if(!methodType){
	    		if(type == 0 && $("#indexBannerBox>div").length >= 6){
	    			return layer.msg("图片数量已达最大上限");
	    		}else if(type == 1 && $("#infoBannerBox>div").length >= 6){
	    			return layer.msg("图片数量已达最大上限");
	    		}
	    	}
	    	$("#certainBtn").attr("method-type",methodType);
	    	
	    	if($this.attr("data-id")){
	    		$(".decorate_modal_title").html(" <h2>Banner图片编辑</h2>");
	    		decoration.renderLayer({
	    			type:methodType,
	    			input:$this.attr("input"),
	    			banner:$this.attr("banner"),
	    			id:$this.attr("data-id"),
	    		});
	    	}else{
	    		$(".decorate_modal_title").html(" <h2>Banner图片添加</h2>");
	    	}
	    	$("#certainBtn").attr("type",type);
	        $('.add-banner').removeClass('ut-none');
	    });
	    
	},
	renderLayer:function(data){
		$(".upload-img").attr("src",data.banner).css("display","block");
		$("#certainBtn").attr("data-id",data.id);
		$("#linkMethod div[type="+data.type+"]").click();
		
		if(data.type==0){
			$(".banner_select input[mark="+data.type+"]").val(data.input);
		}else if(data.type==1){
			decoration.findDseignerById({id:data.input});
		}else{
			$(".banner_select input[mark="+data.type+"]").val(data.input);
		}
	},
	renderDesigner:function(data){
		
	},
	//首页banner展示
	initIndexBanner : function(father,url,callback){
		var type;
		if(father == "#indexBannerBox"){
			type = 0;
		}else{
			type = 1;
		}
		var locationUrl = window.location.href;
		$.ajax({
			url:url,
			type:"post",
			dataType:"json",
			success : function(res) {
//				var res = eval('(' + res + ')'); 
				var html= "";
				$(father).html("");
				$.each(res.data,function(i,value){
					html += '<div class="ut-fl ut-mar-b20">'+
                    '<div class="decorate_banner_img ut-border">'+
                        '<div class="banner_outer">'+
                            '<div class="ut-overflow">'+
                                '<img src="'+value.banner+'?x-oss-process=image/resize,m_mfit,h_107,w_143" alt="">'+
                            '</div>'+
                        '</div>'+
                        '<div class="decorate_banner_img_aperate">'+
                            '<span class="fa fa-edit open-banner ut-font18 ut-inline-block border-right crp" data-id="'+value.id+'" methodType="'+value.type+'" input="'+value.input+'" banner="'+value.banner+'" type="'+type+'"></span>'+
                            '<span class="fa fa-trash ut-font18 ut-inline-block crp crp-del" data-id="'+value.id+'"></span>'+
                        '</div>'+
                    '</div>'+
                    '</div>';
					
				});
				html +='<div class="ut-fl ut-mar-b20">'+
                	'<div class="decorate_addBanner ut-font12 ut-border open-banner" type="'+type+'">'+
                	'<div class="add-banner-outer crp">'+
                    '<img src="img/addBaner.png" alt="">'+
                	'</div><p>添加</p></div></div>';
				$(father).html(html);
				
				//绑定layer弹出事件
				decoration.bannerLayerEvent();
				
				callback();
				//删除banner图
				(function(){
					$(father+" .crp-del").off("click");
					$(father+' .crp-del').click(function() {
						var id = $(this).attr("data-id");
						if(!confirm("确认删除该Banner？")) return;
						decoration.deleteBanner({id:id},father,url,callback);					
					});
				})(father);
				
			}
    	});
	},
	
	//模糊查询设计师
	ajaxFindDesigner:function(data,callback){
		loading = layer.load(2);
		$.ajax({
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/findCommonStylistBycondition",
			type:'post',
			dataType:'json',
			data:data,
			success:function(res){
				layer.close(loading);
				if(res.success){
					callback(res);
				}
			},
			error:function(){
				layer.close(loading);
				layer.msg('网络故障！');
			}
		});
	},
	//通过ID查询设计师
	findDseignerById:function(data){
		$.ajax({
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/findDseignerById",
			type:'post',
			dataType:'json',
			data:data,
			success:function(res){
				if(res.success){
					var str = "",data = res.data;

					str +=  '<div class="ut-fl ut-mar-r10 ut-mar-b10 ut-mar-t10 ut-pointer checked" id="'+data.id+'">'+
		                        '<div class="add-por-outer">'+
		                        '<img src="'+(!!data.photo ? data.photo : "img/temp.png")+'" alt="">'+
		                    '</div>'+
		                    '<div class="ut-pad-t10 text-center">'+data.name+'</div>'+
		                '</div>';
					$("#designerBox").html(str);
					
					decoration.checkDesigner();
					$("#designerBox .checked").click();
				}
			}
		});
	},
	// 明星设计师展示
	initDesigner : function(){
		$.ajax({
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/findStarStylists",
			type:"post",
			dataType:"json",
			success : function(res) {
//				var res = eval('(' + res + ')'); 
				if(res.success){
					decoration.allStarArr = res.data;
					var html= "";
					$(".designer-list").html("");
					starArr = res.data;
					$.each(res.data,function(i,value){
						var starStr = "";
						for(var j = 0;j<5;j++){
							if(j < value.score){
								starStr +='<span class="fa fa-star"></span>';
							}else{
								starStr +='<span class="fa fa-star grey"></span>';
							}
							
						}
						
						html += '<div class="ut-fl ut-mar-b20 ut-mar-r20">'+
                        '<input type="checkbox" name="delete" class="choose-radio" data-id="'+value.id+'">'+
                        '<div class="ut-border ut-pad-5 ut-inline-block list-border-outer">'+
                            '<div class="ut-color-e ut-pad-t5 ut-pad-b5 ut-mar-b10 border-bottom">'+(i+1)+'</div>'+
                            '<div class="ut-overflow">'+
                                '<div class="ut-fl portrait-outer">'+
                                    '<img src="'+(!!value.photo ? value.photo : "img/temp.png")+'" alt="">'+
                                '</div>'+
                                '<div class="ut-fl name-outer">'+
                                    '<div>'+
                                        '<span>'+value.name+'</span>'+
                                        starStr +
                                    '</div>'+
                                    '<div>'+
                                        value.goodStyle+
                                    '</div>'+
                                '</div>'+
                                '<div class="ut-fr name-outer ut-pad-r10">'+
                                    '<div>'+
                                        '<a href="javascript:;" class="open-designer update-designer" mark="'+i+'">修改</a>'+
                                    '</div>'+
                                    '<div>'+
                                        '<a href="javascript:;" class="remove-star" data-id="'+value.id+'">删除</a>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
					});
					
					$(".designer-list").html(html);
					
					//打开明星设计师弹窗
					decoration.openDesignerLayer();
					//删除明星设计师事件
					decoration.removeStar();
				}
				
			}
		});
	},
	
	//增加明星设计师
	addStarAjax:function(data){
		$.ajax({
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/addStarDesigner",
			type:"post",
			dataType:"json",
			data:data,
			success : function(res) {
				if(res.success){
					decoration.starDesigner = {};
					$(".designer-layer").addClass("ut-none");
					decoration.initDesigner();
				}else{
					layer.msg(res.msg);
				}
			}
		});
	},
	updateStarAjax:function(data){
		$.ajax({
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/updateStarDesigner",
			type:"post",
			dataType:"json",
			data:data,
			success : function(res) {
				if(res.success){
					decoration.starDesigner = {};
					$(".designer-layer").addClass("ut-none");
					decoration.initDesigner();
				}
			}
		});
	},
	//删除明星设计师
	removeStarAjax:function(data){
		loading = layer.load(2);
		$.ajax({
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/deleteStarDesigner",
			type:"post",
			dataType:"json",
			data:data,
			success : function(res) {
				layer.close(loading);
				if(res.success){
					decoration.initDesigner();
				}
			},
			error:function(){
				layer.close(loading);
				layer.msg('网络故障！');
			}
		});
	},
	//增加图片ajax
	addPictureAjax:function(data,callback){
		$.ajax({
			type:"post",
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/addBanner",
			data:data,
			dataType:"json",
			success:function(res){
				if(!res.success){
					layer.msg(res.msg);
				}
				callback(res.success);
			}
		});
	},
	//修改banner的ajax
	updatePictureAjax:function(data,callback){
		$.ajax({
			type:"post",
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/updateBanner",
			data:data,
			dataType:"json",
			success:function(res){
				if(!res.success){
					layer.msg(res.msg);
				}
				callback(res.success);
			}
			
		});
	},
	
	deleteBanner : function(data,father,url,callback){
		loading = layer.load(2);
		$.ajax({
			url:headUrl.headIp + headUrl.headPort + "/v2/mng/platformDecorate/deleteBanner",
			type:"post",
			dataType:"json",
			data:data,
			success : function(res) {
				layer.close(loading);
				layer.msg("删除成功！");
				decoration.initIndexBanner(father,url,callback);
			},
			error:function(){
				layer.close(loading);
				layer.msg('网络故障！');
			}
    	});
	},
	
};

$(function(){
   decoration.init();
   

});