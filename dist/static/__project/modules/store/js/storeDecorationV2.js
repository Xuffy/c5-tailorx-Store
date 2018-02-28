layer.close(loading);
var store = {
	init:function(){
		this.bindEvent();
		//获取初始数据
		this.getInitData(this.bindBannerData,this.bindCoverData);
//		this.getInitData();
	},
	bindEvent:function(){
		//绑定上传事件
		this.uploadEvent();
		//绑定添加事件
		$(".fa-plus").click(function(){
		/*	if($("#bannerBox>div").length >5) return layer.msg("头图数量已达最大上限");*/
			
			var str = "";
			str += '<div>'+
	           '<div class="upload-box ut-border-dashed">'+
	           '<i class="fa fa-upload"></i>'+
	           '<p class="title-tips">点击上传</p>'+
	           '<img  src=""  class="store-file ut-none" style="opacity:1;z-index:3;">'+
	           '<input type="file"  class="store-file uploadFile">'+
	   '</div>'+
	        '<p class="picture-tips tips">'+
	            '<span>注：建议图片尺寸比例为3:4</span><br>'+
	            '<span>限制为JPG PNG BMP格式</span><br>'+
	            '<span>单张不超过5M</span><br>'+
	            '<span><i class="fa fa-minus"></i></span>'+
	        '</p>'+
	    '</div>';
			
			$("#addBox").before(str);
			//删除门店头图
			store.removeBanner();
			//绑定上传事件
			store.uploadEvent();
		});
		
		//跳下一步
		$("#nextStepBtn").click(function(){
			loading = layer.load(2);
//			$("#store").load("/v2/store/myStore/getClientDateByStoreId");
//			$("#getClientDateByStoreId").click();
//			$("#index").click();
// 			$(".loadPage")[1].click();
            location.href = "../../modules/store/storeInfo.html";
		});
		
		//保存数据
		$("#saveBtn").click(function(){
			loading = layer.load(2);
			store.getData();
		});
		
	},
	getData:function(){
		var coverImg = $("#headImg").attr("src");
		if(!coverImg){
			layer.close(loading);
			return layer.msg("请上传封面图");
		} 
		
		var bannerStr = "";
		$("#bannerBox img").each(function(){
			var url = $(this).attr("src");
			if(url) bannerStr += url + ";";
		});
		//至少一张头图
		if(!bannerStr){
			layer.close(loading);
			return layer.msg("请上传门店头图");
		} 
		
		bannerStr = bannerStr.slice(0,bannerStr.length - 1);
		store.updateAjax({coverImage:coverImg,images:bannerStr});
	},
	uploadEvent:function(){
		//上传单张图片
		uploadImg({
			ele:".uploadFile",
			type:1,
			callback:function(res,$ele){
//				layer.msg("上传成功");
				var $img = $ele.siblings("img");
				$img.attr("src",res.data[0]).css("display","block");
				$ele.parent().removeClass("ut-border-dashed");
			},
			format:["jpg","png","bmp"],
			size:2
		});
	},
	//删除门店头图片
	removeBanner:function(){
		$(".fa-minus").off("click");
		$(".fa-minus").click(function(){
			$(this).parent().parent().parent().remove();
		});
	},
	getInitData:function(bannerFunc,coverFunc){
		$.ajax({
			url:headUrl.headUrl + "/v2/store/myStore/findStoreDecorate",
			type:"post",
			dataType:"json",
			success:function(res){
				if(res.success){					
					if(bannerFunc) bannerFunc(res.data.images);
					if(coverFunc && res.data.coverImage) coverFunc(res.data.coverImage);
				}else{
                    layer.msg(ree.msg);
				}
			},
            error:function(){
                layer.msg("服务器出错!");
            }
		});
	},
	updateAjax:function(data){
		loading = layer.load(2);
		$.ajax({
			type:"post",
			url:headUrl.headUrl + "/v2/store/myStore/addStoreDecorate",
			data:data,
			dataType:"json",
			success:function(res){
				layer.close(loading);
				if(res.success){
					layer.msg("保存成功!");
				}else{
                    layer.msg(res.msg);
				}
			},
			error:function(){
				layer.close(loading);
				layer.msg("服务器出错!");
			}
		})
	},
	bindCoverData:function(url){
		var $headImg = $("#headImg");
		$headImg.attr("src",url).css("display","block");
		$headImg.parent().removeClass("ut-border-dashed");
	},
	bindBannerData:function(res){
		var str = "";
		for(var j=0,len1 = res.length;j < len1;j++){
			
			str += '<div>'+
		           '<div class="upload-box">'+
		           '<i class="fa fa-upload"></i>'+
		           '<p class="title-tips">点击上传</p>'+
		           '<img  src="'+res[j]+'"  class="store-file" style="opacity:1;z-index:3;">'+
		            '<input type="file"  class="store-file uploadFile">'+
		        '</div>'+
		        '<p class="picture-tips tips">'+
		            '<span>注：建议图片尺寸比例为3:4</span><br>'+
		            '<span>限制为JPG PNG BMP格式</span><br>'+
		            '<span>单张不超过5M</span><br>'+
		            (j == 0?"":'<span><i class="fa fa-minus"></i></span>')+
		        '</p>'+
		    '</div>';
		}
		$("#bannerBox .upload-box").parent().remove();
		$("#addBox").before(str);
		//删除门店头图
		store.removeBanner();
		//绑定上传事件
		store.uploadEvent();
	}
};

store.init();

//uploadImg({
//	ele:"#uploadFile",
//	type:1,
//	callback:function(){
//		
//	}
//});