layer.close(loading);
var edit = {
	init: function() {
		this.getWorkData();
		this.getEduData();
		this.getStyleData();
		this.uploadSingleImg();
		this.deleteProductionImg();
		this.multUpload();
		//		this.judgePictureNum();
		this.uploadProduction();
		//		$("#pictureNum").html(edit.judgePictureNum());

		$("#name").blur(function() {
			edit.limtLength(1, $("#name"));
		});
	},
	nameValid: true,
	styleValid: true,
	infoValid: false,
	//设计师编辑页面跳转
	listDesigner: function(id) {
		sessionStorage.removeItem('designerId');
		location.href = 'designerV2.html';
	},

	//获取所有参数
	getParams: function() {
		var pr = new Object();
		var id = $("#id").val();
		var name = $("#name").val();
		var level = $("#level option:selected").val();
		var qq = $("#qq").val();
		var phone = $("#phone").val();
		var position = $(".col-xs-8 .position");
		var company = $(".col-xs-8 .company");
		var specialty = $(".col-xs-8 .specialty");
		var school = $(".col-xs-8 .school");
		var goodStyle = $(".ut-pad-l10 .goodStyle");
		var max_design = $("#max_design").val();
		var introduction = $("#introduction").val();
		var weChat = $("#we_chat").val();
		var photo = $("#photoImg").attr("src");
		if(id != "") {
			pr.id = id;
		}
		if(name != "") {
			pr.name = name;
		}
		if(level != "") {
			pr.level = level;
		}
		if(qq != "") {
			pr.qq = qq;
		}
		if(phone != "") {
			pr.phone = phone;
		}
		if(position != "" && company != "") {
			var work = "";
			work += "[";
			for(i = 0; i < position.length; i++) {
				var str = $(position[i]).val();
				var newStr = str.replace(/["'\\]/g, "");
				var str2 = $(company[i]).val();
				var newStr2 = str2.replace(/["'\\]/g, "");
				work += '{';
				work += '\"position\":\"' + newStr + '\",' + '\"company\":\"' + newStr2 + '\"';
				work += "},"
			}
			work += "]"
			pr.workExperience = work;
		}
		if(specialty != "" && school != "") {
			var education = "";
			education += "[";
			for(i = 0; i < specialty.length; i++) {
				var str = $(specialty[i]).val();
				var newStr = str.replace(/["'\\]/g, "");
				var str2 = $(school[i]).val();
				var newStr2 = str2.replace(/["'\\]/g, "");
				education += "{"
				education += "\"specialty\":\"" + newStr + "\"," + "\"school\":\"" + newStr2 + '\"';
				education += "},"
			}
			education += "]"
			pr.educationExperience = education;
		}
		if(goodStyle.length != 0) {
			var style = "";
			for(i = 0; i < goodStyle.length; i++) {
				if(i != 0 && goodStyle[i].value != "") {
					style += "、";
				}
				if(goodStyle[i].value != "") {
					style += goodStyle[i].value.replace(/["'\\、]/g, "");
				}
			}
			pr.goodStyle = style;
		}
		if(max_design != "") {
			pr.max_design = max_design;
		}
		if(introduction != "") {
			pr.introduction = introduction;
		}
		if(weChat != "") {
			pr.weChat = weChat;
		}
		if(photo != "") {
			pr.photo = photo;
		}
		// 获取作品链接
		var imgs = $("#productions .opus-upload .img-outer img");
		if(imgs != "" && imgs != null) {
			var pros = [];
			for(var i = 0; i < imgs.length; i++) {
				pros.push(imgs.eq(i).attr('src').split('?')[0]);
			}
			pr.pros = pros;

			/*var pros = "";
			pros += '[';
			console.log(imgs.eq(0).attr('src'),'----')
			for(var i = 0, len = imgs.length; i < len; i++) {
				pros += '"' + imgs[i].src + '"';
				if(i < len - 1) {
					pros += ',';
				}
			}
			pros += ']';*/
			pr.pros = JSON.stringify(pros);
		}
		//工作经历
		var rowEl = $('#work_experience_div .row'),
			gz_data = [];

		for(var i = 0; i < rowEl.length; i++) {
			//			console.log(i);
			gz_data.push({
				"position": rowEl.eq(i).find('input').val(),
				"company": rowEl.eq(i + 1).find('input').val()
			});

			i++;
		}
		pr.workExperience = JSON.stringify(gz_data);
		//教育经历
		var rowEle = $('#education_experience_div .row'),
			ez_data = [];
		for(var i = 0; i < rowEle.length; i++) {
			ez_data.push({
				"specialty": rowEle.eq(i).find('input').val(),
				"school": rowEle.eq(i + 1).find('input').val()
			});

			i++;
		}
		pr.educationExperience = JSON.stringify(ez_data);

		return pr;
	},
	//提交更新
	ajaxSubmit: function(params) {
		loading = layer.load(2);
		if(params.photo.indexOf('?') > -1) {
			params.photo = params.photo.split('?')[0];
		}
		$.ajax({
			url: headUrl.headIp + headUrl.headPort + "/v2/store/designer/updateDesignerInfo",
			type: "post",
			dataType: "json",
			data: params,
			success: function(result) {
				layer.close(loading);
				sessionStorage.removeItem('designerId');
				sessionStorage.setItem('designerId', $("#id").val());
				location.href = 'designerDetail.html';
			},
			error: function() {
				layer.close(loading);
				layer.alert('网络故障，操作失败！');
			}
		});
	},

	// 获取工作经历
	getWorkData: function() {
		var WData = $("#workData").val();
		var dataObj = "";
		if(WData != "" && WData != null) {
			dataObj = eval("(" + WData + ")");
		}

		if(!WData || dataObj.length < 1) {
			dataObj = [{
				"position": "",
				"company": ""
			}, {
				"position": "",
				"company": ""
			}];
		}
		var Wtemplate = $("#work_experience").html();
		var arr2 = [];
		if(dataObj.length == 1) {
			arr2.push(edit.formatTemplate(dataObj[0], Wtemplate));
		} else {
			for(var i = 0; i < dataObj.length; i++) {
				arr2.push(edit.formatTemplate(dataObj[i], Wtemplate));
			}
		}

		$("#work_experience_div").append(arr2.join(''));

	},

	// 获取教育经历
	getEduData: function() {
		var EData = $("#educationData").val();
		var dataObj = "";
		if(EData != "" && EData != null) {
			dataObj = eval("(" + EData + ")");
		} else {
			dataObj = [{
				"specialty": "",
				"school": ""
			}];
		}
		var Etemplate = $("#education_experience").html();
		var arr1 = [];
		arr1.push(edit.formatTemplate(dataObj[0], Etemplate));
		$("#education_experience_div").append(arr1.join(''));
	},

	// 获取善常风格
	getStyleData: function() {
		var gsData = $("#styleData").val();
		var data = gsData.split("、");
		var gs = $("#goodStyle");
		var html = "";
		for(i = 0; i < data.length; i++) {
			if(i < data.length - 1) {
				html += "<div class='style-add'><div class='ut-mar-t10 ut-mar-b10 ut-pad-l10'>";
				html += "<input class='ut-input goodStyle' onblur='edit.limtLength(2,this)' type='text' name='goodStyle' value='" + data[i] + "'></div></div>";
			} else {
				html += "<div class='style-add'><div class='ut-mar-t10 ut-mar-b10 ut-pad-l10'>";
				html += "<input class='ut-input goodStyle' onblur='edit.limtLength(2,this)' type='text' name='goodStyle' value='" + data[i] + "'>";
				if(i < 4) {
					html += "<span class='glyphicon glyphicon-plus add-style-input''></span></div>";
				}
				html += "</div><div class='ut-overflow ut-mar-t10'><div class='ut-fr'><span class='show-style-num'>" + (i + 1) + "</span>/<span>5</span></div></div>";
			}
		}
		gs.append(html);
	},

	//替换template中的数据
	formatTemplate: function(dta, tmpl) {
		var format = {
			name: function(x) {
				return x;
			}
		};
		return tmpl.replace(/{(\w+)}/g, function(m1, m2) {
			if(!m2 || !dta)
				return "";
			return(format && format[m2]) ? format[m2](dta[m2]) : dta[m2];
		});
	},

	//判断一共有多少张图片
	/*judgePictureNum: function() {
		return $("#productions .opus-upload").length;

	},*/

	//上传头像图片
	uploadSingleImg: function() {
		uploadImg({
			ele: ".designer-portrait .upload",
			type: 1,
			clipping: true,
			callback: function(res, ele) {
				ele.parent().siblings("img").attr("src", res.data[0]);
			}
		});

	},

	//批量上传
	multUpload: function() {
		uploadImg({
			ele: "#multUpload",
			type: 1,
			//			format:["jpg"],
			//			size:0.05,
			//			num: 21 - edit.judgePictureNum(),
			father: "#pictureBox",
			callback: function(res) {
				var str = $("#productions").html();
				$.each(res.data, function(i, value) {
					str += '<div class="col-md-3 col-xs-5 opus-upload ut-mar-b20" data-id="' + value + '">' +
						'<div class="img-outer">' +
						'<img src="' + $.ossImage(value, 'resize,w_240/crop,h_180') + '" alt=""> <label for="opus1' + i + '" class="portrait-upload">' +
						'<span class="glyphicon glyphicon-cloud-upload ut-font18 cur"></span>' +
						'<span class="ut-font18 ut-pad-l10 cur"> 上传</span>' +
						'<span class="glyphicon glyphicon-trash ut-font18 cur"></span>' +
						'</label> <input type="file" class="upload"></div></div><div class="col-xs-1" data-id="' + value + '"></div>';
				});

				$("#productions").html(str);
				//当前图片个数
				//				$("#pictureNum").html(edit.judgePictureNum());

				edit.uploadProduction();
				edit.multUpload();

			}
		});
	},

	//上传单张作品图片
	uploadProduction: function() {
		uploadImg({
			ele: $("#productions input"),
			type: 1,
			father: "#pictureBox",
			callback: function(res, ele) {
				ele.siblings("img").attr("src", res.data[0]);
			}
		});

	},

	//删除作品
	deleteProductionImg: function(productionId) {
		$("#designer-edit").on('click', '.glyphicon-trash', function() {
			var $this = $(this);
			layer.confirm('确定要删除作品吗？', {
				btn: ['是', '否'] //按钮
			}, function() {
				var dataId = $this.parents('.opus-upload').attr('data-id');
				$this.parents('.opus-upload').remove();
				var next = $('#productions .col-xs-1')
				$.each(next, function() {
					var _this = $(this);
					if(_this.attr('data-id') == dataId) {
						_this.remove();
					}
				});
				//				$("#pictureNum").html(edit.judgePictureNum());
				edit.multUpload();
				layer.closeAll();
			}, function() {
				layer.closeAll();
			});
		});
	},

	//判断字符是否为中文
	isChinese: function(value) {
		var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
		return reg.test(value);
	},

	//限制字符长度
	limtLength: function(type, obj, judge) {
		var value = $(obj).val().trim();
		if('1' == type) { //限制名称的长度，中文为6，英文为12
			var boolean = edit.isChinese(value);
			if(boolean) {
				//$(obj).attr("maxlength",6);
				if(value.length > 6) {
					layer.msg("姓名只能输入6个中文字符或者12个英文字符！");
					edit.nameValid = false;
					return;
				} else if(value.length <= 0) {
					layer.msg("姓名不能为空");
					edit.nameValid = false;
					return;
				}

			} else {
				if(value.length > 12) {
					layer.msg("姓名只能输入6个中文字符或者12个英文字符！");
					edit.nameValid = false;
					return;
				}
				//$(obj).attr("maxlength",12);
				//				value = value.substring(0,12);
			}
			edit.nameValid = true;
		}

		if('2' == type) { //限制擅长风格长度为4
			if(value.length > 4) {
				if(!judge) layer.msg("擅长风格只能输入4个字以内！");
				return false;
			}
			return true;
		}
		if('3' == type) { //设计师简介限制长度为150
			if(value.length > 150) {
				layer.msg("设计师简介只能输入150个字符！");
				edit.infoValid = false;
				return;
			}
			edit.infoValid = true;
		}
		$(obj).val(value);
	}

}

$(function() {
	var designerId = sessionStorage.getItem('designerId');
	$.ajax({
		url: headUrl.headIp + headUrl.headPort + '/v2/store/designer/getDesignerInfo',
		type: 'post',
		data: 'designerId=' + designerId,
		dataType: 'json',
		success: function(data) {
			if(data !== null) {
				var designerInfo = data['data'];
				$("#id").val(designerInfo['id']);
				$("#name").val(designerInfo['name']);
				$("#qq").val(designerInfo['qq']);
				$("#phone").val(designerInfo['phone']);
				$("#we_chat").val(designerInfo['weChat']);

				//设计师简介
				$("#introduction").val(designerInfo['introduction']);
				//              $("#workData").data('data',designerInfo['workExperience']);
				$("#workData").val(designerInfo['workExperience']);
				$("#educationData").val(designerInfo['educationExperience']);
				$("#order_count").text(designerInfo['order_count']);
				$("#appointmentAmount").text(designerInfo['appointmentAmount']);
				$("#deal_count").text(designerInfo['deal_count']);

				//
				if(designerInfo.goodStyle) {
					var goodStyleStr = designerInfo.goodStyle;
					if(goodStyleStr.substring(0, 1) == '、') {
						var goodStyleNum = goodStyleStr.substring(1, goodStyleStr.length + 1)
						$("#styleData").val(goodStyleNum);
					} else {
						$("#styleData").val(designerInfo['goodStyle']);

					}
				}
				$("#max_design").val(designerInfo['max_design']);
				if(designerInfo['photo']) {
					$("#photoImg").attr('src', $.ossImage(designerInfo['photo'], 'resize,w_170/crop,h_170'));
				}
				$("#level").val(designerInfo['level']);

				// productions
				var designerProductions = designerInfo['designerProductions'];

				if(designerProductions !== null) {
					var html = '';
					$.each(designerProductions, function(index, item) {
						html += '<div class="col-md-3 col-xs-5 opus-upload ut-mar-b20" data-id="' + item['id'] + '">';
						html += '<div class="img-outer">';
						html += '<img src="' + $.ossImage(item['productionImg'], 'resize,w_240/crop,h_180') + '" alt="">';
						html += '<label class="portrait-upload">';
						html += '<span class="glyphicon glyphicon-cloud-upload ut-font18 cur"></span>';
						html += '<span class="ut-font18 ut-pad-l10 cur"> 上传</span>';
						html += '<span class="glyphicon glyphicon-trash ut-font18 cur"></span>';
						html += '</label>';
						html += '<input type="file" class="upload">';
						html += '</div>';
						html += '</div>';
						html += '<div class="col-xs-1" data-id="' + item['id'] + '"></div>';
					});
					$("#productions").html(html);
				}
			}

			edit.init();
		},
		error: function(msg) {
		}
	});
	// edit.init();

	$("#submit").on("click", function() {
		if($("#max_design").val() < 0 || $("#max_design").val() > 10000) {
			layer.msg("设计师每日最大设计量在0-10000之间！");
			return;
		}
		var goodStyle = $(".ut-pad-l10 .goodStyle");
		if(goodStyle.length != 0) {
			var style = "";
			for(i = 0; i < goodStyle.length; i++) {
				if(i != 0 && goodStyle[i].value != "") {
					style += "、";
				}
				if(goodStyle[i].value != "") {
					var val = goodStyle[i].value.replace(/["'\\、]/g, "");
					if(val == "") {
						return layer.msg("擅长风格输入不合法！");
					}
					style += val;
				}
			}
			if(style == '') {
				return layer.msg("请输入设计师风格！");
			}
		}

		var styleValid = true;
		$(".goodStyle").each(function() {
			if(!edit.limtLength(2, this, true)) styleValid = false;
		});

		if(!styleValid) return layer.msg("擅长风格只能输入4个字以内！");

		if($("#introduction").val().length > 500) return layer.msg("设计师简介只能输入500个字符！");

		$("#name").blur();

		if(!edit.nameValid) return;

		edit.ajaxSubmit(edit.getParams());
	});

	//添加设计风格
	var str = '<div class="ut-mar-t10 ut-mar-b10 ut-pad-l10"><input class="ut-input goodStyle" onkeyup="edit.limtLength(2,this)" type="text" name="goodStyle" value=""><span class="glyphicon glyphicon-plus add-style-input"></span></div>';
	$('.right-designer').on('click', '.add-style-input', function() {
		$(this).remove();
		$('.style-add:last').append(str);
		if($('.style-add>div').length >= 5) {
			$('.style-add>div .add-style-input').remove();
		}
		$('.show-style-num').html($('.style-add>div').length);
	});

})

function replaceVal(valueR) {
	var newStr = $(valueR).val().replace(/["'\\]/g, "");
	$(valueR).val(newStr);
}

// var headUrl = {
//     headIp: 'http://localhost:',
//     headPort: 30704
// }
