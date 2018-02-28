var addNews = {
	init: function() {
		this.initPage();
		//显示当前图片个数

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

					$('#firstCategory').val(data.firstCategoryName);
					$('#secondCategory').val(data.secondCategoryName);
					$('#thirdCategory').val(data.thirdCategoryName);
					$("#coverImg").attr("src", data.coverPicture);
					$("#bannerImg").attr("src", data.bannerPicture);
					/*if(data.firstCategoryId != null) {

						addNews.thirdCategoryId = data.thirdCategoryId;
						addNews.secondCategoryId = data.secondCategoryId;
						$("#firstCategory").val(data.firstCategoryId);
						$("#firstCategory").trigger("change");
					}*/

					var str = "";
					$.each(data.pictures, function(i, value) {
						str += '<div class="picture-setting" >' +
							'<div class="img-box">' +
							'<i class="fa fa-upload"></i>' +
							'<p class="title-tips ut-mar-t5" id="title-tips1">点击上传</p>' +
							'<img src="' + value.picture + '" alt="">' +
							'</div>' +
							'<div class="bar">' +
							'<span class="name">价格区间：</span>' +
							'<input type="text"  class="ut-input w-80 minprice" placeholder="价格下限" readonly onkeyup="replace(this)"' +
							'onblur="replace(this)"  value="' + (value.minPrice == null ? '' : value.minPrice) + '"> ~' +
							'<input type="text"  class="ut-input w-80 maxprice" placeholder="价格上限" readonly onkeyup="replace(this)" ' +
							'onblur="replace(this)" value="' + (value.maxPrice == null ? '' : value.maxPrice) + '">' +
							'</div>' +
							'<textarea class="ut-input" placeholder="这里是文字描述/可选不填" readonly>' + value.description + '</textarea>' +
							'</div>';
					});
					$('#descriptions').html(str);
				}
				layer.close(loading);
			},
			error: function() {
				layer.close(loading);
				layer.msg("网络故障！");
			}
		});
		$("#backNewsBtn").click(function() {
			loading = layer.load(2);
			location.href = "outInfo.html";
		});

	},
};

$(function() {
	addNews.init();
});

function replace(doc) {
	doc.value = doc.value.replace(/\D/g, '');
}
