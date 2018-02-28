//图片上传
//	option = {
//		ele:"#id",//元素选择器
//		callback:function(){//回调函数
//			
//		},
//		type:1,//类型  1是图片 2是视频 3是音乐
//		format:["png","jpg"],//格式限制
//		size:5//文件大小限制,
//		father:"#father" //进度条出现的父级元素,
//		num:5 //上传文件个数限制 少于5个
//	};

function uploadImg(option) {

	(function(option) {

		$(option.ele).off("change");
		$(option.ele).change(function() {

			var data = this.files,
				len = data.length;
			if(option.num || option.num == 0) {
				if(option.num < len) return alert("文件个数超过限制");
			}
			if(!data || !data.length) return;

			//判断上传格式
			if(option.format && option.format.length) {
				for(var i = 0; i < len; i++) {
					var format = data[0].name.split('.');
					format = format[format.length - 1];
					var valid = false;
					for(var j = 0, len1 = option.format.length; j < len1; j++) {
						if(format.toLowerCase() == option.format[j].toLowerCase()) {
							valid = true;
							break;
						}
					}
					if(!valid) {
						$(option.ele).val('');
						return alert("只支持" + option.format + "格式文件");
					}
				}

			}
			//判断文件大小
			if(option.size) {
				for(i = 0; i < len; i++) {
					var size = data[i].size / 1000 / 1000;
					if(Number(option.size) < size) return alert("请上传小于" + option.size + "M的文件");
				}

			}
			var $this = $(this);

			//上传
			var imgFile = new FormData();
			for(var i = 0, len = this.files.length; i < len; i++) {
				imgFile.append("files", this.files[i]);
			}
			imgFile.append("type", option.type);
			if(option.data && option.data.orderNo) {
				imgFile.append('orderNo', option.data.orderNo);
			}

			if(option.before && !option.before(imgFile, $this)) {
				return false;
			};

			var progress_timer = null;
			//			是否显示进度条
			if(option.father) {
				var father = option.father;

				if(typeof father == "string") father = $(option.father);
				father.append("<div class='ut-progress-box'><div class='ut-progress-bar'></div></div>");
				progress_timer = progress(option.father, 'start');
			}

			var _this = this;

			if(option.clipping) {
				clipping(this, this.files, $this);
			} else {
				startUpload(imgFile, $this, imgFile, _this, progress_timer);
			}

			// startUpload(imgFile);
			// console.log(getObjectURL($('#portrait')[0].files[0]));

			//			option.father && progressHandlingFunction(option.father)
		});
	})(option);

	function clipping(_this, imgFile, $this) {
		var uciEl = $('#upload-clipping-img');

		// 取消裁剪 重置
		$('#upload-clipping').modal('show').on('hidden.bs.modal', function(e) {
			$(_this).val('');
			uciEl.cropper('destroy');
		})

		// 显示预览图片
		setImagePreview($(_this)[0]);

		// 旋转图片
		$('#upload-clipping-rotate').unbind('click').on('click', function() {
			uciEl.cropper('rotate', 90);
		})

		// 重置图片
		$('#upload-clipping-reset').unbind('click').on('click', function() {
			uciEl.cropper('reset');
		})

		// 重置图片
		$('#upload-clipping-submit').unbind('click').on('click', function() {

			uciEl.cropper('getCroppedCanvas').toBlob(function(blob) {

				var formData = new FormData();

				formData.append('files', blob, imgFile[0].name);

				formData.append('type', option.type);
				if(!$.isEmptyObject(option.data)) {
					formData.append('orderNo', option.data.orderNo);
				}

				startUpload(formData, $this, imgFile, _this).then(function() {
					$('#upload-clipping').modal('hide');
				});
			});

		})

		uciEl.cropper({
			autoCropArea: 1,
			crop: function(e) {
				var imgCanvas = $(this).cropper('getCroppedCanvas');

				$('.upload-clipping-preview').attr('src', imgCanvas.toDataURL('image/png', 0.5))
			}
		})

	}

	function startUpload(imgFile, $this, data, _this, progress_timer) {

		return $.ajax({
			type: "post",
			url: headUrl.headIp + headUrl.headPort + (option.apiUrl || "/v2/store/file/uploadFiles"),
			/*beforeSend: function(xhr) {
			 xhr.setRequestHeader('utouu-open-client-ticket', sessionStorage.getItem("ticket"))
			 },*/
			dataType: "json",
			data: imgFile,
			success: function(res) {
				$(option.ele).val('');
				if(res.success) {
					option.father && progress(option.father, 'success', progress_timer);

					// option.callback(res, $this, data, _this.files);
					option.callback(res, $this, data, _this.files);

				} else {
					alert(res.msg);
				}

			},
			error: function() {
				layer.msg('上传失败,请重新上传!')
			},
			xhr: function() {
				var myXhr = $.ajaxSettings.xhr();
				myXhr.onreadystatechange = function(e, a) {};
				if(myXhr.upload && option.father) {
					var father = option.father;
					myXhr.upload.addEventListener("progress", function(e) {
						//							progressHandlingFunction(e, father)
					}, false);
				}
				return myXhr;
			},
			cache: false,
			contentType: false,
			processData: false
		});
	}

	/**
	 * 显示本地图片预览
	 * @param avalue
	 * @returns {boolean}
	 */
	function setImagePreview(inputEl) {
		var imgObjPreview = document.getElementById("upload-clipping-img");
		if(inputEl.files && inputEl.files[0]) {
			imgObjPreview.src = window.URL.createObjectURL(inputEl.files[0]);
		} else {
			inputEl.select();
			var imgSrc = document.selection.createRange().text;
			var localImagId = document.getElementById("localImag");

			//图片异常的捕捉，防止用户修改后缀来伪造图片
			try {
				localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
			} catch(e) {
				alert("您上传的图片格式不正确，请重新选择!");
				return false;
			}
			imgObjPreview.style.display = 'none';
			document.selection.empty();
		}
		return true;
	}

	function progress(father, type, progress_timer) {
		var timeout = null,
			progress_num = 0;

		progress_ele = typeof father == "string" ? $(father) : father;

		switch(type) {
			case 'start': // 显示进度条
				var max_num = RandomNum(80, 99);

				return setInterval(function() {
					var n = progress_num + 50 > max_num ? max_num : progress_num + 50;

					if(progress_num < n) {
						progress_num = RandomNum(progress_num, progress_num + 50 > max_num ? max_num : progress_num + 50);
					}

					progress_ele.find(".ut-progress-bar").css("width", progress_num + '%');

				}, RandomNum(350, 500));
				break;
			case 'success':

				progress_timer && clearInterval(progress_timer);

				progress_ele.find(".ut-progress-bar").css("width", '100%');

				timeout = setTimeout(function() {

					clearTimeout(timeout);

					progress_ele.find(".ut-progress-box").remove();

					progress_ele.find(".ut-progress-bar").css("width", '0%');

				}, 500);
				break;
		}

	}

	function RandomNum(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		if(Math.round(Rand * Range) == 0) {
			return Min + 1;
		} else if(Math.round(Rand * Max) == Max) {
			return Max - 1;
		} else {
			var num = Min + Math.round(Rand * Range) - 1;
			return num;
		}
	}

}